import { useState, useEffect } from 'react';
import { projectId } from '../../../utils/supabase/info';
import { supabase } from '../utils/supabaseClient';
<<<<<<< HEAD
import { apiHelper } from '../utils/apiHelper'; // ✅ Usando API helper com fallback
=======
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8

export interface PaymentStatus {
  initialPaid: boolean;
  initialAmount: number;
  finalPaid: boolean;
  finalAmount: number;
  totalPrice: number;
}

export function usePaymentStatus(taxYear: number) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) {
<<<<<<< HEAD
          // ✅ Em demo mode, retorna status mockado
          setPaymentStatus({
            initialPaid: true,
            initialAmount: 50,
            finalPaid: false,
            finalAmount: 0,
            totalPrice: 150
          });
          setLoading(false);
          return;
        }

        // ✅ Usa apiHelper que detecta backend offline e retorna dados mockados
        const result = await apiHelper.get<{ payment: PaymentStatus }>(
=======
          throw new Error('Not authenticated');
        }

        const response = await fetch(
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
          `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/payments/${taxYear}/status`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

<<<<<<< HEAD
        setPaymentStatus(result.payment);

      } catch (err: any) {
        // ✅ Silencia erros de backend offline (apiHelper já retorna dados mockados)
        if (err.message?.includes('Failed to fetch') || err.message?.includes('Network')) {
          // Backend offline - usa dados mockados silenciosamente
          setPaymentStatus({
            initialPaid: true,
            initialAmount: 50,
            finalPaid: false,
            finalAmount: 0,
            totalPrice: 150
          });
        } else {
          // Só loga erros reais
          console.error('Error fetching payment status:', err);
          setError(err.message);
        }
=======
        if (!response.ok) {
          throw new Error('Failed to fetch payment status');
        }

        const { payment } = await response.json();
        setPaymentStatus(payment);

      } catch (err: any) {
        console.error('Error fetching payment status:', err);
        setError(err.message);
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [taxYear]);

<<<<<<< HEAD
  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      if (!accessToken) {
        setPaymentStatus({
          initialPaid: true,
          initialAmount: 50,
          finalPaid: false,
          finalAmount: 0,
          totalPrice: 150
        });
        setLoading(false);
        return;
      }

      const result = await apiHelper.get<{ payment: PaymentStatus }>(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/payments/${taxYear}/status`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      setPaymentStatus(result.payment);

    } catch (err: any) {
      if (err.message?.includes('Failed to fetch') || err.message?.includes('Network')) {
        setPaymentStatus({
          initialPaid: true,
          initialAmount: 50,
          finalPaid: false,
          finalAmount: 0,
          totalPrice: 150
        });
      } else {
        console.error('Error fetching payment status:', err);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
=======
  const refetch = () => {
    setLoading(true);
    setError(null);
    
    const fetchPaymentStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        if (!accessToken) {
          throw new Error('Not authenticated');
        }

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/payments/${taxYear}/status`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch payment status');
        }

        const { payment } = await response.json();
        setPaymentStatus(payment);

      } catch (err: any) {
        console.error('Error fetching payment status:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
  };

  return {
    paymentStatus,
    loading,
    error,
    refetch
  };
}