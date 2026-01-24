import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface HealthCheck {
  endpoint: string;
  name: string;
  status: 'checking' | 'success' | 'error';
  message?: string;
  responseTime?: number;
}

export default function ServerHealthPage() {
  const [checks, setChecks] = useState<HealthCheck[]>([
    { endpoint: '/kv/getByPrefix?prefix=profile:', name: 'KV Store - Get Profiles', status: 'checking' },
    { endpoint: '/auth/session', name: 'Auth Session', status: 'checking' },
  ]);

  const runHealthChecks = async () => {
    const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0`;
    
    const updatedChecks = await Promise.all(
      checks.map(async (check) => {
        const startTime = Date.now();
        try {
          const response = await fetch(
            `${baseUrl}${check.endpoint}`,
            {
              method: (check as any).method || 'GET',
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
                'Content-Type': 'application/json'
              },
              body: (check as any).method === 'POST' ? JSON.stringify({ test: true }) : undefined
            }
          );
          
          const responseTime = Date.now() - startTime;
          const data = await response.json();
          
          return {
            ...check,
            status: response.ok ? 'success' as const : 'error' as const,
            message: response.ok ? `OK (${responseTime}ms)` : `Error: ${data.error || 'Unknown'}`,
            responseTime
          };
        } catch (error: any) {
          return {
            ...check,
            status: 'error' as const,
            message: error.message || 'Failed to fetch'
          };
        }
      })
    );
    
    setChecks(updatedChecks);
  };

  useEffect(() => {
    runHealthChecks();
  }, []);

  const allPassed = checks.every(c => c.status === 'success');
  const allChecked = checks.every(c => c.status !== 'checking');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Server Health Check</h1>
            <button
              onClick={runHealthChecks}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {allChecked && (
            <div className={`mb-6 p-4 rounded-lg ${
              allPassed 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {allPassed ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-900 font-medium">
                      ✅ All systems operational
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-900 font-medium">
                      ❌ Some services are down
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {checks.map((check, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {check.status === 'checking' && (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  )}
                  {check.status === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {check.status === 'error' && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  
                  <div>
                    <p className="font-medium text-gray-900">{check.name}</p>
                    <p className="text-sm text-gray-500">{check.endpoint}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  {check.status === 'checking' && (
                    <span className="text-sm text-gray-500">Checking...</span>
                  )}
                  {check.message && (
                    <span className={`text-sm ${
                      check.status === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {check.message}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Server Info:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Project ID:</strong> {projectId}</p>
              <p><strong>Base URL:</strong> https://{projectId}.supabase.co/functions/v1/make-server-c2a25be0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}