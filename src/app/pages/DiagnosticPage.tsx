import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface Check {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export default function DiagnosticPage() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [loading, setLoading] = useState(true);

  const runDiagnostics = async () => {
    setLoading(true);
    setChecks([]);

    const results: Check[] = [];

    // Check 1: Environment Variables
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (projectId && anonKey) {
      results.push({
        name: 'Environment Variables',
        status: 'success',
        message: 'Variáveis de ambiente configuradas corretamente',
        details: `Project ID: ${projectId ? projectId.substring(0, 10) + '...' : 'N/A'}`
      });
    } else {
      results.push({
        name: 'Environment Variables',
        status: 'error',
        message: 'Variáveis de ambiente não encontradas',
        details: `Project ID: ${projectId || 'MISSING'}, Anon Key: ${anonKey ? 'SET' : 'MISSING'}`
      });
    }

    // Check 2: Server Connection
    try {
      const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/health`;
      const response = await fetch(serverUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${anonKey}`
        }
      });

      if (response.ok) {
        results.push({
          name: 'Server Connection',
          status: 'success',
          message: 'Servidor respondendo corretamente',
          details: `Status: ${response.status}`
        });
      } else {
        results.push({
          name: 'Server Connection',
          status: 'warning',
          message: `Servidor retornou status: ${response.status}`,
          details: await response.text()
        });
      }
    } catch (error: any) {
      results.push({
        name: 'Server Connection',
        status: 'error',
        message: 'Não foi possível conectar ao servidor',
        details: error.message
      });
    }

    // Check 3: Page Version
    const storedVersion = localStorage.getItem('app_version');
    const currentVersion = '2.0.0';

    if (storedVersion === currentVersion) {
      results.push({
        name: 'Page Version',
        status: 'success',
        message: 'Versão da página está atualizada',
        details: `Versão: ${currentVersion}`
      });
    } else {
      results.push({
        name: 'Page Version',
        status: 'warning',
        message: 'Versão da página pode estar desatualizada',
        details: `Armazenada: ${storedVersion || 'none'}, Atual: ${currentVersion}`
      });
    }

    // Check 4: Current URL
    const currentUrl = window.location.href;
    results.push({
      name: 'Current URL',
      status: 'success',
      message: 'URL atual',
      details: currentUrl
    });

    // Check 5: Browser Info
    results.push({
      name: 'Browser Info',
      status: 'success',
      message: 'Informações do navegador',
      details: `${navigator.userAgent.substring(0, 50)}...`
    });

    setChecks(results);
    setLoading(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getIcon = (status: Check['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getColor = (status: Check['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-300 bg-green-50';
      case 'error':
        return 'border-red-300 bg-red-50';
      case 'warning':
        return 'border-yellow-300 bg-yellow-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mb-4">
            <span className="text-3xl">🔍</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            System Diagnostics
          </h1>
          <p className="text-gray-600">
            Verificação completa do sistema
          </p>
        </div>

        {/* Reload Button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Verificando...' : 'Verificar Novamente'}
          </button>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            📊 Resultados da Verificação
          </h2>

          <div className="space-y-4">
            {checks.map((check, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${getColor(check.status)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(check.status)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {check.name}
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">
                      {check.message}
                    </p>
                    {check.details && (
                      <div className="bg-white/50 rounded p-2 font-mono text-xs text-gray-600 overflow-x-auto">
                        {check.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {checks.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              Nenhuma verificação realizada ainda.
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-gray-600">Executando diagnósticos...</span>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {checks.filter(c => c.status === 'success').length}
            </div>
            <div className="text-sm text-green-800 mt-1">✅ Sucessos</div>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {checks.filter(c => c.status === 'warning').length}
            </div>
            <div className="text-sm text-yellow-800 mt-1">⚠️ Avisos</div>
          </div>
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-600">
              {checks.filter(c => c.status === 'error').length}
            </div>
            <div className="text-sm text-red-800 mt-1">❌ Erros</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a
            href="/setup"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            🚀 Ir para Setup
          </a>
          <a
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            🔑 Ir para Login
          </a>
          <a
            href="/auth-debug"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            🛠️ Debug Panel
          </a>
        </div>
      </div>
    </div>
  );
}
