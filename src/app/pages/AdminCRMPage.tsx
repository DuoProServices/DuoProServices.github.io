import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  Award, 
  TrendingUp, 
  DollarSign,
  Filter,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  Linkedin,
  Instagram,
  CheckCircle2,
  XCircle,
  Send,
  Clock,
  ArrowLeft,
  Loader2,
  WifiOff
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { isAdminEmail } from '@/app/config/admins';
import { projectId, publicAnonKey } from '@utils/supabase/info';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';

// Storage key for localStorage fallback
const STORAGE_KEY = 'crm-leads-local';
const OFFLINE_MODE_KEY = 'crm-offline-mode';

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  contactMethod: 'email' | 'whatsapp' | 'phone' | 'form' | 'referral' | 'linkedin' | 'instagram' | 'other';
  status: 'new' | 'contacted' | 'quote-sent' | 'negotiating' | 'won' | 'lost';
  estimatedValue?: number;
  notes?: string;
  quoteSent?: boolean;
  quoteSentDate?: string;
  closedDate?: string;
  lostReason?: string;
  source?: string;
  assignedTo?: string;
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
}

interface Activity {
  id: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'quote' | 'status-change';
  description: string;
  createdBy: string;
  createdAt: string;
}

interface CRMStats {
  total: number;
  new: number;
  contacted: number;
  quoteSent: number;
  negotiating: number;
  won: number;
  lost: number;
  conversionRate: number;
  totalValue: number;
  estimatedPipeline: number;
  byContactMethod: {
    email: number;
    whatsapp: number;
    phone: number;
    form: number;
    referral: number;
    linkedin: number;
    instagram: number;
    other: number;
  };
}

export function AdminCRMPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    contactMethod: 'email' as Lead['contactMethod'],
    status: 'new' as Lead['status'],
    estimatedValue: 0,
    notes: '',
    source: '',
    assignedTo: '',
  });

  useEffect(() => {
    if (!authLoading && user && !isAdminEmail(user.email)) {
      toast.error('Access denied. Admin permissions required.');
      navigate('/admin');
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user && isAdminEmail(user.email)) {
      // Check if we're in offline mode from previous session
      const offlineMode = localStorage.getItem(OFFLINE_MODE_KEY) === 'true';
      setIsOfflineMode(offlineMode);
      
      loadLeads();
      loadStats();
    }
  }, [user]);

  // Helper: Load from localStorage
  const loadFromLocalStorage = (): Lead[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  };

  // Helper: Save to localStorage
  const saveToLocalStorage = (leads: Lead[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Helper: Calculate stats from leads
  const calculateStats = (leadsData: Lead[]): CRMStats => {
    return {
      total: leadsData.length,
      new: leadsData.filter(l => l.status === 'new').length,
      contacted: leadsData.filter(l => l.status === 'contacted').length,
      quoteSent: leadsData.filter(l => l.status === 'quote-sent').length,
      negotiating: leadsData.filter(l => l.status === 'negotiating').length,
      won: leadsData.filter(l => l.status === 'won').length,
      lost: leadsData.filter(l => l.status === 'lost').length,
      conversionRate: leadsData.length > 0 
        ? Math.round((leadsData.filter(l => l.status === 'won').length / leadsData.length) * 100)
        : 0,
      totalValue: leadsData
        .filter(l => l.status === 'won')
        .reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
      estimatedPipeline: leadsData
        .filter(l => !['won', 'lost'].includes(l.status))
        .reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
      byContactMethod: {
        email: leadsData.filter(l => l.contactMethod === 'email').length,
        whatsapp: leadsData.filter(l => l.contactMethod === 'whatsapp').length,
        phone: leadsData.filter(l => l.contactMethod === 'phone').length,
        form: leadsData.filter(l => l.contactMethod === 'form').length,
        referral: leadsData.filter(l => l.contactMethod === 'referral').length,
        linkedin: leadsData.filter(l => l.contactMethod === 'linkedin').length,
        instagram: leadsData.filter(l => l.contactMethod === 'instagram').length,
        other: leadsData.filter(l => l.contactMethod === 'other').length,
      },
    };
  };

  const loadLeads = async () => {
    try {
      console.log('🔄 [CRM] Loading leads...');
      
      // If already in offline mode, use localStorage
      if (isOfflineMode) {
        console.log('📦 [CRM] Using localStorage (offline mode)');
        const localLeads = loadFromLocalStorage();
        setLeads(localLeads);
        setLoading(false);
        return;
      }

      // Try backend first
      console.log('🌐 [CRM] Attempting backend connection...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/crm/leads`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);
        console.log('📡 [CRM] Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.warn('⚠️ [CRM] Backend returned error:', response.status, errorText);
          throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ [CRM] Connected to backend. Loaded', data.length || 0, 'leads');
        
        const leadsData = Array.isArray(data) ? data : [];
        setLeads(leadsData);
        
        // Save to localStorage as backup
        saveToLocalStorage(leadsData);
        
        // Clear offline mode if it was set
        if (localStorage.getItem(OFFLINE_MODE_KEY) === 'true') {
          localStorage.removeItem(OFFLINE_MODE_KEY);
          setIsOfflineMode(false);
          console.log('🔄 [CRM] Backend is back online!');
        }
        
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        // Check if it's a timeout/abort error
        if (fetchError.name === 'AbortError') {
          console.log('⏱️ [CRM] Backend connection timeout (backend not available)');
          throw new Error('Backend timeout');
        }
        
        throw fetchError;
      }
      
    } catch (error: any) {
      // Backend is unavailable - this is OK, we have offline mode
      console.log('📦 [CRM] Backend unavailable - activating offline mode');
      console.log('💡 [CRM] All data will be saved locally');
      
      // Switch to offline mode
      const wasOffline = isOfflineMode;
      localStorage.setItem(OFFLINE_MODE_KEY, 'true');
      setIsOfflineMode(true);
      
      // Load from localStorage
      const localLeads = loadFromLocalStorage();
      setLeads(localLeads);
      
      // Show friendly message only on first time switching to offline
      if (!wasOffline) {
        toast.info('Working in offline mode', {
          description: 'Your changes will be saved locally in your browser.',
          duration: 4000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      
      // If in offline mode, calculate from local leads
      if (isOfflineMode) {
        console.log('📊 [CRM] Calculating stats from local data');
        const localLeads = loadFromLocalStorage();
        const calculatedStats = calculateStats(localLeads);
        setStats(calculatedStats);
        return;
      }

      // Try backend first
      console.log('🌐 [CRM] Loading stats from backend...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/crm/stats`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.warn('⚠️ [CRM] Backend stats error:', response.status, errorText);
          throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ [CRM] Stats loaded from backend');
        setStats(data);
        
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        // Check if it's a timeout/abort error
        if (fetchError.name === 'AbortError') {
          console.log('⏱️ [CRM] Stats timeout - using local calculation');
          throw new Error('Backend timeout');
        }
        
        throw fetchError;
      }
      
    } catch (error: any) {
      // Calculate from local data - this is normal in offline mode
      console.log('📊 [CRM] Calculating stats locally');
      
      const localLeads = loadFromLocalStorage();
      const calculatedStats = calculateStats(localLeads);
      setStats(calculatedStats);
    }
  };

  const handleSaveLead = async () => {
    try {
      if (!formData.name) {
        toast.error('Name is required');
        return;
      }

      // If in offline mode, save to localStorage
      if (isOfflineMode) {
        const localLeads = loadFromLocalStorage();
        
        if (editingLead) {
          // Update existing lead
          const updatedLeads = localLeads.map(lead => 
            lead.id === editingLead.id 
              ? {
                  ...lead,
                  ...formData,
                  estimatedValue: Number(formData.estimatedValue) || 0,
                  updatedAt: new Date().toISOString(),
                }
              : lead
          );
          saveToLocalStorage(updatedLeads);
          setLeads(updatedLeads);
        } else {
          // Create new lead
          const newLead: Lead = {
            id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...formData,
            estimatedValue: Number(formData.estimatedValue) || 0,
            activities: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          const updatedLeads = [newLead, ...localLeads];
          saveToLocalStorage(updatedLeads);
          setLeads(updatedLeads);
        }

        toast.success(`Lead ${editingLead ? 'updated' : 'created'} successfully (offline mode)`);
        setShowForm(false);
        setEditingLead(null);
        resetForm();
        loadStats(); // Recalculate stats
        return;
      }

      // Try backend
      const url = editingLead
        ? `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/crm/leads/${editingLead.id}`
        : `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/crm/leads`;

      const response = await fetch(url, {
        method: editingLead ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          estimatedValue: Number(formData.estimatedValue) || 0,
        }),
      });

      if (!response.ok) throw new Error('Failed to save lead');

      toast.success(`Lead ${editingLead ? 'updated' : 'created'} successfully`);
      setShowForm(false);
      setEditingLead(null);
      resetForm();
      loadLeads();
      loadStats();
    } catch (error) {
      console.error('Error saving lead:', error);
      toast.error('Failed to save lead');
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      // If in offline mode, delete from localStorage
      if (isOfflineMode) {
        const localLeads = loadFromLocalStorage();
        const updatedLeads = localLeads.filter(lead => lead.id !== leadId);
        saveToLocalStorage(updatedLeads);
        setLeads(updatedLeads);
        toast.success('Lead deleted successfully (offline mode)');
        loadStats(); // Recalculate stats
        return;
      }

      // Try backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/crm/leads/${leadId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete lead');

      toast.success('Lead deleted successfully');
      loadLeads();
      loadStats();
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
    }
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email || '',
      phone: lead.phone || '',
      company: lead.company || '',
      contactMethod: lead.contactMethod,
      status: lead.status,
      estimatedValue: lead.estimatedValue || 0,
      notes: lead.notes || '',
      source: lead.source || '',
      assignedTo: lead.assignedTo || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      contactMethod: 'email',
      status: 'new',
      estimatedValue: 0,
      notes: '',
      source: '',
      assignedTo: '',
    });
  };

  const getStatusBadgeColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'contacted': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'quote-sent': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'negotiating': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'won': return 'bg-green-100 text-green-700 border-green-200';
      case 'lost': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getContactMethodIcon = (method: Lead['contactMethod']) => {
    switch (method) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'form': return <FileText className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getFilteredLeads = () => {
    return leads.filter(lead => {
      if (filterStatus !== 'all' && lead.status !== filterStatus) return false;
      if (filterMethod !== 'all' && lead.contactMethod !== filterMethod) return false;
      return true;
    });
  };

  const filteredLeads = getFilteredLeads();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin Hub
              </Button>
              <div className="h-8 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">CRM - Lead Management</h1>
                  <p className="text-sm text-gray-600">Track contacts, quotes, and conversions</p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => {
                resetForm();
                setEditingLead(null);
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Lead
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Leads</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Won Deals</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{stats.won}</p>
                </div>
                <Award className="w-8 h-8 text-green-500" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversion Rate</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">{stats.conversionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Value Won</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">
                    ${stats.totalValue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
          </div>
        )}

        {/* Pipeline Stats */}
        {stats && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Pipeline</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
                <div className="text-xs text-gray-600 mt-1">New</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.contacted}</div>
                <div className="text-xs text-gray-600 mt-1">Contacted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.quoteSent}</div>
                <div className="text-xs text-gray-600 mt-1">Quote Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.negotiating}</div>
                <div className="text-xs text-gray-600 mt-1">Negotiating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.won}</div>
                <div className="text-xs text-gray-600 mt-1">Won</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.lost}</div>
                <div className="text-xs text-gray-600 mt-1">Lost</div>
              </div>
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="quote-sent">Quote Sent</option>
              <option value="negotiating">Negotiating</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>

            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Contact Methods</option>
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="phone">Phone</option>
              <option value="form">Contact Form</option>
              <option value="referral">Referral</option>
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="other">Other</option>
            </select>

            <div className="ml-auto text-sm text-gray-600">
              Showing {filteredLeads.length} of {leads.length} leads
            </div>
          </div>
        </Card>

        {/* Lead Form */}
        {showForm && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingLead ? 'Edit Lead' : 'New Lead'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Company Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Method
                </label>
                <select
                  value={formData.contactMethod}
                  onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value as Lead['contactMethod'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="phone">Phone</option>
                  <option value="form">Contact Form</option>
                  <option value="referral">Referral</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="instagram">Instagram</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Lead['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="quote-sent">Quote Sent</option>
                  <option value="negotiating">Negotiating</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Value ($)
                </label>
                <input
                  type="number"
                  value={formData.estimatedValue}
                  onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Google Ads, Facebook, etc."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Additional information..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingLead(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveLead}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {editingLead ? 'Update Lead' : 'Create Lead'}
              </Button>
            </div>
          </Card>
        )}

        {/* Leads Table */}
        <Card className="overflow-hidden">
          {filteredLeads.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Lead
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          {lead.company && (
                            <p className="text-sm text-gray-500">{lead.company}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {lead.email && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Mail className="w-3 h-3" />
                              <span>{lead.email}</span>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Phone className="w-3 h-3" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getContactMethodIcon(lead.contactMethod)}
                          <span className="text-sm text-gray-600 capitalize">
                            {lead.contactMethod.replace('-', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(lead.status)}`}>
                          {lead.status === 'won' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {lead.status === 'lost' && <XCircle className="w-3 h-3 mr-1" />}
                          {lead.status === 'quote-sent' && <Send className="w-3 h-3 mr-1" />}
                          {lead.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          ${lead.estimatedValue?.toLocaleString() || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditLead(lead)}
                            className="flex items-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteLead(lead.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}