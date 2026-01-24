import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { API_ENDPOINTS } from '@/config/api';
import { isAdminEmail } from '../config/admins';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  User,
  Flag,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Save,
  ArrowLeft,
  Filter
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  color: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // member id or 'all'
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
  createdBy: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Veronica Prass', email: 'veprass@gmail.com', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { id: '2', name: 'Jamila Azevedo', email: 'jamila.coura15@gmail.com', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  { id: '3', name: 'Germana Azevedo', email: 'germana.canada@gmail.com', color: 'bg-green-100 text-green-700 border-green-300' },
];

function AdminTeamActivityPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [filterMember, setFilterMember] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // ⚠️ DEMO MODE: Use localStorage when backend is not available
  // 🔗 COMPARTILHADO COM PROJECTS MODULE - mesmos dados!
  const DEMO_MODE = false; // ✅ BACKEND IS DEPLOYED - usando Supabase real!
  const STORAGE_KEY = 'admin-hub-tasks'; // MESMO KEY que ProjectsModule!

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: 'all',
    status: 'todo' as Activity['status'],
    priority: 'medium' as Activity['priority'],
    dueDate: '',
  });

  // Check admin access
  useEffect(() => {
    if (!isAdminEmail(user?.email)) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Load activities function (moved outside useEffect so it can be reused)
  const loadActivities = async () => {
    console.log('📦 [Team Activities] DEMO MODE: Loading from localStorage...');
    setIsLoading(true);
    
    try {
      // Em DEMO MODE, usa apenas localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Projects Module salva como { tasks: [...] }, então precisamos extrair o array
        const tasksArray = Array.isArray(parsed) ? parsed : (parsed.tasks || []);
        setActivities(tasksArray);
        console.log(`✅ [Team Activities] Loaded ${tasksArray.length} activities from localStorage`);
      } else {
        setActivities([]);
        console.log('📭 [Team Activities] No activities found - starting fresh');
      }
    } catch (err) {
      console.error('❌ [Team Activities] Error loading from localStorage:', err);
      setActivities([]);
    }
    
    setServerStatus('online');
    setIsLoading(false);
  };

  // Load activities on mount
  useEffect(() => {
    loadActivities();
  }, []);

  const handleSaveActivity = async () => {
    console.log('💾 [Team Activities] Starting save...', formData);
    
    if (!formData.title.trim()) {
      console.error('❌ [Team Activities] Title is required');
      alert('Please enter a title');
      return;
    }

    const activity: Activity = editingActivity
      ? { ...editingActivity, ...formData }
      : {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
          createdBy: user?.email || 'Unknown',
        };

    console.log('📦 [Team Activities] Activity object created:', activity);

    // ⚠️ DEMO MODE: Save to localStorage only
    if (DEMO_MODE) {
      console.log('📦 [Team Activities] DEMO MODE: Saving to localStorage');
      let currentActivities = activities;
      
      if (editingActivity) {
        // Update existing
        currentActivities = activities.map(a => a.id === editingActivity.id ? activity : a);
        console.log('✅ [Team Activities] Updated activity');
      } else {
        // Add new
        currentActivities = [...activities, activity];
        console.log('✅ [Team Activities] Added new activity');
      }
      
      // Salva no localStorage no formato { tasks: [...] } para compatibilidade com Projects Module
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks: currentActivities }));
      console.log('✅ [Team Activities] Saved to localStorage (synced with Projects Module)');
      
      // Atualiza o estado
      setActivities(currentActivities);
      resetForm();
      setShowAddModal(false);
      setEditingActivity(null);
      alert(editingActivity ? 'Activity updated successfully! 🎉' : 'Activity created successfully! 🎉');
      return;
    }

    try {
      console.log('📡 [Team Activities] Getting session...');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        console.error('❌ [Team Activities] No session found:', sessionError);
        alert('Not authenticated. Please log in again.');
        return;
      }

      console.log('✅ [Team Activities] Session found, sending POST request...');
      console.log('🔗 [Team Activities] URL:', API_ENDPOINTS.teamActivities);

      // Create timeout controller with 30 second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.error('⏱️ [Team Activities] Request timeout after 30 seconds!');
        controller.abort();
      }, 30000); // 30 second timeout

      try {
        console.log('🚀 [Team Activities] Initiating fetch...');
        
        const response = await fetch(
          API_ENDPOINTS.teamActivities,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionData.session.access_token}`,
            },
            body: JSON.stringify({ activity }),
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);
        
        console.log('📡 [Team Activities] ✨ RESPONSE RECEIVED!');
        console.log('📡 [Team Activities] Response status:', response.status);
        console.log('📡 [Team Activities] Response ok?:', response.ok);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('❌ [Team Activities] API Error:', errorData);
          alert(`Failed to save: ${errorData.error || 'Unknown error'}`);
          return;
        }

        const result = await response.json();
        console.log('✅ [Team Activities] Save successful:', result);

        await loadActivities();
        resetForm();
        setShowAddModal(false);
        setEditingActivity(null);
        
        alert(editingActivity ? 'Activity updated successfully! 🎉' : 'Activity created successfully! 🎉');
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.error('❌ [Team Activities] Request was aborted due to timeout');
          alert('Request timeout. The server is taking too long to respond. Please check your connection and try again.');
        } else {
          console.error('❌ [Team Activities] FETCH ERROR:', fetchError);
          console.error('❌ [Team Activities] Error name:', fetchError.name);
          console.error('❌ [Team Activities] Error message:', fetchError.message);
          alert(`Network error: ${fetchError.message || 'Failed to connect to server'}. Please try again.`);
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('❌ [Team Activities] Error saving activity:', error);
      // Don't show duplicate alert - already shown in catch block above
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    // ⚠️ DEMO MODE: Delete from localStorage only
    if (DEMO_MODE) {
      console.log('🗑️ [Team Activities] DEMO MODE: Deleting from localStorage');
      
      // Remove do localStorage
      const currentActivities = activities.filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks: currentActivities }));
      console.log('✅ [Team Activities] Deleted from localStorage (synced with Projects Module)');
      
      // Atualiza o estado
      setActivities(currentActivities);
      alert('Activity deleted successfully');
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        alert('Not authenticated');
        return;
      }

      const response = await fetch(
        API_ENDPOINTS.teamActivityDelete(id),
        {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${sessionData.session.access_token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.ok) {
        await loadActivities();
        alert('Activity deleted successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Failed to delete activity');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      assignedTo: 'all',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
    });
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description,
      assignedTo: activity.assignedTo,
      status: activity.status,
      priority: activity.priority,
      dueDate: activity.dueDate,
    });
    setShowAddModal(true);
  };

  const getMemberById = (id: string) => {
    return TEAM_MEMBERS.find(m => m.id === id);
  };

  const getStatusIcon = (status: Activity['status']) => {
    switch (status) {
      case 'todo': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'completed': return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const getPriorityColor = (priority: Activity['priority']) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesMember = filterMember === 'all' || activity.assignedTo === filterMember || activity.assignedTo === 'all';
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
    return matchesMember && matchesStatus;
  });

  const getActivityCountByMember = (memberId: string) => {
    return activities.filter(a => a.assignedTo === memberId && a.status !== 'completed').length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Server Status Banner */}
      {serverStatus === 'offline' && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">
                  ⚠️ Edge Function Not Deployed
                </h3>
                <p className="text-red-800 mb-4">
                  The Supabase Edge Function <code className="bg-red-100 px-2 py-1 rounded">make-server-c2a25be0</code> is not responding. 
                  This means it hasn't been deployed yet.
                </p>
                <div className="space-y-2 text-sm text-red-900">
                  <p className="font-semibold">Quick Fix:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>
                      Go to:{' '}
                      <a 
                        href="https://supabase.com/dashboard/project/pwlacumydrxvshklvttp/functions" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-red-700 font-medium"
                      >
                        Supabase Functions Dashboard
                      </a>
                    </li>
                    <li>Click "Create a new function" → Name it: <code className="bg-red-100 px-1 rounded">make-server-c2a25be0</code></li>
                    <li>Copy the code from <code className="bg-red-100 px-1 rounded">/supabase/functions/make-server-c2a25be0/index.ts</code></li>
                    <li>Deploy and wait 10-30 seconds</li>
                    <li>Reload this page</li>
                  </ol>
                  <p className="mt-3">
                    📄{' '}
                    <a 
                      href="/test-server.html" 
                      target="_blank"
                      className="underline hover:text-red-700 font-medium"
                    >
                      Open Server Test Page
                    </a>
                    {' '}to verify the deployment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {serverStatus === 'online' && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-900 font-medium">
                ✅ Edge Function is online and responding
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/control-panel')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Control Panel</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">Team Activity Manager</h1>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingActivity(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Activity
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Team Members Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {TEAM_MEMBERS.map(member => (
            <div key={member.id} className={`${member.color} border rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <h3 className="font-semibold">{member.name}</h3>
                </div>
                <span className="text-2xl font-bold">{getActivityCountByMember(member.id)}</span>
              </div>
              <p className="text-sm opacity-75">{member.email}</p>
              <p className="text-xs mt-1 opacity-60">Active tasks</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Team Member:</label>
              <select
                value={filterMember}
                onChange={(e) => setFilterMember(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Team Members</option>
                {TEAM_MEMBERS.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Activities List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading activities...</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No activities found</h3>
            <p className="text-gray-500 mb-6">Create your first activity to get started</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Activity
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map(activity => {
              const member = getMemberById(activity.assignedTo);
              return (
                <div key={activity.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(activity.status)} flex items-center gap-1`}>
                          {getStatusIcon(activity.status)}
                          {activity.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(activity.priority)}`}>
                          {activity.priority.toUpperCase()}
                        </span>
                      </div>
                      {activity.description && (
                        <p className="text-gray-600 mb-3">{activity.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>
                            {activity.assignedTo === 'all' 
                              ? 'All Team Members' 
                              : member?.name || 'Unknown'}
                          </span>
                        </div>
                        {activity.dueDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(activity.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => openEditModal(activity)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingActivity ? 'Edit Activity' : 'New Activity'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingActivity(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Activity title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Activity description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Team Members</option>
                    {TEAM_MEMBERS.map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Activity['status'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Activity['priority'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingActivity(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveActivity}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingActivity ? 'Update Activity' : 'Create Activity'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTeamActivityPage;