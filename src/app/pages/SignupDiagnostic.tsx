import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

export default function SignupDiagnostic() {
  const [email, setEmail] = useState('test' + Math.random().toString(36).substring(7) + '@example.com');
  const [password, setPassword] = useState('test123456');
  const [name, setName] = useState('Test User');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const addResult = (title: string, status: 'success' | 'error' | 'warning', message: string, details?: any) => {
    setResults(prev => [...prev, { title, status, message, details, timestamp: new Date() }]);
  };

  const testSignup = async () => {
    setLoading(true);
    setResults([]);
    
    addResult('🚀 Iniciando teste de signup', 'warning', `Email: ${email}`);

    try {
      // Step 1: Test Supabase signup
      addResult('📝 STEP 1: Chamando supabase.auth.signUp()', 'warning', 'Aguarde...');
      
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

      if (error) {
        addResult('❌ ERRO no signup', 'error', error.message, error);
        setLoading(false);
        return;
      }

      addResult('✅ Signup chamado com sucesso', 'success', 'Verificando resposta...', data);

      // Step 2: Check user
      if (!data.user) {
        addResult('❌ ERRO: Nenhum usuário criado', 'error', 'data.user é null/undefined', data);
        setLoading(false);
        return;
      }

      addResult('✅ Usuário criado', 'success', `ID: ${data.user.id}`, {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at,
        confirmed_at: data.user.confirmed_at,
        user_metadata: data.user.user_metadata
      });

      // Step 3: Check session
      if (!data.session) {
        addResult('❌ PROBLEMA CRÍTICO: Sessão NÃO foi criada!', 'error', 
          'O usuário foi criado MAS sem sessão. Isso indica que a confirmação de email está ATIVADA ou há outro bloqueio.', 
          {
            session: data.session,
            user: {
              id: data.user.id,
              email: data.user.email,
              email_confirmed_at: data.user.email_confirmed_at,
              confirmed_at: data.user.confirmed_at
            }
          }
        );

        // Check email confirmation status
        if (!data.user.email_confirmed_at && !data.user.confirmed_at) {
          addResult('🔍 DIAGNÓSTICO', 'warning', 
            'Email NÃO confirmado automaticamente. Configuração do Supabase pode estar errada.',
            {
              sugestao: 'Vá em Supabase Dashboard → Authentication → Settings → Email Auth',
              verificar: [
                '1. "Enable email confirmations" deve estar DESMARCADO',
                '2. "Secure email change" - verificar se está afetando',
                '3. "Double confirm email changes" - deve estar DESMARCADO'
              ]
            }
          );
        }

        setLoading(false);
        return;
      }

      addResult('✅ SESSÃO CRIADA!', 'success', 
        'Usuário tem sessão ativa! O signup funcionou corretamente.', 
        {
          access_token: data.session.access_token.substring(0, 20) + '...',
          refresh_token: data.session.refresh_token?.substring(0, 20) + '...',
          expires_at: data.session.expires_at,
          user_id: data.session.user.id
        }
      );

      // Step 4: Verify current session
      addResult('🔍 STEP 4: Verificando sessão atual...', 'warning', 'Consultando getSession()...');
      
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (sessionData.session) {
        addResult('✅ Sessão confirmada!', 'success', 
          'getSession() retornou sessão ativa', 
          {
            user_id: sessionData.session.user.id,
            email: sessionData.session.user.email
          }
        );
      } else {
        addResult('⚠️ Sessão não encontrada', 'warning', 
          'Mesmo após signup bem-sucedido, getSession() não retornou sessão'
        );
      }

      // Step 5: Try to delete the test user
      addResult('🧹 STEP 5: Limpando usuário de teste...', 'warning', 'Tentando deletar...');
      
      try {
        await supabase.auth.signOut();
        addResult('✅ Logout realizado', 'success', 'Usuário de teste foi deslogado');
      } catch (cleanupError) {
        addResult('⚠️ Erro no cleanup', 'warning', 'Não foi possível fazer logout do usuário de teste');
      }

    } catch (err: any) {
      addResult('❌ EXCEÇÃO', 'error', err.message, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 mb-6">
          <h1 className="text-3xl font-bold mb-2">🔬 Diagnóstico de Signup</h1>
          <p className="text-gray-600 mb-6">
            Teste detalhado do fluxo de signup para identificar problemas
          </p>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label>Nome</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do usuário"
              />
            </div>
            <div>
              <Label>Email (gerado automaticamente)</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label>Senha</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          <Button onClick={testSignup} disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Testar Signup Completo
          </Button>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">📊 Resultados ({results.length})</h2>
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
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : result.status === 'error' ? (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <AlertDescription className={
                        result.status === 'success' ? 'text-green-800' :
                        result.status === 'error' ? 'text-red-800' :
                        'text-yellow-800'
                      }>
                        <div className="font-semibold mb-1">{result.title}</div>
                        <div className="whitespace-pre-wrap">{result.message}</div>
                        {result.details && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm underline">Ver detalhes técnicos</summary>
                            <pre className="mt-2 p-3 bg-black/5 rounded text-xs overflow-auto max-h-96">
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
        <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
          <h3 className="font-bold text-blue-900 mb-3">📖 Como interpretar os resultados:</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <strong>✅ SUCESSO:</strong> Se você ver "SESSÃO CRIADA!", significa que:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>A confirmação de email está corretamente DESATIVADA</li>
                <li>O signup público deve funcionar normalmente</li>
              </ul>
            </div>
            <div>
              <strong>❌ ERRO "Sessão NÃO foi criada":</strong> Significa que:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>O Supabase está bloqueando o login imediato</li>
                <li>Pode haver configurações adicionais ativas</li>
                <li>Veja as sugestões de verificação nos detalhes</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Supabase Config Check */}
        <Card className="p-6 mt-6 bg-purple-50 border-purple-200">
          <h3 className="font-bold text-purple-900 mb-3">🔧 Checklist de Configuração do Supabase:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-purple-800">
            <li>
              <strong>Authentication → Providers → Email:</strong>
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>✅ "Enable Email provider" = ON</li>
                <li>✅ "Confirm email" = OFF (desmarcado)</li>
              </ul>
            </li>
            <li>
              <strong>Authentication → Settings:</strong>
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Verifique "Enable email confirmations" = OFF</li>
                <li>Verifique "Secure email change" (pode interferir)</li>
                <li>Verifique "Double confirm email changes" = OFF</li>
              </ul>
            </li>
            <li>
              <strong>Authentication → URL Configuration:</strong>
              <ul className="list-disc list-inside ml-6 mt-1">
                <li>Confirme que seu domínio está na lista de "Redirect URLs"</li>
              </ul>
            </li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
