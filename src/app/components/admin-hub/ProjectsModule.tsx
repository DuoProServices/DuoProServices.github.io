import { useState, useEffect } from 'react';
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
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Target
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { API_ENDPOINTS } from '@/config/api';
import { toast } from 'sonner';
import { TasksAPI, shouldUseLocalMode } from '../../../utils/localApiMock';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsModule() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [useLocal, setUseLocal] = useState(false);
  
  // 🆕 Filtros avançados
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  // 🆕 View mode (list ou calendar)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  // 🆕 Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started' as Task['status'],
    priority: 'medium' as Task['priority'],
    assignedTo: '',
    dueDate: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      console.log('📋 [ProjectsModule] DEMO MODE: Loading from Supabase KV store...');
      
      // Carregar tasks do KV store
      const { data: tasksData, error } = await supabase
        .from('kv_store_c2a25be0')
        .select('key, value')
        .like('key', 'admin_task:%');
      
      if (error) {
        console.error('❌ [ProjectsModule] Error loading from KV store:', error);
        // Fallback para localStorage se KV store falhar
        const localData = await TasksAPI.getTasks();
        setTasks(localData.tasks || []);
        setUseLocal(true);
        console.log(`✅ [ProjectsModule] Loaded ${localData.tasks?.length || 0} tasks from localStorage (KV fallback)`);
        toast.info('📦 Usando dados salvos localmente');
      } else {
        const loadedTasks = tasksData?.map(item => item.value) || [];
        setTasks(loadedTasks);
        setUseLocal(false);
        console.log(`✅ [ProjectsModule] Loaded ${loadedTasks.length} tasks from Supabase KV store`);
        
        // Sync to localStorage for backup
        if (loadedTasks.length > 0) {
          localStorage.setItem('admin-hub-tasks', JSON.stringify({ tasks: loadedTasks }));
        }
      }
      
    } catch (error) {
      console.error('❌ [ProjectsModule] Unexpected error:', error);
      // Fallback para localStorage
      try {
        const localData = await TasksAPI.getTasks();
        setTasks(localData.tasks || []);
        setUseLocal(true);
        console.log(`✅ [ProjectsModule] Loaded ${localData.tasks?.length || 0} tasks from localStorage (error fallback)`);
      } catch (localError) {
        console.error('❌ [ProjectsModule] Even localStorage failed:', localError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async () => {
    try {
      const task: Task = {
        id: editingTask?.id || `task-${Date.now()}`,
        ...formData,
        createdAt: editingTask?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('💾 [ProjectsModule] Saving task:', task.id);

      if (useLocal) {
        // Modo local - salva no localStorage
        console.log('📦 [ProjectsModule] Saving to localStorage...');
        await TasksAPI.saveTask(task);
        toast.success('✅ Task saved locally');
      } else {
        // Modo servidor - salva no servidor
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          throw new Error('Not authenticated');
        }

        const response = await fetch(API_ENDPOINTS.adminHubTasks, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionData.session.access_token}`,
          },
          body: JSON.stringify(task),
        });

        if (!response.ok) {
          // Se falhar no servidor, tenta salvar localmente
          console.warn('⚠️ [ProjectsModule] Server save failed, falling back to local');
          await TasksAPI.saveTask(task);
          setUseLocal(true);
          toast.warning('⚠️ Saved locally (server unavailable)');
        } else {
          const data = await response.json();
          console.log('✅ [ProjectsModule] Saved to server');
          toast.success('✅ Task saved successfully');
        }
      }

      // Recarrega tasks e fecha o formulário
      await loadTasks();
      setShowForm(false);
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'not-started',
        priority: 'medium',
        assignedTo: '',
        dueDate: '',
      });
      
    } catch (error) {
      console.error('❌ [ProjectsModule] Error saving task:', error);
      toast.error(`Failed to save task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      console.log('🗑️ [ProjectsModule] Deleting task:', taskId);

      if (useLocal) {
        // Modo local
        await TasksAPI.deleteTask(taskId);
        toast.success('✅ Task deleted locally');
      } else {
        // Modo servidor
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          throw new Error('Not authenticated');
        }

        const response = await fetch(API_ENDPOINTS.adminHubTaskDelete(taskId), {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${sessionData.session.access_token}`,
          },
        });

        if (!response.ok) {
          // Se falhar no servidor, tenta deletar localmente
          console.warn('⚠️ [ProjectsModule] Server delete failed, falling back to local');
          await TasksAPI.deleteTask(taskId);
          setUseLocal(true);
          toast.warning('⚠️ Deleted locally (server unavailable)');
        } else {
          toast.success('✅ Task deleted successfully');
        }
      }

      await loadTasks();
      
    } catch (error) {
      console.error('❌ [ProjectsModule] Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo,
      dueDate: task.dueDate,
    });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'not-started',
      priority: 'medium',
      assignedTo: '',
      dueDate: '',
    });
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'not-started':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // 🆕 Funções auxiliares para filtros e estatísticas
  const getAllAssignees = () => {
    const assignees = new Set(tasks.map(t => t.assignedTo).filter(Boolean));
    return Array.from(assignees);
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      // Filtro por status
      if (filterStatus !== 'all' && task.status !== filterStatus) return false;
      
      // Filtro por prioridade
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
      
      // Filtro por assignee
      if (filterAssignee !== 'all' && task.assignedTo !== filterAssignee) return false;
      
      // Filtro por data
      if (filterDateRange !== 'all' && task.dueDate) {
        const taskDate = new Date(task.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        switch (filterDateRange) {
          case 'today':
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            if (taskDate < today || taskDate >= tomorrow) return false;
            break;
          case 'week':
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);
            if (taskDate < today || taskDate >= nextWeek) return false;
            break;
          case 'month':
            const nextMonth = new Date(today);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            if (taskDate < today || taskDate >= nextMonth) return false;
            break;
        }
      }
      
      return true;
    });
  };

  const getStatsByAssignee = () => {
    const stats: Record<string, { total: number; completed: number; inProgress: number; notStarted: number }> = {};
    
    tasks.forEach(task => {
      const assignee = task.assignedTo || 'Unassigned';
      if (!stats[assignee]) {
        stats[assignee] = { total: 0, completed: 0, inProgress: 0, notStarted: 0 };
      }
      stats[assignee].total++;
      if (task.status === 'completed') stats[assignee].completed++;
      else if (task.status === 'in-progress') stats[assignee].inProgress++;
      else stats[assignee].notStarted++;
    });
    
    return stats;
  };

  // 🆕 Funções de calendário
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate?.startsWith(dateStr));
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const filteredTasks = getFilteredTasks();
  const statsbyAssignee = getStatsByAssignee();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Tasks</h2>
          <p className="text-gray-600 mt-1">
            Manage your project tasks and deliverables
            {useLocal && (
              <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                📦 Offline Mode
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* Task Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingTask ? 'Edit Task' : 'New Task'}
            </h3>
            <button
              onClick={handleCancelEdit}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Enter task description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Task['status'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTask}
                disabled={!formData.title}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {tasks.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No tasks yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first task
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        {task.description && (
                          <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        {task.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        <Flag className="w-3 h-3" />
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{task.assignedTo || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditTask(task)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}