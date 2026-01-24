import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Users, UserPlus, Trash2, RefreshCw, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

export default function SupabaseAuthManager() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [operationComplete, setOperationComplete] = useState(false);

  const adminEmails = [
    'veprass@gmail.com',
    'germana.canada@gmail.com',
    'jamila.coura15@gmail.com'
  ];

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  const listAllUsers = async () => {
    setLoading(true);
    setLogs([]);
    setOperationComplete(false);
    
    addLog('📋 Listando usuários do Supabase Auth...');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/auth/admin/list-users`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        addLog(`✅ Encontrados ${data.users?.length || 0} usuários`);
        
        if (data.users && data.users.length > 0) {
          addLog('');
          addLog('👥 USUÁRIOS ENCONTRADOS:');
          data.users.forEach((user: any, index: number) => {
            addLog(`   ${index + 1}. ${user.email} (ID: ${user.id.substring(0, 8)}...)`);
          });
        }
      } else {
        addLog(`❌ Erro ao listar usuários: ${response.status}`);
      }
    } catch (err: any) {
      addLog(`❌ Erro de conexão: ${err.message}`);
    }

    setLoading(false);
  };

  const createTestUser = async () => {
    setLoading(true);
    setLogs([]);
    setOperationComplete(false);
    
    addLog('🔧 Criando usuário de teste...');
    addLog('📧 Email: test@example.com');
    addLog('🔑 Senha: test123456');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/auth/create-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'test123456',
            name: 'Test User'
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        addLog('✅ Usuário de teste criado com sucesso!');
        addLog('');
        addLog('📝 Credenciais:');
        addLog('   Email: test@example.com');
        addLog('   Senha: test123456');
        setOperationComplete(true);
      } else {
        addLog(`❌ Erro: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (err: any) {
      addLog(`❌ Erro de conexão: ${err.message}`);
    }

    setLoading(false);
  };

  const resetAllUsers = async () => {
    if (!confirm('⚠️ ATENÇÃO: Isso vai DELETAR todos os usuários do Supabase Auth! Tem certeza?')) {
      return;
    }

    setLoading(true);
    setLogs([]);
    setOperationComplete(false);
    
    addLog('🗑️ Deletando TODOS os usuários...');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/auth/reset-all-users`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        addLog(`✅ ${data.deletedCount} usuários deletados com sucesso!`);
        setOperationComplete(true);
      } else {
        addLog(`❌ Erro: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (err: any) {
      addLog(`❌ Erro de conexão: ${err.message}`);
    }

    setLoading(false);
  };

  const completeSystemReset = async () => {
    if (!confirm('🚨 PERIGO: Isso vai DELETAR TUDO (usuários, dados do KV store, documentos, etc)! TEM CERTEZA ABSOLUTA?')) {
      return;
    }

    if (!confirm('🔴 ÚLTIMA CHANCE: Você tem CERTEZA que quer deletar TODO o sistema?')) {
      return;
    }

    setLoading(true);
    setLogs([]);
    setOperationComplete(false);
    
    addLog('🗑️ INICIANDO RESET COMPLETO DO SISTEMA...');
    addLog('⚠️  Deletando: usuários, dados, documentos, tudo!');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/auth/complete-reset`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        addLog('');
        addLog('📊 RELATÓRIO DE DELEÇÃO:');
        addLog(`   ✅ Usuários deletados: ${data.report.authUsersDeleted}`);
        addLog(`   ✅ Registros KV deletados: ${data.report.kvRecordsDeleted}`);
        addLog(`   ✅ Arquivos deletados: ${data.report.storageFilesDeleted}`);
        addLog(`   ✅ Buckets deletados: ${data.report.bucketsDeleted}`);
        addLog('');
        addLog('🎉 SISTEMA COMPLETAMENTE RESETADO!');
        setOperationComplete(true);
      } else {
        addLog(`❌ Erro: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (err: any) {
      addLog(`❌ Erro de conexão: ${err.message}`);
    }

    setLoading(false);
  };

  const quickFix = async () => {
    setLoading(true);
    setLogs([]);
    setOperationComplete(false);
    
    addLog('🚀 INICIANDO FIX AUTOMÁTICO...');
    addLog('');
    addLog('Passo 1/2: Deletando usuários existentes...');

    try {
      // Step 1: Delete all users
      const deleteResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/auth/reset-all-users`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      const deleteData = await deleteResponse.json();

      if (deleteResponse.ok && deleteData.success) {
        addLog(`   ✅ ${deleteData.deletedCount} usuários deletados`);
      } else {
        addLog(`   ⚠️ Aviso: ${deleteData.error || 'Nenhum usuário para deletar'}`);
      }

      addLog('');
      addLog('Passo 2/2: Criando 3 contas admin...');
      
      // Step 2: Create admin accounts
      let successCount = 0;
      
      for (const email of adminEmails) {
        addLog(`   🔧 Criando: ${email}`);
        
        const createResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/auth/create-user`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({
              email,
              password: 'admin123',
              name: email.split('@')[0]
            })
          }
        );

        const createData = await createResponse.json();

        if (createResponse.ok && createData.success) {
          addLog(`      ✅ Criado com sucesso!`);
          successCount++;
        } else {
          addLog(`      ❌ Erro: ${createData.error}`);
        }

        await new Promise(resolve => setTimeout(resolve, 300));
      }

      addLog('');
      addLog('📊 RESULTADO FINAL:');
      addLog(`   ✅ ${successCount}/3 contas admin criadas`);
      
      if (successCount === 3) {
        addLog('');
        addLog('🎉 SUCESSO TOTAL!');
        addLog('');
        addLog('📝 NOVAS CREDENCIAIS:');
        adminEmails.forEach(email => {
          addLog(`   • ${email} / admin123`);
        });
        addLog('');
        addLog('✨ Agora você pode fazer login!');
        setOperationComplete(true);
      }

    } catch (err: any) {
      addLog(`❌ Erro fatal: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Auth Debug Panel
          </h1>
          <p className="text-gray-600">
            Manage Supabase Auth users for testing
          </p>
        </div>

        {/* Quick Fix Button - HIGHLIGHTED */}
        <div className="mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <RefreshCw className="w-6 h-6" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">
                🚀 SOLUÇÃO RÁPIDA - Resolver Erro de Login
              </h2>
              <p className="text-sm text-white/90 mb-4">
                Deleta todos os usuários antigos e cria 3 novas contas admin com senha "admin123"
              </p>
              <button
                onClick={quickFix}
                disabled={loading}
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Executando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    ⚡ EXECUTAR FIX AUTOMÁTICO
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button
            onClick={listAllUsers}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            📋 List All Users
          </button>

          <button
            onClick={createTestUser}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            🔧 Create Test User
          </button>

          <button
            onClick={resetAllUsers}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            🗑️ Reset All Users
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-red-900 text-lg">⚠️ DANGER ZONE</h3>
              <p className="text-sm text-red-800">
                Deleta TUDO: usuários, clientes, documentos, invoices, histórico completo!
              </p>
            </div>
          </div>
          <button
            onClick={completeSystemReset}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            🗑️ 🛒 COMPLETE SYSTEM RESET (DELETE EVERYTHING)
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            📘 How to use:
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <div><strong>1. List All Users</strong> - See which users exist in Supabase Auth</div>
            <div><strong>2. Create Test User</strong> - Creates a test user with known credentials</div>
            <div><strong>3. Reset All Users</strong> - Deletes ALL users (use carefully!)</div>
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
            🔧 Common Issues:
          </h3>
          <div className="space-y-2 text-sm text-yellow-800">
            <div>
              <strong>"Invalid login credentials"</strong> → User exists but wrong password
            </div>
            <div>
              <strong>"User already registered"</strong> → Email already exists in database
            </div>
            <div className="mt-3 pt-3 border-t border-yellow-300">
              <strong>Solution:</strong> Click "Reset All Users" then go to /setup to create fresh admin
            </div>
          </div>
        </div>

        {/* Console Log */}
        {logs.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">📋 Operation Log</h3>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 max-h-[400px] overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="mb-1">{log}</div>
              ))}
              {loading && <div className="animate-pulse mt-2">▊</div>}
            </div>

            {operationComplete && (
              <div className="mt-4 space-y-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                >
                  ✨ Ir para Login
                </button>
              </div>
            )}
          </div>
        )}

        {/* Users Display */}
        {users.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">
              👥 Users Found: {users.length}
            </h3>
            <div className="space-y-2">
              {users.map((user: any) => (
                <div key={user.id} className="bg-gray-50 rounded p-3 text-sm">
                  <div className="font-mono text-blue-600">{user.email}</div>
                  <div className="text-gray-500 text-xs">ID: {user.id}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            → Go to Login
          </button>
          <span className="text-gray-300">•</span>
          <button
            onClick={() => navigate('/quick-setup')}
            className="text-green-600 hover:text-green-800 underline"
          >
            → Go to Setup Page
          </button>
        </div>

      </div>
    </div>
  );
}
