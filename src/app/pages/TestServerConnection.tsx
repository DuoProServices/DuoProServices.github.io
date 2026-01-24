import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function TestServerConnection() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);

  const tests = [
    {
      id: 'health',
      name: '🏥 Health Check',
      url: `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/health`,
      method: 'GET'
    },
    {
      id: 'server-alive',
      name: '💓 Server Alive',
      url: `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/server-alive`,
      method: 'GET'
    },
    {
      id: 'list-users',
      name: '👥 List Users',
      url: `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/auth/list-users`,
      method: 'GET'
    }
  ];

  const runTest = async (test: typeof tests[0]) => {
    setLoading(test.id);
    try {
      console.log(`🧪 Testing ${test.name}...`);
      console.log(`📍 URL: ${test.url}`);
      
      const response = await fetch(test.url, {
        method: test.method,
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`📡 Response status: ${response.status}`);
      
      const data = await response.json();
      console.log(`📦 Response data:`, data);

      setResults((prev: any) => ({
        ...prev,
        [test.id]: {
          success: response.ok,
          status: response.status,
          data
        }
      }));
    } catch (error: any) {
      console.error(`❌ Test ${test.name} failed:`, error);
      setResults((prev: any) => ({
        ...prev,
        [test.id]: {
          success: false,
          error: error.message
        }
      }));
    } finally {
      setLoading(null);
    }
  };

  const runAllTests = async () => {
    setResults({}); // Clear previous results
    for (const test of tests) {
      await runTest(test);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
    }
    
    // Check if all tests failed
    const allFailed = Object.values(results).every((r: any) => !r.success);
    if (allFailed && Object.keys(results).length === tests.length) {
      setResults((prev: any) => ({
        ...prev,
        _deploymentNeeded: true
      }));
    }
  };

  const testSignup = async () => {
    setLoading('signup');
    try {
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'Test123456!';
      const testName = 'Test User';

      console.log(`🧪 Testing Signup...`);
      console.log(`📧 Email: ${testEmail}`);
      
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/auth/signup`;
      console.log(`📍 URL: ${url}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          name: testName
        })
      });

      console.log(`📡 Response status: ${response.status}`);
      
      const data = await response.json();
      console.log(`📦 Response data:`, data);

      setResults((prev: any) => ({
        ...prev,
        signup: {
          success: response.ok,
          status: response.status,
          data,
          testCredentials: { email: testEmail, password: testPassword }
        }
      }));
    } catch (error: any) {
      console.error(`❌ Signup test failed:`, error);
      setResults((prev: any) => ({
        ...prev,
        signup: {
          success: false,
          error: error.message
        }
      }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">🧪 Server Connection Test</h1>
          
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold">Project ID:</p>
              <p className="font-mono text-sm">{projectId}</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold">Base URL:</p>
              <p className="font-mono text-sm break-all">
                https://{projectId}.supabase.co/functions/v1/make-server-c2a25be0
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <p className="font-semibold">Anon Key (first 50 chars):</p>
              <p className="font-mono text-xs break-all">{publicAnonKey.substring(0, 50)}...</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={runAllTests}
              disabled={loading !== null}
              className="w-full"
            >
              {loading ? '⏳ Testing...' : '🚀 Run All Tests'}
            </Button>

            {tests.map(test => (
              <Button
                key={test.id}
                onClick={() => runTest(test)}
                disabled={loading !== null}
                variant="outline"
                className="w-full"
              >
                {loading === test.id ? '⏳' : test.name}
              </Button>
            ))}

            <Button
              onClick={testSignup}
              disabled={loading !== null}
              variant="outline"
              className="w-full bg-green-50 hover:bg-green-100"
            >
              {loading === 'signup' ? '⏳ Testing...' : '🆕 Test Signup (Create Random User)'}
            </Button>
          </div>
        </Card>

        {Object.keys(results).length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">📊 Results</h2>
            {/* Show deployment warning if all tests failed */}
            {Object.values(results).filter((r: any) => r.success === false).length >= 3 && (
              <div className="mb-6 p-6 bg-red-100 border-4 border-red-500 rounded-lg">
                <h3 className="text-2xl font-bold text-red-900 mb-3">🚨 EDGE FUNCTION NOT DEPLOYED!</h3>
                <p className="text-red-800 mb-4 font-semibold">
                  Todos os testes falharam. O Edge Function do Supabase NÃO está deployed.
                </p>
                <div className="bg-white p-4 rounded border-2 border-red-300 mb-4">
                  <p className="font-bold mb-2">📄 Leia estes arquivos (em ordem):</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li className="font-bold text-blue-600">LEIA_ISSO_PRIMEIRO.md</li>
                    <li className="font-bold text-blue-600">CHECKLIST.md</li>
                    <li>INSTRUCOES_SIMPLES.md</li>
                  </ol>
                </div>
                <div className="bg-white p-4 rounded border-2 border-red-300">
                  <p className="font-bold mb-2">⚡ Ou execute no terminal:</p>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
{`node copy-files.js
supabase login
supabase link --project-ref ${projectId}
supabase functions deploy make-server-c2a25be0`}                    
                  </pre>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {Object.entries(results).filter(([key]) => key !== '_deploymentNeeded').map(([testId, result]: [string, any]) => (
                <div 
                  key={testId}
                  className={`p-4 rounded-lg ${
                    result.success 
                      ? 'bg-green-50 border-2 border-green-200' 
                      : 'bg-red-50 border-2 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold">
                      {testId === 'signup' ? '🆕 Signup Test' : tests.find(t => t.id === testId)?.name}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      result.success ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {result.success ? '✅ SUCCESS' : '❌ FAILED'}
                    </span>
                  </div>
                  
                  {result.status && (
                    <p className="text-sm mb-2">
                      <span className="font-semibold">Status:</span> {result.status}
                    </p>
                  )}
                  
                  {result.testCredentials && (
                    <div className="mb-2 p-3 bg-yellow-50 rounded border border-yellow-200">
                      <p className="font-semibold text-sm mb-1">📋 Test Credentials:</p>
                      <p className="text-xs font-mono">Email: {result.testCredentials.email}</p>
                      <p className="text-xs font-mono">Password: {result.testCredentials.password}</p>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <p className="font-semibold text-sm mb-1">Response:</p>
                    <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
                      {JSON.stringify(result.data || result.error, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-6 bg-yellow-50">
          <h2 className="text-lg font-bold mb-3">📝 Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li><strong>Run All Tests</strong> - Verifica se o Edge Function está deployed e funcionando</li>
            <li><strong>Health Check</strong> - Endpoint básico de saúde do servidor</li>
            <li><strong>Server Alive</strong> - Confirma que o servidor está rodando</li>
            <li><strong>List Users</strong> - Lista todos os usuários no Supabase Auth</li>
            <li><strong>Test Signup</strong> - Cria um novo usuário de teste aleatório</li>
          </ol>
          
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <p className="font-bold text-sm mb-1">❗ Se TODOS os testes FALHAREM:</p>
            <p className="text-xs">O Edge Function NÃO está deployed! Você precisa fazer o deploy no Supabase.</p>
          </div>
          
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded">
            <p className="font-bold text-sm mb-1">✅ Se os testes PASSAREM:</p>
            <p className="text-xs">O Edge Function está funcionando! O problema está em outro lugar.</p>
          </div>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>🔍 Open Developer Console (F12) to see detailed logs</p>
        </div>
      </div>
    </div>
  );
}