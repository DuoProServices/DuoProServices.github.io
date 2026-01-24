import { useState } from 'react';
import { useNavigate } from 'react-router';
import { KeyRound, CheckCircle, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

export default function SimpleResetPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState('admin123');

  const adminEmails = [
    'veprass@gmail.com',
    'germana.canada@gmail.com',
    'jamila.coura15@gmail.com'
  ];

  const resetPasswords = async () => {
    setLoading(true);
    setResults([]);
    setSuccess(false);

    const logs: string[] = [];
    logs.push('🔄 Resetando senhas dos admins...');
    setResults([...logs]);

    if (!projectId || !publicAnonKey) {
      logs.push('❌ ERRO: Variáveis de ambiente não configuradas!');
      logs.push(`ProjectID: ${projectId || 'NÃO ENCONTRADO'}`);
      logs.push(`AnonKey: ${publicAnonKey ? 'OK' : 'NÃO ENCONTRADO'}`);
      setResults([...logs]);
      setLoading(false);
      return;
    }

    logs.push(`✅ ProjectID: ${projectId}`);
    logs.push(`✅ AnonKey: Configurado`);
    setResults([...logs]);

    const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/auth/reset-password`;
    logs.push(`🌐 Server: ${serverUrl}`);
    setResults([...logs]);

    // Test server connectivity first
    logs.push(`\n🔍 Testando conectividade do servidor...`);
    setResults([...logs]);

    try {
      const testResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/auth/admin/list-users`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      logs.push(`   📡 Status: ${testResponse.status}`);
      
      if (testResponse.ok) {
        logs.push(`   ✅ Servidor está online e respondendo!`);
      } else {
        logs.push(`   ⚠️ Servidor respondeu com status ${testResponse.status}`);
        const errorText = await testResponse.text();
        logs.push(`   📄 Resposta: ${errorText.substring(0, 200)}`);
      }
    } catch (testErr: any) {
      logs.push(`   ❌ Servidor não está acessível: ${testErr.message}`);
      logs.push(`   💡 Possíveis causas:`);
      logs.push(`      • Edge Function não foi deployada`);
      logs.push(`      • CORS bloqueando a requisição`);
      logs.push(`      • Servidor offline`);
      setResults([...logs]);
      setLoading(false);
      return;
    }

    setResults([...logs]);
    logs.push(`\n🔄 Iniciando reset de senhas...`);
    setResults([...logs]);

    let successCount = 0;

    for (const email of adminEmails) {
      logs.push(`\n🔑 Resetando: ${email}`);
      setResults([...logs]);

      try {
        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email,
            newPassword
          })
        });

        logs.push(`   📡 Status: ${response.status} ${response.statusText}`);
        setResults([...logs]);

        // Get response as text first
        const responseText = await response.text();
        logs.push(`   📄 Response: ${responseText.substring(0, 200)}...`);
        setResults([...logs]);

        // Try to parse as JSON
        let result;
        try {
          result = JSON.parse(responseText);
        } catch {
          logs.push(`   ⚠️ Resposta não é JSON válido`);
          logs.push(`   ❌ O servidor pode não estar respondendo corretamente`);
          setResults([...logs]);
          continue;
        }

        if (response.ok && result.success) {
          logs.push(`   ✅ Senha resetada com sucesso!`);
          successCount++;
        } else {
          logs.push(`   ❌ Erro: ${result.error || 'Erro desconhecido'}`);
        }
      } catch (err: any) {
        logs.push(`   ❌ Erro de requisição: ${err.message}`);
      }

      setResults([...logs]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    logs.push(`\n📊 RESULTADO:`);
    logs.push(`   ✅ Senhas resetadas: ${successCount}/3`);

    if (successCount > 0) {
      logs.push(`\n🎉 SENHAS ATUALIZADAS!`);
      logs.push(`\n📝 NOVAS CREDENCIAIS:`);
      adminEmails.forEach(email => {
        logs.push(`   • Email: ${email}`);
        logs.push(`     Senha: ${newPassword}`);
      });
      setSuccess(true);
    }

    setResults([...logs]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-600 rounded-full mb-4">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Reset Admin Passwords
          </h1>
          <p className="text-gray-600">
            Redefina as senhas das 3 contas admin
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {!success && !loading && (
            <>
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                <h3 className="font-bold text-blue-900 mb-2">
                  ℹ️ Informação Importante
                </h3>
                <p className="text-sm text-blue-800 mb-3">
                  Os usuários admin já existem no banco de dados! Esta ferramenta vai apenas resetar suas senhas.
                </p>
                <div className="space-y-1 text-sm text-blue-800">
                  <div>✅ veprass@gmail.com</div>
                  <div>✅ germana.canada@gmail.com</div>
                  <div>✅ jamila.coura15@gmail.com</div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova senha para todas as contas
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                  placeholder="admin123"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Mínimo 6 caracteres. A mesma senha será definida para todas as 3 contas.
                </p>
              </div>

              <button
                onClick={resetPasswords}
                disabled={newPassword.length < 6}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg font-semibold text-lg hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔄 Resetar Senhas Agora
              </button>
            </>
          )}

          {loading && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Resetando senhas...</p>
            </div>
          )}

          {/* Results Log */}
          {results.length > 0 && (
            <div className="mt-6">
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 max-h-96 overflow-y-auto">
                {results.map((log, i) => (
                  <div key={i} className="mb-1 whitespace-pre-wrap">{log}</div>
                ))}
                {loading && <div className="animate-pulse">▊</div>}
              </div>
            </div>
          )}

          {/* Success Actions */}
          {success && (
            <div className="mt-6 space-y-3">
              <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-900 mb-1">
                    🎉 Senhas resetadas com sucesso!
                  </h3>
                  <p className="text-sm text-green-800">
                    Agora você pode fazer login com a nova senha.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
              >
                ✨ Ir para Login
              </button>
            </div>
          )}
        </div>

        {/* Back to Login Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            ← Voltar para Login
          </button>
        </div>
      </div>
    </div>
  );
}
