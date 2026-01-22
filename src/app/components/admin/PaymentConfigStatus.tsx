/**
 * PAYMENT CONFIG STATUS
 * Small widget showing Stripe configuration status
 */

import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { API_ENDPOINTS } from '@/config/api';

export function PaymentConfigStatus() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'checking' | 'configured' | 'not-configured'>('checking');

  useEffect(() => {
    checkStripeConfig();
  }, []);

  const checkStripeConfig = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        setStatus('not-configured');
        return;
      }

      // Try to create a test invoice to verify Stripe is working
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

      if (response.ok && (result.checkoutUrl || result.paymentUrl)) {
        setStatus('configured');
      } else {
        setStatus('not-configured');
      }
    } catch (error) {
      setStatus('not-configured');
    }
  };

  if (status === 'checking') {
    return null; // Don't show while checking
  }

  if (status === 'configured') {
    return (
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-900 text-sm">Stripe Configured</p>
              <p className="text-xs text-green-700">Payments are working correctly</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/admin/payment-setup')}
          >
            Test
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-amber-50 border-amber-300 border-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-900 text-sm">⚠️ Stripe Not Configured</p>
            <p className="text-xs text-amber-700">Set up payments to accept $50 deposits</p>
          </div>
        </div>
        <Button
          size="sm"
          className="bg-amber-600 hover:bg-amber-700"
          onClick={() => navigate('/admin/payment-setup')}
        >
          Setup Now
        </Button>
      </div>
    </Card>
  );
}