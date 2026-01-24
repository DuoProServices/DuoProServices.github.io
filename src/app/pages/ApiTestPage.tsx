import { useState } from 'react';
import { API_ENDPOINTS } from '@/config/api';
import { publicAnonKey, projectId } from '/utils/supabase/info';

export function ApiTestPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (name: string, url: string, options?: RequestInit) => {
    console.log(`🧪 Testing ${name}...`);
    console.log(`URL: ${url}`);
    
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      setResults(prev => [...prev, {
        name,
        url,
        status: response.status,
        ok: response.ok,
        data,
        timestamp: new Date().toISOString()
      }]);
      
      console.log(`✅ ${name}:`, data);
    } catch (error) {
      setResults(prev => [...prev, {
        name,
        url,
        status: 'ERROR',
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      }]);
      
      console.error(`❌ ${name}:`, error);
    }
  };

  const runAllTests = async () => {
    setResults([]);
    setLoading(true);

    // Test 1: Health check
    await testEndpoint('Health Check', API_ENDPOINTS.health);

    // Test 2: Admin Hub Ping (no auth)
    await testEndpoint(
      'Admin Hub Ping',
      `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/admin-hub/ping`
    );

    // Test 3: Admin Hub Health
    await testEndpoint(
      'Admin Hub Health',
      `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/admin-hub/health`
    );

    // Test 4: Get Tasks
    await testEndpoint(
      'Get Tasks',
      API_ENDPOINTS.adminHubTasks,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      }
    );

    // Test 5: Get Social Posts
    await testEndpoint(
      'Get Social Posts',
      API_ENDPOINTS.adminHubSocialPosts,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      }
    );

    // Test 6: Get Activities
    await testEndpoint(
      'Get Activities',
      API_ENDPOINTS.teamActivities,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      }
    );

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">API Endpoint Tester</h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-2">Project ID: <code className="bg-gray-100 px-2 py-1 rounded">{projectId}</code></p>
            <p className="text-gray-600 mb-4">Base URL: <code className="bg-gray-100 px-2 py-1 rounded text-xs">https://{projectId}.supabase.co/functions/v1/make-server-c2a25be0</code></p>
          </div>

          <button
            onClick={runAllTests}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed mb-8"
          >
            {loading ? 'Testing...' : 'Run All Tests'}
          </button>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`border-l-4 p-4 rounded-lg ${
                  result.ok
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">{result.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      result.ok
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {result.status}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mb-2 break-all">
                  {result.url}
                </p>
                
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-gray-700 hover:text-gray-900 font-medium">
                    View Response
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-900 text-green-400 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(result.data || result.error, null, 2)}
                  </pre>
                </details>
                
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>

          {results.length === 0 && !loading && (
            <div className="text-center text-gray-400 py-12">
              Click "Run All Tests" to start testing the API endpoints
            </div>
          )}
        </div>
      </div>
    </div>
  );
}