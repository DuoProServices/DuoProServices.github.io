import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Loader2, Trash2, Search, AlertTriangle } from 'lucide-react';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

export default function DeleteUserByEmail() {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [adminToken, setAdminToken] = useState('');

  const loginAsAdmin = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/auth/v1/token?grant_type=password`,
        {
          method: 'POST',
          headers: {
            'apikey': publicAnonKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: adminEmail,
            password: adminPassword
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.access_token) {
        setAdminToken(data.access_token);
        setResult({
          status: 'success',
          message: '✅ Login admin realizado com sucesso!',
          data
        });
      } else {
        setResult({
          status: 'error',
          message: '❌ Erro ao fazer login admin',
          data
        });
      }
    } catch (err: any) {
      setResult({
        status: 'error',
        message: '❌ Erro: ' + err.message,
        data: err
      });
    } finally {
      setLoading(false);
    }
  };

  const searchAndDeleteUser = async () => {
    if (!adminToken) {
      setResult({
        status: 'error',
        message: '❌ Você precisa fazer login como admin primeiro!',
        data: null
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Search for user by email
      setResult({
        status: 'info',
        message: '🔍 Buscando usuário com email: ' + targetEmail,
        data: null
      });

      const listResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/users/list`,
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const users = await listResponse.json();

      if (!listResponse.ok) {
        setResult({
          status: 'error',
          message: '❌ Erro ao listar usuários',
          data: users
        });
        setLoading(false);
        return;
      }

      // Find user with matching email
      const targetUser = Array.isArray(users) 
        ? users.find((u: any) => u.email?.toLowerCase() === targetEmail.toLowerCase())
        : null;

      if (!targetUser) {
        setResult({
          status: 'error',
          message: '⚠️ Usuário não encontrado com email: ' + targetEmail,
          data: { availableUsers: users }
        });
        setLoading(false);
        return;
      }

      setResult({
        status: 'info',
        message: `✅ Usuário encontrado! ID: ${targetUser.userId}\n🗑️ Deletando...`,
        data: targetUser
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Delete user
      const deleteResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/users/${targetUser.userId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const deleteResult = await deleteResponse.json();

      if (deleteResponse.ok) {
        setResult({
          status: 'success',
          message: `✅ USUÁRIO DELETADO COM SUCESSO!\n\nEmail: ${targetEmail}\nID: ${targetUser.userId}\n\nAgora você pode criar um novo usuário com esse email.`,
          data: deleteResult
        });
      } else {
        setResult({
          status: 'error',
          message: '❌ Erro ao deletar usuário',
          data: deleteResult
        });
      }
    } catch (err: any) {
      setResult({
        status: 'error',
        message: '❌ Erro: ' + err.message,
        data: err
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Admin Login */}
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">🔐 Login Admin</h1>
          <p className="text-sm text-gray-600 mb-4">
            Faça login com uma conta admin para deletar usuários
          </p>

          <div className="space-y-4">
            <div>
              <Label>Email Admin</Label>
              <Input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="germana.canada@gmail.com"
              />
            </div>
            <div>
              <Label>Senha Admin</Label>
              <Input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button 
              onClick={loginAsAdmin} 
              disabled={loading || !adminEmail || !adminPassword}
              className="w-full"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Login como Admin
            </Button>
          </div>

          {adminToken && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                ✅ Você está logado como admin!
              </AlertDescription>
            </Alert>
          )}
        </Card>

        {/* Delete User */}
        {adminToken && (
          <Card className="p-6 bg-red-50 border-red-200">
            <h2 className="text-xl font-bold mb-4 text-red-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Deletar Usuário por Email
            </h2>
            <Alert className="mb-4 bg-yellow-50 border-yellow-300">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription className="ml-2">
                ⚠️ <strong>ATENÇÃO:</strong> Esta ação é PERMANENTE e não pode ser desfeita!
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label>Email do Usuário a Deletar</Label>
                <Input
                  type="email"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  placeholder="usuario@example.com"
                />
              </div>
              <Button 
                onClick={searchAndDeleteUser} 
                disabled={loading || !targetEmail}
                variant="destructive"
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Buscar e Deletar Usuário
              </Button>
            </div>
          </Card>
        )}

        {/* Result */}
        {result && (
          <Card className={`p-6 ${
            result.status === 'success' ? 'bg-green-50 border-green-200' :
            result.status === 'error' ? 'bg-red-50 border-red-200' :
            'bg-blue-50 border-blue-200'
          }`}>
            <h3 className="font-bold mb-2">Resultado:</h3>
            <pre className="whitespace-pre-wrap text-sm mb-4">{result.message}</pre>
            {result.data && (
              <details>
                <summary className="cursor-pointer text-sm underline">Ver dados completos</summary>
                <pre className="mt-2 p-4 bg-black/5 rounded text-xs overflow-auto max-h-60">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-6 bg-purple-50 border-purple-200">
          <h3 className="font-bold text-purple-900 mb-3">📖 Como usar:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-purple-800">
            <li>Faça login com uma conta <strong>admin</strong> (germana.canada@gmail.com ou jamila.coura15@gmail.com)</li>
            <li>Digite o <strong>email</strong> do usuário que deseja deletar</li>
            <li>Clique em "Buscar e Deletar Usuário"</li>
            <li>O sistema vai buscar o usuário e deletar automaticamente</li>
            <li>Depois você pode criar um novo usuário com esse email</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
