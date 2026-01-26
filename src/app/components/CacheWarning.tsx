import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const CURRENT_VERSION = '2.0.0';
const VERSION_KEY = 'app_version';

export default function CacheWarning() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check stored version
    const storedVersion = localStorage.getItem(VERSION_KEY);
    
    if (!storedVersion || storedVersion !== CURRENT_VERSION) {
      console.log(`🔄 Version mismatch! Stored: ${storedVersion}, Current: ${CURRENT_VERSION}`);
      setShowWarning(true);
      
      // Update stored version
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    }
  }, []);

  const handleReload = () => {
    // Clear all caches and reload
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      }).catch(() => {
        // Ignore errors
      });
    }
    
    // Clear localStorage except version
    try {
      const version = localStorage.getItem(VERSION_KEY);
      localStorage.clear();
      if (version) localStorage.setItem(VERSION_KEY, version);
    } catch (e) {
      // Ignore errors
    }
    
    // Hard reload
    window.location.reload();
  };

  if (!showWarning) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 flex-shrink-0" />
          <div>
            <p className="font-bold">🔄 Nova versão disponível!</p>
            <p className="text-sm opacity-90">
              Recarregue a página para garantir que está usando a versão mais recente.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReload}
            className="px-4 py-2 bg-white text-yellow-600 rounded-lg font-semibold hover:bg-yellow-50 transition-colors"
          >
            🔄 Recarregar Agora
          </button>
          <button
            onClick={() => setShowWarning(false)}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
          >
            Dispensar
          </button>
        </div>
      </div>
    </div>
  );
}
