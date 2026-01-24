import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  DollarSign, 
  Briefcase, 
  Calendar,
  LogOut,
  Menu,
  X,
  ListTodo,
  Target,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { supabase } from '@/app/utils/supabaseClient';
import { isAdminEmail } from '@/app/config/admins';
import { toast } from 'sonner';

// Lazy load admin modules for better performance
const ClientsModule = lazy(() => import('@/app/components/admin-hub/ClientsModule'));
const FinancialModule = lazy(() => import('@/app/components/admin-hub/FinancialModule'));
const ProjectsModule = lazy(() => import('@/app/components/admin-hub/ProjectsModuleNew'));
const SocialCalendarModule = lazy(() => import('@/app/components/admin-hub/SocialCalendarModule'));

type ModuleType = 'clients' | 'financial' | 'projects' | 'social' | 'crm';

interface Module {
  id: ModuleType;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
}

const MODULES: Module[] = [
  {
    id: 'clients',
    name: 'Client Management',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'financial',
    name: 'Financial Control',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'projects',
    name: 'Project Management',
    icon: Briefcase,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'social',
    name: 'Social Media Calendar',
    icon: Calendar,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
  },
  {
    id: 'crm',
    name: 'CRM - Lead Management',
    icon: Target,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

export default function AdminControlPanelPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<ModuleType>('clients');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdminEmail(user.email)) {
      toast.error('Access denied. Admin only.');
      navigate('/login');
      return;
    }
    setLoading(false);
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const ModuleLoadingFallback = () => (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading module...</p>
      </div>
    </div>
  );

  const renderModule = () => {
    const ModuleComponent = (() => {
      switch (activeModule) {
        case 'clients':
          return ClientsModule;
        case 'financial':
          return FinancialModule;
        case 'projects':
          return ProjectsModule;
        case 'social':
          return SocialCalendarModule;
        default:
          return ClientsModule;
      }
    })();

    return (
      <Suspense fallback={<ModuleLoadingFallback />}>
        <ModuleComponent />
      </Suspense>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  const activeModuleData = MODULES.find(m => m.id === activeModule);

  return (
    <>
      <Helmet>
        <title>Admin Control Panel - DuoPro Services</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {MODULES.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;

              // CRM é uma página separada, então redireciona
              if (module.id === 'crm') {
                return (
                  <button
                    key={module.id}
                    onClick={() => navigate('/admin/crm')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-700 hover:bg-gray-50`}
                    title={!sidebarOpen ? module.name : undefined}
                  >
                    <Icon className="w-5 h-5 text-gray-600" />
                    {sidebarOpen && <span className="text-sm">{module.name}</span>}
                  </button>
                );
              }

              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? `${module.bgColor} ${module.color} font-semibold`
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={!sidebarOpen ? module.name : undefined}
                >
                  <Icon className={`w-5 h-5 ${isActive ? module.color : 'text-gray-600'}`} />
                  {sidebarOpen && <span className="text-sm">{module.name}</span>}
                </button>
              );
            })}
            
            {/* Divider */}
            <div className="py-2">
              <div className="border-t border-gray-200"></div>
            </div>
            
            {/* Team Activity Manager - Special Button */}
            <button
              onClick={() => navigate('/admin/team-activity')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all font-medium"
              title={!sidebarOpen ? 'Team Activities' : undefined}
            >
              <ListTodo className="w-5 h-5 text-indigo-600" />
              {sidebarOpen && <span className="text-sm">Team Activities</span>}
            </button>
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title={!sidebarOpen ? 'Sign Out' : undefined}
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="text-sm font-medium">Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center gap-4">
              {activeModuleData && (
                <>
                  <div className={`p-3 ${activeModuleData.bgColor} rounded-lg`}>
                    <activeModuleData.icon className={`w-6 h-6 ${activeModuleData.color}`} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {activeModuleData.name}
                    </h1>
                    <p className="text-sm text-gray-500">
                      Manage and monitor your {activeModuleData.name.toLowerCase()}
                    </p>
                  </div>
                </>
              )}
            </div>
          </header>

          {/* Module Content */}
          <div className="p-8">
            {renderModule()}
          </div>
        </main>
      </div>
    </>
  );
}