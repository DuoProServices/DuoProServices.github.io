import { useState, useEffect } from 'react';
import { projectId } from '/utils/supabase/info';

export function useBackendStatus() {
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkBackend = async () => {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 3000);
      });

      // Create the fetch promise
      const fetchPromise = fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/health`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      if (response.ok) {
        const data = await response.json();
        setIsBackendOnline(data.status === 'ok');
      } else {
        setIsBackendOnline(false);
      }
    } catch (error) {
      // Expected error when backend is not deployed - don't log to console
      setIsBackendOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  return { isBackendOnline, isChecking, recheckBackend: checkBackend };
}