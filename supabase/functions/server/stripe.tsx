import Stripe from 'npm:stripe';

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

<<<<<<< HEAD
// Check if we're in demo mode (invalid or missing Stripe key)
const isDemoMode = !stripeSecretKey || 
  stripeSecretKey === 'Bondade2026!' || 
  stripeSecretKey.length < 20 ||
  (!stripeSecretKey.startsWith('sk_test_') && !stripeSecretKey.startsWith('sk_live_'));

if (isDemoMode) {
  console.warn('⚠️ STRIPE DEMO MODE: Using simulated payment responses');
  console.warn('⚠️ To enable real payments, add a valid STRIPE_SECRET_KEY starting with sk_test_ or sk_live_');
} else {
  console.log('✅ Stripe initialized with valid API key');
}

// Initialize Stripe only if we have a valid key
const stripe = (!isDemoMode && stripeSecretKey)
=======
if (!stripeSecretKey) {
  console.error('❌ STRIPE_SECRET_KEY environment variable is not set');
}

// Initialize Stripe
const stripe = stripeSecretKey
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
  ? new Stripe(stripeSecretKey, {
      // @ts-ignore - Using latest Stripe API version
      apiVersion: '2023-10-16',
    })
  : null;

/**
<<<<<<< HEAD
 * Generic payment session creator (supports both demo and real mode)
 * This is the main function used by the payment endpoints
 */
export async function createPaymentSession(params: {
  userId: string;
  taxYear: number;
  amount: number;
  paymentType: 'initial' | 'final';
  metadata?: Record<string, string>;
}): Promise<{
  success: boolean;
  sessionId?: string;
  url?: string;
  error?: string;
  demoMode?: boolean;
}> {
  try {
    // DEMO MODE: Return simulated response
    if (isDemoMode) {
      const demoSessionId = `demo_session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const demoUrl = `https://demo-stripe-checkout.example.com?session_id=${demoSessionId}&amount=${params.amount}`;
      
      console.log(`🎭 DEMO MODE: Created simulated Stripe session`);
      console.log(`   Session ID: ${demoSessionId}`);
      console.log(`   Amount: $${params.amount} CAD`);
      console.log(`   Type: ${params.paymentType}`);
      
      return {
        success: true,
        sessionId: demoSessionId,
        url: demoUrl,
        demoMode: true,
      };
    }

    // REAL MODE: Create actual Stripe session
    if (!stripe) {
      return {
        success: false,
        error: 'Stripe is not initialized',
      };
    }

    const amountInCents = Math.round(params.amount * 100);
    const returnUrl = `https://${Deno.env.get('SUPABASE_URL')?.split('//')[1]}/client/timeline`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: `Tax Filing ${params.taxYear} - ${params.paymentType === 'initial' ? 'Initial' : 'Final'} Payment`,
              description: params.paymentType === 'initial' 
                ? 'Initial deposit to start your tax filing process'
                : `Final payment for your ${params.taxYear} tax return`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${returnUrl}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?payment=cancelled`,
      client_reference_id: params.userId,
      metadata: {
        userId: params.userId,
        taxYear: params.taxYear.toString(),
        paymentType: params.paymentType,
        ...params.metadata,
      },
    });

    console.log(`✅ Real Stripe session created: ${session.id}`);

    return {
      success: true,
      sessionId: session.id,
      url: session.url!,
      demoMode: false,
    };

  } catch (error) {
    console.error('Error creating payment session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Creates a Stripe Checkout Session for initial payment ($50 CAD)
 * LEGACY WRAPPER - Use createPaymentSession instead
=======
 * Creates a Stripe Checkout Session for initial payment ($50 CAD)
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
 */
export async function createInitialPaymentSession(
  userId: string,
  userEmail: string,
  taxYear: number,
  returnUrl: string
): Promise<{ sessionId: string; url: string }> {
<<<<<<< HEAD
  console.log(`📞 createInitialPaymentSession called for user ${userId}, year ${taxYear}`);
  
  const result = await createPaymentSession({
    userId,
    taxYear,
    amount: 50,
    paymentType: 'initial',
  });

  console.log(`📊 Payment session result:`, { 
    success: result.success, 
    hasSessionId: !!result.sessionId, 
    hasUrl: !!result.url,
    demoMode: result.demoMode 
  });

  if (!result.success || !result.sessionId || !result.url) {
    const errorMsg = result.error || 'Failed to create payment session';
    console.error(`❌ Payment session creation failed: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  return {
    sessionId: result.sessionId,
    url: result.url,
=======
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'cad',
          product_data: {
            name: `Tax Filing ${taxYear} - Initial Deposit`,
            description: 'Initial deposit to start your tax filing process',
          },
          unit_amount: 5000, // $50.00 CAD in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${returnUrl}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${returnUrl}?payment=cancelled`,
    client_reference_id: userId,
    metadata: {
      userId,
      taxYear: taxYear.toString(),
      paymentType: 'initial',
    },
    customer_email: userEmail,
  });

  return {
    sessionId: session.id,
    url: session.url!,
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
  };
}

/**
 * Creates a Stripe Checkout Session for final payment (remaining balance)
<<<<<<< HEAD
 * LEGACY WRAPPER - Use createPaymentSession instead
=======
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
 */
export async function createFinalPaymentSession(
  userId: string,
  userEmail: string,
  taxYear: number,
<<<<<<< HEAD
  finalAmount: number,
  returnUrl: string
): Promise<{ sessionId: string; url: string }> {
  const result = await createPaymentSession({
    userId,
    taxYear,
    amount: finalAmount,
    paymentType: 'final',
  });

  if (!result.success || !result.sessionId || !result.url) {
    throw new Error(result.error || 'Failed to create payment session');
  }

  return {
    sessionId: result.sessionId,
    url: result.url,
=======
  finalAmount: number, // In CAD dollars (e.g., 149.00)
  returnUrl: string
): Promise<{ sessionId: string; url: string }> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  // Convert to cents
  const amountInCents = Math.round(finalAmount * 100);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'cad',
          product_data: {
            name: `Tax Filing ${taxYear} - Final Payment`,
            description: `Final balance for your ${taxYear} tax return preparation`,
          },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${returnUrl}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${returnUrl}?payment=cancelled`,
    client_reference_id: userId,
    metadata: {
      userId,
      taxYear: taxYear.toString(),
      paymentType: 'final',
    },
    customer_email: userEmail,
  });

  return {
    sessionId: session.id,
    url: session.url!,
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
  };
}

/**
 * Retrieves a Stripe Checkout Session to verify payment
 */
export async function getCheckoutSession(sessionId: string) {
<<<<<<< HEAD
  // DEMO MODE: Return simulated session
  if (isDemoMode || sessionId.startsWith('demo_session_')) {
    console.log(`🎭 DEMO MODE: Returning simulated session data for ${sessionId}`);
    return {
      id: sessionId,
      payment_status: 'paid',
      amount_total: 5000, // $50.00 in cents
      currency: 'cad',
      metadata: {
        paymentType: 'initial',
        taxYear: '2025',
        userId: 'demo_user',
      },
      client_reference_id: 'demo_user',
    };
  }

=======
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
}

/**
 * Verifies if a payment was successful
 */
export async function verifyPayment(sessionId: string): Promise<{
  paid: boolean;
  amount: number;
  currency: string;
  paymentType: 'initial' | 'final';
  taxYear: number;
  userId: string;
}> {
  const session = await getCheckoutSession(sessionId);

  return {
    paid: session.payment_status === 'paid',
    amount: (session.amount_total || 0) / 100, // Convert cents to dollars
    currency: session.currency || 'cad',
    paymentType: session.metadata?.paymentType as 'initial' | 'final',
    taxYear: parseInt(session.metadata?.taxYear || '0'),
    userId: session.metadata?.userId || session.client_reference_id || '',
  };
}

/**
 * Creates a refund for a payment
 */
export async function createRefund(
  paymentIntentId: string,
  amount?: number // Optional: partial refund amount in CAD dollars
): Promise<{ refundId: string; status: string }> {
  if (!stripe) {
    throw new Error('Stripe is not configured');
  }

  const refundData: any = {
    payment_intent: paymentIntentId,
  };

  if (amount) {
    refundData.amount = Math.round(amount * 100); // Convert to cents
  }

  const refund = await stripe.refunds.create(refundData);

  return {
    refundId: refund.id,
    status: refund.status,
  };
<<<<<<< HEAD
}
=======
}
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
