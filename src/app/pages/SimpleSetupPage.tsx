import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function SimpleSetupPage() {
  const navigate = useNavigate();
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [password3, setPassword3] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const adminEmails = [
    'veprass@gmail.com',
    'germana.canada@gmail.com',
    'jamila.coura15@gmail.com'
  ];

  const createAccounts = async () => {
    if (!password1 || !password2 || !password3) {
      setMessage('❌ Por favor, preencha todas as senhas');
      return;
    }

    if (password1.length < 6 || password2.length < 6 || password3.length < 6) {
      setMessage('❌ Todas as senhas devem ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    setMessage('⏳ Criando contas...');

    const passwords = [password1, password2, password3];

    try {
      for (let i = 0; i < adminEmails.length; i++) {
        const email = adminEmails[i];
        const password = passwords[i];
        
        console.log(`📝 Criando conta: ${email}`);

        const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/auth/signup`;
        
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

        if (!response.ok && !result.error?.includes('already registered')) {
          throw new Error(result.error || 'Erro ao criar conta');
        }

        console.log(`✅ Conta criada: ${email}`);
      }

      setMessage('✅ Todas as contas foram criadas com sucesso!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error: any) {
      console.error('❌ Erro:', error);
      setMessage(`❌ Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🚀 Configuração Inicial
        </h1>
        <p className="text-gray-600 mb-6">
          Crie as senhas para as 3 contas admin
        </p>

        <div className="space-y-4 mb-6">
          {/* Account 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              1. {adminEmails[0]}
            </label>
            <input
              type="password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              placeholder="Digite a senha (mín. 6 caracteres)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Account 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              2. {adminEmails[1]}
            </label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Digite a senha (mín. 6 caracteres)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          {/* Account 3 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              3. {adminEmails[2]}
            </label>
            <input
              type="password"
              value={password3}
              onChange={(e) => setPassword3(e.target.value)}
              placeholder="Digite a senha (mín. 6 caracteres)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg mb-4 ${
            message.includes('✅') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : message.includes('❌')
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {message}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={createAccounts}
            disabled={loading}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Criando...' : '✨ Criar Todas as Contas'}
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Ir para Login
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 <strong>Dica:</strong> Use uma senha simples para testes (ex: admin123). 
            Você pode mudá-la depois nas configurações.
          </p>
        </div>
      </div>
    </div>
  );
}
