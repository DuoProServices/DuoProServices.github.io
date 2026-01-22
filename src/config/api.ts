import { projectId } from '../../utils/supabase/info';

// Base API URL for Edge Functions
export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0`;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  signup: `${API_BASE_URL}/auth/signup`,
  session: `${API_BASE_URL}/auth/session`,
  
<<<<<<< HEAD
  // Personal Info
  personalInfo: `${API_BASE_URL}/personal-info`,
  
=======
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
  // Documents
  documentsUpload: `${API_BASE_URL}/documents/upload`,
  documents: `${API_BASE_URL}/documents`,
  documentDelete: (id: string) => `${API_BASE_URL}/documents/${id}`,
  
  // Messages
  messages: (clientId: string) => `${API_BASE_URL}/messages/${clientId}`,
  messagesSend: `${API_BASE_URL}/messages/send`,
  messagesUnreadCount: (clientId: string) => `${API_BASE_URL}/messages/${clientId}/unread-count`,
  messagesMarkRead: (messageId: string) => `${API_BASE_URL}/messages/${messageId}/read`,
  
  // Admin
  adminClients: `${API_BASE_URL}/admin/clients`,
  adminClient: (userId: string) => `${API_BASE_URL}/admin/clients/${userId}`,
  adminClientFiles: (userId: string, year: string) => `${API_BASE_URL}/admin/clients/${userId}/files/${year}`,
  adminFilingStatus: (userId: string, year: string) => `${API_BASE_URL}/admin/clients/${userId}/filings/${year}/status`,
  adminFinancials: `${API_BASE_URL}/admin/financials`,
  adminNotifications: `${API_BASE_URL}/admin/notifications/send`,
  adminCreateBuckets: `${API_BASE_URL}/admin/create-buckets`,
  adminSetupPolicies: `${API_BASE_URL}/admin/setup-storage-policies`,
  adminTaxDocumentNotify: `${API_BASE_URL}/admin/tax-document/notify`,
  adminCraAssessmentSend: `${API_BASE_URL}/admin/cra-assessment/send`,
<<<<<<< HEAD
  adminInvoices: `${API_BASE_URL}/admin/invoices`,
=======
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
  
  // Tax Filing
  taxFilingCreate: `${API_BASE_URL}/tax-filing/create`,
  taxFilingSubmitReport: `${API_BASE_URL}/tax-filing/submit-report`,
  taxFilingApproveReport: `${API_BASE_URL}/tax-filing/approve-report`,
  taxFilingRejectReport: `${API_BASE_URL}/tax-filing/reject-report`,
  
  // Tax Documents & Preview
  taxDocumentsParse: `${API_BASE_URL}/tax-documents/parse`,
  taxDocumentsGet: (year: string) => `${API_BASE_URL}/tax-documents/${year}`,
  taxPreviewSave: `${API_BASE_URL}/tax-preview/save`,
  taxPreviewGet: (userId: string, year: string) => `${API_BASE_URL}/tax-preview/${userId}/${year}`,
  
<<<<<<< HEAD
  // Initial Payment & Invoices
  createInitialPaymentInvoice: `${API_BASE_URL}/payment/initial-invoice`,
  invoices: `${API_BASE_URL}/payment/invoices`,
  invoice: (invoiceNumber: string) => `${API_BASE_URL}/payment/invoice/${invoiceNumber}`,
  invoicePdf: (invoiceNumber: string) => `${API_BASE_URL}/payment/invoice/${invoiceNumber}/pdf`,
  invoiceMarkPaid: (invoiceNumber: string) => `${API_BASE_URL}/payment/invoice/${invoiceNumber}/paid`,
  paymentVerify: `${API_BASE_URL}/payment/verify`,
  
  // Stripe Webhooks
  stripeWebhook: `${API_BASE_URL}/stripe/webhook`,
  
=======
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
  // Bookkeeping
  bookkeepingSummary: `${API_BASE_URL}/bookkeeping/summary`,
  bookkeepingExpenses: `${API_BASE_URL}/bookkeeping/expenses`,
  bookkeepingExpense: (id: string) => `${API_BASE_URL}/bookkeeping/expenses/${id}`,
<<<<<<< HEAD
  bookkeepingInvoices: `${API_BASE_URL}/bookkeeping/invoices`,
  bookkeepingInvoiceDelete: (invoiceNumber: string) => `${API_BASE_URL}/bookkeeping/invoices/${invoiceNumber}`,
  
  // Admin Hub (Projects & Social Calendar)
  adminHubTasks: `${API_BASE_URL}/admin-hub/tasks`,
  adminHubTaskDelete: (taskId: string) => `${API_BASE_URL}/admin-hub/tasks/${taskId}`,
  adminHubSocialPosts: `${API_BASE_URL}/admin-hub/social-posts`,
  adminHubSocialPostDelete: (postId: string) => `${API_BASE_URL}/admin-hub/social-posts/${postId}`,
  
  // Team Activities (Admin Hub)
  teamActivities: `${API_BASE_URL}/admin-hub/activities`,
  teamActivityDelete: (id: string) => `${API_BASE_URL}/admin-hub/activities/${id}`,
  
  // Contact Form
  contactSend: `${API_BASE_URL}/contact/send`,
=======
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
  
  // Health check
  health: `${API_BASE_URL}/health`,
};