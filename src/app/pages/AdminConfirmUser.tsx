import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from "../components/ui/alert";
import { CheckCircle, XCircle } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function AdminConfirmUser() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/admin/confirm-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ email })
        }
      );

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          message: data.message || 'User confirmed successfully!'
        });
        setEmail('');
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to confirm user'
        });
      }
    } catch (error: any) {
      console.error('Error confirming user:', error);
      setResult({
        success: false,
        message: error.message || 'Network error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">🔧 Admin: Confirm User</h1>
            <p className="text-gray-600">
              Manually confirm users who are pending email verification
            </p>
          </div>

          {result && (
            <Alert className={`mb-6 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start gap-2">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.message}
                </AlertDescription>
              </div>
            </Alert>
          )}

          <form onSubmit={handleConfirm} className="space-y-6">
            <div>
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder="user@example.com"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the email address of the user you want to confirm
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Confirming...' : '✅ Confirm User'}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ When to use this:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>User created account but email confirmation is enabled in Supabase</li>
              <li>User didn't receive confirmation email</li>
              <li>Testing environment where you want to skip email verification</li>
            </ul>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">💡 Better Solution:</h3>
            <p className="text-sm text-yellow-800">
              Disable email confirmation in Supabase Dashboard:<br />
              <code className="bg-yellow-100 px-2 py-1 rounded text-xs">
                Authentication → Providers → Email → Uncheck "Confirm email"
              </code>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
