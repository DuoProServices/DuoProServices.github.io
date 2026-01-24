import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  ArrowLeft,
  Users,
  UserPlus,
  RefreshCw,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
  Shield,
  Eye,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { supabase } from '@/app/utils/supabaseClient';
import { useBackendStatus } from '../hooks/useBackendStatus';
import { BackendDeploymentRequired } from '../components/BackendDeploymentRequired';

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastSignIn?: string;
  emailConfirmed?: boolean;
  userMetadata?: any;
}

function AdminUsersListPage() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { isBackendOnline, isChecking } = useBackendStatus();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Add user form
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [adding, setAdding] = useState(false);

  // Admin check
  const adminEmails = ['veprass@gmail.com', 'germana.canada@gmail.com', 'jamila.coura15@gmail.com'];
  const isAdmin = adminEmails.includes(currentUser?.email?.toLowerCase() || '');

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin only.');
      navigate('/admin');
      return;
    }
    loadUsers();
  }, [isAdmin, navigate]);

  useEffect(() => {
    // Filter users based on search
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(u => 
          u.email?.toLowerCase().includes(term) ||
          u.name?.toLowerCase().includes(term) ||
          u.userMetadata?.name?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading users from backend...');

      // Get access token from Supabase session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('No active session');
      }

      const token = session.access_token;
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/users`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Special message for deployment issues
        if (response.status === 404 || response.status === 503) {
          throw new Error('Backend not deployed yet. Please deploy the Edge Function in Supabase Dashboard: Project → Edge Functions → make-server-c2a25be0 → Redeploy');
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      console.log(`✅ Found ${data.users.length} users from backend`);

      setUsers(data.users);
      setFilteredUsers(data.users);
      
      toast.success(`Loaded ${data.users.length} users`);
    } catch (error: any) {
      console.error('❌ Error loading users:', error);
      
      // More helpful error messages
      if (error.message.includes('Failed to fetch')) {
        toast.error('⚠️ Backend not responding. Please DEPLOY the Edge Function first!', {
          duration: 10000,
          description: 'Go to: Supabase Dashboard → Edge Functions → make-server-c2a25be0 → Redeploy'
        });
        
        // Show diagnostic tool suggestion
        toast.info('💡 Click here to run Backend Diagnostic Tool', {
          duration: 10000,
          onClick: () => {
            window.open('/backend-diagnostic', '_blank');
          }
        });
      } else {
        toast.error('Failed to load users: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUserEmail || !newUserPassword || !newUserName) {
      toast.error('Please fill all fields');
      return;
    }

    if (newUserPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setAdding(true);
      console.log('➕ Creating new user:', newUserEmail);

      // Get access token from Supabase session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('No active session');
      }

      const token = session.access_token;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/admin/create-user`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: newUserEmail,
            password: newUserPassword,
            name: newUserName
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      console.log('✅ User created successfully:', data.user.id);
      
      toast.success(`User ${newUserName} created successfully!`);
      
      // Reset form
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserName('');
      setShowAddDialog(false);
      
      // Reload users
      await loadUsers();
    } catch (error: any) {
      console.error('❌ Error creating user:', error);
      toast.error('Failed to create user: ' + error.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log('🗑️ Deleting user:', userId);

      // Get access token from Supabase session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('No active session');
      }

      const token = session.access_token;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      console.log('✅ User deleted successfully');
      toast.success(`User ${userName} deleted`);
      
      // Reload users
      await loadUsers();
    } catch (error: any) {
      console.error('❌ Error deleting user:', error);
      toast.error('Failed to delete user: ' + error.message);
    }
  };

  if (!isAdmin) {
    return null;
  }

  // Show deployment required screen if backend is offline
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isBackendOnline === false) {
    return <BackendDeploymentRequired onBackendReady={() => window.location.reload()} />;
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
                Back to Admin
              </Button>
              <div className="h-8 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                  <p className="text-sm text-gray-600">Manage all registered users in the system</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={loadUsers}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add User
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{users.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Email Confirmed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {users.filter(u => u.emailConfirmed).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Confirmation</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">
                  {users.filter(u => !u.emailConfirmed).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Users Table */}
        <Card className="overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">
                {searchTerm ? 'No users found matching your search' : 'No users registered yet'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {!searchTerm && 'Click "Add User" to create the first user'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                      Last Login
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.emailConfirmed ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm text-green-600 font-medium">Confirmed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span className="text-sm text-orange-600 font-medium">Pending</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {user.lastSignIn 
                            ? new Date(user.lastSignIn).toLocaleDateString()
                            : 'Never'
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/clients/${user.id}`)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
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

        {/* Info Tip */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Tip:</strong> Users are automatically saved to Supabase Auth when they sign up. 
            To see newly created users, make sure the backend is deployed in Supabase Dashboard.
          </p>
        </div>
      </div>

      {/* Add User Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New User</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddDialog(false);
                  setNewUserName('');
                  setNewUserEmail('');
                  setNewUserPassword('');
                }}
                disabled={adding}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 mb-2 block">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="John Doe"
                  disabled={adding}
                  className="mt-1 bg-white text-gray-900"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 mb-2 block">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  disabled={adding}
                  className="mt-1 bg-white text-gray-900"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 mb-2 block">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  disabled={adding}
                  minLength={6}
                  className="mt-1 bg-white text-gray-900"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={handleAddUser}
                  disabled={adding || !newUserName || !newUserEmail || !newUserPassword}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {adding ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create User
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false);
                    setNewUserName('');
                    setNewUserEmail('');
                    setNewUserPassword('');
                  }}
                  disabled={adding}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AdminUsersListPage;