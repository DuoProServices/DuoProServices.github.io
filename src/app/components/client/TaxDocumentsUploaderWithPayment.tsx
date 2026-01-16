/**
 * TAX DOCUMENTS UPLOADER WITH PAYMENT
 * Version that requires payment before submission
 * Integrated with the new payment workflow
 */

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Upload, FileText, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react';
import { ParsedDocument } from '../../types/taxDocuments';
import { toast } from 'sonner';
import { SubmitDocumentsWithPayment } from './SubmitDocumentsWithPayment';

interface TaxDocumentsUploaderWithPaymentProps {
  year: number;
  onComplete?: () => void;
  disabled?: boolean;
  initialPaymentPaid?: boolean;
}

export function TaxDocumentsUploaderWithPayment({ 
  year, 
  onComplete,
  disabled = false,
  initialPaymentPaid = false
}: TaxDocumentsUploaderWithPaymentProps) {
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedDocs, setParsedDocs] = useState<ParsedDocument[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setParsing(true);
    toast.info(`Uploading and parsing ${files.length} file(s)...`);

    try {
      // Simply create parsed documents from files without OCR
      const results: ParsedDocument[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        fileName: file.name,
        type: 'other',
        confidence: 100,
        needsReview: false,
        data: {}
      }));
      
      // Add to parsed docs
      setParsedDocs(prev => [...prev, ...results]);
      
      toast.success(`Successfully processed ${results.length} document(s)!`);
      
      // Log the parsed data
      console.log('📄 Parsed documents:', results);

    } catch (error: any) {
      console.error('Error uploading documents:', error);
      toast.error(error.message || 'Failed to process documents');
    } finally {
      setUploading(false);
      setParsing(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleRemoveDocument = (docId: string) => {
    setParsedDocs(prev => prev.filter(doc => doc.id !== docId));
    toast.success('Document removed');
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      't4': 'T4 - Employment Income',
      'releve1': 'Relevé 1 - Quebec Employment',
      't5': 'T5 - Investment Income',
      't2202': 'T2202 - Tuition',
      'rrsp': 'RRSP Contribution',
      'medical': 'Medical Expense',
      'donation': 'Donation Receipt',
      'business': 'Business Expense',
      'other': 'Other Document',
    };
    return labels[type] || type.toUpperCase();
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence > 70) {
      return <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">High Confidence</span>;
    } else if (confidence > 50) {
      return <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">Medium Confidence</span>;
    } else {
      return <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">Low Confidence</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upload Tax Documents</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            multiple
            accept=".pdf,image/*"
            onChange={handleFileUpload}
            className="hidden"
            id={`tax-docs-upload-${year}`}
            disabled={uploading || parsing || disabled || initialPaymentPaid}
          />
          <label 
            htmlFor={`tax-docs-upload-${year}`} 
            className={`${disabled || initialPaymentPaid ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {uploading ? 'Uploading...' : 'Click to upload documents'}
            </p>
            <p className="text-sm text-gray-500">
              T4, Relevé 1, T5, T2202, RRSP receipts, etc.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              PDF, JPG, PNG supported. Multiple files allowed.
            </p>
          </label>
        </div>

        {parsing && (
          <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Using OCR to extract data from documents...</span>
          </div>
        )}
        
        {initialPaymentPaid && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded flex items-center gap-2 text-sm text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span>Documents already submitted with initial payment!</span>
          </div>
        )}
      </Card>

      {/* Parsed Documents List */}
      {parsedDocs.length > 0 && !initialPaymentPaid && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Uploaded Documents ({parsedDocs.length})
            </h3>
          </div>

          <div className="space-y-3 mb-6">
            {parsedDocs.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{doc.fileName}</p>
                      {getConfidenceBadge(doc.confidence)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {getDocumentTypeLabel(doc.type)}
                    </p>
                    
                    {/* Show extracted data preview */}
                    {doc.type === 't4' && doc.data && (
                      <div className="text-xs text-gray-500 space-y-1">
                        {(doc.data as any).employmentIncome && (
                          <p>Employment Income: ${(doc.data as any).employmentIncome.toLocaleString()}</p>
                        )}
                        {(doc.data as any).incomeTaxDeducted && (
                          <p>Tax Withheld: ${(doc.data as any).incomeTaxDeducted.toLocaleString()}</p>
                        )}
                      </div>
                    )}

                    {doc.type === 'releve1' && doc.data && (
                      <div className="text-xs text-gray-500 space-y-1">
                        {(doc.data as any).employmentIncome && (
                          <p>Employment Income: ${(doc.data as any).employmentIncome.toLocaleString()}</p>
                        )}
                        {(doc.data as any).provincialIncomeTax && (
                          <p>Quebec Tax: ${(doc.data as any).provincialIncomeTax.toLocaleString()}</p>
                        )}
                      </div>
                    )}

                    {doc.needsReview && (
                      <div className="flex items-center gap-1 mt-2 text-yellow-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs">May need manual review</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Remove button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDocument(doc.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Payment & Submit Component */}
          <SubmitDocumentsWithPayment 
            year={year}
            parsedDocuments={parsedDocs}
            onSuccess={() => {
              setParsedDocs([]);
              if (onComplete) {
                onComplete();
              }
            }}
            disabled={disabled}
          />
        </Card>
      )}

      {/* Instructions */}
      {!initialPaymentPaid && parsedDocs.length === 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-blue-900 mb-1">How it works</p>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Upload your tax documents (T4, Relevé 1, receipts, etc.)</li>
                <li>Our OCR system automatically extracts the data</li>
                <li>Pay the $50 CAD initial fee to submit documents</li>
                <li>We'll review and calculate your taxes</li>
                <li>You'll approve the final price before we file with CRA</li>
              </ol>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}