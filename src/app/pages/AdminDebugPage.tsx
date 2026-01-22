import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { API_ENDPOINTS } from '@/config/api';
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';

export default function AdminDebugPage() {
  const [loading, setLoading] = useState(false);
  const [authUsers, setAuthUsers] = useState<any[]>([]);
  const [backendClients, setBackendClients] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [session, setSession] = useState<any>(null);

  const checkSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      setSession(data.session);
      return data.session;
    } catch (error: any) {
      setErrors(prev => [...prev, `Session error: ${error.message}`]);
      return null;
    }
  };

  const checkAuthUsers = async () => {
    try {
      // Tentar listar usuários diretamente (vai falhar se não tiver permissão)
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        setErrors(prev => [...prev, `Auth list users error: ${error.message}`]);
        setAuthUsers([]);
      } else {
        setAuthUsers(data.users);
      }
    } catch (error: any) {
      setErrors(prev => [...prev, `Auth exception: ${error.message}`]);
    }
  };

  const checkBackendClients = async (sessionData: any) => {
    try {
      if (!sessionData?.access_token) {
        setErrors(prev => [...prev, 'No access token available']);
        return;
      }

      const response = await fetch(API_ENDPOINTS.adminClients, {
        headers: {
          'Authorization': `Bearer ${sessionData.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(prev => [...prev, `Backend error: ${data.error || 'Unknown error'}`]);
        setBackendClients([]);
      } else {
        setBackendClients(data.clients || []);
      }
    } catch (error: any) {
      setErrors(prev => [...prev, `Backend exception: ${error.message}`]);
    }
  };

  const runDiagnostics = async () => {
    setLoading(true);
    setErrors([]);
    setAuthUsers([]);
    setBackendClients([]);

    // 1. Check session
    const sessionData = await checkSession();

    // 2. Check Auth users
    await checkAuthUsers();

    // 3. Check backend clients
    if (sessionData) {
      await checkBackendClients(sessionData);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Diagnostics</h1>
          <p className="text-gray-600">
            This page helps diagnose why clients might not be showing up
          </p>
        </div>

        <Button 
          onClick={runDiagnostics} 
          disabled={loading}
          className="mb-6"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running diagnostics...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Diagnostics
            </>
          )}
        </Button>

        {/* Session Info */}
        {session && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Session Info
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">User ID:</span>{' '}
                <span className="font-mono text-xs">{session.user.id}</span>
              </div>
              <div>
                <span className="font-medium">Email:</span>{' '}
                <span>{session.user.email}</span>
              </div>
              <div>
                <span className="font-medium">Access Token:</span>{' '}
                <span className="font-mono text-xs">
                  {session.access_token.substring(0, 20)}...
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <Card className="p-6 mb-6 border-red-200 bg-red-50">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              Errors ({errors.length})
            </h2>
            <ul className="space-y-2">
              {errors.map((error, index) => (
                <li key={index} className="text-sm text-red-700 font-mono">
                  {error}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Auth Users */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Supabase Auth Users (Direct)
          </h2>
          {authUsers.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Found {authUsers.length} user(s) in Supabase Auth
              </p>
              <div className="space-y-4">
                {authUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">ID:</span>{' '}
                        <span className="font-mono text-xs">{user.id}</span>
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{' '}
                        <span>{user.email}</span>
                      </div>
                      <div>
                        <span className="font-medium">Created:</span>{' '}
                        <span>
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Metadata:</span>{' '}
                        <span className="font-mono text-xs">
                          {JSON.stringify(user.user_metadata)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No users found or permission denied. This is expected - the
              frontend can't list users directly.
            </p>
          )}
        </Card>

        {/* Backend Clients */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Backend Clients (via API)
          </h2>
          {backendClients.length > 0 ? (
            <div>
              <p className="text-sm text-green-700 font-medium mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Found {backendClients.length} client(s) via backend API
              </p>
              <div className="space-y-4">
                {backendClients.map((client) => (
                  <div
                    key={client.id}
                    className="p-4 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">ID:</span>{' '}
                        <span className="font-mono text-xs">{client.id}</span>
                      </div>
                      <div>
                        <span className="font-medium">Name:</span>{' '}
                        <span>{client.name}</span>
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{' '}
                        <span>{client.email}</span>
                      </div>
                      <div>
                        <span className="font-medium">Onboarding:</span>{' '}
                        <span>
                          {client.onboardingComplete ? '✅ Complete' : '⏳ Pending'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Tax Filings:</span>{' '}
                        <span>{client.taxFilings?.length || 0}</span>
                      </div>
                      <div>
                        <span className="font-medium">Created:</span>{' '}
                        <span>
                          {new Date(client.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No clients found via backend. This could mean:
              <ul className="list-disc ml-6 mt-2">
                <li>No users have signed up yet</li>
                <li>Backend is not returning data correctly</li>
                <li>Authentication is failing</li>
              </ul>
            </p>
          )}
        </Card>

        {/* Instructions */}
        <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-2 text-blue-900">
            What to check:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc ml-5">
            <li>
              Make sure you're logged in as an admin user (check admins.ts)
            </li>
            <li>
              Check if users exist in Supabase Dashboard → Authentication →
              Users
            </li>
            <li>Check browser console for errors</li>
            <li>
              Verify backend is running and accessible (check Network tab)
            </li>
            <li>
              Make sure your email is in the ADMIN_EMAILS list in the backend
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
