/**
 * SUBMIT DOCUMENTS WITH PAYMENT COMPONENT
 * Manages the workflow: Upload Documents → Pay $50 Initial Fee → Submit
 * Generates invoice for the initial payment
 */

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { 
  CreditCard, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Receipt,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../utils/supabaseClient';
import { API_ENDPOINTS } from '@/config/api';
import { ParsedDocument } from '../../types/taxDocuments';

interface SubmitDocumentsWithPaymentProps {
  year: number;
  parsedDocuments: ParsedDocument[];
  onSuccess?: () => void;
  disabled?: boolean;
}

export function SubmitDocumentsWithPayment({
  year,
  parsedDocuments,
  onSuccess,
  disabled = false
}: SubmitDocumentsWithPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

  // Step 1: Generate Invoice + Create Payment Session
  const handleSubmitWithPayment = async () => {
    if (parsedDocuments.length === 0) {
      toast.error('Please upload at least one document before submitting');
      return;
    }

    setIsProcessing(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error('Please log in again');
      }

      toast.info('Generating invoice and payment link...');

      // Call backend to create invoice + payment session
      const response = await fetch(API_ENDPOINTS.createInitialPaymentInvoice, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify({
          year,
          documentCount: parsedDocuments.length,
          amount: 50, // Initial fee is always $50 CAD
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate invoice');
      }

      // Set invoice generated flag
      setInvoiceGenerated(true);
      
      // If payment URL is returned, redirect to Stripe
      if (result.paymentUrl) {
        setPaymentUrl(result.paymentUrl);
        toast.success('Invoice generated! Redirecting to payment...');
        
        // Wait 1 second then redirect
        setTimeout(() => {
          window.location.href = result.paymentUrl;
        }, 1000);
      } else {
        throw new Error('No payment URL returned');
      }

    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2: After payment success, submit documents
  const handleSubmitDocuments = async () => {
    setIsProcessing(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error('Please log in again');
      }

      // Save parsed documents
      const response = await fetch(API_ENDPOINTS.taxDocumentsParse, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify({
          year,
          parsedDocuments,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save documents');
      }

      toast.success(`✅ Successfully submitted ${parsedDocuments.length} document(s)!`);
      
      if (onSuccess) {
        onSuccess();
      }

    } catch (error: any) {
      console.error('Error submitting documents:', error);
      toast.error(error.message || 'Failed to submit documents');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <FileText className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Submit Documents & Start Tax Filing
            </h3>
            <p className="text-sm text-gray-600">
              Ready to submit {parsedDocuments.length} document(s) for tax year {year}
            </p>
          </div>
        </div>

        {/* Payment Requirement Notice */}
        <div className="bg-white rounded-lg p-4 border-2 border-amber-200">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 mb-2">
                ⚠️ Initial Payment Required
              </p>
              <p className="text-xs text-gray-600 mb-3">
                To start processing your tax return, a <strong>$50 CAD initial fee</strong> is required. 
                This covers the initial analysis and document review. You'll pay the remaining balance 
                after we complete your return.
              </p>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">Initial Fee</span>
                </div>
                <span className="text-lg font-bold text-blue-600">$50.00 CAD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleSubmitWithPayment}
            disabled={disabled || isProcessing || parsedDocuments.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Submit Documents & Pay $50 Initial Fee
              </>
            )}
          </Button>

          {parsedDocuments.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Please upload at least one document before submitting</span>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-white rounded p-3 text-xs text-gray-500 border border-gray-200">
          <p className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>What happens next:</strong> After payment, we'll review your documents, 
              calculate your taxes, and provide a detailed report with the final price. 
              You'll approve and pay the remaining balance before we file with CRA.
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}
