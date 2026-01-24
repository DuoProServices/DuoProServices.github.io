import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2, UserPlus } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router';

export default function CreateFirstAdmin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('veprass@gmail.com');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('Admin User');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const addResult = (title: string, status: 'success' | 'error' | 'warning', message: string, details?: any) => {
    setResults(prev => [...prev, { title, status, message, details, timestamp: new Date() }]);
  };

  const createFirstAdmin = async () => {
    if (!email || !password || password.length < 6) {
      addResult('❌ Validação', 'error', 'Email e senha (mínimo 6 caracteres) são obrigatórios');
      return;
    }

    setLoading(true);
    setResults([]);
    
    addResult('🚀 Iniciando criação do primeiro admin', 'warning', `Email: ${email}`);

    try {
      // Step 1: Create user with Supabase Auth
      addResult('📝 STEP 1: Criando usuário no Supabase Auth', 'warning', 'Aguarde...');
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          },
          emailRedirectTo: `${window.location.origin}/admin`
        }
      });

      if (error) {
        addResult('❌ ERRO no signup', 'error', error.message, error);
        setLoading(false);
        return;
      }

      if (!data.user) {
        addResult('❌ ERRO: Nenhum usuário criado', 'error', 'data.user é null/undefined', data);
        setLoading(false);
        return;
      }

      addResult('✅ Usuário criado no Supabase Auth', 'success', `ID: ${data.user.id}`, {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at
      });

      if (!data.session) {
        addResult('❌ PROBLEMA: Sessão não criada', 'error', 
          'O Supabase criou o usuário mas não criou a sessão. A confirmação de email pode estar ativada.', 
          {
            user_id: data.user.id,
            email: data.user.email,
            email_confirmed_at: data.user.email_confirmed_at,
            sugestao: 'Verifique Supabase → Authentication → Providers → Email → "Confirm email" está DESMARCADO'
          }
        );
        setLoading(false);
        return;
      }

      addResult('✅ Sessão criada com sucesso!', 'success', 'Usuário pode fazer login imediatamente');

      // Step 2: Create profile in KV store
      addResult('📝 STEP 2: Criando profile no KV Store', 'warning', 'Salvando dados do perfil...');
      
      try {
        const profileRes = await fetch(
          `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-c2a25be0/kv/set`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.session.access_token}`
            },
            body: JSON.stringify({
              key: `profile:${data.user.id}`,
              value: {
                userId: data.user.id,
                email: data.user.email!,
                name: name,
                phone: '',
                onboardingCompleted: false,
                createdAt: new Date().toISOString()
              }
            })
          }
        );
        
        if (!profileRes.ok) {
          const errorData = await profileRes.json();
          addResult('❌ Erro ao criar profile', 'error', 'Falha ao salvar no KV Store', errorData);
        } else {
          addResult('✅ Profile criado no KV Store', 'success', 'Dados do perfil salvos com sucesso');
        }
      } catch (kvError: any) {
        addResult('⚠️ Erro no KV Store (profile)', 'warning', kvError.message, kvError);
      }

      // Step 3: Create permissions (ADMIN role)
      addResult('📝 STEP 3: Criando permissions (ADMIN)', 'warning', 'Definindo permissões de administrador...');
      
      try {
        const permissionsRes = await fetch(
          `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-c2a25be0/kv/set`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.session.access_token}`
            },
            body: JSON.stringify({
              key: `user-permissions:${data.user.id}`,
              value: {
                userId: data.user.id,
                email: data.user.email!,
                name: name,
                role: 'admin',
                modules: ['clients', 'invoices', 'reports', 'users', 'settings'],
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            })
          }
        );
        
        if (!permissionsRes.ok) {
          const errorData = await permissionsRes.json();
          addResult('❌ Erro ao criar permissions', 'error', 'Falha ao salvar permissões', errorData);
        } else {
          addResult('✅ Permissions criadas (ADMIN)', 'success', 'Permissões de administrador configuradas');
        }
      } catch (kvError: any) {
        addResult('⚠️ Erro no KV Store (permissions)', 'warning', kvError.message, kvError);
      }

      // Step 4: Success
      addResult('🎉 ADMIN CRIADO COM SUCESSO!', 'success', 
        `O primeiro administrador foi criado!\n\nEmail: ${email}\nRole: admin\n\nVocê já está logado e será redirecionado para o painel admin em 3 segundos...`
      );

      // Redirect to admin after 3 seconds
      setTimeout(() => {
        navigate('/admin');
      }, 3000);

    } catch (err: any) {
      addResult('❌ EXCEÇÃO', 'error', err.message, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 mb-6 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">👑 Criar Primeiro Admin</h1>
            <p className="text-gray-600">
              Configure o primeiro administrador do sistema
            </p>
          </div>

          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription className="ml-2">
              <strong>⚠️ Primeira Configuração:</strong> Esta página cria o primeiro administrador do sistema. Após a criação, use a página de login normal.
            </AlertDescription>
          </Alert>

          {/* Form */}
          <div className="space-y-4 mb-6">
            <div>
              <Label>Nome Completo</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                disabled={loading}
              />
            </div>
            <div>
              <Label>Email (será o login)</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>
            <div>
              <Label>Senha (mínimo 6 caracteres)</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>

          <Button 
            onClick={createFirstAdmin} 
            disabled={loading || !email || !password || password.length < 6} 
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Criando Admin...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Criar Primeiro Administrador
              </>
            )}
          </Button>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <Card className="p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">📊 Progresso</h2>
            <div className="space-y-3">
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
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : result.status === 'error' ? (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <AlertDescription className={
                        result.status === 'success' ? 'text-green-800' :
                        result.status === 'error' ? 'text-red-800' :
                        'text-yellow-800'
                      }>
                        <div className="font-semibold mb-1">{result.title}</div>
                        <div className="whitespace-pre-wrap text-sm">{result.message}</div>
                        {result.details && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-xs underline">Ver detalhes</summary>
                            <pre className="mt-2 p-2 bg-black/5 rounded text-xs overflow-auto max-h-40">
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

        {/* Info */}
        <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold text-blue-900 mb-3">ℹ️ Informações:</h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-blue-800">
            <li>Esta ferramenta cria o <strong>primeiro administrador</strong> do sistema</li>
            <li>O usuário será criado com <strong>role: admin</strong> e todos os módulos</li>
            <li>Após a criação, você será <strong>automaticamente logado</strong></li>
            <li>Use a página <strong>/login</strong> para logins futuros</li>
            <li>Você poderá criar outros admins depois através do painel admin</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
