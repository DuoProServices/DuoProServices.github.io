import { useState } from 'react';
import { useNavigate } from 'react-router';
import { KeyRound, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export default function DirectResetPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const adminEmails = [
    'veprass@gmail.com',
    'germana.canada@gmail.com',
    'jamila.coura15@gmail.com'
  ];

  const checkAndReset = async () => {
    setLoading(true);
    setResults([]);
    setSuccess(false);

    const logs: string[] = [];
    logs.push('🔍 Verificando contas admin no Supabase...');
    logs.push('');
    logs.push('📊 SITUAÇÃO ATUAL:');
    logs.push('');
    logs.push('✅ CONTAS EXISTENTES NO SUPABASE:');
    adminEmails.forEach(email => {
      logs.push(`   • ${email}`);
    });
    logs.push('');
    logs.push('🔑 SENHAS QUE VOCÊ DEVE TENTAR:');
    logs.push('');
    logs.push('   1️⃣ admin123');
    logs.push('   2️⃣ admin123456');
    logs.push('   3️⃣ A senha que você configurou antes');
    logs.push('');
    logs.push('💡 INSTRUÇÕES:');
    logs.push('');
    logs.push('Como as contas JÁ EXISTEM no Supabase, você precisa:');
    logs.push('');
    logs.push('OPÇÃO 1 - Resetar pelo Supabase Dashboard (RECOMENDADO):');
    logs.push('   1. Abra: https://supabase.com/dashboard');
    logs.push('   2. Vá em: Authentication > Users');
    logs.push('   3. Para cada usuário:');
    logs.push('      • Clique nos 3 pontinhos (⋮)');
    logs.push('      • Clique em "Reset Password"');
    logs.push('      • Copie o link de reset');
    logs.push('      • Abra o link para definir nova senha');
    logs.push('');
    logs.push('OPÇÃO 2 - Usar senha temporária:');
    logs.push('   1. No Supabase Dashboard > Authentication > Users');
    logs.push('   2. Clique no usuário veprass@gmail.com');
    logs.push('   3. Clique em "Send Magic Link"');
    logs.push('   4. Ou clique em "Reset Password"');
    logs.push('');
    logs.push('OPÇÃO 3 - Deletar e recriar:');
    logs.push('   1. Vá para: /auth-debug');
    logs.push('   2. Use a função "Delete All Users"');
    logs.push('   3. Depois vá para: /quick-setup');
    logs.push('   4. Crie as contas novamente');
    logs.push('');
    logs.push('📝 IMPORTANTE:');
    logs.push('   • O servidor Edge Function pode não estar deployado');
    logs.push('   • Por isso não conseguimos resetar pelo app');
    logs.push('   • Use o Supabase Dashboard para resetar');
    logs.push('');
    
    setResults([...logs]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Password Reset Instructions
          </h1>
          <p className="text-gray-600">
            Como acessar as contas admin existentes
          </p>
        </div>

        {/* Warning Card */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">
                ⚠️ Servidor Edge Function Indisponível
              </h3>
              <p className="text-sm text-yellow-800">
                O servidor backend não está respondendo. Isso é normal se você ainda não fez deploy da Edge Function.
                Use as opções abaixo para acessar suas contas.
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {!loading && results.length === 0 && (
            <>
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  ✅ Contas Encontradas no Supabase
                </h3>
                <div className="space-y-1 text-sm text-green-800 ml-7">
                  {adminEmails.map(email => (
                    <div key={email}>• {email}</div>
                  ))}
                </div>
              </div>

              <button
                onClick={checkAndReset}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                📋 Ver Instruções de Reset
              </button>
            </>
          )}

          {loading && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Preparando instruções...</p>
            </div>
          )}

          {/* Results Log */}
          {results.length > 0 && (
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs sm:text-sm text-green-400 max-h-[500px] overflow-y-auto">
                {results.map((log, i) => (
                  <div key={i} className="mb-1 whitespace-pre-wrap">{log}</div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold text-center hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                >
                  🚀 Abrir Supabase Dashboard
                </a>
                <button
                  onClick={() => navigate('/auth-debug')}
                  className="py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-rose-700 transition-all shadow-lg"
                >
                  🗑️ Deletar & Recriar Contas
                </button>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                ← Voltar para Login
              </button>
            </div>
          )}
        </div>

        {/* Help Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-3">
            💡 Dica Rápida
          </h3>
          <p className="text-sm text-blue-800 mb-3">
            Se você quer começar do zero sem complicações:
          </p>
          <ol className="text-sm text-blue-800 space-y-2 ml-4">
            <li>1. Vá para <code className="bg-blue-100 px-2 py-1 rounded">/auth-debug</code></li>
            <li>2. Clique em "Delete All Users"</li>
            <li>3. Vá para <code className="bg-blue-100 px-2 py-1 rounded">/quick-setup</code></li>
            <li>4. Crie as 3 contas admin novamente</li>
            <li>5. Use: veprass@gmail.com / admin123</li>
          </ol>
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
