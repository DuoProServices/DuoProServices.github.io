import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink,
  Server,
  Loader2
} from 'lucide-react';
import { projectId } from '/utils/supabase/info';

interface BackendDeploymentRequiredProps {
  onBackendReady?: () => void;
}

export function BackendDeploymentRequired({ onBackendReady }: BackendDeploymentRequiredProps) {
  const [checking, setChecking] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkBackendStatus = async () => {
    setChecking(true);
    try {
      // Create a timeout promise (3 seconds)
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
        if (data.status === 'ok') {
          setIsDeployed(true);
          setLastCheck(new Date());
          if (onBackendReady) {
            setTimeout(() => onBackendReady(), 1000);
          }
          return true;
        }
      }
      
      setIsDeployed(false);
      setLastCheck(new Date());
      return false;
    } catch (error) {
      // Expected error when backend is not deployed - silently handle
      setIsDeployed(false);
      setLastCheck(new Date());
      return false;
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const openSupabaseDashboard = () => {
    window.open(
      `https://supabase.com/dashboard/project/${projectId}/functions/make-server-c2a25be0`,
      '_blank'
    );
  };

  if (isDeployed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-green-900 mb-3">
            ✅ Backend is Online!
          </h1>
          <p className="text-green-700 mb-6">
            The Edge Function is deployed and responding correctly.
          </p>
          <div className="text-sm text-green-600">
            Redirecting...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-red-900 mb-3">
            🚨 Backend Not Deployed
          </h1>
          <p className="text-lg text-red-700">
            The Edge Function needs to be deployed before you can use this application.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6 border-2 border-red-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-red-600" />
            Deployment Instructions
          </h2>
          
          <ol className="space-y-4 text-gray-700">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </span>
              <div className="flex-1 pt-1">
                <p className="font-semibold mb-1">Click the button below to open Supabase Dashboard</p>
                <Button
                  onClick={openSupabaseDashboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white mt-2 w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Supabase Dashboard
                </Button>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </span>
              <div className="flex-1 pt-1">
                <p className="font-semibold mb-1">Find the Deploy button</p>
                <p className="text-sm text-gray-600">
                  Look for a <strong className="text-blue-600">blue "Deploy"</strong> or <strong className="text-blue-600">"Redeploy"</strong> button in the top-right corner of the page.
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                3
              </span>
              <div className="flex-1 pt-1">
                <p className="font-semibold mb-1">Click Deploy</p>
                <p className="text-sm text-gray-600">
                  Click the button and wait 10-30 seconds for the deployment to complete.
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                4
              </span>
              <div className="flex-1 pt-1">
                <p className="font-semibold mb-1">Come back here and click "Check Again"</p>
                <p className="text-sm text-gray-600">
                  The page will automatically reload once the backend is online.
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-amber-900 mb-2">⚠️ Alternative Method</h3>
          <p className="text-sm text-amber-800 mb-2">
            If the button above doesn't work, manually navigate to:
          </p>
          <div className="bg-white rounded px-3 py-2 font-mono text-xs break-all border border-amber-300">
            https://supabase.com/dashboard/project/{projectId}/functions/make-server-c2a25be0
          </div>
        </div>

        {lastCheck && (
          <div className="text-center text-sm text-gray-500 mb-4">
            Last checked: {lastCheck.toLocaleTimeString()}
          </div>
        )}

        <Button
          onClick={checkBackendStatus}
          disabled={checking}
          className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
        >
          {checking ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Checking Backend Status...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5 mr-2" />
              Check Again
            </>
          )}
        </Button>

        <div className="mt-6 text-center">
          <details className="text-sm text-gray-600">
            <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
              🔧 Technical Details
            </summary>
            <div className="mt-3 text-left bg-gray-50 rounded p-3 space-y-2">
              <p><strong>Project ID:</strong> {projectId}</p>
              <p><strong>Function Name:</strong> make-server-c2a25be0</p>
              <p><strong>Health Endpoint:</strong></p>
              <code className="text-xs bg-white px-2 py-1 rounded block mt-1 break-all">
                https://{projectId}.supabase.co/functions/v1/make-server-c2a25be0/health
              </code>
              <p className="mt-2"><strong>Expected Response:</strong></p>
              <code className="text-xs bg-white px-2 py-1 rounded block mt-1">
                {`{ "status": "ok", "timestamp": "..." }`}
              </code>
            </div>
          </details>
        </div>
      </Card>
    </div>
  );
}