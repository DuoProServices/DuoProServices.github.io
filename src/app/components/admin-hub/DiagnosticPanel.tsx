import { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';
import { supabase } from '@/app/utils/supabaseClient';
import { projectId, publicAnonKey } from '@utils/supabase/info';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

export function DiagnosticPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const runDiagnostics = async () => {
    setTesting(true);
    const newResults: TestResult[] = [];

    // Test 1: Project ID
    newResults.push({
      name: 'Project ID',
      status: projectId ? 'success' : 'error',
      message: projectId || 'Missing project ID',
      details: { projectId }
    });

    // Test 2: API Base URL
    const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0`;
    newResults.push({
      name: 'API Base URL',
      status: 'success',
      message: baseUrl,
      details: { baseUrl }
    });

    setResults([...newResults]);

    // Test 3: Health Check
    try {
      const healthUrl = API_ENDPOINTS.health;
      console.log('Testing health endpoint:', healthUrl);
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        newResults.push({
          name: 'Server Health Check',
          status: 'success',
          message: 'Server is running',
          details: data
        });
      } else {
        const text = await response.text();
        newResults.push({
          name: 'Server Health Check',
          status: 'error',
          message: `HTTP ${response.status}`,
          details: { status: response.status, body: text }
        });
      }
    } catch (error) {
      newResults.push({
        name: 'Server Health Check',
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error',
        details: { error: String(error) }
      });
    }

    setResults([...newResults]);

    // Test 3.5: Admin Hub PING (no auth required)
    try {
      const pingUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/admin-hub/ping`;
      console.log('🏓 Testing PING endpoint (no auth):', pingUrl);
      
      const response = await fetch(pingUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        newResults.push({
          name: 'Admin Hub PING (No Auth)',
          status: 'success',
          message: 'Admin Hub responding without auth',
          details: data
        });
      } else {
        const text = await response.text();
        newResults.push({
          name: 'Admin Hub PING (No Auth)',
          status: 'error',
          message: `HTTP ${response.status}`,
          details: { status: response.status, body: text }
        });
      }
    } catch (error) {
      newResults.push({
        name: 'Admin Hub PING (No Auth)',
        status: 'error',
        message: error instanceof Error ? error.message : 'Network error',
        details: { error: String(error) }
      });
    }

    setResults([...newResults]);

    // Test 4: Authentication
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        newResults.push({
          name: 'Authentication',
          status: 'error',
          message: sessionError.message,
          details: sessionError
        });
      } else if (!sessionData.session) {
        newResults.push({
          name: 'Authentication',
          status: 'error',
          message: 'No active session',
          details: null
        });
      } else {
        newResults.push({
          name: 'Authentication',
          status: 'success',
          message: `Logged in as ${sessionData.session.user.email}`,
          details: { userId: sessionData.session.user.id }
        });

        // Test 5: Admin Hub Health
        try {
          const adminHealthUrl = API_ENDPOINTS.adminHubTasks.replace('/tasks', '/health');
          console.log('Testing admin hub endpoint:', adminHealthUrl);
          
          const response = await fetch(adminHealthUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionData.session.access_token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            newResults.push({
              name: 'Admin Hub Health',
              status: 'success',
              message: 'Admin Hub is accessible',
              details: data
            });
          } else {
            const text = await response.text();
            newResults.push({
              name: 'Admin Hub Health',
              status: 'error',
              message: `HTTP ${response.status}`,
              details: { status: response.status, body: text }
            });
          }
        } catch (error) {
          newResults.push({
            name: 'Admin Hub Health',
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error',
            details: { error: String(error) }
          });
        }

        // Test 6: Admin Hub Tasks GET
        try {
          const response = await fetch(API_ENDPOINTS.adminHubTasks, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionData.session.access_token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            newResults.push({
              name: 'Get Tasks',
              status: 'success',
              message: `Found ${data.tasks?.length || 0} tasks`,
              details: data
            });
          } else {
            const text = await response.text();
            newResults.push({
              name: 'Get Tasks',
              status: 'error',
              message: `HTTP ${response.status}`,
              details: { status: response.status, body: text }
            });
          }
        } catch (error) {
          newResults.push({
            name: 'Get Tasks',
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error',
            details: { error: String(error) }
          });
        }

        // Test 7: Admin Hub Posts GET
        try {
          const response = await fetch(API_ENDPOINTS.adminHubSocialPosts, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionData.session.access_token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            newResults.push({
              name: 'Get Posts',
              status: 'success',
              message: `Found ${data.posts?.length || 0} posts`,
              details: data
            });
          } else {
            const text = await response.text();
            newResults.push({
              name: 'Get Posts',
              status: 'error',
              message: `HTTP ${response.status}`,
              details: { status: response.status, body: text }
            });
          }
        } catch (error) {
          newResults.push({
            name: 'Get Posts',
            status: 'error',
            message: error instanceof Error ? error.message : 'Network error',
            details: { error: String(error) }
          });
        }
      }
    } catch (error) {
      newResults.push({
        name: 'Authentication',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: { error: String(error) }
      });
    }

    setResults([...newResults]);
    setTesting(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          runDiagnostics();
        }}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2 z-50"
      >
        <AlertCircle className="w-4 h-4" />
        Run Diagnostics
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-[600px] overflow-hidden z-50">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">System Diagnostics</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={runDiagnostics}
            disabled={testing}
            className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-4 max-h-[500px] overflow-y-auto space-y-3">
        {testing && results.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        )}

        {results.map((result, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              {result.status === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              )}
              {result.status === 'error' && (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              {result.status === 'pending' && (
                <Loader2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 animate-spin" />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900">{result.name}</div>
                <div className="text-xs text-gray-600 mt-1 break-words">{result.message}</div>
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-xs text-blue-600 cursor-pointer">View details</summary>
                    <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-xs text-gray-600">
        {results.length} test(s) completed
      </div>
    </div>
  );
}