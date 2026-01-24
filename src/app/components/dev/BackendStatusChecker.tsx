/**
 * BACKEND STATUS CHECKER
 * Visual component to check if backend is deployed and working
 */

import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { AlertCircle, CheckCircle, Loader2, RefreshCw, ExternalLink } from 'lucide-react';
import { projectId } from '/utils/supabase/info';

interface EndpointTest {
  name: string;
  url: string;
  status: 'pending' | 'success' | 'error';
  httpStatus?: number;
  message?: string;
}

export function BackendStatusChecker() {
  const [testing, setTesting] = useState(false);
  const [tests, setTests] = useState<EndpointTest[]>([
    {
      name: 'Health Check',
      url: `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/health`,
      status: 'pending'
    }
  ]);

  const runTests = async () => {
    setTesting(true);
    
    const updatedTests: EndpointTest[] = [];

    for (const test of tests) {
      try {
        console.log(`Testing: ${test.name}...`);
        
        const response = await fetch(test.url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();
        
        updatedTests.push({
          ...test,
          status: response.ok ? 'success' : 'error',
          httpStatus: response.status,
          message: response.ok 
            ? `✅ ${test.name} is working!`
            : `❌ HTTP ${response.status}: ${response.statusText}`
        });
      } catch (error: any) {
        console.error(`Error testing ${test.name}:`, error);
        updatedTests.push({
          ...test,
          status: 'error',
          message: `❌ ${error.message || 'Connection failed'}`
        });
      }
    }

    setTests(updatedTests);
    setTesting(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const allSuccess = tests.every(t => t.status === 'success');
  const anyError = tests.some(t => t.status === 'error');

  return (
    <Card className="p-6 max-w-2xl mx-auto my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {testing && <Loader2 className="size-5 animate-spin" />}
            {!testing && allSuccess && <CheckCircle className="size-5 text-green-600" />}
            {!testing && anyError && <AlertCircle className="size-5 text-red-600" />}
            Backend Status
          </h3>
          <p className="text-sm text-muted-foreground">
            Project: {projectId}
          </p>
        </div>
        
        <Button
          onClick={runTests}
          disabled={testing}
          variant="outline"
          size="sm"
        >
          {testing ? (
            <Loader2 className="size-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="size-4 mr-2" />
          )}
          {testing ? 'Testing...' : 'Retest'}
        </Button>
      </div>

      <div className="space-y-3">
        {tests.map((test, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              test.status === 'success'
                ? 'bg-green-50 border-green-200'
                : test.status === 'error'
                ? 'bg-red-50 border-red-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {test.status === 'pending' && (
                    <Loader2 className="size-4 animate-spin text-gray-500" />
                  )}
                  {test.status === 'success' && (
                    <CheckCircle className="size-4 text-green-600" />
                  )}
                  {test.status === 'error' && (
                    <AlertCircle className="size-4 text-red-600" />
                  )}
                  <span className="font-medium">{test.name}</span>
                  {test.httpStatus && (
                    <span className="text-xs text-muted-foreground">
                      HTTP {test.httpStatus}
                    </span>
                  )}
                </div>
                {test.message && (
                  <p className="text-sm text-muted-foreground ml-6">
                    {test.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground ml-6 mt-1 truncate">
                  {test.url}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {anyError && !testing && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-2">
                Backend Not Deployed
              </h4>
              <p className="text-sm text-amber-800 mb-3">
                The Edge Function is not deployed yet. You need to deploy it to Supabase.
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={() => {
                    window.open('/FIX_FAILED_TO_FETCH_ERRORS.md', '_blank');
                  }}
                >
                  <ExternalLink className="size-4 mr-2" />
                  View Deployment Guide
                </Button>
                <div className="text-xs text-amber-700 space-y-1">
                  <p>Quick fix:</p>
                  <code className="block bg-amber-100 p-2 rounded">
                    supabase functions deploy server
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {allSuccess && !testing && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-900 mb-1">
                All Systems Operational
              </h4>
              <p className="text-sm text-green-800">
                Backend is deployed and responding correctly! 🎉
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
