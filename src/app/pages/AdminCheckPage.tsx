import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Check, X, AlertCircle, ArrowLeft, UserCheck } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { useAuth } from '@/app/contexts/AuthContext';
import { ADMIN_EMAILS, isAdminEmail } from '@/app/config/admins';

interface AdminStatus {
  email: string;
  exists: boolean;
  isLoggedIn: boolean;
  isCurrentUser: boolean;
}

export default function AdminCheckPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [adminStatuses, setAdminStatuses] = useState<AdminStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmins();
  }, [user]);

  const checkAdmins = async () => {
    setLoading(true);
    
    const statuses: AdminStatus[] = ADMIN_EMAILS.map(email => ({
      email,
      exists: true, // Assume true - precisaria verificar no Supabase Auth
      isLoggedIn: user?.email?.toLowerCase() === email.toLowerCase(),
      isCurrentUser: user?.email?.toLowerCase() === email.toLowerCase(),
    }));

    setAdminStatuses(statuses);
    setLoading(false);
  };

  const currentUserIsAdmin = isAdminEmail(user?.email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/admin')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Admin Hub
          </Button>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Verificação de Administradores
              </h1>
              <p className="text-gray-600 mt-1">
                Status dos 3 usuários admin configurados
              </p>
            </div>
          </div>
        </div>

        {/* Current User Status */}
        <Card className="p-6 mb-6 border-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Usuário atual:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user?.email || 'Não logado'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentUserIsAdmin ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300 rounded-lg">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">É Admin</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 border border-red-300 rounded-lg">
                  <X className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-700">Não é Admin</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Admin List */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-600" />
            Lista de Administradores Configurados
          </h2>

          <div className="space-y-4">
            {adminStatuses.map((status, index) => (
              <div
                key={status.email}
                className={`
                  p-6 rounded-xl border-2 transition-all
                  ${status.isCurrentUser 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-md' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  {/* Left side - Info */}
                  <div className="flex items-center gap-4">
                    {/* Number Badge */}
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                      ${status.isCurrentUser 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                      }
                    `}>
                      {index + 1}
                    </div>

                    {/* Email and Name */}
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {status.email}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-600">
                          {status.email === 'veprass@gmail.com' && '👩‍💼 Veronica Prass'}
                          {status.email === 'germana.canada@gmail.com' && '👩‍💼 Germana Azevedo'}
                          {status.email === 'jamila.coura15@gmail.com' && '👩‍💼 Jamila Azevedo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Badges */}
                  <div className="flex flex-col gap-2 items-end">
                    {/* Admin Badge */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 border border-purple-300 rounded-full">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-semibold text-purple-700">ADMIN</span>
                    </div>

                    {/* Current User Badge */}
                    {status.isCurrentUser && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 border border-blue-300 rounded-full">
                        <Check className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700">VOCÊ</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="space-y-3">
              <h3 className="font-bold text-blue-900 text-lg">
                ℹ️ Informações Importantes
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>
                  <strong>✅ Frontend:</strong> Os 3 emails estão configurados em{' '}
                  <code className="px-2 py-1 bg-blue-100 rounded">/src/app/config/admins.ts</code>
                </p>
                <p>
                  <strong>✅ Backend:</strong> Os 3 emails estão configurados em{' '}
                  <code className="px-2 py-1 bg-blue-100 rounded">/supabase/functions/server/index.tsx</code>
                </p>
                <p className="pt-2 border-t border-blue-200">
                  <strong>🔐 Permissões Admin:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 pl-4">
                  <li>Acesso total a todos os painéis administrativos</li>
                  <li>Gerenciamento de usuários e permissões</li>
                  <li>Visualização e edição de clientes</li>
                  <li>Acesso ao Content Calendar e Launch Roadmap</li>
                  <li>Configuração de pagamentos e invoices</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <Button
            onClick={() => navigate('/admin')}
            className="flex-1"
            size="lg"
          >
            <Shield className="w-5 h-5 mr-2" />
            Ir para Admin Hub
          </Button>
          <Button
            onClick={() => navigate('/quick-admin-setup')}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            <UserCheck className="w-5 h-5 mr-2" />
            Setup de Admins
          </Button>
        </div>
      </div>
    </div>
  );
}
