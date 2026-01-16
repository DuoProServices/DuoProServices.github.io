import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import { lazy, Suspense } from 'react';

// Componente de Loading
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  );
}

// Lazy load de todas as páginas para melhorar performance
// Default exports
const HomePage = lazy(() => import('./pages/HomePage'));
const TestServerConnection = lazy(() => import('./pages/TestServerConnection'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AdminPaymentSetupPage = lazy(() => import('./pages/AdminPaymentSetupPage'));
const AdminInvoicesPage = lazy(() => import('./pages/AdminInvoicesPage'));
const AdminConfirmUser = lazy(() => import('./pages/AdminConfirmUser'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const OnboardingPage = lazy(() => import('./pages/OnboardingPageNew'));
const OnboardingSuccessPage = lazy(() => import('./pages/OnboardingSuccessPage'));
const ClientInvoicesPage = lazy(() => import('./pages/ClientInvoicesPage'));
const MarketingImageGenerator = lazy(() => import('./pages/MarketingImageGenerator'));
const AdminDebugPage = lazy(() => import('./pages/AdminDebugPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const SetupPage = lazy(() => import('./pages/SetupPage'));
const AuthDebugPage = lazy(() => import('./pages/AuthDebugPage'));
const AdminControlPanelPage = lazy(() => import('./pages/AdminControlPanelPage'));
const ServerTestPage = lazy(() => import('./pages/ServerTestPage'));
const UserManagementDebug = lazy(() => import('./pages/UserManagementDebug'));
const EmailConfirmationRequired = lazy(() => import('./pages/EmailConfirmationRequired'));
const DeleteUserByEmail = lazy(() => import('./pages/DeleteUserByEmail'));
const SignupDiagnostic = lazy(() => import('./pages/SignupDiagnostic'));
const CreateFirstAdmin = lazy(() => import('./pages/CreateFirstAdmin'));
const SignupDebugger = lazy(() => import('./pages/SignupDebugger'));
const SystemReset = lazy(() => import('./pages/SystemReset'));
const FixOfflineMode = lazy(() => import('./pages/FixOfflineMode'));

// Named exports - these need .then(m => ({ default: m.ComponentName }))
const AdminClientsPage = lazy(() => import('./pages/AdminClientsPage').then(m => ({ default: m.AdminClientsPage })));
const AdminBookkeepingDashboard = lazy(() => import('./pages/AdminBookkeepingDashboard').then(m => ({ default: m.AdminBookkeepingDashboard })));
const AdminFinancialDashboard = lazy(() => import('./pages/AdminFinancialDashboard').then(m => ({ default: m.AdminFinancialDashboard })));
const AdminMarketingDashboard = lazy(() => import('./pages/AdminMarketingDashboard').then(m => ({ default: m.AdminMarketingDashboard })));
const ContentCalendarDashboard = lazy(() => import('./pages/ContentCalendarDashboard').then(m => ({ default: m.ContentCalendarDashboard })));
const MarketingGuide = lazy(() => import('./pages/MarketingGuide').then(m => ({ default: m.MarketingGuide })));
const AdminClientDetailPage = lazy(() => import('./pages/AdminClientDetailPage').then(m => ({ default: m.AdminClientDetailPage })));
const AdminHubPage = lazy(() => import('./pages/AdminHubPage').then(m => ({ default: m.AdminHubPage })));
const AdminTeamActivityPage = lazy(() => import('./pages/AdminTeamActivityPage').then(m => ({ default: m.AdminTeamActivityPage })));
const ApiTestPage = lazy(() => import('./pages/ApiTestPage').then(m => ({ default: m.ApiTestPage })));
const AdminCRMPage = lazy(() => import('./pages/AdminCRMPage').then(m => ({ default: m.AdminCRMPage })));
const AdminUsersListPage = lazy(() => import('./pages/AdminUsersListPage').then(m => ({ default: m.AdminUsersListPage })));
const BackendDiagnosticPage = lazy(() => import('./pages/BackendDiagnosticPage').then(m => ({ default: m.BackendDiagnosticPage })));

export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Helmet>
              <title>DuoPro Services - Canadian Tax Services | Personal & Small Business Tax Returns</title>
              <meta name="description" content="Professional Canadian tax services for individuals, newcomers, and small businesses. Expert personal and small business tax returns in English and French." />
              <meta name="keywords" content="Canadian tax, tax return, personal tax, small business tax, newcomer tax, tax services Canada, fiscaliste Canada" />
              <link rel="canonical" href="https://duoproservices.ca" />
              
              {/* Open Graph */}
              <meta property="og:title" content="DuoPro Services - Canadian Tax Services" />
              <meta property="og:description" content="Professional Canadian tax services for individuals, newcomers, and small businesses." />
              <meta property="og:type" content="website" />
              <meta property="og:url" content="https://duoproservices.ca" />
              
              {/* Twitter Card */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="DuoPro Services - Canadian Tax Services" />
              <meta name="twitter:description" content="Professional Canadian tax services for individuals, newcomers, and small businesses." />
              
              {/* Structured Data */}
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "AccountingService",
                  "name": "DuoPro Services",
                  "description": "Professional Canadian tax services for individuals, newcomers, and small businesses",
                  "url": "https://duoproservices.ca",
                  "areaServed": "CA",
                  "serviceType": ["Tax Preparation", "Tax Filing", "Small Business Tax", "Personal Tax Returns"]
                })}
              </script>
            </Helmet>
            
            <Routes>
              <Route path="/" element={<Suspense fallback={<PageLoader />}><HomePage /></Suspense>} />
              <Route path="/test-server-connection" element={<Suspense fallback={<PageLoader />}><TestServerConnection /></Suspense>} />
              <Route path="/login" element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />
              <Route path="/dashboard" element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />
              <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminPage /></Suspense>} />
              <Route path="/admin/control-panel" element={<Suspense fallback={<PageLoader />}><AdminControlPanelPage /></Suspense>} />
              <Route path="/admin/team-activity" element={<Suspense fallback={<PageLoader />}><AdminTeamActivityPage /></Suspense>} />
              <Route path="/admin/clients" element={<Suspense fallback={<PageLoader />}><AdminClientsPage /></Suspense>} />
              <Route path="/admin/crm" element={<Suspense fallback={<PageLoader />}><AdminCRMPage /></Suspense>} />
              <Route path="/admin/bookkeeping-dashboard" element={<Suspense fallback={<PageLoader />}><AdminBookkeepingDashboard /></Suspense>} />
              <Route path="/admin/financial-dashboard" element={<Suspense fallback={<PageLoader />}><AdminFinancialDashboard /></Suspense>} />
              <Route path="/admin/payment-setup" element={<Suspense fallback={<PageLoader />}><AdminPaymentSetupPage /></Suspense>} />
              <Route path="/admin/marketing-dashboard" element={<Suspense fallback={<PageLoader />}><AdminMarketingDashboard /></Suspense>} />
              <Route path="/admin/content-calendar" element={<Suspense fallback={<PageLoader />}><ContentCalendarDashboard /></Suspense>} />
              <Route path="/admin/invoices" element={<Suspense fallback={<PageLoader />}><AdminInvoicesPage /></Suspense>} />
              <Route path="/admin/confirm-user" element={<Suspense fallback={<PageLoader />}><AdminConfirmUser /></Suspense>} />
              <Route path="/signup" element={<Suspense fallback={<PageLoader />}><SignupPage /></Suspense>} />
              <Route path="/onboarding" element={<Suspense fallback={<PageLoader />}><OnboardingPage /></Suspense>} />
              <Route path="/onboarding-success" element={<Suspense fallback={<PageLoader />}><OnboardingSuccessPage /></Suspense>} />
              <Route path="/client/invoices" element={<Suspense fallback={<PageLoader />}><ClientInvoicesPage /></Suspense>} />
              <Route path="/marketing-guide" element={<Suspense fallback={<PageLoader />}><MarketingGuide /></Suspense>} />
              <Route path="/marketing-generator" element={<Suspense fallback={<PageLoader />}><MarketingImageGenerator /></Suspense>} />
              <Route path="/admin/clients/:userId" element={<Suspense fallback={<PageLoader />}><AdminClientDetailPage /></Suspense>} />
              <Route path="/admin/hub" element={<Suspense fallback={<PageLoader />}><AdminHubPage /></Suspense>} />
              <Route path="/admin/debug" element={<Suspense fallback={<PageLoader />}><AdminDebugPage /></Suspense>} />
              <Route path="/reset-password" element={<Suspense fallback={<PageLoader />}><ResetPasswordPage /></Suspense>} />
              <Route path="/setup" element={<Suspense fallback={<PageLoader />}><SetupPage /></Suspense>} />
              <Route path="/auth-debug" element={<Suspense fallback={<PageLoader />}><AuthDebugPage /></Suspense>} />
              <Route path="/api-test" element={<Suspense fallback={<PageLoader />}><ApiTestPage /></Suspense>} />
              <Route path="/server-test" element={<Suspense fallback={<PageLoader />}><ServerTestPage /></Suspense>} />
              <Route path="/admin/users-list" element={<Suspense fallback={<PageLoader />}><AdminUsersListPage /></Suspense>} />
              <Route path="/backend-diagnostic" element={<Suspense fallback={<PageLoader />}><BackendDiagnosticPage /></Suspense>} />
              <Route path="/user-management-debug" element={<Suspense fallback={<PageLoader />}><UserManagementDebug /></Suspense>} />
              <Route path="/email-confirmation-required" element={<Suspense fallback={<PageLoader />}><EmailConfirmationRequired /></Suspense>} />
              <Route path="/delete-user-by-email" element={<Suspense fallback={<PageLoader />}><DeleteUserByEmail /></Suspense>} />
              <Route path="/signup-diagnostic" element={<Suspense fallback={<PageLoader />}><SignupDiagnostic /></Suspense>} />
              <Route path="/create-first-admin" element={<Suspense fallback={<PageLoader />}><CreateFirstAdmin /></Suspense>} />
              <Route path="/signup-debugger" element={<Suspense fallback={<PageLoader />}><SignupDebugger /></Suspense>} />
              <Route path="/system-reset" element={<Suspense fallback={<PageLoader />}><SystemReset /></Suspense>} />
              <Route path="/fix-offline-mode" element={<Suspense fallback={<PageLoader />}><FixOfflineMode /></Suspense>} />
            </Routes>
            
            {/* Toast Notifications */}
            <Toaster position="top-right" richColors closeButton />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}