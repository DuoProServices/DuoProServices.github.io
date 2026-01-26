import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function QuickAdminSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'choose' | 'creating' | 'done'>('choose');
  const [usePassword, setUsePassword] = useState('admin123');
  const [customPassword, setCustomPassword] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState('');

  const adminEmails = [
    'veprass@gmail.com',
    'germana.canada@gmail.com',
    'jamila.coura15@gmail.com'
  ];

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
    console.log(message);
  };

  const createAdminAccounts = async (password: string) => {
    setStep('creating');
    setError('');
    setLogs([]);
    
    addLog('🚀 Iniciando criação de contas admin...');
    addLog(`📅 Data: ${new Date().toLocaleString()}`);
    addLog(`🌐 URL atual: ${window.location.href}`);
    
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    addLog(`📡 Project ID: ${projectId}`);
    addLog(`🔑 Anon Key: ${anonKey ? '✅ Configurado' : '❌ Não encontrado'}`);

    if (!projectId || !anonKey) {
      setError('❌ Variáveis de ambiente não configuradas!');
      addLog('❌ ERRO: VITE_SUPABASE_PROJECT_ID ou VITE_SUPABASE_ANON_KEY não encontrado');
      return;
    }

    const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/auth/signup`;
    addLog(`🌐 Server URL: ${serverUrl}`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < adminEmails.length; i++) {
      const email = adminEmails[i];
      
      addLog(`\n📝 [${i + 1}/3] Criando: ${email}`);

      try {
        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`
          },
          body: JSON.stringify({
            email,
            password,
            name: email.split('@')[0]
          })
        });

        const result = await response.json();
        
        addLog(`   📊 Status: ${response.status} ${response.statusText}`);
        addLog(`   📦 Response: ${JSON.stringify(result)}`);

        if (response.ok) {
          addLog(`   ✅ Conta criada com sucesso!`);
          successCount++;
        } else {
          if (result.error?.includes('already registered') || result.error?.includes('User already registered')) {
            addLog(`   ⚠️ Conta já existe (isso é OK!)`);
            successCount++;
          } else {
            addLog(`   ❌ Erro: ${result.error}`);
            errorCount++;
          }
        }

      } catch (error: any) {
        addLog(`   ❌ Erro de rede: ${error.message}`);
        addLog(`   🔍 Tipo de erro: ${error.name}`);
        addLog(`   🔍 Stack: ${error.stack?.substring(0, 200)}`);
        errorCount++;
      }

      // Pequeno delay entre requests
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    addLog(`\n📊 RESULTADO FINAL:`);
    addLog(`   ✅ Sucessos: ${successCount}`);
    addLog(`   ❌ Erros: ${errorCount}`);

    if (successCount === 3) {
      addLog(`\n🎉 TODAS AS CONTAS ESTÃO PRONTAS!`);
      addLog(`\n📝 CREDENCIAIS PARA LOGIN:`);
      adminEmails.forEach(email => {
        addLog(`   • Email: ${email}`);
        addLog(`     Senha: ${password}`);
      });
      setStep('done');
    } else if (successCount > 0) {
      addLog(`\n⚠️ Algumas contas foram criadas. Você pode tentar fazer login.`);
      setStep('done');
    } else {
      setError('❌ Nenhuma conta foi criada. Verifique os logs acima.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Cache Warning */}
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-yellow-900 mb-1">
                🔄 Se você está vendo uma página diferente:
              </p>
              <p className="text-sm text-yellow-800 mb-2">
                Pressione <kbd className="px-2 py-1 bg-yellow-200 rounded font-mono text-xs">Ctrl + Shift + R</kbd> (Windows/Linux) 
                ou <kbd className="px-2 py-1 bg-yellow-200 rounded font-mono text-xs">Cmd + Shift + R</kbd> (Mac) para recarregar sem cache
              </p>
              <p className="text-xs text-yellow-700">
                Versão da página: 2.0.0 - QuickAdminSetup ativa
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
            <span className="text-3xl">🚀</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Quick Admin Setup
          </h1>
          <p className="text-gray-600">
            Crie as 3 contas admin em segundos
          </p>
        </div>

        {/* Step 1: Choose Password */}
        {step === 'choose' && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Escolha a senha para as contas admin
            </h2>

            {/* Quick Option */}
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  id="quick"
                  name="password-option"
                  checked={usePassword === 'admin123'}
                  onChange={() => setUsePassword('admin123')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="quick" className="block font-semibold text-gray-900 mb-1 cursor-pointer">
                    ⚡ Rápido: Usar "admin123" (Recomendado para testes)
                  </label>
                  <p className="text-sm text-gray-600">
                    Perfeito para desenvolvimento. Você pode mudar depois.
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Option */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  id="custom"
                  name="password-option"
                  checked={usePassword === 'custom'}
                  onChange={() => setUsePassword('custom')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor="custom" className="block font-semibold text-gray-900 mb-2 cursor-pointer">
                    🔒 Personalizado: Escolher minha própria senha
                  </label>
                  {usePassword === 'custom' && (
                    <input
                      type="text"
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      placeholder="Digite sua senha (mín. 6 caracteres)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      autoFocus
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>ℹ️ Informação:</strong> A mesma senha será usada para as 3 contas:
              </p>
              <ul className="mt-2 text-sm text-yellow-800 space-y-1">
                <li>• veprass@gmail.com</li>
                <li>• germana.canada@gmail.com</li>
                <li>• jamila.coura15@gmail.com</li>
              </ul>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const pwd = usePassword === 'custom' ? customPassword : 'admin123';
                  if (usePassword === 'custom' && (!pwd || pwd.length < 6)) {
                    setError('❌ A senha deve ter pelo menos 6 caracteres');
                    return;
                  }
                  createAdminAccounts(pwd);
                }}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              >
                🚀 Criar Contas Agora
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Ir para Login
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Creating */}
        {step === 'creating' && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 animate-pulse">
                <span className="text-3xl">⏳</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Criando contas...
              </h2>
            </div>

            {/* Logs */}
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 max-h-96 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="mb-1">{log}</div>
              ))}
              <div className="animate-pulse">▊</div>
            </div>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 'done' && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Contas Criadas!
              </h2>
              <p className="text-gray-600">
                Agora você pode fazer login
              </p>
            </div>

            {/* Credentials */}
            <div className="mb-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-4 text-center">
                🔑 Suas Credenciais
              </h3>
              <div className="space-y-3">
                {adminEmails.map(email => (
                  <div key={email} className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="text-sm text-gray-600">Email:</div>
                    <div className="font-mono font-semibold text-gray-900">{email}</div>
                    <div className="text-sm text-gray-600 mt-2">Senha:</div>
                    <div className="font-mono font-semibold text-gray-900">
                      {usePassword === 'custom' ? customPassword : 'admin123'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logs */}
            <details className="mb-6">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-900 font-medium mb-2">
                📋 Ver logs detalhados
              </summary>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 max-h-64 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="mb-1">{log}</div>
                ))}
              </div>
            </details>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/login')}
                className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
              >
                ✨ Ir para Login
              </button>
              
              <button
                onClick={() => {
                  setStep('choose');
                  setLogs([]);
                  setError('');
                }}
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Criar Novamente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
