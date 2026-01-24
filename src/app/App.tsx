import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from '@/app/contexts/LanguageContext';
import { AuthProvider, useAuth } from '@/app/contexts/AuthContext';
import { Toaster } from 'sonner';
import { logger } from '@/app/utils/logger';
import React from 'react';
import ErrorBoundary from '@/app/ErrorBoundary';

// Import pages directly
import HomePage from '@/app/pages/HomePage';
import LoginPage from '@/app/pages/LoginPage';
import DashboardPage from '@/app/pages/DashboardPage';
import AuthDebugPage from '@/app/pages/AuthDebugPage';
import SupabaseAuthManager from '@/app/pages/SupabaseAuthManager';
import QuickAdminSetup from '@/app/pages/QuickAdminSetup';
import QuickCreateAdminPage from '@/app/pages/QuickCreateAdminPage';
import SimpleResetPasswordPage from '@/app/pages/SimpleResetPasswordPage';
import DirectResetPasswordPage from '@/app/pages/DirectResetPasswordPage';
import ResetAdminPasswordsPage from '@/app/pages/ResetAdminPasswordsPage';
import AdminDiagnosticPage from '@/app/pages/AdminDiagnosticPage';
import SystemStatusPage from '@/app/pages/SystemStatusPage';
import AdminCheckPage from '@/app/pages/AdminCheckPage';

// Admin pages
import AdminIndexPage from '@/app/pages/AdminIndexPage';
import AdminControlPanelPage from '@/app/pages/AdminControlPanelPage';
import AdminHubPage from '@/app/pages/AdminHubPage';
import AdminClientsPage from '@/app/pages/AdminClientsPage';
import AdminClientDetailPage from '@/app/pages/AdminClientDetailPage';
import AdminUsersPage from '@/app/pages/AdminUsersPage';
import AdminCRMPage from '@/app/pages/AdminCRMPage';
import AdminTeamActivityPage from '@/app/pages/AdminTeamActivityPage';

// Loading component for protected routes
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
        <span className="text-white font-bold text-2xl">DP</span>
      </div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    logger.warn('ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    logger.warn('ProtectedRoute: User not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  // Validate all imports
  const requiredPages = {
    HomePage,
    LoginPage,
    DashboardPage,
    AuthDebugPage,
    QuickAdminSetup,
    QuickCreateAdminPage,
    SimpleResetPasswordPage,
    DirectResetPasswordPage,
    ResetAdminPasswordsPage,
    SupabaseAuthManager,
    AdminDiagnosticPage,
    SystemStatusPage,
    AdminControlPanelPage,
    AdminHubPage,
    AdminClientsPage,
    AdminClientDetailPage,
    AdminUsersPage,
    AdminCRMPage,
    AdminTeamActivityPage
  };

  Object.entries(requiredPages).forEach(([name, component]) => {
    if (!component) {
      console.error(`❌ ${name} is undefined!`);
      throw new Error(`${name} component failed to load`);
    }
  });

  console.log('✅ All page components loaded successfully');
  
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <Helmet>
                <title>DuoPro Services - Canadian Tax Services</title>
                <meta name="description" content="Professional Canadian tax services for individuals, newcomers, and small businesses." />
              </Helmet>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/setup" element={<QuickAdminSetup />} />
                <Route path="/quick-setup" element={<QuickCreateAdminPage />} />
                <Route path="/simple-reset" element={<SimpleResetPasswordPage />} />
                <Route path="/direct-reset" element={<DirectResetPasswordPage />} />
                <Route path="/reset-passwords" element={<ResetAdminPasswordsPage />} />
                <Route path="/admin-diagnostic" element={<AdminDiagnosticPage />} />
                <Route path="/auth-debug" element={<SupabaseAuthManager />} />
                <Route path="/auth-debug-old" element={<AuthDebugPage />} />
                <Route path="/system-status" element={<SystemStatusPage />} />
                <Route path="/admin-check" element={<AdminCheckPage />} />
                
                {/* Client Dashboard */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Admin Routes - Require Admin Access */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminIndexPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/control-panel" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminControlPanelPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/hub" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminHubPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/clients" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminClientsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/clients/:clientId" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminClientDetailPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminUsersPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/crm" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminCRMPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/team-activity" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminTeamActivityPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster position="top-right" richColors closeButton />
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
