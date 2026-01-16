import { useState, useEffect } from 'react';
import { AlertTriangle, ExternalLink, X, Terminal } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { projectId } from '/utils/supabase/info';

export function BackendOfflineNotice() {
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkBackend = async () => {
    try {
      setIsChecking(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/health`,
        { method: 'GET' }
      );
      
      setIsBackendOnline(response.ok);
      
      if (response.ok) {
        setIsDismissed(true); // Auto-dismiss if backend is online
      }
    } catch (error) {
      setIsBackendOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackend();
    
    // Check every 30 seconds
    const interval = setInterval(checkBackend, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Don't show if dismissed or if backend is online
  if (isDismissed || isBackendOnline === true || isBackendOnline === null) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-[500px] z-50 animate-in slide-in-from-bottom-4">
      <Card className="bg-red-50 border-red-200 shadow-lg">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="size-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-red-900 mb-1">
                Backend Offline
              </h3>
              <p className="text-sm text-red-800">
                O servidor backend não foi deployado ainda. Algumas funcionalidades não estarão disponíveis.
              </p>
            </div>
            <button
              onClick={() => setIsDismissed(true)}
              className="flex-shrink-0 text-red-600 hover:text-red-700"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Quick Fix */}
          <div className="bg-red-100 rounded p-3 mb-3">
            <p className="text-xs font-medium text-red-900 mb-2">
              🔧 Corrija rapidamente:
            </p>
            <div className="space-y-1.5 text-xs text-red-800">
              <div className="flex items-start gap-2">
                <span className="font-mono bg-red-200 px-1.5 py-0.5 rounded">1</span>
                <code className="flex-1">brew install supabase/tap/supabase</code>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono bg-red-200 px-1.5 py-0.5 rounded">2</span>
                <code className="flex-1">supabase login</code>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono bg-red-200 px-1.5 py-0.5 rounded">3</span>
                <code className="flex-1">chmod +x DEPLOY_AGORA.sh && ./DEPLOY_AGORA.sh</code>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/deploy-guide'}
              className="text-xs bg-red-600 text-white hover:bg-red-700 border-red-600"
            >
              <Terminal className="size-3 mr-1.5" />
              Ver Guia Visual
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/test-backend', '_blank')}
              className="text-xs"
            >
              <Terminal className="size-3 mr-1.5" />
              Testar Backend
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={checkBackend}
              disabled={isChecking}
              className="text-xs"
            >
              {isChecking ? 'Verificando...' : 'Verificar Novamente'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}