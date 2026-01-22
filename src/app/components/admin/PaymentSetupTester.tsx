/**
 * PAYMENT SETUP TESTER
 * Admin component to test and verify Stripe payment configuration
 */

import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  CreditCard,
  Check,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
  CheckCircle,
  XCircle,
  Zap,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabaseClient';
import { API_ENDPOINTS } from '@/config/api';
import { projectId } from '/utils/supabase/info';
import { safeCopyToClipboard } from '../../utils/clipboard';

interface TestResult {
  step: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  details?: any;
}

export function PaymentSetupTester() {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [testSessionId, setTestSessionId] = useState('');

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const runFullTest = async () => {
    setTesting(true);
    setResults([]);

    try {
      // Test 1: Check Stripe Secret Key
      addResult({
        step: '1. Checking Stripe Configuration',
        status: 'pending',
        message: 'Verifying STRIPE_SECRET_KEY is set...',
      });

      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error('Not authenticated');
      }

      // Try to create a test invoice to verify Stripe
      const testInvoiceResponse = await fetch(API_ENDPOINTS.createInitialPaymentInvoice, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year: 2025,
          documentCount: 1,
          amount: 50, // Required field
        }),
      });

      const invoiceResult = await testInvoiceResponse.json();

      if (testInvoiceResponse.ok && (invoiceResult.checkoutUrl || invoiceResult.paymentUrl)) {
        const isDemoMode = invoiceResult.sessionId?.startsWith('demo_session_');
        setResults(prev => prev.map((r, i) => 
          i === prev.length - 1 
            ? { 
                ...r, 
                status: 'success', 
                message: isDemoMode 
                  ? '🎭 Demo Mode Active - Simulated Stripe response'
                  : '✅ Stripe is configured correctly!'
              }
            : r
        ));

        // Store session ID for manual verification
        if (invoiceResult.sessionId) {
          setTestSessionId(invoiceResult.sessionId);
        }
      } else {
        setResults(prev => prev.map((r, i) => 
          i === prev.length - 1 
            ? { 
                ...r, 
                status: 'error', 
                message: '❌ Stripe configuration error',
                details: invoiceResult.error
              }
            : r
        ));
      }

      // Test 2: Check Webhook URL
      addResult({
        step: '2. Webhook Configuration',
        status: 'pending',
        message: 'Checking webhook endpoint...',
      });

      const webhookEndpoint = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/stripe/webhook`;
      setWebhookUrl(webhookEndpoint);

      setResults(prev => prev.map((r, i) => 
        i === prev.length - 1 
          ? { 
              ...r, 
              status: 'success', 
              message: '📍 Webhook URL ready to configure in Stripe',
              details: webhookEndpoint
            }
          : r
      ));

      // Test 3: Invoice Creation
      addResult({
        step: '3. Invoice Generation',
        status: invoiceResult.invoice?.invoiceNumber ? 'success' : 'error',
        message: invoiceResult.invoice?.invoiceNumber 
          ? `✅ Test invoice created: ${invoiceResult.invoice.invoiceNumber}`
          : '❌ Failed to create invoice',
        details: invoiceResult,
      });

      // Test 4: Checkout URL
      const paymentUrl = invoiceResult.paymentUrl || invoiceResult.checkoutUrl;
      addResult({
        step: '4. Stripe Checkout',
        status: paymentUrl ? 'success' : 'error',
        message: paymentUrl 
          ? '✅ Stripe Checkout URL generated'
          : '❌ Failed to generate checkout URL',
        details: paymentUrl,
      });

    } catch (error: any) {
      console.error('Test error:', error);
      addResult({
        step: 'Error',
        status: 'error',
        message: `❌ Test failed: ${error.message}`,
        details: error,
      });
    } finally {
      setTesting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    const success = await safeCopyToClipboard(text);
    if (success) {
      toast.success('Copied to clipboard!');
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const testPayment = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(API_ENDPOINTS.createInitialPaymentInvoice, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year: 2025,
          documentCount: 1,
          amount: 50, // Required field
        }),
      });

      const result = await response.json();

      const paymentUrl = result.paymentUrl || result.checkoutUrl;
      if (paymentUrl) {
        toast.success('Opening Stripe Checkout...');
        window.open(paymentUrl, '_blank');
      } else {
        toast.error(result.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create test payment');
    }
  };

  const verifyPayment = async () => {
    if (!testSessionId) {
      toast.error('No session ID available. Create a test payment first.');
      return;
    }

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(API_ENDPOINTS.paymentVerify, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: testSessionId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('✅ Payment verified and invoice marked as paid!');
      } else {
        toast.warning(result.message || 'Payment not completed yet');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify payment');
    }
  };

  return (
    <div className="space-y-6">
      {/* Important Alert - API Key Issue */}
      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-sm border-2 border-amber-400 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-amber-900">
                🎭 Demo Mode Active
              </h3>
              <Badge className="bg-amber-600 text-white px-3 py-1 text-xs font-bold">
                TESTING ONLY
              </Badge>
            </div>
            <p className="text-amber-900 mb-4 leading-relaxed">
              The system is currently running in <strong>demo mode</strong> with simulated Stripe responses. 
              This allows you to test the payment flow without a real Stripe account.
            </p>
            <div className="bg-white border-2 border-amber-200 rounded-lg p-4 mb-4">
              <p className="font-semibold text-gray-900 mb-3">✨ What works in Demo Mode:</p>
              <ul className="space-y-2 text-sm text-gray-700 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Invoice creation and tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Payment session generation (simulated)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Complete UI flow testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Timeline and document management</span>
                </li>
              </ul>
              <p className="font-semibold text-gray-900 mb-2">🔐 To enable real payments:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Create a free account at <a href="https://dashboard.stripe.com/register" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Stripe Dashboard</a></li>
                <li>Copy your <strong>Secret key</strong> (starts with <code className="bg-gray-100 px-1 rounded">sk_test_...</code>)</li>
                <li>Add it to Supabase → Edge Functions → Secrets → <code className="bg-gray-100 px-1 rounded">STRIPE_SECRET_KEY</code></li>
                <li>Wait 1-2 minutes, then click "Run Full Test" below</li>
              </ol>
            </div>
            <div className="flex gap-3">
              <Button
                size="sm"
                onClick={() => window.open('https://dashboard.stripe.com/register', '_blank')}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Create Stripe Account
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open('https://dashboard.stripe.com/test/apikeys', '_blank')}
                className="border-2 border-amber-300 hover:bg-amber-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Get API Keys
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Configuration Tester Card */}
      <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Configuration Tester
            </h2>
            <p className="text-gray-600">
              Use this tool to verify your Stripe integration is working correctly.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button 
            onClick={runFullTest} 
            disabled={testing}
            className="bg-black hover:bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm"
          >
            {testing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Run Full Test
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={testPayment}
            className="px-6 py-2.5 rounded-lg font-medium border-2 border-gray-300 hover:bg-gray-50 transition-all"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Create Test Payment
          </Button>
          
          {testSessionId && (
            <Button 
              variant="outline" 
              onClick={verifyPayment}
              className="px-6 py-2.5 rounded-lg font-medium border-2 border-gray-300 hover:bg-gray-50 transition-all"
            >
              <Check className="w-4 h-4 mr-2" />
              Verify Payment
            </Button>
          )}
        </div>
      </Card>

      {/* Quick Setup Guide */}
      <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Quick Setup Guide
          </h3>
        </div>
        
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <div className="flex-1 pt-1">
              <h4 className="font-semibold text-gray-900 mb-2 text-lg">Get Stripe API Key</h4>
              <p className="text-gray-600 mb-3">
                Go to Stripe Dashboard → Developers → API keys → Copy "Secret key"
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open('https://dashboard.stripe.com/test/apikeys', '_blank')}
                className="border-2 border-gray-300 hover:bg-gray-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Stripe Dashboard
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <div className="flex-1 pt-1">
              <h4 className="font-semibold text-gray-900 mb-2 text-lg">Add to Supabase</h4>
              <p className="text-gray-600 mb-3">
                Supabase Dashboard → Edge Functions → Secrets → Add:
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                STRIPE_SECRET_KEY = sk_test_...
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <div className="flex-1 pt-1">
              <h4 className="font-semibold text-gray-900 mb-2 text-lg">Configure Webhook</h4>
              <p className="text-gray-600 mb-3">
                Add this webhook URL to your Stripe Dashboard:
              </p>
              {webhookUrl ? (
                <div className="flex items-center gap-2 mb-3">
                  <code className="bg-gray-100 px-4 py-3 rounded-lg text-sm flex-1 overflow-x-auto border border-gray-200">
                    {webhookUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(webhookUrl)}
                    className="border-2 border-gray-300 hover:bg-gray-50 px-4"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic mb-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  Run the test above to generate your webhook URL
                </p>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open('https://dashboard.stripe.com/test/webhooks', '_blank')}
                className="border-2 border-gray-300 hover:bg-gray-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Configure in Stripe
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Test Results */}
      {results.length > 0 && (
        <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Test Results</h3>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-5 rounded-xl border-2 transition-all ${
                  result.status === 'success'
                    ? 'bg-green-50 border-green-200'
                    : result.status === 'error'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {result.status === 'success' ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : result.status === 'error' ? (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Loader2 className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5 animate-spin" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-base mb-1">{result.step}</h4>
                    <p className="text-sm text-gray-700">{result.message}</p>
                    {result.details && (
                      <details className="mt-3">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 font-medium">
                          View details
                        </summary>
                        <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                          {typeof result.details === 'string' 
                            ? result.details 
                            : JSON.stringify(result.details, null, 2)
                          }
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Test Cards */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm border border-purple-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Stripe Test Cards
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
            <div>
              <p className="font-mono font-bold text-base">4242 4242 4242 4242</p>
              <p className="text-sm text-gray-600 mt-1">Success - Use any CVV and future date</p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-2 border-green-300 px-3 py-1 text-sm font-semibold">
              ✅ Success
            </Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
            <div>
              <p className="font-mono font-bold text-base">4000 0000 0000 0002</p>
              <p className="text-sm text-gray-600 mt-1">Declined - Card will be declined</p>
            </div>
            <Badge className="bg-red-100 text-red-700 border-2 border-red-300 px-3 py-1 text-sm font-semibold">
              ❌ Declined
            </Badge>
          </div>
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-200 shadow-sm">
            <div>
              <p className="font-mono font-bold text-base">4000 0025 0000 3155</p>
              <p className="text-sm text-gray-600 mt-1">3D Secure - Requires authentication</p>
            </div>
            <Badge className="bg-blue-100 text-blue-700 border-2 border-blue-300 px-3 py-1 text-sm font-semibold">
              🔐 Auth Required
            </Badge>
          </div>
        </div>
      </Card>

      {/* Documentation Link */}
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-base text-gray-900">Need help?</p>
            <p className="text-sm text-gray-600 mt-1">Read the complete setup guide for detailed instructions</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              toast.success('Check /PAYMENT_SETUP_GUIDE.md for detailed instructions');
            }}
            className="border-2 border-gray-300 hover:bg-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Guide
          </Button>
        </div>
      </Card>
    </div>
  );
}