import { useState } from 'react';

export default function FixOfflineMode() {
  const [step, setStep] = useState(0);
  const [testResults, setTestResults] = useState<string[]>([]);

  const projectId = "pwlacumydrxvshklvttp";
  const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3bGFjdW15ZHJ4dnNoa2x2dHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjM3MTQsImV4cCI6MjA4MTczOTcxNH0.uj1rVapx5bBzp6YVFbcOwxCDZftpLzjwfMJ4aCy_B_A";

  const clearAllCache = () => {
    setTestResults([]);
    setTestResults(prev => [...prev, '🧹 Limpando localStorage...']);
    
    const localKeys = Object.keys(localStorage);
    localStorage.clear();
    setTestResults(prev => [...prev, `✅ ${localKeys.length} items removidos do localStorage`]);
    
    const sessionKeys = Object.keys(sessionStorage);
    sessionStorage.clear();
    setTestResults(prev => [...prev, `✅ ${sessionKeys.length} items removidos do sessionStorage`]);
    
    setTestResults(prev => [...prev, '']);
    setTestResults(prev => [...prev, '✅ CACHE LIMPO!']);
    setTestResults(prev => [...prev, '']);
    setTestResults(prev => [...prev, '⚠️ IMPORTANTE: Recarregue a página agora (F5 ou Ctrl+R)']);
    
    setStep(1);
  };

  const testConnection = async () => {
    setTestResults([]);
    setTestResults(prev => [...prev, '🔍 Testando conexão com Supabase...']);
    setTestResults(prev => [...prev, '']);
    
    // Test Edge Function
    setTestResults(prev => [...prev, '1️⃣ Testando Edge Function (Backend)...']);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/health`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        setTestResults(prev => [...prev, '✅ Backend ONLINE! Edge Function está funcionando!']);
      } else {
        setTestResults(prev => [...prev, `❌ Backend OFFLINE! (Status: ${response.status})`]);
        setTestResults(prev => [...prev, '']);
        setTestResults(prev => [...prev, '⚠️ PROBLEMA ENCONTRADO:']);
        setTestResults(prev => [...prev, 'O Edge Function não foi deployed ou foi deletado.']);
        setTestResults(prev => [...prev, '']);
        setTestResults(prev => [...prev, '✅ SOLUÇÃO:']);
        setTestResults(prev => [...prev, '1. Vá para: https://supabase.com/dashboard']);
        setTestResults(prev => [...prev, '2. Selecione seu projeto: ' + projectId]);
        setTestResults(prev => [...prev, '3. Menu lateral → Edge Functions']);
        setTestResults(prev => [...prev, '4. Procure: make-server-c2a25be0']);
        setTestResults(prev => [...prev, '5. Se não existe → Precisa fazer deploy']);
        setTestResults(prev => [...prev, '6. Se existe mas não está deployed → Clique em Deploy']);
      }
    } catch (err: any) {
      setTestResults(prev => [...prev, `❌ ERRO: ${err.message}`]);
      setTestResults(prev => [...prev, '']);
      setTestResults(prev => [...prev, '⚠️ Não conseguiu conectar ao backend.']);
      setTestResults(prev => [...prev, 'O Edge Function NÃO foi deployed!']);
    }
    
    setTestResults(prev => [...prev, '']);
    setTestResults(prev => [...prev, '2️⃣ Verificando configuração...']);
    setTestResults(prev => [...prev, `• Project ID: ${projectId}`]);
    setTestResults(prev => [...prev, `• URL: https://${projectId}.supabase.co`]);
    
    setStep(2);
  };

  const forceReload = () => {
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '3rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem'
          }}>🔧</div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Fix "Working in Offline Mode"
          </h1>
          <p style={{
            color: '#666',
            fontSize: '1.1rem'
          }}>
            Resolver problema de dados da Verônica e novos usuários não salvando
          </p>
        </div>

        {/* Problema */}
        <div style={{
          background: '#fff3cd',
          border: '2px solid #ffc107',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#856404',
            marginBottom: '1rem'
          }}>
            ⚠️ Problema Atual:
          </h2>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            color: '#856404',
            lineHeight: '2'
          }}>
            <li>❌ Sistema está em "Working in offline mode"</li>
            <li>❌ Novos usuários não são salvos no Supabase</li>
            <li>❌ Aparece sempre os dados da Verônica</li>
            <li>❌ Dados ficam só no cache do navegador</li>
          </ul>
        </div>

        {/* Actions */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '3rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            🎯 Escolha uma ação:
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Test Connection */}
            <button
              onClick={testConnection}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '2rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔍</div>
              Testar Conexão
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.5rem' }}>
                Verificar se backend está online
              </div>
            </button>

            {/* Clear Cache */}
            <button
              onClick={clearAllCache}
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '2rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 12px rgba(245, 87, 108, 0.4)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧹</div>
              Limpar Cache
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.5rem' }}>
                Remove dados antigos da Verônica
              </div>
            </button>

            {/* Reload */}
            <button
              onClick={forceReload}
              style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '2rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 12px rgba(79, 172, 254, 0.4)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
              Recarregar Página
              <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '0.5rem' }}>
                Depois de limpar o cache
              </div>
            </button>
          </div>
        </div>

        {/* Results */}
        {testResults.length > 0 && (
          <div style={{
            background: '#1a1a1a',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{
              color: '#4ade80',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}>
              📊 Resultados:
            </h3>
            <div style={{
              background: '#0a0a0a',
              borderRadius: '8px',
              padding: '1.5rem',
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              lineHeight: '1.8',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              {testResults.map((result, index) => (
                <div key={index} style={{
                  color: result.includes('✅') ? '#4ade80' :
                         result.includes('❌') ? '#f87171' :
                         result.includes('⚠️') ? '#fbbf24' :
                         result.includes('🔍') || result.includes('1️⃣') || result.includes('2️⃣') ? '#60a5fa' :
                         '#e5e7eb',
                  marginBottom: '0.3rem'
                }}>
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginTop: '2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#333'
          }}>
            📖 Passo a Passo:
          </h3>
          <ol style={{
            lineHeight: '2',
            color: '#555',
            paddingLeft: '1.5rem'
          }}>
            <li><strong>Primeiro:</strong> Clique em "Testar Conexão" para ver se o backend está online</li>
            <li><strong>Se backend estiver OFFLINE:</strong> Você precisa fazer deploy da Edge Function no Supabase Dashboard</li>
            <li><strong>Se backend estiver OK:</strong> Clique em "Limpar Cache" para remover dados antigos</li>
            <li><strong>Depois:</strong> Clique em "Recarregar Página" ou pressione F5</li>
            <li><strong>Pronto:</strong> O sistema deve sair do modo offline e funcionar normalmente!</li>
          </ol>
        </div>

        {/* Back to home */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a
            href="/"
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.1rem',
              opacity: 0.8
            }}
          >
            ← Voltar para home
          </a>
        </div>
      </div>
    </div>
  );
}
