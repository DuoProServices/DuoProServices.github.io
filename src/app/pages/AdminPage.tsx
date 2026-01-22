import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Calendar, TrendingUp, LogOut, Home, BarChart3, Settings, DollarSign, Loader2, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Profile {
  userId: string;
  email: string;
  name: string;
  phone?: string;
  onboardingCompleted?: boolean;
}

interface TaxFiling {
  id: string;
  userId: string;
  year: number;
  status: string;
  createdAt: string;
}

interface Invoice {
  id: string;
  userId: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalClients: number;
  activeReturns: number;
  totalRevenue: number;
  recentActivity: Array<{
    client: string;
    action: string;
    time: string;
  }>;
  recentClients: Array<{
    name: string;
    email: string;
    status: string;
  }>;
}

export default function AdminPage() {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'clients' | 'content'>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles
      const profilesRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/kv/getByPrefix?prefix=profile:`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      const profilesData = await profilesRes.json();
      const profiles: Profile[] = profilesData.values || [];

      // Fetch tax filings
      const filingsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/kv/getByPrefix?prefix=tax_filing:`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      const filingsData = await filingsRes.json();
      const filings: TaxFiling[] = filingsData.values || [];

      // Fetch invoices
      const invoicesRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/kv/getByPrefix?prefix=invoice:`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      const invoicesData = await invoicesRes.json();
      const invoices: Invoice[] = invoicesData.values || [];

      // Calculate stats
      const activeReturns = filings.filter(f => 
        ['documents_uploaded', 'in_review', 'in_progress'].includes(f.status)
      ).length;

      const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);

      // Recent activity (last 5 profiles)
      const sortedProfiles = [...profiles].sort((a, b) => 
        new Date(b.onboardingCompleted ? '2026-01-01' : '2025-01-01').getTime() - 
        new Date(a.onboardingCompleted ? '2026-01-01' : '2025-01-01').getTime()
      ).slice(0, 5);

      const recentActivity = sortedProfiles.map(profile => ({
        client: profile.name || profile.email,
        action: profile.onboardingCompleted ? 'Completed onboarding' : 'Registered',
        time: 'Recent'
      }));

      // Recent clients for table
      const recentClients = profiles.slice(0, 10).map(profile => ({
        name: profile.name || 'No name',
        email: profile.email,
        status: profile.onboardingCompleted ? 'Active' : 'Pending'
      }));

      setStats({
        totalClients: profiles.length,
        activeReturns,
        totalRevenue,
        recentActivity: recentActivity.length > 0 ? recentActivity : [{ client: 'No activity', action: 'No recent activity', time: '-' }],
        recentClients: recentClients.length > 0 ? recentClients : [{ name: 'No clients', email: 'No clients yet', status: '-' }]
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({
        totalClients: 0,
        activeReturns: 0,
        totalRevenue: 0,
        recentActivity: [{ client: 'Error', action: 'Failed to load data', time: '-' }],
        recentClients: [{ name: 'Error', email: 'Failed to load', status: '-' }]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - DuoPro Services</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-xl">
                  DuoPro
                </div>
                <span className="text-gray-900 font-semibold">Services - Admin</span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                  className="px-3 py-2 rounded-lg border border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                  {language === 'en' ? 'FR' : 'EN'}
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>{t('nav.home')}</span>
                </button>

                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
            <nav className="space-y-2">
              <button
                onClick={() => navigate('/admin/control-panel')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg mb-4"
              >
                <Settings className="w-5 h-5" />
                <span className="font-semibold">Control Panel</span>
              </button>

              <button
                onClick={() => setActiveView('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'dashboard'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </button>

              <button
                onClick={() => setActiveView('clients')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'clients'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Clients</span>
              </button>

              <button
                onClick={() => navigate('/admin/content-calendar')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-50"
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Content Calendar</span>
              </button>

              <button
                onClick={() => navigate('/admin/crm')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-50"
              >
                <Target className="w-5 h-5" />
                <span className="font-medium">CRM - Leads</span>
              </button>

              <button
                onClick={() => navigate('/admin/users-list')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-50"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">User Management</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {activeView === 'dashboard' && stats && (
              <div>
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="w-8 h-8 text-blue-600" />
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{stats.totalClients}</h3>
                    <p className="text-sm text-gray-600">Total Clients</p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <FileText className="w-8 h-8 text-green-600" />
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{stats.activeReturns}</h3>
                    <p className="text-sm text-gray-600">Active Returns</p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <Calendar className="w-8 h-8 text-purple-600" />
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                        This Month
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">-</h3>
                    <p className="text-sm text-gray-600">Content Posts</p>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <DollarSign className="w-8 h-8 text-yellow-600" />
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">${(stats.totalRevenue / 1000).toFixed(1)}k</h3>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {stats.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{activity.client}</p>
                          <p className="text-sm text-gray-600">{activity.action}</p>
                        </div>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeView === 'clients' && stats && (
              <div>
                <h1 className="text-3xl font-bold mb-8">Client Management</h1>
                
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {stats.recentClients.map((client, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{client.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              client.status === 'Active' ? 'bg-green-100 text-green-700' :
                              client.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {client.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => navigate('/admin/clients')}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}