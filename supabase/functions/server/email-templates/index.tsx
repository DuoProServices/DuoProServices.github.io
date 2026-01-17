/**
 * EMAIL TEMPLATES INDEX
 * Central export point for all email templates
 */

export { generateWelcomeEmail } from './welcome-email.tsx';
export type { WelcomeEmailData } from './welcome-email.tsx';

export { generatePaymentConfirmationEmail } from './payment-confirmation-email.tsx';
export type { PaymentConfirmationEmailData } from './payment-confirmation-email.tsx';

export { generateInvoiceEmail } from './invoice-email.tsx';
export type { InvoiceEmailData } from './invoice-email.tsx';

export { generateTaxReturnCompletedEmail } from './tax-return-completed-email.tsx';
export type { TaxReturnCompletedEmailData } from './tax-return-completed-email.tsx';

export { generateReminderEmail } from './reminder-email.tsx';
export type { ReminderEmailData } from './reminder-email.tsx';
