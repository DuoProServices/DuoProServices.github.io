import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Search, 
  Filter, 
  FileText, 
  Mail, 
  Phone, 
  Calendar,
  ChevronRight,
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/app/utils/supabaseClient';
import { API_ENDPOINTS } from '@/config/api';
import { toast } from 'sonner';

interface Client {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  personalInfo?: any;
  taxFilings?: any[];
  onboardingComplete?: boolean;
}

export default function ClientsModule() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'onboarding'>('all');
  const [usingFallback, setUsingFallback] = useState(false);

  // ⚠️ FALLBACK MODE: Try backend first, use Supabase KV directly if failed
  const STORAGE_KEY = 'admin-clients-demo';

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error('❌ [ClientsModule] Auth error:', sessionError);
        throw new Error("Not authenticated");
      }

      try {
        // Try backend API first
        console.log('✅ [ClientsModule] Auth OK, fetching from:', API_ENDPOINTS.adminClients);
        
        const response = await fetch(API_ENDPOINTS.adminClients, {
          headers: {
            'Authorization': `Bearer ${sessionData.session.access_token}`,
          },
        });

        console.log('📡 [ClientsModule] Response status:', response.status);

        if (!response.ok) {
          throw new Error("Backend API failed");
        }

        const data = await response.json();
        console.log('✅ [ClientsModule] Loaded clients from API:', data.clients?.length || 0);
        setClients(data.clients || []);
        setUsingFallback(false);
        
      } catch (apiError) {
        // Fallback: Load directly from Supabase KV store
        console.log('📦 [ClientsModule] Using direct database access...');
        setUsingFallback(true);
        
        // Buscar todos os personal_info do KV store
        const { data: personalInfos, error: kvError } = await supabase
          .from('kv_store_c2a25be0')
          .select('key, value')
          .like('key', 'personal_info:%');

        if (kvError) {
          console.error('❌ Error fetching from KV store:', kvError);
          throw new Error('Failed to load from both API and KV store');
        }

        console.log(`📋 Found ${personalInfos?.length || 0} clients in KV store`);

        if (!personalInfos || personalInfos.length === 0) {
          // Tentar buscar por onboarding_data também
          const { data: onboardingData } = await supabase
            .from('kv_store_c2a25be0')
            .select('key, value')
            .like('key', 'onboarding_data:%');
          
          if (onboardingData && onboardingData.length > 0) {
            const clientsFromOnboarding = onboardingData.map(data => {
              const userId = data.key.replace('onboarding_data:', '');
              const obData = data.value;
              
              return {
                id: userId,
                email: obData?.email || `user-${userId.substring(0, 8)}@example.com`,
                name: obData?.firstName || obData?.email?.split('@')[0] || 'Unknown User',
                createdAt: new Date().toISOString(),
                personalInfo: obData,
                taxFilings: [],
                onboardingComplete: true
              };
            });
            
            console.log(`✅ Loaded ${clientsFromOnboarding.length} clients from onboarding_data`);
            setClients(clientsFromOnboarding);
            return;
          }
          
          setClients([]);
          toast.info('No clients registered yet');
          return;
        }

        // Processar cada cliente
        const clientsData: Client[] = await Promise.all(
          personalInfos.map(async (info) => {
            const userId = info.key.replace('personal_info:', '');
            const personalInfo = info.value;

            // Buscar dados adicionais
            const { data: userMetadata } = await supabase
              .from('kv_store_c2a25be0')
              .select('value')
              .eq('key', `user_metadata:${userId}`)
              .single();

            const { data: filingsData } = await supabase
              .from('kv_store_c2a25be0')
              .select('value')
              .like('key', `tax_filing:${userId}:%`);

            const email = userMetadata?.value?.email || personalInfo?.email || `user-${userId.substring(0, 8)}@example.com`;
            const name = userMetadata?.value?.name || personalInfo?.firstName || email.split('@')[0];

            return {
              id: userId,
              email: email,
              name: name,
              createdAt: userMetadata?.value?.created_at || new Date().toISOString(),
              personalInfo: personalInfo,
              taxFilings: filingsData?.map(f => f.value) || [],
              onboardingComplete: !!personalInfo
            };
          })
        );

        console.log(`✅ Loaded ${clientsData.length} clients from KV store`);
        setClients(clientsData);
      }
    } catch (error) {
      console.error("❌ [ClientsModule] Error loading clients:", error);
      toast.error(`Failed to load clients: ${error instanceof Error ? error.message : 'Network error'}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && client.onboardingComplete) ||
      (filterStatus === 'onboarding' && !client.onboardingComplete);
    
    return matchesSearch && matchesFilter;
  });

  const handleClientClick = (clientId: string) => {
    navigate(`/admin/clients/${clientId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Data Source Indicator */}
      {usingFallback && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <p className="text-sm text-blue-800">
            Using direct database access (API endpoint not responding)
          </p>
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{clients.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Clients</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {clients.filter(c => c.onboardingComplete).length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Onboarding</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {clients.filter(c => !c.onboardingComplete).length}
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="all">All Clients</option>
              <option value="active">Active Only</option>
              <option value="onboarding">In Onboarding</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax Filings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No clients found</p>
                    {searchTerm && (
                      <p className="text-sm text-gray-500 mt-1">
                        Try adjusting your search or filters
                      </p>
                    )}
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleClientClick(client.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {client.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {client.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="truncate max-w-xs">{client.email}</span>
                        </div>
                        {client.personalInfo?.homePhoneNumber && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>
                              ({client.personalInfo.homePhoneArea}) {client.personalInfo.homePhoneNumber}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {client.onboardingComplete ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Onboarding
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {client.taxFilings?.length || 0} filing(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(client.createdAt).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClientClick(client.id);
                        }}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 ml-auto"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}