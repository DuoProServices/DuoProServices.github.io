import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { RefreshCw, CheckCircle, XCircle, Key, LogIn, Trash2, UserPlus } from 'lucide-react';

interface User {
  id: string;
  email: string;
  created_at: string;
  email_confirmed_at: string | null;
}

export default function AdminDiagnosticPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [newPassword, setNewPassword] = useState('admin123');
  const [testEmail, setTestEmail] = useState('veprass@gmail.com');
  const [testPassword, setTestPassword] = useState('admin123');

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev, logMessage]);
    console.log(logMessage);
  };

  const listAllUsers = async () => {
    setLoading(true);
    setLogs([]);
    addLog('🔍 Listando todos os usuários no Supabase...');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/admin/list-users`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${anonKey}`
          }
        }
      );

      const result = await response.json();
      
      if (response.ok && result.users) {
        setUsers(result.users);
        addLog(`✅ Encontrados ${result.users.length} usuários`);
        result.users.forEach((user: User, index: number) => {
          addLog(`   ${index + 1}. ${user.email} (ID: ${user.id.substring(0, 8)}...)`);
        });
      } else {
        addLog(`❌ Erro: ${result.error || 'Falha ao listar usuários'}`);
      }
    } catch (error: any) {
      addLog(`❌ Erro de rede: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = async (email: string, password: string) => {
    addLog(`\n🔄 Resetando senha para: ${email}`);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`
          },
          body: JSON.stringify({
            email,
            newPassword: password
          })
        }
      );

      const result = await response.json();
      
      if (response.ok && result.success) {
        addLog(`✅ Senha resetada com sucesso para ${email}!`);
        addLog(`   Nova senha: ${password}`);
        return true;
      } else {
        addLog(`❌ Erro: ${result.error || 'Falha ao resetar senha'}`);
        return false;
      }
    } catch (error: any) {
      addLog(`❌ Erro de rede: ${error.message}`);
      return false;
    }
  };

  const testLogin = async () => {
    setLogs([]);
    addLog(`🔐 Testando login com: ${testEmail}`);
    addLog(`🔑 Senha: ${testPassword}`);

    try {
      // Try using Supabase client directly
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        `https://${projectId}.supabase.co`,
        anonKey
      );

      addLog('📡 Enviando requisição de login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      if (error) {
        addLog(`❌ ERRO DE LOGIN: ${error.message}`);
        addLog(`   Código: ${error.status}`);
        addLog(`   Detalhes: ${JSON.stringify(error)}`);
        
        if (error.message.includes('Invalid login credentials')) {
          addLog('\n💡 DIAGNÓSTICO:');
          addLog('   • O usuário existe mas a senha está incorreta');
          addLog('   • OU o email não está confirmado');
          addLog('   • Use o botão "Reset Password" abaixo para corrigir');
        }
        
        return false;
      }

      if (data.user) {
        addLog(`✅ LOGIN BEM SUCEDIDO!`);
        addLog(`   User ID: ${data.user.id}`);
        addLog(`   Email: ${data.user.email}`);
        addLog(`   Email confirmado: ${data.user.email_confirmed_at ? 'Sim' : 'Não'}`);
        addLog(`   Access Token: ${data.session?.access_token?.substring(0, 20)}...`);
        addLog('\n🎉 Você pode fazer login normalmente agora!');
        return true;
      }

      addLog('⚠️ Login retornou sem erro mas sem dados');
      return false;

    } catch (error: any) {
      addLog(`❌ Erro crítico: ${error.message}`);
      addLog(`   Stack: ${error.stack}`);
      return false;
    }
  };

  const resetAll3Admins = async () => {
    const adminEmails = [
      'veprass@gmail.com',
      'germana.canada@gmail.com',
      'jamila.coura15@gmail.com'
    ];

    setLogs([]);
    addLog('🔄 Resetando senhas de todos os 3 admins...');
    addLog(`🔑 Nova senha: ${newPassword}\n`);

    let successCount = 0;

    for (const email of adminEmails) {
      const success = await resetUserPassword(email, newPassword);
      if (success) successCount++;
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    addLog(`\n📊 RESULTADO: ${successCount}/3 senhas resetadas`);
    
    if (successCount === 3) {
      addLog('\n✅ SUCESSO TOTAL! Agora você pode fazer login com:');
      adminEmails.forEach(email => {
        addLog(`   Email: ${email}`);
        addLog(`   Senha: ${newPassword}\n`);
      });
    }
  };

  const deleteUser = async (email: string) => {
    if (!confirm(`⚠️ Tem certeza que quer DELETAR ${email}?`)) return;

    addLog(`\n🗑️ Deletando usuário: ${email}`);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/admin/delete-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`
          },
          body: JSON.stringify({ email })
        }
      );

      const result = await response.json();
      
      if (response.ok && result.success) {
        addLog(`✅ Usuário deletado: ${email}`);
        listAllUsers(); // Refresh list
      } else {
        addLog(`❌ Erro: ${result.error || 'Falha ao deletar'}`);
      }
    } catch (error: any) {
      addLog(`❌ Erro: ${error.message}`);
    }
  };

  useEffect(() => {
    listAllUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🔧 Admin Diagnostic Center
              </h1>
              <p className="text-gray-600">
                Diagnóstico completo, reset de senhas e testes de login
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              ← Voltar para Login
            </button>
          </div>

          {/* Env Check */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm text-gray-600">Project ID</div>
              <div className="font-mono text-sm font-semibold">
                {projectId ? `✅ ${projectId}` : '❌ Não configurado'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Anon Key</div>
              <div className="font-mono text-sm font-semibold">
                {anonKey ? `✅ ${anonKey.substring(0, 20)}...` : '❌ Não configurado'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column: Users List */}
          <div className="space-y-6">
            {/* Users List */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  👥 Usuários Existentes
                </h2>
                <button
                  onClick={listAllUsers}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </button>
              </div>

              {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {loading ? '⏳ Carregando...' : '❌ Nenhum usuário encontrado'}
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-mono font-semibold text-gray-900 mb-1">
                            {user.email}
                          </div>
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>ID: {user.id}</div>
                            <div>Criado: {new Date(user.created_at).toLocaleString()}</div>
                            <div className="flex items-center gap-2">
                              {user.email_confirmed_at ? (
                                <>
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                  <span className="text-green-600">Email confirmado</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 text-red-600" />
                                  <span className="text-red-600">Email NÃO confirmado</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteUser(user.email)}
                          className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deletar usuário"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-4">⚡ Ações Rápidas</h2>
              
              <div className="space-y-3">
                <button
                  onClick={resetAll3Admins}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <Key className="w-5 h-5" />
                  Resetar TODOS os 3 Admins (senha: {newPassword})
                </button>

                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nova senha para todos"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 border-2 border-white/20"
                />

                <button
                  onClick={() => navigate('/setup')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  Criar Novas Contas Admin
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Test Login & Logs */}
          <div className="space-y-6">
            {/* Test Login */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                🔐 Testar Login
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <input
                    type="text"
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={testLogin}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  Testar Login Agora
                </button>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    💡 Este teste faz login real no Supabase e mostra logs detalhados abaixo
                  </p>
                </div>
              </div>
            </div>

            {/* Logs */}
            <div className="bg-gray-900 rounded-xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">📋 Logs</h2>
                <button
                  onClick={() => setLogs([])}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Limpar
                </button>
              </div>

              <div className="bg-black rounded-lg p-4 font-mono text-xs text-green-400 max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-gray-500">Aguardando ações...</div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="mb-1 break-all">{log}</div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
