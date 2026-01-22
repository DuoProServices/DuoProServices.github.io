import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

export default function AuthDebugPage() {
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testPassword, setTestPassword] = useState('test123456');
  const [testName, setTestName] = useState('Test User');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [authSettings, setAuthSettings] = useState<any>(null);

  useEffect(() => {
    checkAuthSettings();
  }, []);

  const addResult = (title: string, status: 'success' | 'error' | 'warning', message: string, details?: any) => {
    setResults(prev => [...prev, { title, status, message, details, timestamp: new Date() }]);
  };

  const checkAuthSettings = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      setAuthSettings({
        hasSession: !!data.session,
        user: data.session?.user,
        error: error
      });
    } catch (err) {
      console.error('Error checking auth settings:', err);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    setResults([]);
    addResult('🔄 Iniciando teste de SIGNUP', 'warning', 'Tentando criar nova conta...');

    try {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            name: testName
          }
        }
      });

      if (error) {
        addResult('❌ SIGNUP FALHOU', 'error', error.message, error);
        return;
      }

      if (data.user && data.session) {
        addResult('✅ SIGNUP OK - Auto-confirmado', 'success', 'Usuário criado e sessão ativa!', {
          userId: data.user.id,
          email: data.user.email,
          emailConfirmed: data.user.email_confirmed_at,
          hasSession: true
        });
      } else if (data.user && !data.session) {
        addResult('⚠️ SIGNUP OK mas SEM SESSÃO', 'warning', 'Usuário criado mas precisa confirmar email!', {
          userId: data.user.id,
          email: data.user.email,
          emailConfirmed: data.user.email_confirmed_at,
          hasSession: false,
          needsConfirmation: true
        });
      }
    } catch (err: any) {
      addResult('❌ ERRO no signup', 'error', err.message, err);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResults([]);
    addResult('🔄 Iniciando teste de LOGIN', 'warning', 'Tentando fazer login...');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          addResult('❌ LOGIN FALHOU - Credenciais inválidas', 'error', 
            'Possíveis causas: 1) Email não confirmado, 2) Senha errada, 3) Usuário não existe', 
            error
          );
        } else if (error.message.includes('Email not confirmed')) {
          addResult('❌ LOGIN FALHOU - Email não confirmado', 'error', 
            'O usuário existe mas precisa confirmar o email!', 
            error
          );
        } else {
          addResult('❌ LOGIN FALHOU', 'error', error.message, error);
        }
        return;
      }

      if (data.user && data.session) {
        addResult('✅ LOGIN OK!', 'success', 'Login realizado com sucesso!', {
          userId: data.user.id,
          email: data.user.email,
          emailConfirmed: data.user.email_confirmed_at,
          sessionExpires: data.session.expires_at
        });
      }
    } catch (err: any) {
      addResult('❌ ERRO no login', 'error', err.message, err);
    } finally {
      setLoading(false);
    }
  };

  const testFullFlow = async () => {
    setLoading(true);
    setResults([]);
    
    addResult('🚀 TESTE COMPLETO INICIADO', 'warning', 'Testando signup + login...');

    // Step 1: Signup
    try {
      const signupResult = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: { name: testName }
        }
      });

      if (signupResult.error) {
        if (signupResult.error.message.includes('already registered')) {
          addResult('⚠️ Usuário já existe', 'warning', 'Pulando para teste de login...', signupResult.error);
        } else {
          addResult('❌ SIGNUP FALHOU', 'error', signupResult.error.message, signupResult.error);
          setLoading(false);
          return;
        }
      } else {
        if (signupResult.data.user && signupResult.data.session) {
          addResult('✅ SIGNUP OK - Auto-confirmado', 'success', 'Continuando...', {
            userId: signupResult.data.user.id,
            hasSession: true
          });
        } else if (signupResult.data.user && !signupResult.data.session) {
          addResult('⚠️ SIGNUP OK mas precisa confirmar email', 'warning', 'Email de confirmação necessário!', {
            userId: signupResult.data.user.id,
            hasSession: false
          });
        }
      }

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Logout if logged in
      await supabase.auth.signOut();
      addResult('🔓 Logout feito', 'warning', 'Testando login agora...');

      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Login
      const loginResult = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      if (loginResult.error) {
        addResult('❌ LOGIN FALHOU após signup', 'error', loginResult.error.message, loginResult.error);
        
        // Diagnóstico
        if (loginResult.error.message.includes('Invalid login credentials')) {
          addResult('🔍 DIAGNÓSTICO', 'warning', 
            'PROBLEMA: Confirmação de email está ATIVADA no Supabase. ' +
            'Solução: Vá em Supabase Dashboard → Authentication → Providers → Email → Desative "Confirm email"'
          );
        }
      } else {
        addResult('✅ LOGIN OK após signup!', 'success', 'Tudo funcionando perfeitamente!', {
          userId: loginResult.data.user?.id,
          email: loginResult.data.user?.email
        });
      }

    } catch (err: any) {
      addResult('❌ ERRO no teste completo', 'error', err.message, err);
    } finally {
      setLoading(false);
    }
  };

  const listAllUsers = async () => {
    setLoading(true);
    setResults([]);
    addResult('🔄 Listando usuários...', 'warning', 'Consultando Supabase Auth...');

    try {
      // Get current session token
      const { data: sessionData } = await supabase.auth.getSession();
      
      const headers: any = {
        'Content-Type': 'application/json'
      };

      if (sessionData.session) {
        headers['Authorization'] = `Bearer ${sessionData.session.access_token}`;
      } else {
        headers['Authorization'] = `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`;
      }

      const response = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-c2a25be0/users/list`,
        { headers }
      );

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        addResult('✅ Usuários encontrados', 'success', `Total: ${data.length}`, data);
      } else {
        addResult('❌ Erro ao listar', 'error', 'Você precisa estar logado como admin', data);
      }
    } catch (err: any) {
      addResult('❌ ERRO', 'error', err.message, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 mb-6">
          <h1 className="text-3xl font-bold mb-2">🔧 Auth Debug Tool</h1>
          <p className="text-gray-600 mb-6">
            Ferramenta de diagnóstico para identificar problemas de autenticação
          </p>

          {/* Quick Link to User Management */}
          <Alert className="mb-6 bg-purple-50 border-purple-200">
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>👥 Gerenciamento Completo de Usuários</strong>
                  <div className="text-sm mt-1">Criar, excluir e listar usuários do Supabase</div>
                </div>
                <Button 
                  onClick={() => window.location.href = '/user-management-debug'}
                  variant="outline"
                  size="sm"
                  className="bg-purple-100 hover:bg-purple-200"
                >
                  Ir para Gerenciamento →
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          {/* Current Session */}
          {authSettings && (
            <Alert className={`mb-6 ${authSettings.hasSession ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <AlertDescription>
                <strong>Sessão Atual:</strong> {authSettings.hasSession ? '✅ Logado' : '❌ Não logado'}
                {authSettings.user && (
                  <div className="mt-2 text-sm">
                    <div>Email: {authSettings.user.email}</div>
                    <div>ID: {authSettings.user.id}</div>
                    <div>Email confirmado: {authSettings.user.email_confirmed_at ? '✅ Sim' : '❌ Não'}</div>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Test Credentials */}
          <div className="space-y-4 mb-6">
            <div>
              <Label>Email de Teste</Label>
              <Input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <Label>Senha de Teste</Label>
              <Input
                type="password"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <Label>Nome</Label>
              <Input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Test User"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={testSignup} disabled={loading} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '1. Testar Signup'}
            </Button>
            <Button onClick={testLogin} disabled={loading} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '2. Testar Login'}
            </Button>
            <Button onClick={testFullFlow} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '🚀 Teste Completo'}
            </Button>
            <Button onClick={listAllUsers} disabled={loading} variant="outline" className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '📋 Listar Usuários'}
            </Button>
          </div>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">📊 Resultados dos Testes</h2>
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
                            <pre className="mt-2 p-2 bg-black/5 rounded text-xs overflow-auto">
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
          <h3 className="font-bold text-blue-900 mb-3">📖 Como usar:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Preencha os campos com um email e senha de teste</li>
            <li>Clique em "🚀 Teste Completo" para fazer um teste completo de signup + login</li>
            <li>Veja os resultados abaixo para identificar o problema</li>
            <li>Se aparecer "DIAGNÓSTICO" em amarelo, siga as instruções</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}