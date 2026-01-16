import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2, Trash2, Database, Globe } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

export default function SystemReset() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const addResult = (title: string, status: 'success' | 'error' | 'warning', message: string, details?: any) => {
    setResults(prev => [...prev, { title, status, message, details, timestamp: new Date() }]);
  };

  const clearLocalStorage = () => {
    setLoading(true);
    setResults([]);
    
    addResult('🧹 Limpando localStorage', 'warning', 'Removendo todos os dados locais...');
    
    const keys = Object.keys(localStorage);
    const clearedKeys = [];
    
    for (const key of keys) {
      localStorage.removeItem(key);
      clearedKeys.push(key);
    }
    
    addResult('✅ localStorage limpo', 'success', 
      `${keys.length} items removidos do cache do navegador`,
      { clearedKeys }
    );
    
    setLoading(false);
  };

  const clearSessionStorage = () => {
    setLoading(true);
    
    addResult('🧹 Limpando sessionStorage', 'warning', 'Removendo dados da sessão...');
    
    const keys = Object.keys(sessionStorage);
    const clearedKeys = [];
    
    for (const key of keys) {
      sessionStorage.removeItem(key);
      clearedKeys.push(key);
    }
    
    addResult('✅ sessionStorage limpo', 'success', 
      `${keys.length} items removidos da sessão`,
      { clearedKeys }
    );
    
    setLoading(false);
  };

  const clearSupabaseSession = async () => {
    setLoading(true);
    
    addResult('🔐 Limpando sessão Supabase', 'warning', 'Fazendo logout...');
    
    try {
      await supabase.auth.signOut();
      addResult('✅ Sessão Supabase limpa', 'success', 'Logout realizado com sucesso');
    } catch (err: any) {
      addResult('⚠️ Erro ao limpar sessão', 'warning', err.message);
    }
    
    setLoading(false);
  };

  const testSupabaseConnection = async () => {
    setLoading(true);
    setResults([]);
    
    addResult('🔍 Testando conexão Supabase', 'warning', 'Iniciando testes...');
    
    // Test 1: Supabase Auth
    addResult('1️⃣ Teste Supabase Auth', 'warning', 'Verificando autenticação...');
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        addResult('1️⃣ Teste Supabase Auth', 'error', `Erro: ${error.message}`, error);
      } else {
        addResult('1️⃣ Teste Supabase Auth', 'success', 
          `✅ Conexão Auth OK!\n• Sessão ativa: ${data.session ? 'SIM' : 'NÃO'}`,
          { session: data.session ? 'Active' : 'None' }
        );
      }
    } catch (err: any) {
      addResult('1️⃣ Teste Supabase Auth', 'error', `Exceção: ${err.message}`, err);
    }

    // Test 2: Backend Edge Function
    addResult('2️⃣ Teste Edge Function', 'warning', 'Testando backend...');
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/health`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details');
        addResult('2️⃣ Teste Edge Function', 'error', 
          `❌ Backend não está respondendo (${response.status})\n\n` +
          `PROBLEMA: O Edge Function não foi deployed!\n\n` +
          `SOLUÇÃO:\n` +
          `1. Vá para Supabase Dashboard\n` +
          `2. Edge Functions\n` +
          `3. Deploy a função 'make-server-c2a25be0'`,
          { 
            status: response.status,
            statusText: response.statusText,
            error: errorText
          }
        );
      } else {
        const data = await response.json().catch(() => ({ message: 'OK' }));
        addResult('2️⃣ Teste Edge Function', 'success', 
          `✅ Backend está ONLINE!\n• Edge Function respondendo corretamente`,
          data
        );
      }
    } catch (err: any) {
      addResult('2️⃣ Teste Edge Function', 'error', 
        `❌ ERRO CRÍTICO: Não conseguiu conectar ao backend\n\n` +
        `Erro: ${err.message}\n\n` +
        `CAUSA PROVÁVEL:\n` +
        `• Edge Function não foi deployed\n` +
        `• CORS bloqueado\n` +
        `• Função foi deletada\n\n` +
        `SOLUÇÃO: Deploy o backend primeiro!`,
        { error: err }
      );
    }

    // Test 3: KV Store
    addResult('3️⃣ Teste KV Store', 'warning', 'Testando armazenamento de dados...');
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/kv/get?key=test`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!response.ok) {
        addResult('3️⃣ Teste KV Store', 'warning', 
          `⚠️ KV Store não acessível (status: ${response.status})\n\n` +
          `Isso é esperado se o backend não está deployed.`
        );
      } else {
        addResult('3️⃣ Teste KV Store', 'success', 
          `✅ KV Store acessível!\n• Endpoint respondendo`
        );
      }
    } catch (err: any) {
      addResult('3️⃣ Teste KV Store', 'warning', 
        `⚠️ Não conseguiu testar KV Store: ${err.message}`
      );
    }

    // Summary
    addResult('📊 Resumo', 'warning', 
      `\n` +
      `✅ Testes concluídos!\n\n` +
      `➡️ Próximos passos:\n` +
      `1. Se Edge Function está com erro → Deploy o backend\n` +
      `2. Se tudo está OK → Limpe o cache e teste novamente\n` +
      `3. Recarregue a página após limpar o cache`
    );
    
    setLoading(false);
  };

  const fullReset = async () => {
    setLoading(true);
    setResults([]);
    
    addResult('🚀 Reset Completo', 'warning', 'Iniciando reset total do sistema...');
    
    // Step 1: Clear localStorage
    addResult('1️⃣ Limpando localStorage', 'warning', 'Aguarde...');
    const localKeys = Object.keys(localStorage);
    localStorage.clear();
    addResult('1️⃣ Limpando localStorage', 'success', `${localKeys.length} items removidos`);
    
    // Step 2: Clear sessionStorage
    addResult('2️⃣ Limpando sessionStorage', 'warning', 'Aguarde...');
    const sessionKeys = Object.keys(sessionStorage);
    sessionStorage.clear();
    addResult('2️⃣ Limpando sessionStorage', 'success', `${sessionKeys.length} items removidos`);
    
    // Step 3: Logout Supabase
    addResult('3️⃣ Logout Supabase', 'warning', 'Aguarde...');
    try {
      await supabase.auth.signOut();
      addResult('3️⃣ Logout Supabase', 'success', 'Sessão encerrada');
    } catch (err: any) {
      addResult('3️⃣ Logout Supabase', 'warning', `Aviso: ${err.message}`);
    }
    
    // Step 4: Clear browser cache (instructions)
    addResult('4️⃣ Cache do Navegador', 'warning', 
      `Para limpar completamente:\n\n` +
      `Chrome/Edge:\n` +
      `• Ctrl+Shift+Delete\n` +
      `• Selecione "Imagens e arquivos em cache"\n` +
      `• Clique em "Limpar dados"\n\n` +
      `Firefox:\n` +
      `• Ctrl+Shift+Delete\n` +
      `• Marque "Cache"\n` +
      `• Clique em "Limpar agora"`
    );
    
    // Final summary
    addResult('✅ Reset Completo!', 'success', 
      `O sistema foi resetado!\n\n` +
      `⚠️ IMPORTANTE:\n` +
      `1. Recarregue a página (F5 ou Ctrl+R)\n` +
      `2. Se ainda aparecer "Working in offline mode", significa que o BACKEND não está deployed\n` +
      `3. Nesse caso, você precisa fazer o deploy da Edge Function primeiro!`
    );
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="p-8 mb-6 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-full mb-4">
              <Trash2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              🔥 System Reset & Diagnostic
            </h1>
            <p className="text-gray-600 text-lg">
              Limpar cache, testar conexões e resolver "offline mode"
            </p>
          </div>

          {/* Config Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-blue-900 mb-2">⚙️ Configuração Atual:</h3>
            <div className="space-y-1 text-sm text-blue-800 font-mono">
              <div>• Project ID: {projectId}</div>
              <div>• Supabase URL: https://{projectId}.supabase.co</div>
              <div>• Anon Key: {publicAnonKey.substring(0, 30)}...</div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button 
              onClick={testSupabaseConnection}
              disabled={loading}
              variant="outline"
              className="h-20"
            >
              <Globe className="w-5 h-5 mr-2" />
              Testar Conexão Supabase
            </Button>

            <Button 
              onClick={clearLocalStorage}
              disabled={loading}
              variant="outline"
              className="h-20"
            >
              <Database className="w-5 h-5 mr-2" />
              Limpar localStorage
            </Button>

            <Button 
              onClick={clearSessionStorage}
              disabled={loading}
              variant="outline"
              className="h-20"
            >
              <Database className="w-5 h-5 mr-2" />
              Limpar sessionStorage
            </Button>

            <Button 
              onClick={clearSupabaseSession}
              disabled={loading}
              variant="outline"
              className="h-20"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Logout Supabase
            </Button>
          </div>

          {/* Full Reset */}
          <Button 
            onClick={fullReset}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 h-16 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Processando...
              </>
            ) : (
              <>
                <Trash2 className="w-6 h-6 mr-2" />
                🔥 RESET COMPLETO (Limpar TUDO)
              </>
            )}
          </Button>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card 
                key={index} 
                className={`p-6 shadow-lg ${
                  result.status === 'success' ? 'bg-green-50 border-green-200' :
                  result.status === 'error' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {result.status === 'success' ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : result.status === 'error' ? (
                      <XCircle className="w-6 h-6 text-red-600" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg mb-2 ${
                      result.status === 'success' ? 'text-green-800' :
                      result.status === 'error' ? 'text-red-800' :
                      'text-yellow-800'
                    }`}>
                      {result.title}
                    </h3>
                    <div className={`whitespace-pre-wrap text-sm ${
                      result.status === 'success' ? 'text-green-700' :
                      result.status === 'error' ? 'text-red-700' :
                      'text-yellow-700'
                    }`}>
                      {result.message}
                    </div>
                    {result.details && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-xs underline font-semibold">
                          Ver detalhes técnicos
                        </summary>
                        <pre className="mt-2 p-3 bg-black/5 rounded text-xs overflow-auto max-h-60">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Instructions */}
        <Card className="p-6 mt-6 bg-purple-50 border-purple-200">
          <h3 className="font-bold text-purple-900 mb-3 text-lg">📖 Como resolver "Working in offline mode":</h3>
          <ol className="list-decimal list-inside space-y-3 text-sm text-purple-800">
            <li>
              <strong>Teste a conexão</strong> clicando em "Testar Conexão Supabase"
            </li>
            <li>
              <strong>Se Edge Function der erro:</strong>
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>O backend NÃO foi deployed</li>
                <li>Vá para Supabase Dashboard → Edge Functions</li>
                <li>Deploy a função "make-server-c2a25be0"</li>
              </ul>
            </li>
            <li>
              <strong>Se tudo estiver OK mas ainda aparecer offline:</strong>
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>Clique em "RESET COMPLETO"</li>
                <li>Recarregue a página (F5)</li>
                <li>O sistema deve sair do modo offline</li>
              </ul>
            </li>
            <li>
              <strong>Limpe dados antigos da Verônica:</strong>
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                <li>Use "RESET COMPLETO" para limpar todo cache</li>
                <li>Isso remove todos os dados locais do navegador</li>
                <li>Novos usuários terão dados limpos</li>
              </ul>
            </li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
