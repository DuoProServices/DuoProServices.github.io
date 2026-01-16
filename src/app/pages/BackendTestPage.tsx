/**
 * BACKEND TEST PAGE
 * Visual page to test if backend is working
 */

import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AlertCircle, CheckCircle, Loader2, RefreshCw, Terminal, Copy, ExternalLink } from 'lucide-react';
import { projectId } from '/utils/supabase/info';
import { toast } from 'sonner';
import { copyToClipboard } from '../utils/clipboard';

interface TestResult {
  name: string;
  url: string;
  status: 'pending' | 'success' | 'error' | 'not-started';
  httpStatus?: number;
  message?: string;
  responseData?: any;
  duration?: number;
}

export default function BackendTestPage() {
  const [testing, setTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const [results, setResults] = useState<TestResult[]>([
    {
      name: '1. Health Check',
      url: `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/health`,
      status: 'not-started',
    },
    {
      name: '2. Email Routes Check',
      url: `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/emails/test`,
      status: 'not-started',
    },
  ]);

  const runTests = async () => {
    setTesting(true);
    const updatedResults: TestResult[] = [];

    for (let i = 0; i < results.length; i++) {
      const test = results[i];
      setCurrentTest(test.name);

      try {
        const startTime = performance.now();
        
        const response = await fetch(test.url, {
          method: test.url.includes('/emails/test') ? 'POST' : 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: test.url.includes('/emails/test') 
            ? JSON.stringify({ email: 'test@example.com' })
            : undefined
        });

        const duration = Math.round(performance.now() - startTime);
        let data;
        
        try {
          data = await response.json();
        } catch {
          data = await response.text();
        }

        updatedResults.push({
          ...test,
          status: response.ok ? 'success' : 'error',
          httpStatus: response.status,
          message: response.ok 
            ? `✅ Working! (${duration}ms)`
            : `❌ HTTP ${response.status}: ${response.statusText}`,
          responseData: data,
          duration,
        });

        // Update state progressively
        setResults([...updatedResults, ...results.slice(i + 1)]);
      } catch (error: any) {
        updatedResults.push({
          ...test,
          status: 'error',
          message: `❌ ${error.message || 'Connection failed'}`,
        });
        
        setResults([...updatedResults, ...results.slice(i + 1)]);
      }
    }

    setCurrentTest(null);
    setTesting(false);
  };

  const copyTestCommand = () => {
    const command = `fetch('https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/health').then(r => r.json()).then(d => console.log('✅ Backend online:', d)).catch(e => console.error('❌ Backend offline:', e));`;
    copyToClipboard(command);
    toast.success('Comando copiado!');
  };

  const allSuccess = results.every(t => t.status === 'success');
  const anyError = results.some(t => t.status === 'error');
  const notStarted = results.every(t => t.status === 'not-started');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🔧 Backend Status</h1>
          <p className="text-muted-foreground">
            Teste se o Edge Function foi deployado corretamente
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Project ID: <code className="bg-gray-100 px-2 py-1 rounded">{projectId}</code>
          </p>
        </div>

        {/* Quick Test Button */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Teste Rápido</h3>
              <p className="text-sm text-muted-foreground">
                Clique para testar todos os endpoints
              </p>
            </div>
            <Button
              onClick={runTests}
              disabled={testing}
              size="lg"
              className="min-w-[200px]"
            >
              {testing ? (
                <>
                  <Loader2 className="size-5 animate-spin mr-2" />
                  Testando...
                </>
              ) : (
                <>
                  <RefreshCw className="size-5 mr-2" />
                  Iniciar Testes
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Test Results */}
        <div className="space-y-4 mb-6">
          {results.map((test, index) => (
            <Card
              key={index}
              className={`p-6 transition-all ${
                test.status === 'success'
                  ? 'bg-green-50 border-green-200'
                  : test.status === 'error'
                  ? 'bg-red-50 border-red-200'
                  : test.status === 'pending' || currentTest === test.name
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {test.status === 'not-started' && (
                    <div className="size-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      <span className="text-xs text-gray-500">{index + 1}</span>
                    </div>
                  )}
                  {(test.status === 'pending' || currentTest === test.name) && (
                    <Loader2 className="size-6 animate-spin text-blue-600" />
                  )}
                  {test.status === 'success' && (
                    <CheckCircle className="size-6 text-green-600" />
                  )}
                  {test.status === 'error' && (
                    <AlertCircle className="size-6 text-red-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{test.name}</h4>
                    {test.httpStatus && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        test.httpStatus === 200 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        HTTP {test.httpStatus}
                      </span>
                    )}
                    {test.duration && (
                      <span className="text-xs text-muted-foreground">
                        {test.duration}ms
                      </span>
                    )}
                  </div>

                  {test.message && (
                    <p className="text-sm mb-2">{test.message}</p>
                  )}

                  <p className="text-xs text-muted-foreground truncate">
                    {test.url}
                  </p>

                  {test.responseData && (
                    <details className="mt-3">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                        Ver resposta completa
                      </summary>
                      <pre className="mt-2 p-3 bg-white rounded border text-xs overflow-auto max-h-40">
                        {JSON.stringify(test.responseData, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Success Message */}
        {allSuccess && !testing && !notStarted && (
          <Card className="p-6 bg-green-50 border-green-200 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="size-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900 mb-1 text-lg">
                  🎉 Backend Funcionando Perfeitamente!
                </h3>
                <p className="text-green-800 mb-3">
                  Todos os testes passaram! O Edge Function está deployado e respondendo corretamente.
                </p>
                <div className="bg-green-100 p-3 rounded">
                  <p className="text-sm text-green-900 font-medium mb-1">
                    ✅ Próximos passos:
                  </p>
                  <ul className="text-sm text-green-800 space-y-1 ml-4 list-disc">
                    <li>Volte para o app principal</li>
                    <li>Recarregue a página</li>
                    <li>Todos os erros "Failed to fetch" desaparecerão!</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Error Message */}
        {anyError && !testing && (
          <Card className="p-6 bg-red-50 border-red-200 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1 text-lg">
                  ❌ Backend Não Está Respondendo
                </h3>
                <p className="text-red-800 mb-3">
                  O Edge Function não foi deployado ou não está funcionando corretamente.
                </p>
                
                <div className="bg-red-100 p-3 rounded mb-3">
                  <p className="text-sm text-red-900 font-medium mb-2">
                    🔧 Como corrigir:
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm text-red-800">
                      <p className="font-medium">1. Instale o Supabase CLI:</p>
                      <code className="block bg-white p-2 rounded mt-1">
                        brew install supabase/tap/supabase
                      </code>
                    </div>
                    <div className="text-sm text-red-800">
                      <p className="font-medium">2. Faça login:</p>
                      <code className="block bg-white p-2 rounded mt-1">
                        supabase login
                      </code>
                    </div>
                    <div className="text-sm text-red-800">
                      <p className="font-medium">3. Link ao projeto:</p>
                      <code className="block bg-white p-2 rounded mt-1">
                        supabase link --project-ref {projectId}
                      </code>
                    </div>
                    <div className="text-sm text-red-800">
                      <p className="font-medium">4. Deploy:</p>
                      <code className="block bg-white p-2 rounded mt-1">
                        supabase functions deploy server
                      </code>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/deploy-guide'}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  <Terminal className="size-4 mr-2" />
                  Ver Guia Visual Passo a Passo
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Manual Test */}
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <Terminal className="size-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Teste Manual (Console)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Você também pode testar diretamente no console do navegador:
              </p>
              <div className="bg-gray-50 p-3 rounded border">
                <code className="text-xs block overflow-x-auto">
                  fetch('https://{projectId}.supabase.co/functions/v1/make-server-c2a25be0/health')
                  .then(r =&gt; r.json())
                  .then(d =&gt; console.log('✅ Backend online:', d))
                  .catch(e =&gt; console.error('❌ Backend offline:', e));
                </code>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={copyTestCommand}
              >
                <Copy className="size-4 mr-2" />
                Copiar Comando
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Precisa de ajuda? Abra o arquivo: <code className="bg-gray-100 px-2 py-1 rounded">/RESOLVER_ERROS_AGORA.md</code></p>
        </div>
      </div>
    </div>
  );
}