import { Calendar } from 'lucide-react';
import { useMemo } from 'react';

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

interface TimelineViewProps {
  roadmap: LaunchRoadmap;
  onTaskClick: (task: RoadmapTask) => void;
}

export function TimelineView({ roadmap, onTaskClick }: TimelineViewProps) {
  // Memoize timeline boundaries to avoid recalculating on every render
  const { minDate, maxDate, todayPosition } = useMemo(() => {
    const allDates = roadmap.tasks.map(t => new Date(t.dueDate).getTime());
    const min = new Date(Math.min(...allDates));
    const max = new Date(Math.max(...allDates));
    const today = new Date();
    const position = ((today.getTime() - min.getTime()) / (max.getTime() - min.getTime())) * 100;
    
    return {
      minDate: min,
      maxDate: max,
      todayPosition: position
    };
  }, [roadmap.tasks]);

  // Memoize getTaskPosition function to avoid recreating it on every render
  const getTaskPosition = useMemo(() => {
    return (task: RoadmapTask) => {
      // Estimate start date based on phase
      let startDate: Date;
      const endDate = new Date(task.dueDate);

      if (task.phase === 'setup') {
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 7); // 7 days before due date
      } else if (task.phase === 'week1') {
        startDate = new Date('2025-02-01');
      } else {
        startDate = new Date('2025-02-08');
      }

      const left = ((startDate.getTime() - minDate.getTime()) / (maxDate.getTime() - minDate.getTime())) * 100;
      const width = ((endDate.getTime() - startDate.getTime()) / (maxDate.getTime() - minDate.getTime())) * 100;

      return { left: Math.max(0, left), width: Math.max(3, width), startDate, endDate };
    };
  }, [minDate, maxDate]);

  const getTaskColor = (task: RoadmapTask) => {
    if (task.status === 'completed') {
      return 'bg-green-200 border-green-400';
    }
    switch (task.assignedTo) {
      case 'veronica':
        return 'bg-purple-200 border-purple-400';
      case 'germana':
        return 'bg-blue-200 border-blue-400';
      case 'jamila':
        return 'bg-pink-200 border-pink-400';
      default:
        return 'bg-yellow-200 border-yellow-400';
    }
  };

  // Calculate task rows for a member (no recursion, using memoization)
  const calculateTaskRows = (tasks: RoadmapTask[]) => {
    const taskRows = new Map<string, number>();
    const rowOccupancy: Array<Array<{ start: number; end: number }>> = [[]];

    tasks.forEach(task => {
      const { left, width } = getTaskPosition(task);
      const start = left;
      const end = left + width;

      // Find first available row
      let assignedRow = 0;
      let foundRow = false;

      for (let row = 0; row < rowOccupancy.length; row++) {
        const hasOverlap = rowOccupancy[row].some(occupied => {
          return !(end <= occupied.start || start >= occupied.end);
        });

        if (!hasOverlap) {
          assignedRow = row;
          foundRow = true;
          break;
        }
      }

      // If no row found, create new one
      if (!foundRow) {
        assignedRow = rowOccupancy.length;
        rowOccupancy.push([]);
      }

      // Mark this position as occupied
      rowOccupancy[assignedRow].push({ start, end });
      taskRows.set(task.id, assignedRow);
    });

    return taskRows;
  };

  const phases = [
    { id: 'setup', label: '🎯 Primeiros Passos', start: 0, end: 33.33 },
    { id: 'week1', label: '🚀 Semana 1', start: 33.33, end: 66.66 },
    { id: 'week2', label: '📈 Semana 2', start: 66.66, end: 100 },
  ];

  const teamMembers: ('veronica' | 'germana' | 'jamila' | 'all')[] = ['veronica', 'germana', 'jamila', 'all'];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
      <div className="min-w-[900px]">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Vista de Linha do Tempo</h2>
          
          {/* Phase Headers */}
          <div className="relative h-16 mb-2">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="absolute top-0 h-full flex items-center justify-center"
                style={{ left: `${phase.start}%`, width: `${phase.end - phase.start}%` }}
              >
                <div className="bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold text-sm whitespace-nowrap">
                  {phase.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="relative">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex">
            {[0, 33.33, 66.66, 100].map((pos, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 border-l-2 border-gray-200"
                style={{ left: `${pos}%` }}
              />
            ))}
          </div>

          {/* Today Marker */}
          {todayPosition >= 0 && todayPosition <= 100 && (
            <div
              className="absolute top-0 bottom-0 z-20"
              style={{ left: `${todayPosition}%` }}
            >
              <div className="relative">
                <div className="absolute -top-2 -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded text-xs font-bold whitespace-nowrap shadow-lg">
                  📍 Hoje
                </div>
                <div className="absolute top-6 bottom-0 w-1 bg-red-500 -translate-x-1/2"></div>
              </div>
            </div>
          )}

          {/* Team Rows */}
          {teamMembers.map((member, memberIndex) => {
            const memberTasks = roadmap.tasks.filter(t => t.assignedTo === member);
            const taskRows = calculateTaskRows(memberTasks);
            
            // Calculate required height based on task rows
            const maxRow = Math.max(0, ...Array.from(taskRows.values()));
            const rowHeight = Math.max(80, (maxRow + 1) * 70 + 15);
            
            return (
              <div
                key={member}
                className={`relative border-b-2 border-gray-100 ${
                  memberIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
                style={{ height: `${rowHeight}px` }}
              >
                {/* Member Label */}
                <div className="absolute left-0 top-0 h-full w-40 flex items-center px-4 bg-white border-r-2 border-gray-200 z-10">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      member === 'veronica' ? 'bg-purple-500' :
                      member === 'germana' ? 'bg-blue-500' :
                      member === 'jamila' ? 'bg-pink-500' : 'bg-gray-500'
                    }`}>
                      {member === 'all' ? '👥' : member.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 capitalize block">
                        {member === 'all' ? 'Todos' : roadmap.teamMembers[member]?.name || member}
                      </span>
                      <span className="text-xs text-gray-500">
                        {memberTasks.length} {memberTasks.length === 1 ? 'tarefa' : 'tarefas'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="absolute left-40 right-0 top-0 h-full">
                  {memberTasks.map((task) => {
                    const { left, width } = getTaskPosition(task);
                    const row = taskRows.get(task.id) || 0;
                    return (
                      <div
                        key={task.id}
                        className={`absolute rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg hover:z-30 hover:scale-105 ${getTaskColor(task)}`}
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          top: `${row * 70 + 8}px`,
                          height: '60px',
                        }}
                        onClick={() => onTaskClick(task)}
                        title={`${task.title} - ${task.category}`}
                      >
                        <div className="p-2 h-full overflow-hidden flex flex-col">
                          <div className="text-xs font-bold text-gray-900 truncate leading-tight">
                            {task.title}
                          </div>
                          <div className="text-xs text-gray-600 truncate leading-tight mt-0.5">
                            {task.category}
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            {task.status === 'completed' && (
                              <span className="text-xs text-green-700 font-bold">✅</span>
                            )}
                            {task.priority === 'high' && (
                              <span className="text-xs text-red-600 font-bold ml-auto">🔴</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-purple-200 border-2 border-purple-400 rounded"></div>
            <span>Veronica</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-blue-200 border-2 border-blue-400 rounded"></div>
            <span>Germana</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-pink-200 border-2 border-pink-400 rounded"></div>
            <span>Jamila</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-yellow-200 border-2 border-yellow-400 rounded"></div>
            <span>Todos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-green-200 border-2 border-green-400 rounded"></div>
            <span>✅ Concluída</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-600 font-bold">🔴</span>
            <span>Alta Prioridade</span>
          </div>
        </div>

        {/* Task Summary */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Total de {roadmap.tasks.length} tarefas no roadmap
        </div>
      </div>
    </div>
  );
}