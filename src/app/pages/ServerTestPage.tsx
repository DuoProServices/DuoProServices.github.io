import React, { useState } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function ServerTestPage() {
  const [results, setResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0`;

  const addResult = (endpoint: string, status: string, data: any, error?: string) => {
    setResults(prev => [...prev, {
      endpoint,
      status,
      data,
      error,
      timestamp: new Date().toISOString()
    }]);
  };

  const testEndpoint = async (endpoint: string, label: string) => {
    console.log(`🧪 Testing ${label}:`, endpoint);
    
    try {
      // Create a timeout promise (5 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 5000);
      });

      // Create the fetch promise
      const fetchPromise = fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${label} SUCCESS:`, data);
        addResult(label, '✅ SUCCESS', data);
      } else {
        console.error(`❌ ${label} ERROR:`, response.status, data);
        addResult(label, '❌ ERROR', data, `Status: ${response.status}`);
      }
    } catch (error: any) {
      console.error(`❌ ${label} FAILED:`, error.message);
      addResult(label, '❌ FAILED', null, error.message);
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setResults([]);

    console.log('🚀 Starting server connectivity tests...');
    console.log('📍 Base URL:', baseUrl);
    console.log('🔑 Using public anon key');

    // Test 1: Health
    await testEndpoint(`${baseUrl}/health`, 'Health Check');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 2: Ping
    await testEndpoint(`${baseUrl}/ping`, 'Ping');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 3: Admin Hub Ping
    await testEndpoint(`${baseUrl}/admin-hub/ping`, 'Admin Hub Ping');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 4: Admin Hub Mock Activities
    await testEndpoint(`${baseUrl}/admin-hub/activities-mock`, 'Admin Hub Mock Activities');

    setTesting(false);
    console.log('✅ All tests completed');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* CRITICAL WARNING BANNER */}
        <div className="bg-red-600 text-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">🚨 AÇÃO NECESSÁRIA: DEPLOY MANUAL OBRIGATÓRIO</h2>
          <p className="text-lg mb-4">
            O servidor Edge Function <strong>NÃO está funcionando</strong> porque você precisa fazer o <strong>DEPLOY MANUAL</strong> no Supabase Dashboard!
          </p>
          <p className="text-sm">
            Sem este passo, <strong>NENHUM endpoint vai funcionar</strong> - nem ping, nem health, nem admin hub!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">🔧 Server Connectivity Test</h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <h2 className="font-semibold text-blue-900 mb-2">📍 Configuration:</h2>
            <p className="text-sm text-blue-800 font-mono break-all">
              Base URL: {baseUrl}
            </p>
            <p className="text-sm text-blue-800 font-mono mt-1">
              Project ID: {projectId}
            </p>
          </div>

          <button
            onClick={runAllTests}
            disabled={testing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {testing ? '🔄 Testing...' : '🚀 Run All Tests'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">📊 Test Results</h2>
            
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    result.status.includes('SUCCESS') 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">
                      {result.status} {result.endpoint}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {result.error && (
                    <div className="bg-red-100 border border-red-300 rounded p-2 mb-2">
                      <p className="text-sm text-red-800 font-mono">{result.error}</p>
                    </div>
                  )}
                  
                  {result.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                        View Response Data
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-800 text-green-400 p-3 rounded overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-orange-50 border-2 border-orange-500 rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-bold text-orange-900 mb-4">
            ⚠️ INSTRUÇÕES DE DEPLOY OBRIGATÓRIAS
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white rounded p-4 border-l-4 border-orange-500">
              <h4 className="font-bold text-lg mb-2">📍 PASSO 1: Abrir Supabase Dashboard</h4>
              <a 
                href={`https://supabase.com/dashboard/project/${projectId}/functions`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                🔗 Clique aqui para abrir o Supabase Functions Dashboard
              </a>
            </div>

            <div className="bg-white rounded p-4 border-l-4 border-orange-500">
              <h4 className="font-bold text-lg mb-2">📋 PASSO 2: Copiar o código</h4>
              <p className="text-sm mb-2">Abra o arquivo no VSCode ou editor:</p>
              <code className="block bg-gray-800 text-green-400 p-3 rounded mb-2">
                /supabase/functions/make-server-c2a25be0/index-minimal.ts
              </code>
              <p className="text-sm text-gray-700">
                Pressione <kbd className="bg-gray-200 px-2 py-1 rounded">Ctrl+A</kbd> e depois <kbd className="bg-gray-200 px-2 py-1 rounded">Ctrl+C</kbd> para copiar TODO o conteúdo
              </p>
            </div>

            <div className="bg-white rounded p-4 border-l-4 border-orange-500">
              <h4 className="font-bold text-lg mb-2">✏️ PASSO 3: Substituir e Deploy</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>No Supabase Dashboard, clique na função <code className="bg-gray-100 px-2 py-1 rounded">make-server-c2a25be0</code></li>
                <li><strong>APAGUE TODO</strong> o código antigo no editor</li>
                <li><strong>COLE</strong> o código que você copiou (<kbd className="bg-gray-200 px-2 py-1 rounded">Ctrl+V</kbd>)</li>
                <li>Clique no botão <strong className="text-green-700">"Deploy"</strong> (canto superior direito)</li>
                <li>Aguarde aparecer <span className="text-green-700 font-semibold">"Deployment successful"</span> (30-60 segundos)</li>
              </ol>
            </div>

            <div className="bg-white rounded p-4 border-l-4 border-orange-500">
              <h4 className="font-bold text-lg mb-2">✅ PASSO 4: Testar</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Aguarde <strong>60 segundos</strong> após o deploy</li>
                <li>Volte para esta página</li>
                <li>Clique no botão <strong>"🚀 Run All Tests"</strong> acima</li>
                <li>Todos os testes devem ficar <span className="text-green-700 font-semibold">✅ VERDES</span></li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 text-green-400 rounded-lg p-6 font-mono text-sm">
          <h3 className="text-white font-bold mb-3">💡 O que você deve ver nos logs do Supabase:</h3>
          <div className="space-y-1">
            <div>🚀 [MINIMAL SERVER] Starting...</div>
            <div>✅ [MINIMAL SERVER] All routes registered</div>
            <div>✅ [MINIMAL SERVER] Server started successfully!</div>
          </div>
          <p className="text-yellow-400 mt-4">
            Se você NÃO ver essas mensagens nos logs, o servidor não iniciou corretamente!
          </p>
        </div>
      </div>
    </div>
  );
}