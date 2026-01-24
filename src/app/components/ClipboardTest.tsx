/**
 * CLIPBOARD TEST COMPONENT
 * Component to test clipboard functionality
 */

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { safeCopyToClipboard } from '../utils/clipboard';
import { toast } from 'sonner';

export function ClipboardTest() {
  const [copied, setCopied] = useState(false);

  const testText = 'Hello! This clipboard utility works perfectly without errors! 🎉';

  const handleCopy = async () => {
    const success = await safeCopyToClipboard(testText);
    
    if (success) {
      setCopied(true);
      toast.success('✅ Copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } else {
      toast.error('❌ Failed to copy');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        📋 Clipboard Test
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Click the button below to test the clipboard functionality.
        No errors should appear in the console!
      </p>
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
        <code className="text-sm text-gray-700">{testText}</code>
      </div>
      <Button
        onClick={handleCopy}
        className={`transition-all ${
          copied 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-black hover:bg-gray-900'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 mr-2" />
            Copy Text
          </>
        )}
      </Button>
    </div>
  );
}
