import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import * as stripeService from "./stripe.tsx";

export const initialPaymentApp = new Hono();

// Enable CORS for payment routes
initialPaymentApp.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

/**
 * CREATE INITIAL PAYMENT INVOICE
 * Generates invoice and creates Stripe payment session for $50 CAD initial fee
 * Route: POST /make-server-c2a25be0/payment/initial-invoice
 */
initialPaymentApp.post('/make-server-c2a25be0/payment/initial-invoice', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized - No access token provided' }, 401);
    }

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return c.json({ error: 'Unauthorized - Invalid access token' }, 401);
    }

    const { year, documentCount, amount } = await c.req.json();

    if (!year || amount !== 50) {
      return c.json({ error: 'Invalid request: year and amount=50 required' }, 400);
    }

    console.log(`📝 Creating initial payment invoice for user ${user.id}, year ${year}`);

    // Get user data
    const userData = await kv.get(`user:${user.id}`);
    if (!userData) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Generate sequential invoice number
    const invoiceCounter = await kv.get('invoice:counter') || 0;
    const newCounter = invoiceCounter + 1;
    await kv.set('invoice:counter', newCounter);
    const invoiceNumber = String(newCounter).padStart(4, '0');
    const invoiceDate = new Date().toISOString();

    // Create invoice record
    const invoice = {
      invoiceNumber,
      userId: user.id,
      userName: userData.name,
      userEmail: userData.email,
      year,
      type: 'initial', // initial or final
      amount: 50,
      currency: 'CAD',
      status: 'pending', // pending, paid, cancelled
      documentCount: documentCount || 0,
      description: `${year} tax return processing (filed in ${year - 1})`,
      createdAt: invoiceDate,
      updatedAt: invoiceDate,
      paidAt: null,
      stripeSessionId: null,
      stripePaymentIntentId: null,
    };

    // Save invoice to KV store
    await kv.set(`invoice:${invoiceNumber}`, invoice);
    
    // Also index by user for easy retrieval
    const userInvoicesKey = `user-invoices:${user.id}`;
    const existingInvoices = await kv.get(userInvoicesKey) || [];
    existingInvoices.push(invoiceNumber);
    await kv.set(userInvoicesKey, existingInvoices);

    console.log(`✅ Invoice ${invoiceNumber} created successfully`);

    // Create Stripe payment session
    console.log(`💳 Creating Stripe session for $${amount} CAD...`);

    const paymentSession = await stripeService.createPaymentSession({
      userId: user.id,
      taxYear: year,
      amount: amount,
      paymentType: 'initial',
      metadata: {
        invoiceNumber,
        documentCount: String(documentCount || 0),
      },
    });

    if (!paymentSession.success || !paymentSession.url) {
      throw new Error(paymentSession.error || 'Failed to create payment session');
    }

    // Update invoice with Stripe session ID
    invoice.stripeSessionId = paymentSession.sessionId;
    invoice.updatedAt = new Date().toISOString();
    await kv.set(`invoice:${invoiceNumber}`, invoice);

    console.log(`✅ Stripe session created: ${paymentSession.sessionId}`);

    return c.json({
      success: true,
      invoice: {
        invoiceNumber,
        amount: 50,
        currency: 'CAD',
        status: 'pending',
        createdAt: invoiceDate,
      },
      paymentUrl: paymentSession.url,
      sessionId: paymentSession.sessionId,
    });

  } catch (error) {
    console.error('❌ Error creating initial payment invoice:', error);
    return c.json({ 
      error: `Failed to create invoice: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, 500);
  }
});

/**
 * GET INVOICE BY NUMBER
 * Route: GET /make-server-c2a25be0/payment/invoice/:invoiceNumber
 */
initialPaymentApp.get('/make-server-c2a25be0/payment/invoice/:invoiceNumber', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const invoiceNumber = c.req.param('invoiceNumber');
    
    const invoice = await kv.get(`invoice:${invoiceNumber}`);
    
    if (!invoice) {
      return c.json({ error: 'Invoice not found' }, 404);
    }

    // Verify user owns this invoice
    if (invoice.userId !== user.id) {
      return c.json({ error: 'Unauthorized to access this invoice' }, 403);
    }

    return c.json({
      success: true,
      invoice,
    });

  } catch (error) {
    console.error('❌ Error fetching invoice:', error);
    return c.json({ error: 'Failed to fetch invoice' }, 500);
  }
});

/**
 * GET ALL INVOICES FOR USER
 * Route: GET /make-server-c2a25be0/payment/invoices
 */
initialPaymentApp.get('/make-server-c2a25be0/payment/invoices', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userInvoicesKey = `user-invoices:${user.id}`;
    const invoiceNumbers = await kv.get(userInvoicesKey) || [];

    const invoices = [];
    for (const invoiceNumber of invoiceNumbers) {
      const invoice = await kv.get(`invoice:${invoiceNumber}`);
      if (invoice) {
        invoices.push(invoice);
      }
    }

    // Sort by creation date, newest first
    invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({
      success: true,
      invoices,
    });

  } catch (error) {
    console.error('❌ Error fetching invoices:', error);
    return c.json({ error: 'Failed to fetch invoices' }, 500);
  }
});

/**
 * GET ALL INVOICES (ADMIN ONLY)
 * Route: GET /make-server-c2a25be0/admin/invoices
 */
initialPaymentApp.get('/make-server-c2a25be0/admin/invoices', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // TODO: Add admin check here
    // For now, we'll fetch all invoices by prefix
    const allInvoices = await kv.getByPrefix('invoice:');

    // Sort by creation date, newest first
    allInvoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({
      success: true,
      invoices: allInvoices,
    });

  } catch (error) {
    console.error('❌ Error fetching admin invoices:', error);
    return c.json({ error: 'Failed to fetch invoices' }, 500);
  }
});

/**
 * MARK INVOICE AS PAID (called by Stripe webhook or payment verification)
 * Route: POST /make-server-c2a25be0/payment/invoice/:invoiceNumber/paid
 */
initialPaymentApp.post('/make-server-c2a25be0/payment/invoice/:invoiceNumber/paid', async (c) => {
  try {
    const invoiceNumber = c.req.param('invoiceNumber');
    const { stripePaymentIntentId } = await c.req.json();

    const invoice = await kv.get(`invoice:${invoiceNumber}`);
    
    if (!invoice) {
      return c.json({ error: 'Invoice not found' }, 404);
    }

    // Update invoice status
    invoice.status = 'paid';
    invoice.paidAt = new Date().toISOString();
    invoice.updatedAt = new Date().toISOString();
    if (stripePaymentIntentId) {
      invoice.stripePaymentIntentId = stripePaymentIntentId;
    }

    await kv.set(`invoice:${invoiceNumber}`, invoice);

    console.log(`✅ Invoice ${invoiceNumber} marked as paid`);

    return c.json({
      success: true,
      invoice,
    });

  } catch (error) {
    console.error('❌ Error marking invoice as paid:', error);
    return c.json({ error: 'Failed to update invoice' }, 500);
  }
});

export default initialPaymentApp;