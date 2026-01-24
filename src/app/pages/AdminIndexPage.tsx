import { useNavigate } from 'react-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { isAdminEmail } from '@/app/config/admins';
import { Helmet } from 'react-helmet-async';
import { 
  LayoutDashboard,
  Users,
  DollarSign,
  Briefcase,
  Calendar,
  Target,
  ListTodo,
  FileText,
  UserCog,
  Settings,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface AdminPanel {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: any;
  color: string;
  bgColor: string;
  category: 'primary' | 'management' | 'tools';
}

const ADMIN_PANELS: AdminPanel[] = [
  // PRIMARY DASHBOARDS
  {
    id: 'control-panel',
    name: 'Admin Control Panel',
    description: 'Main control center with modular views',
    route: '/admin/control-panel',
    icon: LayoutDashboard,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    category: 'primary'
  },
  {
    id: 'admin-hub',
    name: 'Admin Hub',
    description: 'Dashboard overview with analytics',
    route: '/admin/hub',
    icon: LayoutDashboard,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    category: 'primary'
  },
  
  // MANAGEMENT
  {
    id: 'clients',
    name: 'Client Management',
    description: 'View and manage all clients',
    route: '/admin/clients',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    category: 'management'
  },
  {
    id: 'users',
    name: 'User Management',
    description: 'Manage users and permissions',
    route: '/admin/users',
    icon: UserCog,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    category: 'management'
  },
  {
    id: 'crm',
    name: 'CRM - Lead Management',
    description: 'Manage leads and opportunities',
    route: '/admin/crm',
    icon: Target,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    category: 'management'
  },
  
  // TOOLS
  {
    id: 'team-activity',
    name: 'Team Activities',
    description: 'Track team tasks and activities',
    route: '/admin/team-activity',
    icon: ListTodo,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    category: 'tools'
  },
];

const CATEGORY_LABELS = {
  primary: 'Primary Dashboards',
  management: 'Management Tools',
  tools: 'Productivity Tools'
};

export default function AdminIndexPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Performance tracking
    const startTime = performance.now();
    console.log('🚀 [AdminIndex] Page load started');

    if (!user || !isAdminEmail(user.email)) {
      toast.error('Access denied. Admin only.');
      navigate('/login');
      return;
    }

    // Log load time
    const loadTime = performance.now() - startTime;
    console.log(`✅ [AdminIndex] Page loaded in ${loadTime.toFixed(2)}ms`);
    
    if (loadTime < 100) {
      console.log('⚡ FAST LOAD - Excellent performance!');
    }
  }, [user, navigate]);

  const groupedPanels = {
    primary: ADMIN_PANELS.filter(p => p.category === 'primary'),
    management: ADMIN_PANELS.filter(p => p.category === 'management'),
    tools: ADMIN_PANELS.filter(p => p.category === 'tools'),
  };

  return (
    <>
      <Helmet>
        <title>Admin Access - DuoPro Services</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Access Center
                </h1>
                <p className="text-gray-600 mt-1">
                  Welcome, {user?.email} • Select a panel to manage
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Panels</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{ADMIN_PANELS.length}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <LayoutDashboard className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Management Tools</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{groupedPanels.management.length}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Settings className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate('/admin-check')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Admin Users</p>
                  <p className="text-xl font-bold text-green-600 mt-1">3 Configured</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Click to verify →</p>
            </div>
          </div>

          {/* Panels by Category */}
          {Object.entries(groupedPanels).map(([category, panels]) => (
            <div key={category} className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {panels.map((panel) => {
                  const Icon = panel.icon;
                  return (
                    <button
                      key={panel.id}
                      onClick={() => navigate(panel.route)}
                      className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-lg hover:border-blue-300 transition-all duration-200 hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 ${panel.bgColor} rounded-lg group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-6 h-6 ${panel.color}`} />
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {panel.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {panel.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500 font-medium">
                          Click to access →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-1 h-6 bg-green-600 rounded-full"></div>
              💡 Recommendations
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">📅 Daily Operations</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Control Panel</li>
                  <li>• Client Management</li>
                  <li>• Team Activities</li>
                </ul>
              </div>
              
              <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">📊 Analytics</h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Admin Hub</li>
                  <li>• Client Management</li>
                </ul>
              </div>
              
              <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-900 mb-2">⚙️ Advanced</h3>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• User Management</li>
                  <li>• CRM</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to start?</h2>
                <p className="text-blue-100">
                  Open the Control Panel for quick access to all modules
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/admin/control-panel')}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Open Control Panel
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors border border-blue-500"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
