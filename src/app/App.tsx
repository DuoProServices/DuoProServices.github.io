<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';

// Import all pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import OnboardingPage from './pages/OnboardingPageNew';
import AuthDebugPage from './pages/AuthDebugPage';
import OnboardingSuccessPage from './pages/OnboardingSuccessPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SimpleDashboardPage from './pages/SimpleDashboardPage';
import TaxFilingDetailPage from './pages/TaxFilingDetailPage';
import AdminHubPage from './pages/AdminHubPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminClientsPage from './pages/AdminClientsPage';
import AdminClientDetailPage from './pages/AdminClientDetailPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminUsersListPage from './pages/AdminUsersListPage';
import AdminFinancialDashboard from './pages/AdminFinancialDashboard';
import AdminBookkeepingDashboard from './pages/AdminBookkeepingDashboard';
import AdminInvoicesPage from './pages/AdminInvoicesPage';
import AdminPaymentSetupPage from './pages/AdminPaymentSetupPage';
import ClientInvoicesPage from './pages/ClientInvoicesPage';
import ContentCalendarDashboard from './pages/ContentCalendarDashboard';
import ErrorBoundaryPage from './pages/ErrorBoundaryPage';
import AdminControlPanelPage from './pages/AdminControlPanelPage';
import AdminMarketingDashboard from './pages/AdminMarketingDashboard';
import AdminProductivityDashboard from './pages/AdminProductivityDashboard';
import AdminTeamActivityPage from './pages/AdminTeamActivityPage';

export default function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter
            basename="/"
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
            
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Pricing } from "./components/Pricing";
import { Process } from "./components/Process";
import { Contact } from "./components/Contact";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { SEO } from "./components/SEO";
import { SimpleErrorBoundary } from "./components/SimpleErrorBoundary";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { OnboardingSuccessPage } from "./pages/OnboardingSuccessPage";
import { SimpleDashboardPage } from "./pages/SimpleDashboardPage";
import { TaxFilingDetailPage } from "./pages/TaxFilingDetailPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { AdminHubPage } from "./pages/AdminHubPage";
import { AdminClientsPage } from "./pages/AdminClientsPage";
import { AdminClientDetailPage } from "./pages/AdminClientDetailPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminFinancialDashboard } from "./pages/AdminFinancialDashboard";
import { AdminBookkeepingDashboard } from "./pages/AdminBookkeepingDashboard";
import { AdminMarketingDashboard } from "./pages/AdminMarketingDashboard";
import { ContentCalendarDashboard } from "./pages/ContentCalendarDashboard";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { AdminProductivityDashboard } from "./pages/AdminProductivityDashboard";
import { SupabaseConnectionTest } from "./components/SupabaseConnectionTest";

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        canonicalPath="/"
        type="website"
      />
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Pricing />
        <Process />
        <Contact />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <SimpleErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
<<<<<<< HEAD
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              
              {/* Client Routes */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/simple-dashboard" element={<SimpleDashboardPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/onboarding-success" element={<OnboardingSuccessPage />} />
              <Route path="/tax-filing/:yearId" element={<TaxFilingDetailPage />} />
              <Route path="/client-invoices" element={<ClientInvoicesPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin-hub" element={<AdminHubPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin-control-panel" element={<AdminControlPanelPage />} />
              <Route path="/admin/clients" element={<AdminClientsPage />} />
              <Route path="/admin/clients/:clientId" element={<AdminClientDetailPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/users-list" element={<AdminUsersListPage />} />
              <Route path="/admin/financial" element={<AdminFinancialDashboard />} />
              <Route path="/admin/bookkeeping" element={<AdminBookkeepingDashboard />} />
              <Route path="/admin/invoices" element={<AdminInvoicesPage />} />
              <Route path="/admin/payment-setup" element={<AdminPaymentSetupPage />} />
              <Route path="/admin/marketing" element={<AdminMarketingDashboard />} />
              <Route path="/admin/productivity" element={<AdminProductivityDashboard />} />
              <Route path="/admin/team-activity" element={<AdminTeamActivityPage />} />
              <Route path="/content-calendar" element={<ContentCalendarDashboard />} />
              
              {/* Debug Routes */}
              <Route path="/auth-debug" element={<AuthDebugPage />} />
              <Route path="/error" element={<ErrorBoundaryPage />} />
            </Routes>
            
            {/* Toast Notifications */}
            <Toaster position="top-right" richColors closeButton />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </HelmetProvider>
=======
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/onboarding-success" element={<OnboardingSuccessPage />} />
              <Route path="/dashboard" element={<SimpleDashboardPage />} />
              <Route path="/tax-filing/:year" element={<TaxFilingDetailPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/admin" element={<AdminHubPage />} />
              <Route path="/admin/clients" element={<AdminClientsPage />} />
              <Route path="/admin/client/:userId" element={<AdminClientDetailPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/financial-dashboard" element={<AdminFinancialDashboard />} />
              <Route path="/admin/bookkeeping-dashboard" element={<AdminBookkeepingDashboard />} />
              <Route path="/admin/marketing-dashboard" element={<AdminMarketingDashboard />} />
              <Route path="/admin/content-calendar" element={<ContentCalendarDashboard />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/productivity" element={<AdminProductivityDashboard />} />
              <Route path="/test-supabase" element={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                  <SupabaseConnectionTest />
                </div>
              } />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </SimpleErrorBoundary>
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
  );
}