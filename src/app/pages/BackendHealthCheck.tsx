import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Check, X, Loader2, RefreshCw, Server, AlertTriangle } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

export default function BackendHealthCheck() {
  const navigate = useNavigate();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [backendUrl, setBackendUrl] = useState('');

  // Hardcoded values to avoid import issues
  const projectId = 'pwlacumydrxvshklvttp';

  const updateResult = (name: string, status: TestResult['status'], message: string, details?: any) => {
    setResults(prev => {
      const existing = prev.find(r => r.name === name);
      if (existing) {
        return prev.map(r => r.name === name ? { name, status, message, details } : r);
      }
      return [...prev, { name, status, message, details }];
    });
  };

  const runTests = async () => {
    setTesting(true);
    setResults([]);

    const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0`;
    setBackendUrl(baseUrl);

    // TEST 1: Health Check
    updateResult('Health Check', 'pending', 'Verificando se o backend está online...');
    try {
      const response = await fetch(`${baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        updateResult('Health Check', 'success', '✅ Backend online!', data);
      } else {
        updateResult('Health Check', 'error', `❌ Backend retornou erro: ${response.status}`, {
          status: response.status,
          statusText: response.statusText,
        });
      }
    } catch (error: any) {
      updateResult('Health Check', 'error', `❌ Backend offline - ${error.message}`, { error: error.toString() });
    }

    // TEST 2: Auth Test (sem credenciais - deve retornar 401)
    updateResult('Auth Check', 'pending', 'Verificando autenticação...');
    try {
      const response = await fetch(`${baseUrl}/auth/session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Esperamos um erro 401 porque não enviamos token
      if (response.status === 401) {
        updateResult('Auth Check', 'success', '✅ Endpoint de autenticação funcionando', {
          status: response.status,
        });
      } else {
        updateResult('Auth Check', 'error', `⚠️ Resposta inesperada: ${response.status}`, {
          status: response.status,
        });
      }
    } catch (error: any) {
      updateResult('Auth Check', 'error', `❌ Erro ao testar autenticação: ${error.message}`, { error: error.toString() });
    }

    // TEST 3: CORS Check
    updateResult('CORS Check', 'pending', 'Verificando configuração CORS...');
    try {
      const response = await fetch(`${baseUrl}/health`, {
        method: 'OPTIONS',
      });

      const corsHeaders = {
        'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
        'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
      };

      updateResult('CORS Check', 'success', '✅ CORS configurado corretamente', corsHeaders);
    } catch (error: any) {
      updateResult('CORS Check', 'error', `❌ Erro ao verificar CORS: ${error.message}`, { error: error.toString() });
    }

    setTesting(false);
  };

  const allSuccess = results.length > 0 && results.every(r => r.status === 'success');
  const hasErrors = results.some(r => r.status === 'error');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Server className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Backend Health Check
          </h1>
          <p className="text-gray-600">
            Diagnóstico completo do status do servidor backend
          </p>
        </div>

        {/* Backend URL */}
        {backendUrl && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-1">Backend URL:</p>
            <code className="text-xs text-gray-600 break-all">{backendUrl}</code>
          </div>
        )}

        {/* Test Button */}
        <div className="text-center mb-8">
          <button
            onClick={runTests}
            disabled={testing}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {testing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Iniciar Testes
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Resultados dos Testes</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {results.map((result, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {result.status === 'pending' && (
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      )}
                      {result.status === 'success' && (
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                      {result.status === 'error' && (
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                          <X className="w-4 h-4 text-red-600" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {result.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {result.message}
                      </p>

                      {/* Details */}
                      {result.details && (
                        <details className="mt-3">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                            Ver detalhes técnicos
                          </summary>
                          <pre className="mt-2 p-3 bg-gray-50 rounded-md text-xs text-gray-700 overflow-x-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {results.length > 0 && !testing && (
          <div className={`rounded-xl p-6 ${
            allSuccess 
              ? 'bg-green-50 border border-green-200' 
              : hasErrors 
              ? 'bg-red-50 border border-red-200'
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {allSuccess ? (
                  <Check className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold mb-2 ${
                  allSuccess ? 'text-green-900' : 'text-red-900'
                }`}>
                  {allSuccess 
                    ? '✅ Backend Online e Funcionando!' 
                    : '❌ Backend Offline ou com Problemas'
                  }
                </h3>
                <p className={`text-sm ${
                  allSuccess ? 'text-green-800' : 'text-red-800'
                }`}>
                  {allSuccess 
                    ? 'Todos os testes passaram com sucesso. Você pode usar o sistema normalmente.'
                    : 'O backend não está respondendo corretamente. Verifique se as Edge Functions estão deployadas no Supabase.'
                  }
                </p>

                {hasErrors && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
                    <h4 className="font-medium text-red-900 mb-2">Como resolver:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-red-800">
                      <li>Verifique se as Edge Functions estão deployadas no Supabase</li>
                      <li>
                        Acesse:{' '}
                        <a 
                          href="https://supabase.com/dashboard" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="underline"
                        >
                          Supabase Dashboard
                        </a>
                      </li>
                      <li>Vá em: Functions → Deploy a new function</li>
                      <li>
                        Faça deploy da função: <code className="bg-red-100 px-1 py-0.5 rounded">make-server-c2a25be0</code>
                      </li>
                      <li>Aguarde alguns minutos e teste novamente</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Voltar ao Site
          </button>
          {allSuccess && (
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Fazer Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
