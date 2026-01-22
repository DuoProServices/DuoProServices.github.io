/**
 * CONSOLE SETTINGS PANEL
 * Painel de configuração rápida para controlar logs do console
 */

import { useState, useEffect } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Terminal, Eye, EyeOff, Settings } from 'lucide-react';
import { APP_CONFIG } from '@/config/app';

export function ConsoleSettingsPanel() {
  const [showPanel, setShowPanel] = useState(false);
  const [config, setConfig] = useState(APP_CONFIG.logging);

  useEffect(() => {
    // Sincroniza com o config global
    Object.assign(APP_CONFIG.logging, config);
  }, [config]);

  const toggleSetting = (key: keyof typeof config) => {
    setConfig(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showPanel) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowPanel(true)}
          size="sm"
          className="bg-gray-900 hover:bg-gray-800 text-white shadow-lg"
        >
          <Terminal className="w-4 h-4 mr-2" />
          Console Settings
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-white shadow-2xl border-2 border-gray-200 p-6 w-96">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-gray-700" />
            <h3 className="font-bold text-gray-900">Console Logs</h3>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPanel(false)}
            className="text-xs"
          >
            Close
          </Button>
        </div>

        <div className="space-y-3">
          {/* Global Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">All Logs</span>
            </div>
            <Button
              size="sm"
              onClick={() => toggleSetting('enabled')}
              className={`text-xs ${
                config.enabled
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 hover:bg-gray-500'
              }`}
            >
              {config.enabled ? (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  ON
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 mr-1" />
                  OFF
                </>
              )}
            </Button>
          </div>

          {/* Demo Warnings */}
          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div>
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>🎭</span>
                Demo Mode Warnings
              </span>
              <p className="text-xs text-gray-500 mt-0.5">
                Backend offline notifications
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => toggleSetting('showDemoWarnings')}
              disabled={!config.enabled}
              className={`text-xs ${
                config.showDemoWarnings && config.enabled
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-gray-300'
              }`}
            >
              {config.showDemoWarnings ? 'ON' : 'OFF'}
            </Button>
          </div>

          {/* API Success Logs */}
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div>
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>✅</span>
                API Success Logs
              </span>
              <p className="text-xs text-gray-500 mt-0.5">
                Connection success messages
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => toggleSetting('showApiSuccess')}
              disabled={!config.enabled}
              className={`text-xs ${
                config.showApiSuccess && config.enabled
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-300'
              }`}
            >
              {config.showApiSuccess ? 'ON' : 'OFF'}
            </Button>
          </div>

          {/* Debug Logs */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>🔍</span>
                Debug Logs
              </span>
              <p className="text-xs text-gray-500 mt-0.5">
                Detailed development logs
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => toggleSetting('showDebugLogs')}
              disabled={!config.enabled}
              className={`text-xs ${
                config.showDebugLogs && config.enabled
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-300'
              }`}
            >
              {config.showDebugLogs ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>

        {/* Status Info */}
        <div className="mt-4 p-3 bg-gray-100 rounded-lg">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>💡 Tip:</strong> Turn off "Demo Mode Warnings" to clean up the console
            when working with mock data.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setConfig({
                enabled: true,
                showDemoWarnings: false, // Silencia avisos de demo
                showApiSuccess: false,
                showDebugLogs: false,
              });
            }}
            className="text-xs flex-1"
          >
            🔕 Silent Mode
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setConfig({
                enabled: true,
                showDemoWarnings: true,
                showApiSuccess: true,
                showDebugLogs: true,
              });
            }}
            className="text-xs flex-1"
          >
            🔊 Verbose Mode
          </Button>
        </div>
      </Card>
    </div>
  );
}
