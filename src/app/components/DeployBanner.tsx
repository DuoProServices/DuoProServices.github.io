import { useState, useEffect } from 'react';
import { Terminal, X, Rocket } from 'lucide-react';
import { projectId } from '/utils/supabase/info';

export function DeployBanner() {
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('deploy-banner-dismissed') === 'true';
  });

  useEffect(() => {
    // Check if backend is online
    const checkBackend = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/health`,
          { method: 'GET' }
        );
        setIsBackendOnline(response.ok);
      } catch (error) {
        setIsBackendOnline(false);
      }
    };

    checkBackend();
  }, []);

  const dismissBanner = () => {
    setIsDismissed(true);
    localStorage.setItem('deploy-banner-dismissed', 'true');
  };

  // Don't show if dismissed or backend is online
  if (isDismissed || isBackendOnline === true || isBackendOnline === null) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg animate-in slide-in-from-top">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg backdrop-blur">
              <Rocket className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm sm:text-base">
                ⚠️ Backend Não Deployado
              </h3>
              <p className="text-xs sm:text-sm opacity-90">
                Siga o guia passo a passo para ativar todas as funcionalidades
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.location.href = '/deploy-guide'}
              className="px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm whitespace-nowrap flex items-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline">Ver Guia</span>
              <span className="sm:hidden">Guia</span>
            </button>
            <button
              onClick={dismissBanner}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
