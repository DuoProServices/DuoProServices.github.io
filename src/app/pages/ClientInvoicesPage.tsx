/**
 * CLIENT INVOICES PAGE
 * Allows clients to view their invoice history
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  ArrowLeft,
  Receipt,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  DollarSign,
  FileText,
  Loader2,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../utils/supabaseClient';
import { API_ENDPOINTS } from '@/config/api';

interface Invoice {
  invoiceNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  year: number;
  type: 'initial' | 'final';
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'cancelled';
  documentCount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
}

export default function ClientInvoicesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ BACKEND MODE: Using real Supabase backend
  const DEMO_MODE = false; // Backend is deployed and working!
  const STORAGE_KEY = 'client-invoices-demo';

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      // ⚠️ DEMO MODE: Load from localStorage
      if (DEMO_MODE) {
        console.log('📦 [Client Invoices] DEMO MODE: Loading from localStorage');
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const userInvoices = parsed.filter((inv: Invoice) => inv.userId === user?.id);
          setInvoices(userInvoices);
          console.log('✅ [Client Invoices] Loaded', userInvoices.length, 'invoices from localStorage');
        } else {
          console.log('📭 [Client Invoices] No invoices in localStorage - starting with empty list');
          setInvoices([]);
        }
        setLoading(false);
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error('Please log in again');
      }

      const response = await fetch(API_ENDPOINTS.invoices, {
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch invoices');
      }

      setInvoices(result.invoices || []);
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast.error(error.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-300">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'initial':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
            Initial Payment
          </Badge>
        );
      case 'final':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
            Final Payment
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleDownloadInvoice = async (invoiceNumber: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token) {
        throw new Error('Please log in again');
      }

      const response = await fetch(API_ENDPOINTS.invoicePdf(invoiceNumber), {
        headers: {
          'Authorization': `Bearer ${session.session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate invoice PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Invoice downloaded successfully!');
    } catch (error: any) {
      console.error('Error downloading invoice:', error);
      toast.error(error.message || 'Failed to download invoice');
    }
  };

  const handlePreviewInvoice = async (invoice: Invoice) => {
    // Generate HTML preview
    const html = generateInvoiceHTML(invoice);
    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const generateInvoiceHTML = (invoice: Invoice): string => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const formatCurrency = (amount: number, currency: string) => {
      return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: currency
      }).format(amount);
    };

    const statusBadge = invoice.status === 'paid' 
      ? '<span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">PAID</span>'
      : '<span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">PENDING</span>';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      background: #f9fafb;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 60px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid #e5e7eb;
    }
    .company-info h1 {
      color: #2563eb;
      font-size: 28px;
      margin-bottom: 8px;
    }
    .company-info p {
      color: #6b7280;
      font-size: 14px;
      line-height: 1.4;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-meta h2 {
      font-size: 32px;
      color: #111827;
      margin-bottom: 8px;
    }
    .invoice-number {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 12px;
    }
    .details-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .detail-box h3 {
      font-size: 12px;
      text-transform: uppercase;
      color: #6b7280;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    .detail-box p {
      font-size: 14px;
      color: #111827;
      margin-bottom: 4px;
    }
    .items-table {
      width: 100%;
      margin: 40px 0;
      border-collapse: collapse;
    }
    .items-table thead {
      background: #f3f4f6;
    }
    .items-table th {
      padding: 12px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      color: #6b7280;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .items-table td {
      padding: 16px 12px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }
    .items-table tbody tr:last-child td {
      border-bottom: 2px solid #e5e7eb;
    }
    .total-section {
      margin-top: 30px;
      text-align: right;
    }
    .total-row {
      display: flex;
      justify-content: flex-end;
      padding: 8px 0;
      font-size: 14px;
    }
    .total-row.grand-total {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      padding-top: 16px;
      margin-top: 16px;
      border-top: 2px solid #e5e7eb;
    }
    .total-label {
      margin-right: 40px;
      color: #6b7280;
    }
    .total-row.grand-total .total-label {
      color: #111827;
    }
    .total-amount {
      min-width: 120px;
      text-align: right;
      color: #111827;
    }
    .footer {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    .footer p {
      margin: 4px 0;
    }
    .status-badge {
      display: inline-block;
      margin-top: 8px;
    }
    .notes-section {
      background: #f9fafb;
      padding: 20px;
      border-radius: 6px;
      margin: 30px 0;
      border-left: 4px solid #2563eb;
    }
    .notes-section h4 {
      color: #111827;
      font-size: 14px;
      margin-bottom: 8px;
    }
    .notes-section p {
      color: #6b7280;
      font-size: 13px;
      line-height: 1.6;
    }
    .tax-note {
      margin-top: 20px;
      padding: 12px;
      background: #f0f9ff;
      border-left: 3px solid #3b82f6;
      font-size: 12px;
      color: #1e40af;
    }
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2563eb;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .print-button:hover {
      background: #1d4ed8;
    }
    @media print {
      .print-button { display: none; }
      body { padding: 0; background: white; }
    }
  </style>
</head>
<body>
  <button class="print-button" onclick="window.print()">🖨️ Print / Save as PDF</button>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div class="company-info">
        <h1>DuoProServices</h1>
        <p>Professional Tax Services</p>
        <p>Email: [Your Email]</p>
        <p>Phone: [Your Phone]</p>
      </div>
      <div class="invoice-meta">
        <h2>INVOICE</h2>
        <p class="invoice-number">${invoice.invoiceNumber}</p>
        <div class="status-badge">${statusBadge}</div>
      </div>
    </div>

    <!-- Details Section -->
    <div class="details-section">
      <div class="detail-box">
        <h3>Bill To</h3>
        <p><strong>${invoice.userName}</strong></p>
        <p>${invoice.userEmail}</p>
      </div>
      <div class="detail-box">
        <h3>Invoice Details</h3>
        <p><strong>Date Issued:</strong> ${formatDate(invoice.createdAt)}</p>
        <p><strong>Tax Year:</strong> ${invoice.year}</p>
        ${invoice.paidAt ? `<p><strong>Date Paid:</strong> ${formatDate(invoice.paidAt)}</p>` : ''}
      </div>
    </div>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Quantity</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${invoice.type === 'initial' ? `${invoice.year} tax return processing (filed in ${invoice.year - 1})` : invoice.description}</strong>
            ${invoice.documentCount > 0 ? `<br><small style="color: #6b7280;">${invoice.documentCount} document${invoice.documentCount !== 1 ? 's' : ''} submitted</small>` : ''}
          </td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right;">${formatCurrency(invoice.amount, invoice.currency)}</td>
        </tr>
      </tbody>
    </table>

    <!-- Total Section -->
    <div class="total-section">
      <div class="total-row">
        <span class="total-label">Subtotal:</span>
        <span class="total-amount">${formatCurrency(invoice.amount, invoice.currency)}</span>
      </div>
      <div class="total-row">
        <span class="total-label">Tax (Included)*:</span>
        <span class="total-amount">$0.00</span>
      </div>
      <div class="total-row grand-total">
        <span class="total-label">Total Due:</span>
        <span class="total-amount">${formatCurrency(invoice.amount, invoice.currency)}</span>
      </div>
    </div>

    <!-- Tax Note -->
    <div class="tax-note">
      <strong>* Tax Information:</strong> Personal tax preparation services are exempt from GST/HST in Canada under Schedule V, Part II, Section 12 of the Excise Tax Act.
    </div>

    <!-- Notes Section -->
    <div class="notes-section">
      <h4>Payment Information</h4>
      <p>
        ${invoice.status === 'paid' 
          ? `This invoice has been paid in full. Thank you for your business!` 
          : `This invoice is currently pending payment. Please complete payment to proceed with your tax filing.`
        }
      </p>
      ${invoice.type === 'initial' 
        ? `<p style="margin-top: 8px;">This initial payment allows us to begin processing your ${invoice.year} tax return. The final balance will be invoiced once your return is complete.</p>`
        : ''
      }
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>DuoProServices - Professional Tax Services</strong></p>
      <p>Thank you for choosing our services!</p>
      <p style="margin-top: 12px; font-size: 11px;">
        Questions? Contact us at [Your Email] or call [Your Phone]
      </p>
    </div>
  </div>
</body>
</html>
    `;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Invoices</h1>
              <p className="text-gray-600">View and download your tax filing invoices</p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading invoices...</p>
            </div>
          </Card>
        ) : invoices.length === 0 ? (
          /* Empty State */
          <Card className="p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Invoices Yet</h3>
              <p className="text-gray-600 mb-6">
                Your invoices will appear here once you start filing your taxes.
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </Card>
        ) : (
          /* Invoices List */
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.invoiceNumber} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Invoice Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-lg text-gray-900">
                        {invoice.invoiceNumber}
                      </h3>
                      {getStatusBadge(invoice.status)}
                      {getTypeBadge(invoice.type)}
                    </div>

                    {/* Invoice Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Amount</p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(invoice.amount, invoice.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Tax Year</p>
                        <p className="font-medium text-gray-900">{invoice.year}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Issued Date</p>
                        <p className="font-medium text-gray-900 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(invoice.createdAt)}
                        </p>
                      </div>
                      {invoice.paidAt && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Paid Date</p>
                          <p className="font-medium text-green-700 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {formatDate(invoice.paidAt)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600">{invoice.description}</p>
                    
                    {invoice.documentCount > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        {invoice.documentCount} document{invoice.documentCount !== 1 ? 's' : ''} submitted
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="ml-4 flex flex-col gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handlePreviewInvoice(invoice)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Invoice
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(invoice.invoiceNumber)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Summary Card */}
        {!loading && invoices.length > 0 && (
          <Card className="p-6 mt-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    invoices
                      .filter(inv => inv.status === 'paid')
                      .reduce((sum, inv) => sum + inv.amount, 0),
                    'CAD'
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(
                    invoices
                      .filter(inv => inv.status === 'pending')
                      .reduce((sum, inv) => sum + inv.amount, 0),
                    'CAD'
                  )}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}