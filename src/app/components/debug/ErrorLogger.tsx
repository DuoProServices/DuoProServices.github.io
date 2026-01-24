import React, { useEffect, useState } from 'react';

interface ErrorLog {
  type: 'error' | 'warn';
  message: string;
  timestamp: string;
}

const ErrorLogger: React.FC = () => {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;

    // Override console.error
    console.error = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      setErrors(prev => [...prev, {
        type: 'error',
        message,
        timestamp: new Date().toISOString()
      }]);
      
      originalError.apply(console, args);
    };

    // Override console.warn
    console.warn = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      setErrors(prev => [...prev, {
        type: 'warn',
        message,
        timestamp: new Date().toISOString()
      }]);
      
      originalWarn.apply(console, args);
    };

    // Listen for keyboard shortcut (Ctrl+Shift+E)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (!isVisible || errors.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-md w-full bg-white rounded-lg shadow-2xl border-2 border-red-500">
      <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg flex justify-between items-center">
        <div>
          <h3 className="font-bold">Console Errors ({errors.length})</h3>
          <p className="text-xs opacity-90">Press Ctrl+Shift+E to toggle</p>
        </div>
        <button
          onClick={() => {
            setErrors([]);
            setIsVisible(false);
          }}
          className="text-white hover:bg-red-700 px-2 py-1 rounded"
        >
          ✕
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto p-4 space-y-2">
        {errors.map((error, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg text-sm ${
              error.type === 'error' 
                ? 'bg-red-50 border border-red-200 text-red-900' 
                : 'bg-yellow-50 border border-yellow-200 text-yellow-900'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg">{error.type === 'error' ? '🔴' : '⚠️'}</span>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs break-words">{error.message}</p>
                <p className="text-xs opacity-60 mt-1">
                  {new Date(error.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorLogger;
