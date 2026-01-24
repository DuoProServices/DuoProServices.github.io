import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { supabase } from '@/app/utils/supabaseClient';
import { API_ENDPOINTS } from '@/config/api';
import { InvoicesAPI } from '@/utils/localApiMock';
import { toast } from 'sonner';
import { 
  DollarSign, 
  TrendingUp, 
  Receipt, 
  Clock, 
  CheckCircle,
  Loader2,
  AlertCircle,
  Filter,
  Calendar,
  FileText,
  Download,
  XCircle
} from 'lucide-react';

const formatCAD = (amount: number) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
};

interface Invoice {
  invoiceNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  paidAt?: string;
  taxYear?: string;
}

interface FinancialStats {
  totalRevenue: number;
  pendingAmount: number;
  paidAmount: number;
  totalInvoices: number;
  pendingInvoices: number;
  paidInvoices: number;
}

export default function FinancialModule() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [stats, setStats] = useState<FinancialStats>({
    totalRevenue: 0,
    pendingAmount: 0,
    paidAmount: 0,
    totalInvoices: 0,
    pendingInvoices: 0,
    paidInvoices: 0
  });
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid' | 'cancelled'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'month' | 'quarter' | 'year'>('all');

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [invoices]);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        throw new Error("Not authenticated");
      }

      try {
        // Tenta carregar do servidor
        console.log('🔄 [FinancialModule] Trying API:', API_ENDPOINTS.bookkeepingInvoices);
        const response = await fetch(API_ENDPOINTS.bookkeepingInvoices, {
          headers: {
            'Authorization': `Bearer ${sessionData.session.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Backend API failed");
        }

        const data = await response.json();
        console.log('✅ [FinancialModule] Loaded from API:', data.invoices?.length || 0);
        setInvoices(data.invoices || []);
        setUsingFallback(false);
      } catch (fetchError) {
        // Fallback: usa localStorage/mock data
        console.log('📦 [FinancialModule] Using local storage fallback...');
        setUsingFallback(true);
        const localData = await InvoicesAPI.getInvoices();
        console.log('✅ [FinancialModule] Loaded from local:', localData.invoices?.length || 0);
        setInvoices(localData.invoices || []);
      }
    } catch (error) {
      console.error("Error loading invoices:", error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const filteredByDate = filterInvoicesByDate(invoices);
    
    const newStats: FinancialStats = {
      totalRevenue: 0,
      pendingAmount: 0,
      paidAmount: 0,
      totalInvoices: filteredByDate.length,
      pendingInvoices: 0,
      paidInvoices: 0
    };

    filteredByDate.forEach(invoice => {
      if (invoice.status === 'paid') {
        newStats.paidAmount += invoice.amount;
        newStats.paidInvoices += 1;
      } else if (invoice.status === 'pending') {
        newStats.pendingAmount += invoice.amount;
        newStats.pendingInvoices += 1;
      }
    });

    newStats.totalRevenue = newStats.paidAmount + newStats.pendingAmount;
    setStats(newStats);
  };

  const filterInvoicesByDate = (invoiceList: Invoice[]) => {
    if (dateFilter === 'all') return invoiceList;

    const now = new Date();
    const filterDate = new Date();

    switch (dateFilter) {
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return invoiceList.filter(invoice => 
      new Date(invoice.createdAt) >= filterDate
    );
  };

  const filteredInvoices = invoices
    .filter(invoice => filterStatus === 'all' || invoice.status === filterStatus)
    .filter(invoice => filterInvoicesByDate([invoice]).length > 0)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleDownloadInvoice = async (invoiceNumber: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return;

      const response = await fetch(
        API_ENDPOINTS.invoicePdf(invoiceNumber),
        {
          headers: {
            'Authorization': `Bearer ${sessionData.session.access_token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to download invoice');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download invoice');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading financial data...</p>
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
            Using local storage (API endpoint not responding)
          </p>
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatCAD(stats.totalRevenue)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {stats.totalInvoices} total invoices
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">Paid</p>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {formatCAD(stats.paidAmount)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {stats.paidInvoices} paid invoices
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">Pending</p>
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {formatCAD(stats.pendingAmount)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {stats.pendingInvoices} pending invoices
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">Average Invoice</p>
            <div className="p-2 bg-purple-50 rounded-lg">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatCAD(stats.totalInvoices > 0 ? stats.totalRevenue / stats.totalInvoices : 0)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Across all invoices
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid Only</option>
              <option value="pending">Pending Only</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No invoices found</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.invoiceNumber} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono font-medium text-gray-900">
                        #{invoice.invoiceNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.userName}
                        </div>
                        <div className="text-sm text-gray-500">{invoice.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCAD(invoice.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(invoice.createdAt).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDownloadInvoice(invoice.invoiceNumber)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Download
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