import { memo } from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle, Calendar } from 'lucide-react';

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

interface TaskCardProps {
  task: RoadmapTask;
  teamMemberName: string;
  onTaskClick: (task: RoadmapTask) => void;
  onStatusChange: (taskId: string, status: 'pending' | 'in-progress' | 'completed') => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    case 'in-progress':
      return <Clock className="w-5 h-5 text-blue-600" />;
    default:
      return <Circle className="w-5 h-5 text-gray-400" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getAssignedToColor = (assignedTo: string) => {
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
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const isOverdue = (dueDate: string, status: string) => {
  if (status === 'completed') return false;
  return new Date(dueDate) < new Date();
};

export const TaskCard = memo(({ task, teamMemberName, onTaskClick, onStatusChange }: TaskCardProps) => {
  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = 
      task.status === 'pending' ? 'in-progress' 
      : task.status === 'in-progress' ? 'completed' 
      : 'pending';
    onStatusChange(task.id, nextStatus);
  };

  return (
    <div
      className={`border-2 rounded-xl p-5 transition-all hover:shadow-md cursor-pointer ${
        task.status === 'completed'
          ? 'bg-green-50 border-green-200'
          : isOverdue(task.dueDate, task.status)
          ? 'bg-red-50 border-red-200'
          : 'bg-white border-gray-200 hover:border-blue-300'
      }`}
      onClick={() => onTaskClick(task)}
    >
      <div className="flex items-start gap-4">
        {/* Status Icon */}
        <button
          onClick={handleStatusClick}
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
              {task.assignedTo === 'all' ? '👥 Todos' : teamMemberName}
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
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.description === nextProps.task.description &&
    prevProps.task.priority === nextProps.task.priority &&
    prevProps.task.dueDate === nextProps.task.dueDate &&
    prevProps.task.assignedTo === nextProps.task.assignedTo &&
    prevProps.task.category === nextProps.task.category
  );
});

TaskCard.displayName = 'TaskCard';
