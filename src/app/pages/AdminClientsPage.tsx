import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { supabase } from "../utils/supabaseClient";
import { isAdminEmail } from "../config/admins";
import { API_ENDPOINTS } from "@/config/api";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { 
  ArrowLeft, 
  Search, 
  Users, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  FileText,
  Mail,
  Calendar,
  Receipt,
  DollarSign,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { AdminMessageDialog } from "../components/AdminMessageDialog";
import { AssignCaseDialog } from "../components/AssignCaseDialog";
import { Badge } from "../components/ui/badge";

interface Client {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  personalInfo: any;
  taxFilings: any[];
  onboardingComplete: boolean;
  assignedAccountant?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

function AdminClientsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [assignDialogData, setAssignDialogData] = useState<{ 
    clientId: string; 
    clientName: string; 
    year: number; 
    currentAssignedTo?: string; 
  } | null>(null);

  // ⚠️ DEMO MODE: Use sample data when backend is not available
  const DEMO_MODE = false; // ✅ BACKEND IS DEPLOYED - usando Supabase real!
  const STORAGE_KEY = 'admin-clients-demo';

  useEffect(() => {
    if (!user || !isAdminEmail(user.email)) {
      navigate("/login");
      return;
    }
    loadClients();
  }, [user]);

  const loadClients = async () => {
    setLoading(true);
    try {
      // ⚠️ DEMO MODE: Load REAL clients from Supabase
      if (DEMO_MODE) {
        console.log('📦 [Admin Clients] Loading REAL clients from Supabase KV store...');
        
        // DEBUG: Buscar TODAS as chaves para ver o que existe
        const { data: allKeys, error: allKeysError } = await supabase
          .from('kv_store_c2a25be0')
          .select('key')
          .limit(100);
        
        console.log('🔍 [DEBUG] ALL KEYS in database:', allKeys?.map(k => k.key));
        
        // Buscar todos os personal_info do KV store (isso não precisa de admin)
        const { data: personalInfos, error: kvError } = await supabase
          .from('kv_store_c2a25be0')
          .select('key, value')
          .like('key', 'personal_info:%');

        console.log('🔍 [DEBUG] Query result:', { 
          error: kvError, 
          count: personalInfos?.length,
          keys: personalInfos?.map(p => p.key)
        });

        if (kvError) {
          console.error('❌ Error fetching from KV store:', kvError);
          toast.error('Failed to fetch clients from database');
          setLoading(false);
          return;
        }

        console.log(`📋 Found ${personalInfos?.length || 0} clients in KV store`);

        if (!personalInfos || personalInfos.length === 0) {
          console.log('📭 No clients found in database');
          console.log('💡 Checking if there are users with onboarding data...');
          
          // Tentar buscar por onboarding_data também
          const { data: onboardingData } = await supabase
            .from('kv_store_c2a25be0')
            .select('key, value')
            .like('key', 'onboarding_data:%');
          
          console.log('🔍 [DEBUG] Onboarding data:', {
            count: onboardingData?.length,
            keys: onboardingData?.map(o => o.key)
          });
          
          if (onboardingData && onboardingData.length > 0) {
            // Usar onboarding_data como fonte
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
                onboardingComplete: true,
                assignedAccountant: null
              };
            });
            
            console.log(`✅ Loaded ${clientsFromOnboarding.length} clients from onboarding_data`);
            setClients(clientsFromOnboarding);
            toast.success(`✅ Loaded ${clientsFromOnboarding.length} client(s)`);
            setLoading(false);
            return;
          }
          
          setClients([]);
          setLoading(false);
          toast.info('No clients registered yet. Users need to complete signup.');
          return;
        }

        // Processar cada cliente
        const clientsData: Client[] = await Promise.all(
          personalInfos.map(async (info) => {
            // Extrair userId da key: "personal_info:userId"
            const userId = info.key.replace('personal_info:', '');
            const personalInfo = info.value;

            console.log('🔍 [DEBUG] Processing client:', {
              userId: userId.substring(0, 8) + '...',
              hasPersonalInfo: !!personalInfo,
              personalInfoKeys: personalInfo ? Object.keys(personalInfo) : []
            });

            // Buscar email e nome do user_metadata no KV store
            const { data: userMetadata } = await supabase
              .from('kv_store_c2a25be0')
              .select('value')
              .eq('key', `user_metadata:${userId}`)
              .single();

            // Buscar todas as tax filings deste usuário
            const { data: filingsData } = await supabase
              .from('kv_store_c2a25be0')
              .select('value')
              .like('key', `tax_filing:${userId}:%`);

            // Buscar assignedAccountant se existir
            const { data: assignedData } = await supabase
              .from('kv_store_c2a25be0')
              .select('value')
              .eq('key', `assigned_accountant:${userId}`)
              .single();

            // Determinar email e nome
            const email = userMetadata?.value?.email || personalInfo?.email || `user-${userId.substring(0, 8)}@example.com`;
            const name = userMetadata?.value?.name || personalInfo?.firstName || email.split('@')[0];

            return {
              id: userId,
              email: email,
              name: name,
              createdAt: userMetadata?.value?.created_at || new Date().toISOString(),
              personalInfo: personalInfo,
              taxFilings: filingsData?.map(f => f.value) || [],
              onboardingComplete: !!personalInfo,
              assignedAccountant: assignedData?.value || null
            };
          })
        );

        console.log(`✅ Loaded ${clientsData.length} REAL clients from KV store`);
        console.log('📋 Clients summary:', clientsData.map(c => ({
          name: c.name,
          email: c.email,
          onboarded: c.onboardingComplete
        })));
        
        setClients(clientsData);
        
        if (clientsData.length > 0) {
          toast.success(`✅ Loaded ${clientsData.length} real client(s)`);
        } else {
          toast.info('No clients have completed signup yet');
        }
        
        setLoading(false);
        return;
      }

      // Backend mode - try to fetch from server
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error("Not authenticated");
      }

      const accessToken = sessionData.session.access_token;
      console.log('🔑 Got access token, fetching clients from server...');

      // ⚠️ DEMO MODE: Se backend falhar, busca direto do Supabase
      try {
        // Tentar buscar do servidor primeiro
        const response = await fetch(
          API_ENDPOINTS.adminClients,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Backend not available');
        }

        const data = await response.json();
        console.log("✅ Fetched clients from server:", data.clients);
        setClients(data.clients || []);
        
        if (!data.clients || data.clients.length === 0) {
          toast.info("No customers found. Users need to sign up first.");
        }
      } catch (backendError) {
        // Backend não disponível - buscar direto do Supabase
        console.log("⚠️ Backend not available, fetching from Supabase directly...");
        
        // Buscar todos os usuários do auth.users
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
        
        if (usersError) {
          console.error("Error fetching users from Supabase:", usersError);
          throw new Error("Failed to fetch users from Supabase");
        }

        console.log("📦 [DEMO MODE] Found users:", users?.length);

        // Buscar dados adicionais de cada usuário
        const clientsData: Client[] = await Promise.all(
          users.map(async (user) => {
            // Buscar dados do KV store
            const { data: kvData } = await supabase
              .from('kv_store_c2a25be0')
              .select('*')
              .ilike('key', `personal_info:${user.id}%`)
              .limit(1)
              .single();

            const { data: filingData } = await supabase
              .from('kv_store_c2a25be0')
              .select('*')
              .ilike('key', `tax_filing:${user.id}%`);

            return {
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
              createdAt: user.created_at,
              personalInfo: kvData?.value || null,
              taxFilings: filingData?.map(f => f.value) || [],
              onboardingComplete: !!kvData?.value,
              assignedAccountant: null
            };
          })
        );

        console.log("✅ [DEMO MODE] Loaded clients from Supabase:", clientsData.length);
        setClients(clientsData);

        if (clientsData.length === 0) {
          toast.info("No customers found. Users need to sign up first.");
        } else {
          toast.success(`✅ Loaded ${clientsData.length} client(s) from database`);
        }
      }
    } catch (error) {
      console.error("Error loading clients:", error);
      toast.error(`Failed to load customers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientStatus = (client: Client) => {
    if (!client.onboardingComplete) {
      return {
        label: "Pending Onboarding",
        color: "bg-yellow-100 text-yellow-700 border-yellow-300",
        icon: AlertCircle
      };
    }

    const activeFiling = client.taxFilings?.find(f => 
      f.status === "in-progress" || f.status === "under-review"
    );

    if (activeFiling) {
      if (activeFiling.status === "under-review") {
        return {
          label: "Needs Review",
          color: "bg-orange-100 text-orange-700 border-orange-300",
          icon: AlertCircle
        };
      }
      return {
        label: "In Progress",
        color: "bg-blue-100 text-blue-700 border-blue-300",
        icon: Clock
      };
    }

    return {
      label: "Active",
      color: "bg-green-100 text-green-700 border-green-300",
      icon: CheckCircle
    };
  };

  const getTaxFilingsCount = (client: Client) => {
    return client.taxFilings?.length || 0;
  };

  const getLatestFilingYear = (client: Client) => {
    if (!client.taxFilings || client.taxFilings.length === 0) return null;
    
    // Filter valid years only
    const years: number[] = [];
    client.taxFilings.forEach(f => {
      if (f && typeof f === 'object' && 'year' in f && typeof f.year === 'number') {
        years.push(f.year);
      }
    });
    
    if (years.length === 0) return null;
    years.sort((a, b) => b - a);
    return years[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{t("admin.customerDashboard")}</h1>
                <p className="text-sm text-gray-500">
                  {clients.length} {clients.length === 1 ? t("admin.customer") : t("admin.customers")} {t("admin.customersTotal")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                onClick={() => navigate("/admin/bookkeeping-dashboard")} 
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Receipt className="w-4 h-4 mr-2" />
                {t("admin.bookkeepingTitle")}
              </Button>
              <Button 
                onClick={() => navigate("/admin/financial-dashboard")} 
                className="bg-green-600 hover:bg-green-700"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                {t("admin.financialTitle")}
              </Button>
              
              {/* Separador Visual */}
              <div className="w-px h-8 bg-gray-300 mx-2"></div>
              
              <Button onClick={() => navigate("/admin")} variant="ghost">
                {t("admin.backToHub")}
              </Button>
              <Button onClick={() => navigate("/")} variant="ghost">
                Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search clients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Clients</p>
                <p className="text-2xl font-semibold mt-1">{clients.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Onboarded</p>
                <p className="text-2xl font-semibold mt-1">
                  {clients.filter(c => c.onboardingComplete).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Needs Review</p>
                <p className="text-2xl font-semibold mt-1">
                  {clients.filter(c => 
                    c.taxFilings?.some(f => f.status === "under-review")
                  ).length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Filings</p>
                <p className="text-2xl font-semibold mt-1">
                  {clients.reduce((sum, c) => 
                    sum + (c.taxFilings?.filter(f => 
                      f.status === "in-progress" || f.status === "under-review"
                    ).length || 0), 0
                  )}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
        </div>

        {/* Clients List */}
        <div className="space-y-4">
          {filteredClients.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchTerm ? "No clients found matching your search" : "No clients yet"}
              </p>
            </Card>
          ) : (
            filteredClients.map((client) => {
              const status = getClientStatus(client);
              const StatusIcon = status.icon;
              const latestYear = getLatestFilingYear(client);

              return (
                <Card 
                  key={client.id} 
                  className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/admin/client/${client.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-lg">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg">{client.name}</h3>
                          <Badge variant="outline" className={`${status.color} border`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-3">{client.email}</p>

                        <div className="flex items-center gap-6 text-sm flex-wrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              Joined {new Date(client.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {getTaxFilingsCount(client)} {getTaxFilingsCount(client) === 1 ? "filing" : "filings"}
                            </span>
                          </div>

                          {latestYear && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">
                                Latest: Tax Year {latestYear}
                              </span>
                            </div>
                          )}

                          {/* Assigned Accountant */}
                          {client.assignedAccountant ? (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">
                                Managed by:{' '}
                                <span className="font-medium text-purple-600">
                                  {client.assignedAccountant.name}
                                </span>
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500 italic">
                                Unassigned
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClient({ id: client.id, name: client.name });
                          setMessageDialogOpen(true);
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="ghost" size="sm">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </main>

      {/* Admin Message Dialog */}
      <AdminMessageDialog
        open={messageDialogOpen}
        onOpenChange={setMessageDialogOpen}
        clientId={selectedClient?.id || ""}
        clientName={selectedClient?.name || ""}
      />

      {/* Assign Case Dialog */}
      <AssignCaseDialog
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        data={assignDialogData}
      />
    </div>
  );
}

export default AdminClientsPage;