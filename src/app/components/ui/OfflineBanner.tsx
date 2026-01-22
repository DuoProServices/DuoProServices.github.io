import { AlertCircle, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { isBackendCurrentlyOffline } from '../../utils/apiHelper';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Verifica status a cada 5 segundos
    const interval = setInterval(() => {
      setIsOffline(isBackendCurrentlyOffline());
    }, 5000);

    // Verifica imediatamente
    setIsOffline(isBackendCurrentlyOffline());

    return () => clearInterval(interval);
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <WifiOff className="w-5 h-5 animate-pulse" />
          <AlertCircle className="w-5 h-5" />
        </div>
        <p className="text-sm font-medium">
          ⚠️ Backend offline - Showing demo data
        </p>
        <p className="text-xs opacity-90 hidden md:block">
          To enable real data, deploy the backend following the guide at <strong>/deploy-guide</strong>
        </p>
      </div>
    </div>
  );
}
