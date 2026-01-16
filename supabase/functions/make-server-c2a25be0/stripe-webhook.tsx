import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";

export const stripeWebhookApp = new Hono();

/**
 * STRIPE WEBHOOK HANDLER
 * Automatically marks invoices as paid when Stripe payment succeeds
 * Route: POST /make-server-c2a25be0/stripe/webhook
 */
stripeWebhookApp.post('/make-server-c2a25be0/stripe/webhook', async (c) => {
  try {
    const stripeSignature = c.req.header('stripe-signature');
    
    if (!stripeSignature) {
      return c.json({ error: 'Missing stripe signature' }, 400);
    }

    // Get the raw body
    const body = await c.req.text();
    
    // TODO: Verify Stripe signature
    // const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    // stripe.webhooks.constructEvent(body, stripeSignature, webhookSecret);

    // Parse the event
    const event = JSON.parse(body);

    console.log(`📨 Received Stripe webhook: ${event.type}`);

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      console.log('💳 Payment successful:', {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        amount: session.amount_total / 100,
        metadata: session.metadata
      });

      // Get invoice number from metadata
      const invoiceNumber = session.metadata?.invoiceNumber;

      if (invoiceNumber) {
        // Mark invoice as paid
        const invoice = await kv.get(`invoice:${invoiceNumber}`);
        
        if (invoice) {
          invoice.status = 'paid';
          invoice.paidAt = new Date().toISOString();
          invoice.updatedAt = new Date().toISOString();
          invoice.stripePaymentIntentId = session.payment_intent;
          
          await kv.set(`invoice:${invoiceNumber}`, invoice);
          
          console.log(`✅ Invoice ${invoiceNumber} automatically marked as PAID via webhook`);
        } else {
          console.warn(`⚠️ Invoice ${invoiceNumber} not found in database`);
        }
      } else {
        console.warn('⚠️ No invoiceNumber in Stripe session metadata');
      }

      // Also update user tax filing payment status
      const userId = session.metadata?.userId || session.client_reference_id;
      const taxYear = session.metadata?.taxYear;
      const paymentType = session.metadata?.paymentType;

      if (userId && taxYear && paymentType) {
        const filingKey = `tax-filing:${userId}:${taxYear}`;
        const filing = await kv.get(filingKey) || {};

        if (paymentType === 'initial') {
          filing.initialPaymentPaid = true;
          filing.initialPaymentDate = new Date().toISOString();
        } else if (paymentType === 'final') {
          filing.finalPaymentPaid = true;
          filing.finalPaymentDate = new Date().toISOString();
        }

        await kv.set(filingKey, filing);
        
        console.log(`✅ Updated ${paymentType} payment status for user ${userId}, year ${taxYear}`);
      }
    }

    // Acknowledge receipt of the event
    return c.json({ received: true });

  } catch (error) {
    console.error('❌ Error processing Stripe webhook:', error);
    return c.json({ 
      error: `Webhook error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, 500);
  }
});

/**
 * MANUAL PAYMENT VERIFICATION
 * Admin can manually verify and mark a payment/invoice as paid
 * Route: POST /make-server-c2a25be0/payment/verify
 */
stripeWebhookApp.post('/make-server-c2a25be0/payment/verify', async (c) => {
  try {
    const { sessionId, invoiceNumber } = await c.req.json();

    if (!sessionId && !invoiceNumber) {
      return c.json({ error: 'sessionId or invoiceNumber required' }, 400);
    }

    console.log(`🔍 Manual payment verification requested:`, { sessionId, invoiceNumber });

    // If session ID provided, fetch from Stripe
    if (sessionId) {
      const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
      
      if (!stripeSecretKey) {
        return c.json({ error: 'Stripe not configured' }, 500);
      }

      const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Stripe session');
      }

      const session = await response.json();

      // Check if paid
      if (session.payment_status === 'paid') {
        const invoiceNum = session.metadata?.invoiceNumber || invoiceNumber;
        
        if (invoiceNum) {
          const invoice = await kv.get(`invoice:${invoiceNum}`);
          
          if (invoice) {
            invoice.status = 'paid';
            invoice.paidAt = new Date().toISOString();
            invoice.updatedAt = new Date().toISOString();
            invoice.stripePaymentIntentId = session.payment_intent;
            
            await kv.set(`invoice:${invoiceNum}`, invoice);
            
            console.log(`✅ Invoice ${invoiceNum} marked as PAID via manual verification`);
            
            return c.json({
              success: true,
              message: 'Payment verified and invoice marked as paid',
              invoice,
            });
          }
        }
      } else {
        return c.json({
          success: false,
          message: 'Payment not completed in Stripe',
          paymentStatus: session.payment_status,
        });
      }
    }

    // If only invoice number provided, just mark as paid (admin override)
    if (invoiceNumber) {
      const invoice = await kv.get(`invoice:${invoiceNumber}`);
      
      if (invoice) {
        invoice.status = 'paid';
        invoice.paidAt = new Date().toISOString();
        invoice.updatedAt = new Date().toISOString();
        
        await kv.set(`invoice:${invoiceNumber}`, invoice);
        
        console.log(`✅ Invoice ${invoiceNumber} marked as PAID via admin override`);
        
        return c.json({
          success: true,
          message: 'Invoice marked as paid (admin override)',
          invoice,
        });
      } else {
        return c.json({ error: 'Invoice not found' }, 404);
      }
    }

    return c.json({ error: 'Could not verify payment' }, 400);

  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    return c.json({ 
      error: `Verification error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, 500);
  }
});

export default stripeWebhookApp;
