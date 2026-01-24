import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function ResetAdminPasswordsPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('admin123');
  const [customPassword, setCustomPassword] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'resetting' | 'done'>('idle');
  const [error, setError] = useState('');

  const adminEmails = [
    'veprass@gmail.com',
    'germana.canada@gmail.com',
    'jamila.coura15@gmail.com'
  ];

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev, logMessage]);
    console.log(logMessage);
  };

  const resetPasswords = async () => {
    const finalPassword = useCustom ? customPassword : password;

    if (!finalPassword || finalPassword.length < 6) {
      setError('❌ A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setStatus('resetting');
    setError('');
    setLogs([]);

    addLog('🔄 Iniciando reset de senhas...');
    
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!projectId || !anonKey) {
      setError('❌ Variáveis de ambiente não configuradas!');
      addLog('❌ VITE_SUPABASE_PROJECT_ID ou VITE_SUPABASE_ANON_KEY não encontrado');
      setStatus('idle');
      return;
    }

    addLog(`📡 Project ID: ${projectId}`);
    addLog(`🔑 Usando senha: ${finalPassword}`);

    const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/auth/reset-password`;
    addLog(`🌐 Server URL: ${serverUrl}`);

    let successCount = 0;
    let errorCount = 0;

    for (const email of adminEmails) {
      addLog(`\n🔄 Resetando senha para: ${email}`);

      try {
        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`
          },
          body: JSON.stringify({
            email,
            newPassword: finalPassword
          })
        });

        const result = await response.json();
        
        addLog(`   📊 Status: ${response.status}`);
        addLog(`   📦 Response: ${JSON.stringify(result, null, 2)}`);

        if (response.ok && result.success) {
          addLog(`   ✅ Senha resetada com sucesso!`);
          successCount++;
        } else {
          addLog(`   ❌ Erro: ${result.error || 'Unknown error'}`);
          errorCount++;
        }

      } catch (error: any) {
        addLog(`   ❌ Erro de rede: ${error.message}`);
        errorCount++;
      }

      // Delay entre requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    addLog(`\n📊 RESULTADO FINAL:`);
    addLog(`   ✅ Sucessos: ${successCount}`);
    addLog(`   ❌ Erros: ${errorCount}`);

    if (successCount === 3) {
      addLog(`\n🎉 TODAS AS SENHAS FORAM RESETADAS!`);
      addLog(`\n📝 NOVAS CREDENCIAIS:`);
      adminEmails.forEach(email => {
        addLog(`   Email: ${email}`);
        addLog(`   Senha: ${finalPassword}`);
      });
      setStatus('done');
    } else if (successCount > 0) {
      addLog(`\n⚠️ Algumas senhas foram resetadas.`);
      setStatus('done');
    } else {
      setError('❌ Nenhuma senha foi resetada. Verifique os logs.');
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-full mb-4">
            <span className="text-3xl">🔄</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Reset Admin Passwords
          </h1>
          <p className="text-gray-600">
            Redefina as senhas das 3 contas admin existentes
          </p>
        </div>

        {/* Warning Box */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">
                Importante: Use esta página quando
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>✅ As contas admin JÁ EXISTEM no Supabase</li>
                <li>✅ Você esqueceu a senha ou ela não funciona</li>
                <li>✅ Você quer definir uma nova senha para todos os admins</li>
              </ul>
            </div>
          </div>
        </div>

        {status === 'idle' && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Escolha a nova senha
            </h2>

            {/* Option 1: admin123 */}
            <div className="mb-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="password-type"
                  checked={!useCustom}
                  onChange={() => setUseCustom(false)}
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    ⚡ Usar "admin123" (Rápido)
                  </div>
                  <div className="text-sm text-gray-600">
                    Senha simples para testes. Você pode mudar depois.
                  </div>
                </div>
              </label>
            </div>

            {/* Option 2: Custom */}
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="password-type"
                  checked={useCustom}
                  onChange={() => setUseCustom(true)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-2">
                    🔒 Senha personalizada
                  </div>
                  {useCustom && (
                    <input
                      type="text"
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      placeholder="Digite a nova senha (mín. 6 caracteres)"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      autoFocus
                    />
                  )}
                </div>
              </label>
            </div>

            {/* Info */}
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                <strong>📋 Contas que serão atualizadas:</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                {adminEmails.map(email => (
                  <li key={email} className="font-mono">• {email}</li>
                ))}
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
                onClick={resetPasswords}
                className="flex-1 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold text-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg"
              >
                🔄 Resetar Senhas Agora
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {status === 'resetting' && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4 animate-pulse">
                <span className="text-3xl">⏳</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Resetando senhas...
              </h2>
            </div>

            {/* Logs */}
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs sm:text-sm text-green-400 max-h-96 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="mb-1 break-all">{log}</div>
              ))}
              <div className="animate-pulse">▊</div>
            </div>
          </div>
        )}

        {status === 'done' && (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Senhas Resetadas!
              </h2>
              <p className="text-gray-600">
                Agora você pode fazer login com a nova senha
              </p>
            </div>

            {/* Credentials */}
            <div className="mb-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-4 text-center">
                🔑 Suas Novas Credenciais
              </h3>
              <div className="space-y-3">
                {adminEmails.map(email => (
                  <div key={email} className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="text-sm text-gray-600">Email:</div>
                    <div className="font-mono font-semibold text-gray-900 break-all">{email}</div>
                    <div className="text-sm text-gray-600 mt-2">Nova Senha:</div>
                    <div className="font-mono font-semibold text-gray-900">
                      {useCustom ? customPassword : password}
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
                  <div key={i} className="mb-1 break-all">{log}</div>
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
                  setStatus('idle');
                  setLogs([]);
                  setError('');
                }}
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Resetar Novamente
              </button>
            </div>
          </div>
        )}

        {/* Help */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Precisa criar novas contas? <button onClick={() => navigate('/setup')} className="text-blue-600 hover:text-blue-700 font-medium underline">Ir para Setup</button>
          </p>
          <p className="mt-2">
            Precisa de ajuda? <button onClick={() => navigate('/auth-debug')} className="text-gray-500 hover:text-gray-700 underline">Abrir Debug</button>
          </p>
        </div>
      </div>
    </div>
  );
}
