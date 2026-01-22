import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { formatCAD } from "../config/pricing";
import { usePermissions } from "../hooks/usePermissions";
import { PaymentConfigStatus } from "../components/admin/PaymentConfigStatus";
import { supabase } from "../utils/supabaseClient";
import { API_ENDPOINTS } from "@/config/api";
import { fetchWithFallback } from "../utils/apiHelper";
import { DiagnosticPanel } from "../components/admin-hub/DiagnosticPanel";

interface DashboardStats {
  totalCustomers: number;
  pendingInvoices: number;
  monthlyRevenue: number;
  activeFilings: number;
}

interface Module {
  id: string;
  title: string;
  description: string;
  iconType: string; // Changed from icon component to string identifier
  color: string;
  bgColor: string;
  borderColor: string;
  route: string;
}

// Icon mapping function
const getIconComponent = (iconType: string) => {
  switch (iconType) {
    case "dashboard": return LayoutDashboard;
    case "bookkeeping": return Receipt;
    case "financial": return DollarSign;
    case "customers": return Users;
    case "marketing": return Megaphone;
    case "calendar": return Calendar;
    case "users": return Shield;
    case "productivity": return Award;
    default: return LayoutDashboard;
  }
};

// Static module definitions - no functions, no Context dependencies
const modules: Module[] = [
  {
    id: "bookkeeping",
    title: "Bookkeeping Dashboard",
    description: "Track expenses, manage invoices, and handle day-to-day accounting",
    iconType: "bookkeeping",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    route: "/admin/bookkeeping-dashboard",
  },
  {
    id: "financial",
    title: "Financial Dashboard",
    description: "View KPIs, revenue analytics, and comprehensive financial reports",
    iconType: "financial",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    route: "/admin/financial-dashboard",
  },
  {
    id: "invoices",
    title: "Invoice Management",
    description: "View, manage, and download all client invoices",
    iconType: "financial",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    route: "/admin/invoices",
  },
  {
    id: "payment-setup",
    title: "⚙️ Payment Setup",
    description: "Configure and test Stripe payment integration",
    iconType: "dashboard",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
    borderColor: "border-purple-200",
    route: "/admin/payment-setup",
  },
  {
    id: "customers",
    title: "Customer Dashboard",
    description: "Manage all customers, view details, documents, and filing status",
    iconType: "customers",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    route: "/admin/clients",
  },
  {
    id: "content-calendar",
    title: "Content Calendar",
    description: "Manage your marketing calendar and create post images",
    iconType: "calendar",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    route: "/admin/content-calendar",
  },
  {
    id: "roadmap",
    title: "🚀 Launch Roadmap",
    description: "Track February launch preparation with the team",
    iconType: "dashboard",
    color: "from-blue-500 to-green-500",
    bgColor: "bg-gradient-to-br from-blue-50 to-green-50",
    borderColor: "border-blue-300",
    route: "/admin/roadmap",
  },
  {
    id: "users",
    title: "User Management",
    description: "Manage team members, permissions, and access control",
    iconType: "users",
    color: "from-pink-500 to-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    route: "/admin/users",
  },
];

function AdminHubPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { hasPermission, isAdmin, loading: permissionsLoading } = usePermissions();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Load dashboard stats
  const loadDashboardStats = async () => {
    setLoadingStats(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;

      const { data, isMocked } = await fetchWithFallback('/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${sessionData.session.access_token}`,
        },
      });

      if (isMocked) {
        // Using mock data
        setStats({
          totalCustomers: data.totalClients || 0,
          pendingInvoices: data.pendingDocuments || 0,
          monthlyRevenue: data.monthlyRevenue || 0,
          activeFilings: data.activeReturns || 0
        });
      } else {
        // Parse real data
        const clientsData = data.clients || {};
        const financialData = data.financial || {};
        
        const currentYear = new Date().getFullYear();
        const activeFilings = clientsData.clients?.reduce((count: number, client: any) => {
          return count + (client.taxFilings?.filter((f: any) => 
            f.year === currentYear && 
            ['in-progress', 'review', 'awaiting-payment'].includes(f.status)
          ).length || 0);
        }, 0) || 0;

        const pendingInvoices = clientsData.clients?.reduce((count: number, client: any) => {
          return count + (client.taxFilings?.filter((f: any) => 
            f.status === 'awaiting-payment' && f.payment?.status === 'pending'
          ).length || 0);
        }, 0) || 0;

        // Get monthly revenue (current month)
        const currentMonth = new Date().getMonth() + 1;
        const currentMonthKey = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
        const monthlyRevenueData = financialData.monthlyRevenue?.find(
          (m: any) => m.month === currentMonthKey
        );

        setStats({
          totalCustomers: clientsData.clients?.length || 0,
          pendingInvoices,
          monthlyRevenue: monthlyRevenueData?.revenue || 0,
          activeFilings
        });
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Simple navigation handlers
  const handleNavigate = (route: string) => {
    navigate(route);
  };

  // Filter modules based on permissions
  const getVisibleModules = () => {
    if (permissionsLoading) return [];
    
    return modules.filter((module) => {
      // Special cases for modules that don't match permission IDs
      if (module.id === 'content-calendar') {
        return hasPermission('marketing');
      }
      if (module.id === 'productivity') {
        return hasPermission('customers');
      }
      // Users module only for admins
      if (module.id === 'users') {
        return isAdmin();
      }
      // Check permission for the module
      return hasPermission(module.id as any);
    });
  };

  const visibleModules = getVisibleModules();

  if (permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {t("admin.panel")}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {t("admin.welcomeBack")}, {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/dashboard")} variant="outline">
                {t("admin.clientPortal")}
              </Button>
              <Button onClick={handleSignOut} variant="ghost">
                <LogOut className="w-4 h-4 mr-2" />
                {t("admin.signOut")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Payment Config Status */}
        <div className="mb-6">
          <PaymentConfigStatus />
        </div>

        {/* Welcome Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Select a Category</h2>
          <p className="text-gray-600">
            Choose from the administrative tools below to manage your tax consultancy business
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleModules.map((category) => {
            const Icon = getIconComponent(category.iconType);
            
            return (
              <Card
                key={category.id}
                className={`
                  group relative overflow-hidden border-2 ${category.borderColor} 
                  hover:shadow-2xl transition-all duration-300 cursor-pointer
                  transform hover:-translate-y-1
                `}
                onClick={() => handleNavigate(category.route)}
              >
                {/* Background Gradient Effect */}
                <div className={`absolute inset-0 ${category.bgColor} opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                
                {/* Content */}
                <div className="relative p-8">
                  <div className="flex items-start justify-between mb-4">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Arrow */}
                    <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-white transition-colors">
                      <ArrowRight className="w-5 h-5 text-gray-700 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  {/* Hover Effect Line */}
                  <div className={`mt-6 h-1 bg-gradient-to-r ${category.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats Section */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border p-8">
          <h3 className="text-xl font-semibold mb-4">Quick Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-900">
                {loadingStats ? <Loader2 className="w-8 h-8 animate-spin" /> : stats?.totalCustomers || '—'}
              </p>
              <p className="text-sm text-gray-600">Total Customers</p>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <Receipt className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-indigo-900">
                {loadingStats ? <Loader2 className="w-8 h-8 animate-spin" /> : stats?.pendingInvoices || '—'}
              </p>
              <p className="text-sm text-gray-600">Pending Invoices</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-900">
                {loadingStats ? <Loader2 className="w-8 h-8 animate-spin" /> : formatCAD(stats?.monthlyRevenue || 0)}
              </p>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <LayoutDashboard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-900">
                {loadingStats ? <Loader2 className="w-8 h-8 animate-spin" /> : stats?.activeFilings || '—'}
              </p>
              <p className="text-sm text-gray-600">Active Filings</p>
            </div>
          </div>
        </div>

        {/* Diagnostic Panel */}
        <div className="mt-12">
          <DiagnosticPanel />
        </div>
      </main>
    </div>
  );
}

// Add default export
export default AdminHubPage;