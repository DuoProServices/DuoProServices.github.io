import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2, Trash2, UserPlus, Users } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

export default function UserManagementDebug() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  
  // Create user form
  const [newEmail, setNewEmail] = useState('test@example.com');
  const [newPassword, setNewPassword] = useState('test123456');
  const [newName, setNewName] = useState('Test User');
  const [newRole, setNewRole] = useState('client');

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const addResult = (title: string, status: 'success' | 'error' | 'warning', message: string, details?: any) => {
    setResults(prev => [...prev, { title, status, message, details, timestamp: new Date() }]);
  };

  const loadCurrentUser = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setCurrentUser(data.session.user);
      }
    } catch (err) {
      console.error('Error loading user:', err);
    }
  };

  const loadAllUsers = async () => {
    setLoading(true);
    setResults([]);
    addResult('🔄 Carregando usuários...', 'warning', 'Consultando Supabase...');

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        addResult('❌ Não autenticado', 'error', 'Você precisa estar logado como admin');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/users/list`,
        {
          headers: {
            'Authorization': `Bearer ${sessionData.session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setAllUsers(data);
        addResult('✅ Usuários carregados', 'success', `Total: ${data.length} usuários`, data);
      } else {
        addResult('❌ Erro ao carregar', 'error', data.error || 'Erro desconhecido', data);
      }
    } catch (err: any) {
      addResult('❌ ERRO', 'error', err.message, err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCurrentUser = async () => {
    if (!currentUser) {
      addResult('❌ Erro', 'error', 'Nenhum usuário logado');
      return;
    }

    if (!confirm(`⚠️ TEM CERTEZA que deseja excluir o usuário ${currentUser.email}?\n\nIsso não pode ser desfeito!`)) {
      return;
    }

    setLoading(true);
    setResults([]);
    addResult('🗑️ Excluindo usuário...', 'warning', `Deletando ${currentUser.email}...`);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        addResult('❌ Não autenticado', 'error', 'Sessão expirada');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/users/${currentUser.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${sessionData.session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        addResult('✅ USUÁRIO EXCLUÍDO!', 'success', 'Fazendo logout...', data);
        
        // Logout
        await supabase.auth.signOut();
        
        addResult('✅ Logout concluído', 'success', 'Você foi deslogado. Recarregue a página.', {});
        
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        addResult('❌ Erro ao excluir', 'error', data.error || 'Erro desconhecido', data);
      }
    } catch (err: any) {
      addResult('❌ ERRO', 'error', err.message, err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`⚠️ TEM CERTEZA que deseja excluir ${userEmail}?`)) {
      return;
    }

    setLoading(true);
    setResults([]);
    addResult('🗑️ Excluindo usuário...', 'warning', `Deletando ${userEmail}...`);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        addResult('❌ Não autenticado', 'error', 'Sessão expirada');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${sessionData.session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        addResult('✅ Usuário excluído!', 'success', 'Recarregando lista...', data);
        await loadAllUsers();
      } else {
        addResult('❌ Erro ao excluir', 'error', data.error || 'Erro desconhecido', data);
      }
    } catch (err: any) {
      addResult('❌ ERRO', 'error', err.message, err);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    setLoading(true);
    setResults([]);
    addResult('➕ Criando usuário...', 'warning', `Criando ${newEmail} no Supabase Auth...`);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        addResult('❌ Não autenticado', 'error', 'Você precisa estar logado como admin');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/admin/create-user`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionData.session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: newEmail,
            password: newPassword,
            name: newName,
            role: newRole,
            modules: [],
            isActive: true
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        addResult('✅ USUÁRIO CRIADO NO SUPABASE!', 'success', 'Usuário criado com sucesso!', data);
        
        // Verificar se foi salvo
        addResult('🔍 Verificando...', 'warning', 'Consultando Supabase Auth...');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Tentar fazer login com o novo usuário
        const loginResult = await supabase.auth.signInWithPassword({
          email: newEmail,
          password: newPassword
        });

        if (loginResult.error) {
          addResult('❌ Login falhou', 'error', 'Usuário foi criado mas não consegue fazer login!', loginResult.error);
        } else {
          addResult('✅ Login OK!', 'success', 'Usuário criado e funcionando!', {
            userId: loginResult.data.user?.id,
            email: loginResult.data.user?.email
          });
          
          // Logout do usuário de teste
          await supabase.auth.signOut();
        }
        
        await loadAllUsers();
      } else {
        addResult('❌ Erro ao criar', 'error', data.error || 'Erro desconhecido', data);
      }
    } catch (err: any) {
      addResult('❌ ERRO', 'error', err.message, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="p-8 mb-6">
          <h1 className="text-3xl font-bold mb-2">👥 Gerenciamento de Usuários</h1>
          <p className="text-gray-600 mb-6">
            Ferramenta completa para gerenciar usuários no Supabase
          </p>

          {/* Current User */}
          {currentUser && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>👤 Usuário Atual:</strong> {currentUser.email}
                    <div className="text-sm mt-1">ID: {currentUser.id}</div>
                  </div>
                  <Button 
                    onClick={deleteCurrentUser} 
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir MEU Usuário
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Create User Form */}
          <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Criar Novo Usuário
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label>Nome</Label>
                <Input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nome Completo"
                />
              </div>
              <div>
                <Label>Senha</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <Label>Role</Label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                  <option value="accountant">Accountant</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
            <Button onClick={createUser} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
              Criar Usuário no Supabase
            </Button>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 gap-4">
            <Button onClick={loadAllUsers} disabled={loading} variant="outline" className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Users className="w-4 h-4 mr-2" />}
              Listar Todos os Usuários
            </Button>
          </div>
        </Card>

        {/* Users List */}
        {allUsers.length > 0 && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">📋 Usuários no Supabase ({allUsers.length})</h2>
            <div className="space-y-2">
              {allUsers.map((user) => (
                <div key={user.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Role: {user.role} • ID: {user.userId?.substring(0, 8)}...
                    </div>
                  </div>
                  <Button
                    onClick={() => deleteUser(user.userId, user.email)}
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Results */}
        {results.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">📊 Resultados</h2>
            <div className="space-y-4">
              {results.map((result, index) => (
                <Alert 
                  key={index} 
                  className={`${
                    result.status === 'success' ? 'bg-green-50 border-green-200' :
                    result.status === 'error' ? 'bg-red-50 border-red-200' :
                    'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {result.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : result.status === 'error' ? (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <AlertDescription className={
                        result.status === 'success' ? 'text-green-800' :
                        result.status === 'error' ? 'text-red-800' :
                        'text-yellow-800'
                      }>
                        <div className="font-semibold">{result.title}</div>
                        <div className="mt-1">{result.message}</div>
                        {result.details && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm underline">Ver detalhes</summary>
                            <pre className="mt-2 p-2 bg-black/5 rounded text-xs overflow-auto max-h-60">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-6 mt-6 bg-purple-50 border-purple-200">
          <h3 className="font-bold text-purple-900 mb-3">📖 Como usar:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-purple-800">
            <li><strong>Excluir seu usuário:</strong> Clique no botão "Excluir MEU Usuário" no topo</li>
            <li><strong>Criar novo usuário:</strong> Preencha o formulário verde e clique em "Criar Usuário no Supabase"</li>
            <li><strong>Ver todos os usuários:</strong> Clique em "Listar Todos os Usuários"</li>
            <li><strong>Excluir outros usuários:</strong> Na lista, clique no ícone da lixeira ao lado do usuário</li>
          </ol>
          
          <Alert className="mt-4 bg-yellow-50 border-yellow-300">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription className="ml-2">
              <strong>⚠️ ATENÇÃO:</strong> Todas as exclusões são PERMANENTES e não podem ser desfeitas!
            </AlertDescription>
          </Alert>
        </Card>
      </div>
    </div>
  );
}
