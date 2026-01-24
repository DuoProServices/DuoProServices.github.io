import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CheckCircle2, Circle, Clock, AlertCircle, Users, TrendingUp, Calendar, ChevronDown, ChevronUp, Plus, X, ArrowLeft, Edit2, LayoutList, BarChart3 } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { useNavigate } from 'react-router';
import { TimelineView } from './TimelineView';
import { TaskCard } from './TaskCard';
import { fetchWithFallback } from '../../utils/apiHelper';

interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  assignedTo: 'veronica' | 'germana' | 'jamila' | 'all';
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completedAt?: string;
  completedBy?: string;
  phase: 'setup' | 'week1' | 'week2';
  category: string;
  notes?: string;
}

interface LaunchRoadmap {
  id: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  tasks: RoadmapTask[];
  teamMembers: {
    veronica: { name: string; avatar: string; };
    germana: { name: string; avatar: string; };
    jamila: { name: string; avatar: string; };
  };
}

interface RoadmapStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  byPhase: {
    setup: { total: number; completed: number; };
    week1: { total: number; completed: number; };
    week2: { total: number; completed: number; };
  };
  byPerson: {
    veronica: number;
    germana: number;
    jamila: number;
    all: number;
  };
  overallProgress: number;
}

export function LaunchRoadmap() {
  const { t } = useLanguage();
  const [roadmap, setRoadmap] = useState<LaunchRoadmap | null>(null);
  const [stats, setStats] = useState<RoadmapStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(['setup']));
  const [selectedTask, setSelectedTask] = useState<RoadmapTask | null>(null);
  const [newNote, setNewNote] = useState('');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState<RoadmapTask | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    assignedTo: 'veronica' as 'veronica' | 'germana' | 'jamila' | 'all',
    priority: 'medium' as 'high' | 'medium' | 'low',
    dueDate: '',
    phase: 'setup' as 'setup' | 'week1' | 'week2',
    category: '',
  });
  const navigate = useNavigate();

  const loadRoadmap = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load roadmap with fallback
      const { data: roadmapData } = await fetchWithFallback<LaunchRoadmap>('/roadmap');
      setRoadmap(roadmapData);

      // Load stats with fallback
      const { data: statsData } = await fetchWithFallback<RoadmapStats>('/roadmap/stats');
      setStats(statsData);
    } catch (error) {
      console.error('Error loading roadmap:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoadmap();
  }, [loadRoadmap]);

  const updateTaskStatus = useCallback(async (taskId: string, status: 'pending' | 'in-progress' | 'completed') => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/roadmap/task/${taskId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      if (res.ok) {
        await loadRoadmap();
      }
    } catch (error) {
      // Silently ignore errors when offline
    }
  }, [loadRoadmap]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<RoadmapTask>) => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/roadmap/task/${taskId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        }
      );

      if (res.ok) {
        await loadRoadmap();
        setEditMode(false);
        setSelectedTask(null);
      }
    } catch (error) {
      // Silently ignore errors when offline
    }
  }, [loadRoadmap]);

  const createTask = useCallback(async (taskData: typeof newTaskData) => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/roadmap/task`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        }
      );

      if (res.ok) {
        await loadRoadmap();
        setShowNewTaskModal(false);
        setNewTaskData({
          title: '',
          description: '',
          assignedTo: 'veronica',
          priority: 'medium',
          dueDate: '',
          phase: 'setup',
          category: '',
        });
      }
    } catch (error) {
      // Silently ignore errors when offline
    }
  }, [loadRoadmap, newTaskData]);

  const addNote = useCallback(async (taskId: string, note: string, author: string) => {
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/roadmap/task/${taskId}/note`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ note, author }),
        }
      );

      if (res.ok) {
        await loadRoadmap();
        setNewNote('');
      }
    } catch (error) {
      // Silently ignore errors when offline
    }
  }, [loadRoadmap]);

  const togglePhase = useCallback((phase: string) => {
    setExpandedPhases(prev => {
      const newSet = new Set(prev);
      if (newSet.has(phase)) {
        newSet.delete(phase);
      } else {
        newSet.add(phase);
      }
      return newSet;
    });
  }, []);

  // Memoize helper functions to avoid recreation on every render
  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }, []);

  const getAssignedToColor = useCallback((assignedTo: string) => {
    switch (assignedTo) {
      case 'veronica':
        return 'bg-purple-100 text-purple-800';
      case 'germana':
        return 'bg-blue-100 text-blue-800';
      case 'jamila':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'completed') return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando roadmap...</p>
        </div>
      </div>
    );
  }

  if (!roadmap || !stats) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">Erro ao carregar roadmap</p>
      </div>
    );
  }

  const phaseConfig = {
    setup: {
      title: '🎯 Primeiros Passos',
      description: 'Setup inicial antes do lançamento',
      color: 'from-purple-500 to-purple-600',
    },
    week1: {
      title: '🚀 Semana 1 (1-7 Fev)',
      description: 'Primeira semana de lançamento',
      color: 'from-blue-500 to-blue-600',
    },
    week2: {
      title: '📈 Semana 2 (8-14 Fev)',
      description: 'Consolidação e ajustes',
      color: 'from-green-500 to-green-600',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin')}
          className="mb-4 flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-md font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar ao Admin Menu
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🚀 Launch Roadmap
              </h1>
              <p className="text-gray-600">
                Acompanhamento completo do lançamento - Fevereiro 2025
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNewTaskModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium"
              >
                <Plus className="w-5 h-5" />
                Nova Tarefa
              </button>
              <div className="text-right">
                <div className="text-5xl font-bold text-blue-600 mb-1">
                  {stats.overallProgress}%
                </div>
                <p className="text-sm text-gray-500">Progresso Total</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                style={{ width: `${stats.overallProgress}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Total</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium mb-1">Concluídas</p>
                  <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border-2 border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium mb-1">Em Progresso</p>
                  <p className="text-3xl font-bold text-yellow-900">{stats.inProgress}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Pendentes</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                </div>
                <Circle className="w-8 h-8 text-gray-600 opacity-50" />
              </div>
            </div>
          </div>

          {/* Team Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  V
                </div>
                <div>
                  <p className="font-medium text-gray-900">Veronica</p>
                  <p className="text-sm text-gray-600">{stats.byPerson.veronica} tarefas</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  G
                </div>
                <div>
                  <p className="font-medium text-gray-900">Germana</p>
                  <p className="text-sm text-gray-600">{stats.byPerson.germana} tarefas</p>
                </div>
              </div>
            </div>

            <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  J
                </div>
                <div>
                  <p className="font-medium text-gray-900">Jamila</p>
                  <p className="text-sm text-gray-600">{stats.byPerson.jamila} tarefas</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Todos</p>
                  <p className="text-sm text-gray-600">{stats.byPerson.all} tarefas</p>
                </div>
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex rounded-lg border-2 border-gray-200 bg-white p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LayoutList className="w-5 h-5" />
                Vista de Lista
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Vista de Timeline
              </button>
            </div>
          </div>
        </div>

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <TimelineView roadmap={roadmap} onTaskClick={setSelectedTask} />
        )}

        {/* Phases */}
        {viewMode === 'list' && (['setup', 'week1', 'week2'] as const).map((phase) => {
          const phaseTasks = roadmap.tasks.filter(t => t.phase === phase);
          const phaseStats = stats.byPhase[phase];
          const phaseProgress = phaseStats.total > 0 
            ? Math.round((phaseStats.completed / phaseStats.total) * 100) 
            : 0;
          const config = phaseConfig[phase];
          const isExpanded = expandedPhases.has(phase);

          return (
            <div key={phase} className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              {/* Phase Header */}
              <button
                onClick={() => togglePhase(phase)}
                className={`w-full p-6 bg-gradient-to-r ${config.color} text-white transition-all hover:shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h2 className="text-2xl font-bold mb-1">{config.title}</h2>
                    <p className="text-white/90">{config.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold">{phaseProgress}%</div>
                      <div className="text-sm text-white/80">
                        {phaseStats.completed}/{phaseStats.total} concluídas
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </div>
                </div>
              </button>

              {/* Phase Tasks */}
              {isExpanded && (
                <div className="p-6">
                  <div className="space-y-4">
                    {phaseTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`border-2 rounded-xl p-5 transition-all hover:shadow-md cursor-pointer ${
                          task.status === 'completed'
                            ? 'bg-green-50 border-green-200'
                            : isOverdue(task.dueDate, task.status)
                            ? 'bg-red-50 border-red-200'
                            : 'bg-white border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedTask(task)}
                      >
                        <div className="flex items-start gap-4">
                          {/* Status Icon */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextStatus = 
                                task.status === 'pending' ? 'in-progress' 
                                : task.status === 'in-progress' ? 'completed' 
                                : 'pending';
                              updateTaskStatus(task.id, nextStatus);
                            }}
                            className="mt-1"
                          >
                            {getStatusIcon(task.status)}
                          </button>

                          {/* Task Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className={`text-lg font-semibold ${
                                task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                              }`}>
                                {task.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                {isOverdue(task.dueDate, task.status) && (
                                  <AlertCircle className="w-5 h-5 text-red-500" />
                                )}
                              </div>
                            </div>

                            <p className="text-gray-600 mb-3">{task.description}</p>

                            <div className="flex flex-wrap items-center gap-2">
                              {/* Category */}
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                                {task.category}
                              </span>

                              {/* Priority */}
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(task.priority)}`}>
                                {task.priority === 'high' ? '🔴 Alta' : task.priority === 'medium' ? '🟡 Média' : '🟢 Baixa'}
                              </span>

                              {/* Assigned To */}
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAssignedToColor(task.assignedTo)}`}>
                                {task.assignedTo === 'all' ? '👥 Todos' : roadmap.teamMembers[task.assignedTo].name}
                              </span>

                              {/* Due Date */}
                              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                                isOverdue(task.dueDate, task.status) 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                <Calendar className="w-4 h-4" />
                                {formatDate(task.dueDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Task Detail Modal */}
        {selectedTask && !editMode && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedTask.title}
                    </h2>
                    <p className="text-gray-600">{selectedTask.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setEditedTask(selectedTask);
                      }}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                      title="Editar tarefa"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedTask(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedTask.status)}
                        <span className="font-medium capitalize">{selectedTask.status}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Prioridade</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(selectedTask.priority)}`}>
                        {selectedTask.priority === 'high' ? 'Alta' : selectedTask.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Responsável</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getAssignedToColor(selectedTask.assignedTo)}`}>
                        {selectedTask.assignedTo === 'all' ? 'Todos' : roadmap.teamMembers[selectedTask.assignedTo].name}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Data Limite</p>
                      <p className="font-medium">{formatDate(selectedTask.dueDate)}</p>
                    </div>
                  </div>

                  {selectedTask.completedAt && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-sm text-green-600 font-medium mb-1">✅ Concluída</p>
                      <p className="text-sm text-green-700">
                        {formatDate(selectedTask.completedAt)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">📝 Notas</h3>
                  
                  {selectedTask.notes && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                        {selectedTask.notes}
                      </pre>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Adicionar nota..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newNote.trim()) {
                          addNote(selectedTask.id, newNote, 'User');
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (newNote.trim()) {
                          addNote(selectedTask.id, newNote, 'User');
                        }
                      }}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t mt-6 pt-6 flex gap-3">
                  <button
                    onClick={() => {
                      updateTaskStatus(selectedTask.id, 'pending');
                      setSelectedTask(null);
                    }}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Pendente
                  </button>
                  <button
                    onClick={() => {
                      updateTaskStatus(selectedTask.id, 'in-progress');
                      setSelectedTask(null);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Em Progresso
                  </button>
                  <button
                    onClick={() => {
                      updateTaskStatus(selectedTask.id, 'completed');
                      setSelectedTask(null);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Task Modal */}
        {editMode && editedTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      ✏️ Editar Tarefa
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setEditedTask(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editedTask) {
                      updateTask(editedTask.id, {
                        title: editedTask.title,
                        description: editedTask.description,
                        assignedTo: editedTask.assignedTo,
                        priority: editedTask.priority,
                        dueDate: editedTask.dueDate,
                        phase: editedTask.phase,
                        category: editedTask.category,
                      });
                    }
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                      <input
                        type="text"
                        value={editedTask.title}
                        onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                      <textarea
                        value={editedTask.description}
                        onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">👤 Responsável</label>
                        <select
                          value={editedTask.assignedTo}
                          onChange={(e) => setEditedTask({ ...editedTask, assignedTo: e.target.value as 'veronica' | 'germana' | 'jamila' | 'all' })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="veronica">Veronica</option>
                          <option value="germana">Germana</option>
                          <option value="jamila">Jamila</option>
                          <option value="all">Todos</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">⚠️ Prioridade</label>
                        <select
                          value={editedTask.priority}
                          onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as 'high' | 'medium' | 'low' })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="high">Alta</option>
                          <option value="medium">Média</option>
                          <option value="low">Baixa</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">📅 Data Limite</label>
                        <input
                          type="date"
                          value={editedTask.dueDate}
                          onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">🎯 Fase</label>
                        <select
                          value={editedTask.phase}
                          onChange={(e) => setEditedTask({ ...editedTask, phase: e.target.value as 'setup' | 'week1' | 'week2' })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="setup">Setup</option>
                          <option value="week1">Semana 1</option>
                          <option value="week2">Semana 2</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">🏷️ Categoria</label>
                      <input
                        type="text"
                        value={editedTask.category}
                        onChange={(e) => setEditedTask({ ...editedTask, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="border-t mt-6 pt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setEditedTask(null);
                      }}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      💾 Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* New Task Modal */}
        {showNewTaskModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Adicionar Nova Tarefa
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowNewTaskModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Add new task logic here
                    createTask(newTaskData);
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 mb-1">Título</label>
                      <input
                        type="text"
                        value={newTaskData.title}
                        onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1">Descrição</label>
                      <textarea
                        value={newTaskData.description}
                        onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1">Responsável</label>
                      <select
                        value={newTaskData.assignedTo}
                        onChange={(e) => setNewTaskData({ ...newTaskData, assignedTo: e.target.value as 'veronica' | 'germana' | 'jamila' | 'all' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="veronica">Veronica</option>
                        <option value="germana">Germana</option>
                        <option value="jamila">Jamila</option>
                        <option value="all">Todos</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1">Prioridade</label>
                      <select
                        value={newTaskData.priority}
                        onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="high">Alta</option>
                        <option value="medium">Média</option>
                        <option value="low">Baixa</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1">Data Limite</label>
                      <input
                        type="date"
                        value={newTaskData.dueDate}
                        onChange={(e) => setNewTaskData({ ...newTaskData, dueDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1">Fase</label>
                      <select
                        value={newTaskData.phase}
                        onChange={(e) => setNewTaskData({ ...newTaskData, phase: e.target.value as 'setup' | 'week1' | 'week2' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="setup">Setup</option>
                        <option value="week1">Semana 1</option>
                        <option value="week2">Semana 2</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 mb-1">Categoria</label>
                      <input
                        type="text"
                        value={newTaskData.category}
                        onChange={(e) => setNewTaskData({ ...newTaskData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="border-t mt-6 pt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowNewTaskModal(false)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Adicionar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Assign Task Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Atribuir Tarefa
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Add new task logic here
                    setShowAssignModal(false);
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 mb-1">Responsável</label>
                      <select
                        value={newTaskData.assignedTo}
                        onChange={(e) => setNewTaskData({ ...newTaskData, assignedTo: e.target.value as 'veronica' | 'germana' | 'jamila' | 'all' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="veronica">Veronica</option>
                        <option value="germana">Germana</option>
                        <option value="jamila">Jamila</option>
                        <option value="all">Todos</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t mt-6 pt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAssignModal(false)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Atribuir
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}