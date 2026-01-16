import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { supabase } from '@/app/utils/supabaseClient';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'testing';
  message: string;
  details?: any;
}

export function BackendDiagnosticPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Supabase Client', status: 'pending', message: 'Not tested yet' },
    { name: 'User Session', status: 'pending', message: 'Not tested yet' },
    { name: 'Health Check', status: 'pending', message: 'Not tested yet' },
    { name: 'Users Endpoint', status: 'pending', message: 'Not tested yet' },
  ]);

  const updateTest = (index: number, update: Partial<TestResult>) => {
    setTests(prev => prev.map((test, i) => i === index ? { ...test, ...update } : test));
  };

  const runAllTests = async () => {
    // Test 1: Supabase Client
    updateTest(0, { status: 'testing', message: 'Testing...' });
    try {
      if (supabase) {
        updateTest(0, { 
          status: 'success', 
          message: '✅ Supabase client initialized',
          details: { projectId, publicAnonKey: publicAnonKey.substring(0, 20) + '...' }
        });
      } else {
        updateTest(0, { status: 'error', message: '❌ Supabase client not found' });
      }
    } catch (error: any) {
      updateTest(0, { status: 'error', message: `❌ Error: ${error.message}` });
    }

    // Test 2: User Session
    updateTest(1, { status: 'testing', message: 'Testing...' });
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        updateTest(1, { 
          status: 'error', 
          message: `❌ Session error: ${error.message}`,
          details: error
        });
      } else if (session) {
        updateTest(1, { 
          status: 'success', 
          message: '✅ Valid session found',
          details: {
            userId: session.user.id,
            email: session.user.email,
            tokenPreview: session.access_token.substring(0, 30) + '...'
          }
        });
      } else {
        updateTest(1, { 
          status: 'error', 
          message: '❌ No active session - Please login first'
        });
        return; // Stop further tests if no session
      }
    } catch (error: any) {
      updateTest(1, { status: 'error', message: `❌ Error: ${error.message}` });
      return;
    }

    // Test 3: Health Check (No Auth Required)
    updateTest(2, { status: 'testing', message: 'Testing...' });
    try {
      const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/health`;
      console.log('🏥 Testing health check:', healthUrl);
      
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json().catch(() => null);
      
      if (response.ok) {
        updateTest(2, { 
          status: 'success', 
          message: '✅ Backend is alive!',
          details: { status: response.status, data }
        });
      } else {
        updateTest(2, { 
          status: 'error', 
          message: `❌ Backend returned ${response.status}`,
          details: { status: response.status, data }
        });
      }
    } catch (error: any) {
      updateTest(2, { 
        status: 'error', 
        message: `❌ Backend offline: ${error.message}`,
        details: { 
          error: error.message,
          hint: 'The backend needs to be deployed in Supabase Dashboard'
        }
      });
      return; // Stop if backend is offline
    }

    // Test 4: Users Endpoint (With Auth)
    updateTest(3, { status: 'testing', message: 'Testing...' });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        updateTest(3, { status: 'error', message: '❌ No session available' });
        return;
      }

      const usersUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/users`;
      console.log('👥 Testing users endpoint:', usersUrl);
      
      const response = await fetch(usersUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json().catch(() => null);
      
      if (response.ok) {
        updateTest(3, { 
          status: 'success', 
          message: `✅ Users endpoint working! Found ${data?.users?.length || 0} users`,
          details: { status: response.status, usersCount: data?.users?.length }
        });
      } else {
        updateTest(3, { 
          status: 'error', 
          message: `❌ Users endpoint failed: ${response.status}`,
          details: { 
            status: response.status, 
            error: data?.error || 'Unknown error',
            hint: response.status === 403 ? 'User is not admin' : 'Check backend logs'
          }
        });
      }
    } catch (error: any) {
      updateTest(3, { 
        status: 'error', 
        message: `❌ Request failed: ${error.message}`,
        details: { error: error.message }
      });
    }
  };

  const resetTests = () => {
    setTests([
      { name: 'Supabase Client', status: 'pending', message: 'Not tested yet' },
      { name: 'User Session', status: 'pending', message: 'Not tested yet' },
      { name: 'Health Check', status: 'pending', message: 'Not tested yet' },
      { name: 'Users Endpoint', status: 'pending', message: 'Not tested yet' },
    ]);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'testing':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'testing':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Backend Diagnostic Tool
          </h1>
          <p className="text-gray-600">
            Run comprehensive tests to identify backend connectivity issues
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Connection Tests</h2>
              <p className="text-sm text-gray-600 mt-1">
                These tests will check every part of the backend connection
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={resetTests}
                variant="outline"
              >
                Reset
              </Button>
              <Button
                onClick={runAllTests}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Run All Tests
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {tests.map((test, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${getStatusColor(test.status)}`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(test.status)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {index + 1}. {test.name}
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">{test.message}</p>
                    {test.details && (
                      <details className="text-xs bg-white bg-opacity-50 rounded p-2 mt-2">
                        <summary className="cursor-pointer font-medium text-gray-600">
                          View Details
                        </summary>
                        <pre className="mt-2 overflow-auto">
                          {JSON.stringify(test.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">
            📋 Deployment Instructions
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>If Health Check fails, you need to deploy the backend:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Go to: <code className="bg-blue-100 px-1 rounded">https://supabase.com/dashboard</code></li>
              <li>Select project: <code className="bg-blue-100 px-1 rounded">{projectId}</code></li>
              <li>Navigate to: <strong>Edge Functions</strong></li>
              <li>Find: <code className="bg-blue-100 px-1 rounded">make-server-c2a25be0</code></li>
              <li>Click: <strong>"Deploy"</strong> or <strong>"Redeploy"</strong></li>
              <li>Wait 10-30 seconds for deployment to complete</li>
              <li>Come back here and click <strong>"Run All Tests"</strong> again</li>
            </ol>
            
            <div className="mt-4 pt-4 border-t border-blue-300">
              <Button
                onClick={() => window.open(`https://supabase.com/dashboard/project/${projectId}/functions/make-server-c2a25be0`, '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                🚀 Open Supabase Dashboard (Deploy Backend)
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}