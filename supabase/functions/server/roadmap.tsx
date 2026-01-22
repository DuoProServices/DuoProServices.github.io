import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";

export const roadmapApp = new Hono();

export interface RoadmapTask {
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

export interface LaunchRoadmap {
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

// Initialize roadmap with default tasks
const initializeRoadmap = async (): Promise<LaunchRoadmap> => {
  const roadmap: LaunchRoadmap = {
    id: 'launch-roadmap-2025',
    version: '1.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    teamMembers: {
      veronica: { name: 'Veronica', avatar: 'V' },
      germana: { name: 'Germana', avatar: 'G' },
      jamila: { name: 'Jamila', avatar: 'J' },
    },
    tasks: [
      // PRIMEIROS PASSOS (Setup)
      {
        id: 'setup-1',
        title: 'Finalizar conteúdo do site',
        description: 'Revisar todos os textos em inglês e francês, garantir que estão corretos e profissionais',
        assignedTo: 'veronica',
        status: 'pending',
        priority: 'high',
        dueDate: '2025-01-15',
        phase: 'setup',
        category: 'Website',
      },
      {
        id: 'setup-2',
        title: 'Testar fluxo completo do cliente',
        description: 'Fazer teste end-to-end: cadastro → upload → pagamento → documentos → aprovação',
        assignedTo: 'germana',
        status: 'pending',
        priority: 'high',
        dueDate: '2025-01-15',
        phase: 'setup',
        category: 'Testing',
      },
      {
        id: 'setup-3',
        title: 'Configurar Calendly',
        description: 'Criar agenda de disponibilidade para consultas e reuniões',
        assignedTo: 'veronica',
        status: 'pending',
        priority: 'medium',
        dueDate: '2025-01-18',
        phase: 'setup',
        category: 'Tools',
      },
      {
        id: 'setup-4',
        title: 'Preparar templates de email',
        description: 'Criar templates para: boas-vindas, confirmação de pagamento, solicitação de documentos, etc.',
        assignedTo: 'jamila',
        status: 'pending',
        priority: 'medium',
        dueDate: '2025-01-18',
        phase: 'setup',
        category: 'Communication',
      },
      {
        id: 'setup-5',
        title: 'Definir preços finais',
        description: 'Tabela de preços para: pessoa física, pequena empresa, newcomers, situações especiais',
        assignedTo: 'all',
        status: 'pending',
        priority: 'high',
        dueDate: '2025-01-20',
        phase: 'setup',
        category: 'Business',
      },
      {
        id: 'setup-6',
        title: 'Criar material de divulgação',
        description: 'Posts para redes sociais, flyers digitais, conteúdo para primeiros clientes',
        assignedTo: 'jamila',
        status: 'pending',
        priority: 'medium',
        dueDate: '2025-01-22',
        phase: 'setup',
        category: 'Marketing',
      },

      // SEMANA 1 (1-7 Fevereiro)
      {
        id: 'week1-1',
        title: 'Anunciar abertura oficialmente',
        description: 'Post nas redes sociais, email para lista de contatos, WhatsApp para network',
        assignedTo: 'all',
        status: 'pending',
        priority: 'high',
        dueDate: '2025-02-01',
        phase: 'week1',
        category: 'Marketing',
      },
      {
        id: 'week1-2',
        title: 'Monitorar primeiros cadastros',
        description: 'Acompanhar dashboard, responder dúvidas rapidamente, garantir boa experiência',
        assignedTo: 'veronica',
        status: 'pending',
        priority: 'high',
        dueDate: '2025-02-01',
        phase: 'week1',
        category: 'Operations',
      },
      {
        id: 'week1-3',
        title: 'Processar primeiros pagamentos',
        description: 'Confirmar recebimento dos $50 iniciais, enviar confirmação aos clientes',
        assignedTo: 'germana',
        status: 'pending',
        priority: 'high',
        dueDate: '2025-02-03',
        phase: 'week1',
        category: 'Finance',
      },
      {
        id: 'week1-4',
        title: 'Revisar documentos recebidos',
        description: 'Analisar qualidade dos uploads, solicitar documentos faltantes se necessário',
        assignedTo: 'germana',
        status: 'pending',
        priority: 'high',
        dueDate: '2025-02-05',
        phase: 'week1',
        category: 'Operations',
      },
      {
        id: 'week1-5',
        title: 'Preparar primeiras declarações',
        description: 'Fazer análise inicial, calcular preço final, preparar relatório para cliente',
        assignedTo: 'veronica',
        status: 'pending',
        priority: 'high',
        dueDate: '2025-02-07',
        phase: 'week1',
        category: 'Tax Prep',
      },
      {
        id: 'week1-6',
        title: 'Publicar conteúdo educativo',
        description: 'Usar Content Calendar para postar dicas sobre tax season, deadlines, documentos',
        assignedTo: 'jamila',
        status: 'pending',
        priority: 'medium',
        dueDate: '2025-02-07',
        phase: 'week1',
        category: 'Marketing',
      },

      // SEMANA 2 (8-14 Fevereiro)
      {
        id: 'week2-1',
        title: 'Coletar feedback dos clientes',
        description: 'Enviar formulário rápido, perguntar sobre experiência, identificar melhorias',
        assignedTo: 'jamila',
        status: 'pending',
        priority: 'medium',
        dueDate: '2025-02-10',
        phase: 'week2',
        category: 'Customer Success',
      },
      {
        id: 'week2-2',
        title: 'Ajustar processos baseado em feedback',
        description: 'Implementar melhorias no fluxo, clarificar instruções, otimizar comunicação',
        assignedTo: 'all',
        status: 'pending',
        priority: 'medium',
        dueDate: '2025-02-12',
        phase: 'week2',
        category: 'Operations',
      },
      {
        id: 'week2-3',
        title: 'Submeter primeiras declarações à CRA',
        description: 'Após aprovação e pagamento final do cliente, submeter para CRA',
        assignedTo: 'veronica',
        status: 'pending',
        priority: 'high',
        dueDate: '2025-02-12',
        phase: 'week2',
        category: 'Tax Prep',
      },
      {
        id: 'week2-4',
        title: 'Analisar métricas da primeira semana',
        description: 'Cadastros, conversão, tempo médio, taxa de aprovação, receita',
        assignedTo: 'germana',
        status: 'pending',
        priority: 'medium',
        dueDate: '2025-02-14',
        phase: 'week2',
        category: 'Analytics',
      },
      {
        id: 'week2-5',
        title: 'Planejar estratégia de crescimento',
        description: 'Definir metas para resto de fevereiro, identificar canais de aquisição, parcerias',
        assignedTo: 'all',
        status: 'pending',
        priority: 'medium',
        dueDate: '2025-02-14',
        phase: 'week2',
        category: 'Strategy',
      },
      {
        id: 'week2-6',
        title: 'Celebrar primeiros sucessos! 🎉',
        description: 'Reconhecer o trabalho da equipe, compartilhar vitórias, manter motivação',
        assignedTo: 'all',
        status: 'pending',
        priority: 'low',
        dueDate: '2025-02-14',
        phase: 'week2',
        category: 'Team',
      },
    ],
  };

  await kv.set('launch-roadmap', roadmap);
  console.log('✅ Launch Roadmap initialized with', roadmap.tasks.length, 'tasks');
  return roadmap;
};

// Get roadmap
roadmapApp.get('/make-server-c2a25be0/roadmap', async (c) => {
  try {
    let roadmap = await kv.get('launch-roadmap');
    
    if (!roadmap) {
      console.log('📋 Creating initial roadmap...');
      roadmap = await initializeRoadmap();
    }
    
    return c.json(roadmap);
  } catch (error) {
    console.error('Error getting roadmap:', error);
    return c.json({ error: 'Failed to get roadmap' }, 500);
  }
});

// Update task status
roadmapApp.put('/make-server-c2a25be0/roadmap/task/:taskId', async (c) => {
  try {
    const taskId = c.req.param('taskId');
    const updates = await c.req.json();
    
    let roadmap = await kv.get('launch-roadmap');
    
    if (!roadmap) {
      roadmap = await initializeRoadmap();
    }
    
    // Find and update task
    const taskIndex = roadmap.tasks.findIndex((t: RoadmapTask) => t.id === taskId);
    
    if (taskIndex === -1) {
      return c.json({ error: 'Task not found' }, 404);
    }
    
    const updatedTask = {
      ...roadmap.tasks[taskIndex],
      ...updates,
    };
    
    // If status changed to completed, add timestamp
    if (updates.status === 'completed' && roadmap.tasks[taskIndex].status !== 'completed') {
      updatedTask.completedAt = new Date().toISOString();
    }
    
    roadmap.tasks[taskIndex] = updatedTask;
    roadmap.updatedAt = new Date().toISOString();
    
    await kv.set('launch-roadmap', roadmap);
    
    console.log(`✅ Updated task ${taskId}:`, updates);
    
    return c.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return c.json({ error: 'Failed to update task' }, 500);
  }
});

// Add note to task
roadmapApp.post('/make-server-c2a25be0/roadmap/task/:taskId/note', async (c) => {
  try {
    const taskId = c.req.param('taskId');
    const { note, author } = await c.req.json();
    
    let roadmap = await kv.get('launch-roadmap');
    
    if (!roadmap) {
      roadmap = await initializeRoadmap();
    }
    
    const taskIndex = roadmap.tasks.findIndex((t: RoadmapTask) => t.id === taskId);
    
    if (taskIndex === -1) {
      return c.json({ error: 'Task not found' }, 404);
    }
    
    const existingNotes = roadmap.tasks[taskIndex].notes || '';
    const timestamp = new Date().toISOString();
    const newNote = `[${timestamp}] ${author}: ${note}`;
    
    roadmap.tasks[taskIndex].notes = existingNotes 
      ? `${existingNotes}\n${newNote}` 
      : newNote;
    
    roadmap.updatedAt = new Date().toISOString();
    
    await kv.set('launch-roadmap', roadmap);
    
    console.log(`💬 Added note to task ${taskId} by ${author}`);
    
    return c.json(roadmap.tasks[taskIndex]);
  } catch (error) {
    console.error('Error adding note:', error);
    return c.json({ error: 'Failed to add note' }, 500);
  }
});

// Get roadmap stats
roadmapApp.get('/make-server-c2a25be0/roadmap/stats', async (c) => {
  try {
    let roadmap = await kv.get('launch-roadmap');
    
    if (!roadmap) {
      roadmap = await initializeRoadmap();
    }
    
    const stats = {
      total: roadmap.tasks.length,
      completed: roadmap.tasks.filter((t: RoadmapTask) => t.status === 'completed').length,
      inProgress: roadmap.tasks.filter((t: RoadmapTask) => t.status === 'in-progress').length,
      pending: roadmap.tasks.filter((t: RoadmapTask) => t.status === 'pending').length,
      byPhase: {
        setup: {
          total: roadmap.tasks.filter((t: RoadmapTask) => t.phase === 'setup').length,
          completed: roadmap.tasks.filter((t: RoadmapTask) => t.phase === 'setup' && t.status === 'completed').length,
        },
        week1: {
          total: roadmap.tasks.filter((t: RoadmapTask) => t.phase === 'week1').length,
          completed: roadmap.tasks.filter((t: RoadmapTask) => t.phase === 'week1' && t.status === 'completed').length,
        },
        week2: {
          total: roadmap.tasks.filter((t: RoadmapTask) => t.phase === 'week2').length,
          completed: roadmap.tasks.filter((t: RoadmapTask) => t.phase === 'week2' && t.status === 'completed').length,
        },
      },
      byPerson: {
        veronica: roadmap.tasks.filter((t: RoadmapTask) => t.assignedTo === 'veronica').length,
        germana: roadmap.tasks.filter((t: RoadmapTask) => t.assignedTo === 'germana').length,
        jamila: roadmap.tasks.filter((t: RoadmapTask) => t.assignedTo === 'jamila').length,
        all: roadmap.tasks.filter((t: RoadmapTask) => t.assignedTo === 'all').length,
      },
      overallProgress: Math.round((roadmap.tasks.filter((t: RoadmapTask) => t.status === 'completed').length / roadmap.tasks.length) * 100),
    };
    
    return c.json(stats);
  } catch (error) {
    console.error('Error getting roadmap stats:', error);
    return c.json({ error: 'Failed to get roadmap stats' }, 500);
  }
});

// Reset roadmap (for testing)
roadmapApp.post('/make-server-c2a25be0/roadmap/reset', async (c) => {
  try {
    const roadmap = await initializeRoadmap();
    console.log('🔄 Roadmap reset to initial state');
    return c.json(roadmap);
  } catch (error) {
    console.error('Error resetting roadmap:', error);
    return c.json({ error: 'Failed to reset roadmap' }, 500);
  }
});

// Create new task
roadmapApp.post('/make-server-c2a25be0/roadmap/task', async (c) => {
  try {
    const newTaskData = await c.req.json();
    
    let roadmap = await kv.get('launch-roadmap');
    
    if (!roadmap) {
      roadmap = await initializeRoadmap();
    }
    
    // Generate unique ID
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newTask: RoadmapTask = {
      id: taskId,
      title: newTaskData.title,
      description: newTaskData.description,
      assignedTo: newTaskData.assignedTo || 'veronica',
      status: 'pending',
      priority: newTaskData.priority || 'medium',
      dueDate: newTaskData.dueDate,
      phase: newTaskData.phase || 'setup',
      category: newTaskData.category || 'General',
      notes: '',
    };
    
    roadmap.tasks.push(newTask);
    roadmap.updatedAt = new Date().toISOString();
    
    await kv.set('launch-roadmap', roadmap);
    
    console.log(`✅ Created new task ${taskId}:`, newTask.title);
    
    return c.json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return c.json({ error: 'Failed to create task' }, 500);
  }
});

export default roadmapApp;