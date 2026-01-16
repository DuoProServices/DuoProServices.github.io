import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

interface Step {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'success' | 'error' | 'warning';
  message: string;
  details?: any;
  timestamp?: Date;
}

export default function SignupDebugger() {
  const [email, setEmail] = useState('test' + Math.random().toString(36).substring(7) + '@example.com');
  const [password, setPassword] = useState('test123456');
  const [name, setName] = useState('Test User ' + Math.random().toString(36).substring(7));
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);

  const addStep = (id: string, title: string, status: Step['status'], message: string, details?: any) => {
    setSteps(prev => {
      const existing = prev.find(s => s.id === id);
      if (existing) {
        return prev.map(s => s.id === id ? { ...s, status, message, details, timestamp: new Date() } : s);
      }
      return [...prev, { id, title, status, message, details, timestamp: new Date() }];
    });
  };

  const resetTest = () => {
    setSteps([]);
    setCreatedUserId(null);
    setEmail('test' + Math.random().toString(36).substring(7) + '@example.com');
    setName('Test User ' + Math.random().toString(36).substring(7));
  };

  const deleteTestUser = async () => {
    if (!createdUserId) return;
    
    try {
      addStep('cleanup', '🧹 Limpeza', 'running', 'Deletando usuário de teste...');
      
      // Logout first
      await supabase.auth.signOut();
      
      addStep('cleanup', '🧹 Limpeza', 'success', 'Usuário de teste deslogado. IMPORTANTE: Você precisa deletar o usuário manualmente no Supabase Dashboard → Authentication → Users');
      
    } catch (err: any) {
      addStep('cleanup', '🧹 Limpeza', 'warning', 'Erro ao limpar: ' + err.message);
    }
  };

  const testCompleteSignup = async () => {
    setLoading(true);
    setSteps([]);
    setCreatedUserId(null);

    try {
      // Step 1: Verify inputs
      addStep('input', '📝 Validação de Entrada', 'running', 'Verificando dados...');
      
      if (!email || !password || !name) {
        addStep('input', '📝 Validação de Entrada', 'error', 'Todos os campos são obrigatórios');
        setLoading(false);
        return;
      }
      
      if (password.length < 6) {
        addStep('input', '📝 Validação de Entrada', 'error', 'Senha deve ter no mínimo 6 caracteres');
        setLoading(false);
        return;
      }
      
      addStep('input', '📝 Validação de Entrada', 'success', 
        `✅ Dados válidos:\n• Email: ${email}\n• Nome: ${name}\n• Senha: ${password.length} caracteres`
      );

      // Step 2: Call Supabase signUp
      addStep('signup', '🔐 Supabase Auth SignUp', 'running', 'Chamando supabase.auth.signUp()...');
      
      const signupStartTime = Date.now();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          },
          emailRedirectTo: `${window.location.origin}/onboarding`
        }
      });
      const signupDuration = Date.now() - signupStartTime;

      if (error) {
        addStep('signup', '🔐 Supabase Auth SignUp', 'error', 
          `❌ Erro do Supabase: ${error.message}`,
          { error: error, duration: `${signupDuration}ms` }
        );
        setLoading(false);
        return;
      }

      addStep('signup', '🔐 Supabase Auth SignUp', 'success', 
        `✅ Chamada bem-sucedida (${signupDuration}ms)`,
        { 
          user_exists: !!data.user,
          session_exists: !!data.session,
          duration: `${signupDuration}ms`
        }
      );

      // Step 3: Check user
      addStep('user', '👤 Verificar Usuário', 'running', 'Verificando se usuário foi criado...');
      
      if (!data.user) {
        addStep('user', '👤 Verificar Usuário', 'error', 
          '❌ ERRO CRÍTICO: data.user é null/undefined',
          { full_response: data }
        );
        setLoading(false);
        return;
      }

      setCreatedUserId(data.user.id);

      addStep('user', '👤 Verificar Usuário', 'success', 
        `✅ Usuário criado com sucesso!\n• ID: ${data.user.id}\n• Email: ${data.user.email}\n• Email Confirmado: ${data.user.email_confirmed_at ? 'SIM' : 'NÃO'}`,
        {
          id: data.user.id,
          email: data.user.email,
          email_confirmed_at: data.user.email_confirmed_at,
          confirmed_at: data.user.confirmed_at,
          user_metadata: data.user.user_metadata,
          created_at: data.user.created_at
        }
      );

      // Step 4: Check session
      addStep('session', '🎫 Verificar Sessão', 'running', 'Verificando se sessão foi criada...');
      
      if (!data.session) {
        addStep('session', '🎫 Verificar Sessão', 'error', 
          `❌ PROBLEMA: Sessão não foi criada!\n\n` +
          `Isso significa que o Supabase está exigindo confirmação de email.\n\n` +
          `SOLUÇÃO:\n` +
          `1. Vá para: Supabase Dashboard\n` +
          `2. Authentication → Providers → Email\n` +
          `3. Desmarque "Confirm email"\n` +
          `4. Salve as configurações\n` +
          `5. Tente novamente`,
          {
            user_created: true,
            session_created: false,
            email_confirmed_at: data.user.email_confirmed_at
          }
        );
        setLoading(false);
        return;
      }

      addStep('session', '🎫 Verificar Sessão', 'success', 
        `✅ Sessão criada! Usuário pode fazer login imediatamente.\n• Access Token: ${data.session.access_token.substring(0, 30)}...\n• Expira em: ${data.session.expires_at}`,
        {
          user_id: data.session.user.id,
          expires_at: data.session.expires_at,
          token_type: data.session.token_type
        }
      );

      // Step 5: Create profile in KV Store
      addStep('kv_profile', '💾 KV Store - Profile', 'running', 'Salvando profile no KV Store...');
      
      try {
        const profilePayload = {
          userId: data.user.id,
          email: data.user.email!,
          name: name,
          phone: '',
          onboardingCompleted: false,
          createdAt: new Date().toISOString()
        };

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
              value: profilePayload
            })
          }
        );
        
        if (!profileRes.ok) {
          const errorData = await profileRes.json().catch(() => ({ error: 'Unknown error' }));
          addStep('kv_profile', '💾 KV Store - Profile', 'error', 
            `❌ Erro ao salvar profile: ${JSON.stringify(errorData)}`,
            { 
              status: profileRes.status,
              payload: profilePayload,
              error: errorData
            }
          );
        } else {
          addStep('kv_profile', '💾 KV Store - Profile', 'success', 
            `✅ Profile salvo com sucesso!\n• Key: profile:${data.user.id}`,
            { payload: profilePayload }
          );
        }
      } catch (kvError: any) {
        addStep('kv_profile', '💾 KV Store - Profile', 'error', 
          `❌ Exceção ao salvar profile: ${kvError.message}`,
          { error: kvError }
        );
      }

      // Step 6: Create permissions in KV Store
      addStep('kv_permissions', '🔐 KV Store - Permissions', 'running', 'Salvando permissions no KV Store...');
      
      try {
        const permissionsPayload = {
          userId: data.user.id,
          email: data.user.email!,
          name: name,
          role: 'client',
          modules: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

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
              value: permissionsPayload
            })
          }
        );
        
        if (!permissionsRes.ok) {
          const errorData = await permissionsRes.json().catch(() => ({ error: 'Unknown error' }));
          addStep('kv_permissions', '🔐 KV Store - Permissions', 'error', 
            `❌ Erro ao salvar permissions: ${JSON.stringify(errorData)}`,
            { 
              status: permissionsRes.status,
              payload: permissionsPayload,
              error: errorData
            }
          );
        } else {
          addStep('kv_permissions', '🔐 KV Store - Permissions', 'success', 
            `✅ Permissions salvas com sucesso!\n• Key: user-permissions:${data.user.id}\n• Role: client`,
            { payload: permissionsPayload }
          );
        }
      } catch (kvError: any) {
        addStep('kv_permissions', '🔐 KV Store - Permissions', 'error', 
          `❌ Exceção ao salvar permissions: ${kvError.message}`,
          { error: kvError }
        );
      }

      // Step 7: Verify data was saved
      addStep('verify', '✅ Verificação Final', 'running', 'Verificando se dados foram salvos corretamente...');
      
      try {
        // Check profile
        const profileCheckRes = await fetch(
          `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-c2a25be0/kv/get?key=profile:${data.user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${data.session.access_token}`
            }
          }
        );
        
        const profileData = await profileCheckRes.json();
        
        // Check permissions
        const permissionsCheckRes = await fetch(
          `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-c2a25be0/kv/get?key=user-permissions:${data.user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${data.session.access_token}`
            }
          }
        );
        
        const permissionsData = await permissionsCheckRes.json();

        const profileExists = profileData && profileData.value;
        const permissionsExist = permissionsData && permissionsData.value;

        if (profileExists && permissionsExist) {
          addStep('verify', '✅ Verificação Final', 'success', 
            `🎉 SIGNUP COMPLETO COM SUCESSO!\n\n` +
            `✅ Usuário criado no Supabase Auth\n` +
            `✅ Sessão ativa (pode fazer login)\n` +
            `✅ Profile salvo no KV Store\n` +
            `✅ Permissions salvas no KV Store\n\n` +
            `O usuário ${name} (${email}) foi criado com sucesso!`,
            {
              profile: profileData.value,
              permissions: permissionsData.value
            }
          );
        } else {
          addStep('verify', '✅ Verificação Final', 'warning', 
            `⚠️ Usuário criado mas alguns dados não foram encontrados:\n` +
            `• Profile: ${profileExists ? '✅' : '❌'}\n` +
            `• Permissions: ${permissionsExist ? '✅' : '❌'}`,
            {
              profile_found: profileExists,
              permissions_found: permissionsExist,
              profile_data: profileData,
              permissions_data: permissionsData
            }
          );
        }
      } catch (verifyError: any) {
        addStep('verify', '✅ Verificação Final', 'warning', 
          `⚠️ Não foi possível verificar os dados: ${verifyError.message}`
        );
      }

      // Step 8: Success summary
      addStep('summary', '📊 Resumo', 'success', 
        `✨ TESTE COMPLETO!\n\n` +
        `🎯 Próximos passos:\n` +
        `1. Verifique o Supabase Dashboard para confirmar\n` +
        `2. Teste fazer login com: ${email}\n` +
        `3. Se tudo funcionou, o signup público está OK!\n` +
        `4. Limpe este usuário de teste depois`
      );

    } catch (err: any) {
      addStep('error', '❌ Erro Geral', 'error', 
        `Exceção não tratada: ${err.message}`,
        { error: err, stack: err.stack }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Card className="p-8 mb-6 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mb-4">
              <span className="text-4xl">🔬</span>
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Signup Debugger Pro
            </h1>
            <p className="text-gray-600 text-lg">
              Diagnóstico completo e detalhado do fluxo de signup
            </p>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label>Nome</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do usuário"
                disabled={loading}
              />
            </div>
            <div>
              <Label>Email (auto-gerado)</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                disabled={loading}
              />
            </div>
            <div>
              <Label>Senha</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              onClick={testCompleteSignup} 
              disabled={loading} 
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Testando...
                </>
              ) : (
                <>
                  🚀 Testar Signup Completo
                </>
              )}
            </Button>
            <Button 
              onClick={resetTest} 
              disabled={loading} 
              variant="outline"
              size="lg"
            >
              🔄 Resetar
            </Button>
            {createdUserId && (
              <Button 
                onClick={deleteTestUser} 
                disabled={loading} 
                variant="destructive"
                size="lg"
              >
                🗑️ Limpar
              </Button>
            )}
          </div>
        </Card>

        {/* Steps */}
        {steps.length > 0 && (
          <div className="space-y-4">
            {steps.map((step, index) => (
              <Card 
                key={step.id} 
                className={`p-6 shadow-lg transition-all duration-300 ${
                  step.status === 'success' ? 'bg-green-50 border-green-200' :
                  step.status === 'error' ? 'bg-red-50 border-red-200' :
                  step.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  step.status === 'running' ? 'bg-blue-50 border-blue-200 animate-pulse' :
                  'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm">
                    {step.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : step.status === 'error' ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : step.status === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    ) : step.status === 'running' ? (
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : (
                      <span className="text-gray-400">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-bold text-lg ${
                        step.status === 'success' ? 'text-green-800' :
                        step.status === 'error' ? 'text-red-800' :
                        step.status === 'warning' ? 'text-yellow-800' :
                        step.status === 'running' ? 'text-blue-800' :
                        'text-gray-800'
                      }`}>
                        {step.title}
                      </h3>
                      {step.timestamp && (
                        <span className="text-xs text-gray-500">
                          {step.timestamp.toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                    <div className={`whitespace-pre-wrap text-sm ${
                      step.status === 'success' ? 'text-green-700' :
                      step.status === 'error' ? 'text-red-700' :
                      step.status === 'warning' ? 'text-yellow-700' :
                      step.status === 'running' ? 'text-blue-700' :
                      'text-gray-700'
                    }`}>
                      {step.message}
                    </div>
                    {step.details && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-xs font-semibold underline opacity-70 hover:opacity-100">
                          📋 Ver detalhes técnicos
                        </summary>
                        <pre className="mt-2 p-4 bg-black/5 rounded-lg text-xs overflow-auto max-h-96 font-mono">
                          {JSON.stringify(step.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Info */}
        {steps.length === 0 && (
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3 text-lg">💡 Como usar:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Clique em <strong>"Testar Signup Completo"</strong> para iniciar</li>
              <li>Aguarde enquanto cada etapa é executada e monitorada</li>
              <li>Veja logs detalhados de cada passo do processo</li>
              <li>Identifique exatamente onde está o problema (se houver)</li>
              <li>Use as sugestões de correção fornecidas</li>
              <li>Depois do teste, delete o usuário de teste no Supabase Dashboard</li>
            </ol>
          </Card>
        )}
      </div>
    </div>
  );
}
