import { useAuth } from '@/app/contexts/AuthContext';
import { ADMIN_EMAILS, isAdminEmail } from '@/app/config/admins';
import { supabase } from '@/app/utils/supabaseClient';
import { useState } from 'react';

export default function AuthDebugPage() {
  const { user, isAdmin, loading } = useAuth();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);

  const checkSupabaseSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    console.log('Supabase session:', data);
    console.log('Supabase error:', error);
    setSupabaseUser(data.session?.user);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-4">🔍 Auth Debug Panel</h1>
          
          {loading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
              <p className="text-yellow-800">⏳ Loading...</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Admin Emails Configuration */}
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold mb-2">📋 Configured Admin Emails</h2>
              <ul className="list-disc list-inside space-y-1">
                {ADMIN_EMAILS.map(email => (
                  <li key={email} className="font-mono text-sm text-blue-600">{email}</li>
                ))}
              </ul>
            </div>

            {/* Current User Info */}
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold mb-2">👤 Current User (from AuthContext)</h2>
              {user ? (
                <div className="bg-gray-50 rounded p-4 font-mono text-sm space-y-2">
                  <div><strong>ID:</strong> {user.id}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Name:</strong> {user.name}</div>
                  <div className={`text-lg font-bold ${isAdmin ? 'text-green-600' : 'text-red-600'}`}>
                    <strong>Is Admin:</strong> {isAdmin ? '✅ YES' : '❌ NO'}
                  </div>
                  <div>
                    <strong>Email Check Result:</strong> {isAdminEmail(user.email) ? '✅ TRUE' : '❌ FALSE'}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No user logged in</p>
              )}
            </div>

            {/* Supabase Session */}
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold mb-2">🔐 Supabase Session</h2>
              <button 
                onClick={checkSupabaseSession}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
              >
                Check Supabase Session
              </button>
              
              {supabaseUser && (
                <div className="bg-gray-50 rounded p-4 font-mono text-sm space-y-2">
                  <div><strong>ID:</strong> {supabaseUser.id}</div>
                  <div><strong>Email:</strong> {supabaseUser.email}</div>
                  <div><strong>Email (lowercase):</strong> {supabaseUser.email?.toLowerCase()}</div>
                  <div><strong>User Metadata:</strong></div>
                  <pre className="bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(supabaseUser.user_metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Test Email Matching */}
            {user && (
              <div className="border-b pb-4">
                <h2 className="text-lg font-semibold mb-2">🧪 Email Matching Test</h2>
                <div className="bg-gray-50 rounded p-4 space-y-2">
                  <div className="font-mono text-sm">
                    <strong>User Email:</strong> "{user.email}"
                  </div>
                  <div className="font-mono text-sm">
                    <strong>Normalized:</strong> "{user.email.toLowerCase()}"
                  </div>
                  <div className="font-mono text-sm">
                    <strong>Admin Emails:</strong> [{ADMIN_EMAILS.map(e => `"${e}"`).join(', ')}]
                  </div>
                  <div className="font-mono text-sm">
                    <strong>Includes?</strong> {ADMIN_EMAILS.includes(user.email.toLowerCase()) ? '✅ YES' : '❌ NO'}
                  </div>
                  
                  <div className="mt-4 space-y-1">
                    <p className="font-semibold">Individual Checks:</p>
                    {ADMIN_EMAILS.map(adminEmail => (
                      <div key={adminEmail} className="text-sm">
                        "{user.email.toLowerCase()}" === "{adminEmail}" ? 
                        {user.email.toLowerCase() === adminEmail ? ' ✅ MATCH' : ' ❌ NO MATCH'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Console Logs */}
            <div>
              <h2 className="text-lg font-semibold mb-2">📝 Instructions</h2>
              <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Abra o Console do navegador (F12 → Console)</li>
                  <li>Faça login com um dos emails admin</li>
                  <li>Veja os logs prefixados com 🔍, 🔐, 👑</li>
                  <li>Volte a esta página para ver o status</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
