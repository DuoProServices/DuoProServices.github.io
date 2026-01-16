import { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

export const invoicePdfApp = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

/**
 * GENERATE INVOICE PDF
 * Creates a professional PDF invoice
 * Route: GET /make-server-c2a25be0/payment/invoice/:invoiceNumber/pdf
 */
invoicePdfApp.get('/make-server-c2a25be0/payment/invoice/:invoiceNumber/pdf', async (c) => {
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

    // Generate HTML for PDF
    const html = generateInvoiceHTML(invoice);

    // Convert HTML to PDF (simplified version - in production use a proper PDF library)
    const pdfBuffer = await generatePDFFromHTML(html);

    // Return PDF
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoiceNumber}.pdf"`,
      },
    });

  } catch (error) {
    console.error('❌ Error generating invoice PDF:', error);
    return c.json({ error: 'Failed to generate PDF' }, 500);
  }
});

/**
 * Generate professional invoice HTML
 */
function generateInvoiceHTML(invoice: any): string {
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
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div class="company-info">
        <h1>DuoProServices</h1>
        <p>Professional Tax Services</p>
        <p>Montreal & All Across Canada</p>
        <p>Email: contact@duoproservices.ca</p>
        <p>Phone: +1 (514) 562-7838</p>
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
        Questions? Contact us at contact@duoproservices.ca or call +1 (514) 562-7838
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Convert HTML to PDF
 * Note: This is a simplified version. In production, use a library like puppeteer or wkhtmltopdf
 */
async function generatePDFFromHTML(html: string): Promise<Uint8Array> {
  // For now, we'll return the HTML as a text file
  // In production, you would use a PDF generation library
  // For Deno, you can use: https://deno.land/x/pdfmake or puppeteer
  
  const encoder = new TextEncoder();
  return encoder.encode(html);
  
  // TODO: Implement actual PDF generation using a library like:
  // - puppeteer-core with chrome
  // - wkhtmltopdf
  // - pdfmake
  // - jsPDF
}

export default invoicePdfApp;