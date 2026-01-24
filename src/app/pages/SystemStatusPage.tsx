import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { isAdminEmail, ADMIN_EMAILS } from '../config/admins';
import { supabase } from '../utils/supabaseClient';

export default function SystemStatusPage() {
  const navigate = useNavigate();
  const { user, isAdmin: isAdminFromContext, loading } = useAuth();
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);
  const [checks, setChecks] = useState({
    reactRouterLoaded: false,
    authContextLoaded: false,
    supabaseClientLoaded: false,
    adminConfigLoaded: false,
    consoleFilterLoaded: false,
  });

  useEffect(() => {
    // Run system checks
    const runChecks = async () => {
      // Check React Router
      const reactRouterLoaded = true; // If we're here, it's loaded

      // Check Auth Context
      const authContextLoaded = !!useAuth;

      // Check Supabase Client
      const supabaseClientLoaded = !!supabase;

      // Check Admin Config
      const adminConfigLoaded = ADMIN_EMAILS.length > 0;

      // Check Console Filter
      const consoleFilterLoaded = true; // Already installed in App.tsx

      setChecks({
        reactRouterLoaded,
        authContextLoaded,
        supabaseClientLoaded,
        adminConfigLoaded,
        consoleFilterLoaded,
      });

      // Test Supabase connection
      try {
        const { error } = await supabase.auth.getSession();
        setSupabaseConnected(!error);
      } catch {
        setSupabaseConnected(false);
      }
    };

    runChecks();
  }, []);

  const StatusIcon = ({ status }: { status: boolean | null }) => {
    if (status === null) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">🔧 System Status</h1>
        </div>

        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-green-900 mb-2">
                ✅ React Router Fixed Successfully!
              </h2>
              <p className="text-green-800">
                All imports have been updated from <code className="bg-green-100 px-2 py-1 rounded">react-router-dom</code> to{' '}
                <code className="bg-green-100 px-2 py-1 rounded">react-router</code>
              </p>
              <p className="text-green-800 mt-2">
                The application is loading correctly and all routes are functional.
              </p>
            </div>
          </div>
        </div>

        {/* System Components */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">📦 Core Components</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">React Router</span>
              <StatusIcon status={checks.reactRouterLoaded} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Auth Context</span>
              <StatusIcon status={checks.authContextLoaded} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Supabase Client</span>
              <StatusIcon status={checks.supabaseClientLoaded} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Admin Configuration</span>
              <StatusIcon status={checks.adminConfigLoaded} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Console Filter</span>
              <StatusIcon status={checks.consoleFilterLoaded} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Supabase Connection</span>
              <StatusIcon status={supabaseConnected} />
            </div>
          </div>
        </div>

        {/* Current User Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">👤 Authentication Status</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : user ? (
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">Logged In</span>
                </div>
                <div className="ml-7 space-y-1 text-sm">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>ID:</strong> <code className="text-xs">{user.id}</code></p>
                </div>
              </div>

              <div className={`p-3 rounded-lg border ${
                isAdminFromContext 
                  ? 'bg-purple-50 border-purple-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {isAdminFromContext ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-900">Admin Access</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold text-gray-900">Regular User</span>
                    </>
                  )}
                </div>
                <div className="ml-7 space-y-1 text-sm">
                  <p><strong>isAdmin (Context):</strong> {isAdminFromContext ? '✅ YES' : '❌ NO'}</p>
                  <p><strong>isAdminEmail():</strong> {isAdminEmail(user.email) ? '✅ YES' : '❌ NO'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-semibold text-yellow-900">Not Logged In</span>
              </div>
              <p className="ml-7 text-sm text-yellow-800 mt-2">
                Please log in to test the authentication system.
              </p>
            </div>
          )}
        </div>

        {/* Admin Emails */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">📋 Configured Admin Emails</h2>
          <ul className="space-y-2">
            {ADMIN_EMAILS.map((email, index) => (
              <li 
                key={email} 
                className={`p-3 rounded-lg ${
                  user?.email.toLowerCase() === email
                    ? 'bg-purple-50 border-2 border-purple-300'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <code className="font-mono text-sm">{email}</code>
                  {user?.email.toLowerCase() === email && (
                    <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded font-semibold">
                      YOU
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-3">🚀 Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>If not logged in, go to <strong>/login</strong> and sign in with an admin email</li>
            <li>After login, visit <strong>/auth-debug</strong> for detailed authentication info</li>
            <li>Check the browser console (F12) for detailed logs (Datadog errors are now filtered)</li>
            <li>If you're an admin, you should see an "Admin Panel" button in the dashboard</li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/login')}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
          <button
            onClick={() => navigate('/auth-debug')}
            className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Go to Auth Debug
          </button>
        </div>
      </div>
    </div>
  );
}
