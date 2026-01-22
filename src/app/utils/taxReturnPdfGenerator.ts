/**
 * TAX RETURN PDF GENERATOR - STUB VERSION
 * Versão simplificada sem geração real de PDF
 */

import { TaxReturnSummary } from '../types/taxFiling';

interface TaxReturnPDFData {
  year: number;
  clientName: string;
  clientEmail: string;
  summary: TaxReturnSummary;
  serviceName: string;
  generatedDate: string;
}

/**
 * Generates a simple text file instead of PDF (stub version)
 */
export function generateTaxReturnSummaryPDFBlob(data: TaxReturnPDFData): Blob {
  const content = `
TAX RETURN SUMMARY ${data.year}

Client: ${data.clientName}
Email: ${data.clientEmail}
Service: ${data.serviceName}
Generated: ${data.generatedDate}

FEDERAL TAX
Refund: $${data.summary.federalRefund}
Owing: $${data.summary.federalOwing}

PROVINCIAL TAX
Refund: $${data.summary.provincialRefund}
Owing: $${data.summary.provincialOwing}

CREDITS
GST Credit: $${data.summary.gstCredit || 0}
Child Benefit: $${data.summary.childBenefit || 0}
Other Credits: $${data.summary.otherCredits || 0}

NET AMOUNT: $${data.summary.netAmount}
${data.summary.estimatedRefundDate ? `Estimated Refund Date: ${data.summary.estimatedRefundDate}` : ''}

${data.summary.notes || ''}
  `.trim();

  return new Blob([content], { type: 'text/plain' });
}

/**
 * Downloads the tax return summary as a text file
 */
export function downloadTaxReturnSummaryPDF(data: TaxReturnPDFData): void {
  const blob = generateTaxReturnSummaryPDFBlob(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tax-return-${data.year}-${data.clientName.replace(/\s+/g, '-')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
