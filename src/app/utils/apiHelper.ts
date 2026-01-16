/**
 * API Helper - Detecta automaticamente quando o backend está offline
 * e usa dados mockados para desenvolvimento
 */

import { projectId, publicAnonKey } from '/utils/supabase/info';
import { logger } from './logger';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0`;

// Flag para saber se o backend está offline
let isBackendOffline = false;

// Track de quais endpoints já mostraram aviso (evita spam no console)
const warnedEndpoints = new Set<string>();

// Mock data
const MOCK_DATA = {
  unreadCount: 3,
  
  messages: [
    {
      id: '1',
      senderId: 'system',
      senderName: 'Sistema DuoProServices',
      recipientId: 'user1',
      content: 'Bem-vindo ao sistema! Por favor, faça upload dos seus documentos fiscais.',
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: '2',
      senderId: 'admin',
      senderName: 'Suporte',
      recipientId: 'user1',
      content: 'Seus documentos foram recebidos. Estamos processando sua declaração.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      read: true,
    },
    {
      id: '3',
      senderId: 'admin',
      senderName: 'Contador',
      recipientId: 'user1',
      content: 'Temos uma dúvida sobre seus rendimentos. Poderia nos contatar?',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      read: false,
    },
  ],

  dashboardStats: {
    totalClients: 156,
    activeReturns: 23,
    completedReturns: 89,
    pendingDocuments: 12,
    totalRevenue: 45670,
    monthlyRevenue: 8900,
    upcomingDeadlines: 5,
    messagesCount: 7,
    recentActivities: [
      {
        id: '1',
        type: 'new_client',
        message: 'Novo cliente: João Silva',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'document_uploaded',
        message: 'Maria Santos enviou T4',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        type: 'return_completed',
        message: 'Declaração concluída: Pedro Costa',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
  },

  permissions: {
    canAccessClientHub: true,
    canAccessContentCalendar: true,
    canAccessUserManagement: true,
    canAccessLaunchRoadmap: true,
    canAccessInvoices: true,
    canEditClients: true,
    canDeleteClients: true,
    canManageUsers: true,
    canManagePermissions: true,
    isAdmin: true,
  },

  roadmap: {
    id: 'roadmap-2025-02',
    version: '1.0',
    createdAt: new Date('2025-01-20').toISOString(),
    updatedAt: new Date().toISOString(),
    tasks: [
      // Setup Phase
      {
        id: 'task-1',
        title: 'Configurar infraestrutura de email',
        description: 'Configurar servidor SMTP e templates de email',
        assignedTo: 'veronica' as const,
        status: 'completed' as const,
        priority: 'high' as const,
        dueDate: '2025-01-25',
        completedAt: '2025-01-24',
        phase: 'setup' as const,
        category: 'Infraestrutura',
        notes: 'Configurado com sucesso usando SendGrid'
      },
      {
        id: 'task-2',
        title: 'Testar fluxo de pagamentos',
        description: 'Validar integração Stripe e fluxo completo',
        assignedTo: 'germana' as const,
        status: 'completed' as const,
        priority: 'high' as const,
        dueDate: '2025-01-26',
        completedAt: '2025-01-25',
        phase: 'setup' as const,
        category: 'Pagamentos',
      },
      {
        id: 'task-3',
        title: 'Revisar conteúdo do site',
        description: 'Verificar textos em inglês e francês',
        assignedTo: 'jamila' as const,
        status: 'in-progress' as const,
        priority: 'medium' as const,
        dueDate: '2025-01-30',
        phase: 'setup' as const,
        category: 'Conteúdo',
      },
      {
        id: 'task-4',
        title: 'Configurar analytics',
        description: 'Google Analytics e Meta Pixel',
        assignedTo: 'veronica' as const,
        status: 'pending' as const,
        priority: 'medium' as const,
        dueDate: '2025-01-31',
        phase: 'setup' as const,
        category: 'Marketing',
      },
      // Week 1
      {
        id: 'task-5',
        title: 'Publicar primeiro post no blog',
        description: 'Artigo sobre prazo de declaração 2025',
        assignedTo: 'jamila' as const,
        status: 'pending' as const,
        priority: 'high' as const,
        dueDate: '2025-02-03',
        phase: 'week1' as const,
        category: 'Content Marketing',
      },
      {
        id: 'task-6',
        title: 'Lançar campanha no Facebook',
        description: 'Anúncios direcionados para newcomers',
        assignedTo: 'germana' as const,
        status: 'pending' as const,
        priority: 'high' as const,
        dueDate: '2025-02-02',
        phase: 'week1' as const,
        category: 'Marketing',
      },
      {
        id: 'task-7',
        title: 'Monitorar feedback de clientes',
        description: 'Revisar emails e mensagens diárias',
        assignedTo: 'all' as const,
        status: 'pending' as const,
        priority: 'medium' as const,
        dueDate: '2025-02-07',
        phase: 'week1' as const,
        category: 'Atendimento',
      },
      // Week 2
      {
        id: 'task-8',
        title: 'Ajustar estratégia baseada em dados',
        description: 'Analisar métricas da primeira semana',
        assignedTo: 'veronica' as const,
        status: 'pending' as const,
        priority: 'high' as const,
        dueDate: '2025-02-10',
        phase: 'week2' as const,
        category: 'Estratégia',
      },
      {
        id: 'task-9',
        title: 'Otimizar landing pages',
        description: 'A/B testing e melhorias de conversão',
        assignedTo: 'germana' as const,
        status: 'pending' as const,
        priority: 'medium' as const,
        dueDate: '2025-02-12',
        phase: 'week2' as const,
        category: 'Marketing',
      },
      {
        id: 'task-10',
        title: 'Preparar relatório de lançamento',
        description: 'Documentar resultados e aprendizados',
        assignedTo: 'all' as const,
        status: 'pending' as const,
        priority: 'low' as const,
        dueDate: '2025-02-14',
        phase: 'week2' as const,
        category: 'Gestão',
      },
    ],
    teamMembers: {
      veronica: { name: 'Veronica', avatar: 'V' },
      germana: { name: 'Germana', avatar: 'G' },
      jamila: { name: 'Jamila', avatar: 'J' },
    },
  },

  roadmapStats: {
    total: 10,
    completed: 2,
    inProgress: 1,
    pending: 7,
    byPhase: {
      setup: { total: 4, completed: 2 },
      week1: { total: 3, completed: 0 },
      week2: { total: 3, completed: 0 },
    },
    byPerson: {
      veronica: 3,
      germana: 3,
      jamila: 2,
      all: 2,
    },
    overallProgress: 20,
  },

  users: [
    {
      userId: 'user-veronica-001',
      email: 'veronica@duoproservices.com',
      name: 'Veronica Prass',
      role: 'owner',
      permissions: {
        canAccessClientHub: true,
        canAccessContentCalendar: true,
        canAccessUserManagement: true,
        canAccessLaunchRoadmap: true,
        canAccessInvoices: true,
        canEditClients: true,
        canDeleteClients: true,
        canManageUsers: true,
        canManagePermissions: true,
        isAdmin: true,
      },
      casesCount: 45,
      pendingCases: 12,
      completedCases: 33,
      createdAt: new Date('2024-01-01').toISOString(),
    },
    {
      userId: 'user-germana-001',
      email: 'germana@duoproservices.com',
      name: 'Germana Silva',
      role: 'accountant',
      permissions: {
        canAccessClientHub: true,
        canAccessContentCalendar: true,
        canAccessUserManagement: false,
        canAccessLaunchRoadmap: true,
        canAccessInvoices: true,
        canEditClients: true,
        canDeleteClients: false,
        canManageUsers: false,
        canManagePermissions: false,
        isAdmin: false,
      },
      casesCount: 38,
      pendingCases: 15,
      completedCases: 23,
      createdAt: new Date('2024-02-15').toISOString(),
    },
    {
      userId: 'user-jamila-001',
      email: 'jamila@duoproservices.com',
      name: 'Jamila Ferreira',
      role: 'admin',
      permissions: {
        canAccessClientHub: true,
        canAccessContentCalendar: true,
        canAccessUserManagement: true,
        canAccessLaunchRoadmap: true,
        canAccessInvoices: true,
        canEditClients: true,
        canDeleteClients: true,
        canManageUsers: true,
        canManagePermissions: true,
        isAdmin: true,
      },
      casesCount: 28,
      pendingCases: 8,
      completedCases: 20,
      createdAt: new Date('2024-03-10').toISOString(),
    },
  ],

  clients: [
    {
      id: 'user-jamila-001',
      email: 'jamila@duoproservices.com',
      name: 'Jamila Ferreira',
      createdAt: new Date('2024-03-10').toISOString(),
      personalInfo: {
        firstName: 'Jamila',
        lastName: 'Ferreira',
        phone: '(514) 555-0123',
        address: '456 Rue Saint-Laurent',
        city: 'Montreal',
        province: 'QC',
        postalCode: 'H2Y 2Y5',
        dateOfBirth: '1988-05-15',
        sin: '123-456-789',
        filingType: 'individual',
      },
      taxFilings: [
        {
          id: 'filing-jamila-2024',
          year: 2024,
          status: 'documents_uploaded',
          createdAt: new Date('2025-01-05').toISOString(),
          updatedAt: new Date('2025-01-08').toISOString(),
          documents: ['T4', 'T5'],
          payment: {
            status: 'pending',
            amount: 0,
          },
        },
      ],
      onboardingComplete: true,
      assignedAccountant: null,
    },
    {
      id: 'client-demo-001',
      email: 'maria.santos@email.com',
      name: 'Maria Santos',
      createdAt: new Date('2024-01-15').toISOString(),
      personalInfo: {
        firstName: 'Maria',
        lastName: 'Santos',
        phone: '(416) 555-0198',
        address: '123 Main Street',
        city: 'Toronto',
        province: 'ON',
        postalCode: 'M5H 2N2',
        dateOfBirth: '1990-03-20',
        sin: '987-654-321',
        filingType: 'individual',
      },
      taxFilings: [
        {
          id: 'filing-maria-2024',
          year: 2024,
          status: 'completed',
          createdAt: new Date('2024-02-01').toISOString(),
          updatedAt: new Date('2024-03-15').toISOString(),
          documents: ['T4', 'T5', 'RRSP'],
          payment: {
            status: 'paid',
            amount: 150,
            paidAt: new Date('2024-03-15').toISOString(),
          },
        },
      ],
      onboardingComplete: true,
      assignedAccountant: {
        id: 'user-germana-001',
        name: 'Germana Silva',
        email: 'germana@duoproservices.com',
        role: 'accountant',
      },
    },
    {
      id: 'client-demo-002',
      email: 'john.wilson@email.com',
      name: 'John Wilson',
      createdAt: new Date('2024-02-20').toISOString(),
      personalInfo: {
        firstName: 'John',
        lastName: 'Wilson',
        phone: '(604) 555-0234',
        address: '789 Oak Avenue',
        city: 'Vancouver',
        province: 'BC',
        postalCode: 'V6B 4Y8',
        dateOfBirth: '1985-11-10',
        sin: '456-789-123',
        filingType: 'couple',
      },
      taxFilings: [
        {
          id: 'filing-john-2024',
          year: 2024,
          status: 'in_review',
          createdAt: new Date('2025-01-10').toISOString(),
          updatedAt: new Date('2025-01-12').toISOString(),
          documents: ['T4', 'Rental Income'],
          payment: {
            status: 'paid',
            amount: 50,
            paidAt: new Date('2025-01-10').toISOString(),
          },
        },
      ],
      onboardingComplete: true,
      assignedAccountant: {
        id: 'user-veronica-001',
        name: 'Veronica Prass',
        email: 'veronica@duoproservices.com',
        role: 'owner',
      },
    },
  ],
};

/**
 * Faz uma requisição para o backend com fallback automático para dados mockados
 */
export async function fetchWithFallback<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T; isMocked: boolean }> {
  try {
    // Tenta chamar o backend real
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // Se backend voltou online, limpa os avisos anteriores
    if (isBackendOffline) {
      warnedEndpoints.clear();
      logger.success('Backend Online', 'API');
    }
    
    isBackendOffline = false;
    
    return { data, isMocked: false };
  } catch (error) {
    // Backend está offline - usa dados mockados
    isBackendOffline = true;

    // Só mostra aviso uma vez por endpoint para não poluir o console
    if (!warnedEndpoints.has(endpoint)) {
      logger.demo(endpoint, 'API');
      warnedEndpoints.add(endpoint);
    }

    // Retorna dados mockados baseado no endpoint
    const mockData = getMockDataForEndpoint(endpoint);
    
    return { data: mockData as T, isMocked: true };
  }
}

/**
 * Retorna dados mockados baseado no endpoint
 */
function getMockDataForEndpoint(endpoint: string): any {
  if (endpoint.includes('/messages/unread-count')) {
    return { count: MOCK_DATA.unreadCount };
  }

  if (endpoint.includes('/messages')) {
    return { messages: MOCK_DATA.messages };
  }

  if (endpoint.includes('/dashboard/stats')) {
    return MOCK_DATA.dashboardStats;
  }

  if (endpoint.includes('/permissions')) {
    return MOCK_DATA.permissions;
  }

  if (endpoint.includes('/roadmap/stats')) {
    return MOCK_DATA.roadmapStats;
  }

  if (endpoint.includes('/roadmap')) {
    return MOCK_DATA.roadmap;
  }

  if (endpoint.includes('/users/list')) {
    return MOCK_DATA.users;
  }

  if (endpoint.includes('/admin/clients')) {
    return { clients: MOCK_DATA.clients };
  }

  // Default
  return {};
}

/**
 * Verifica se o backend está offline
 */
export function isBackendCurrentlyOffline(): boolean {
  return isBackendOffline;
}

/**
 * POST request com fallback
 */
export async function postWithFallback<T>(
  endpoint: string,
  body: any
): Promise<{ data: T; isMocked: boolean }> {
  return fetchWithFallback<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * DELETE request com fallback
 */
export async function deleteWithFallback<T>(
  endpoint: string
): Promise<{ data: T; isMocked: boolean }> {
  return fetchWithFallback<T>(endpoint, {
    method: 'DELETE',
  });
}

/**
 * GET request simples (retorna apenas os dados, não o wrapper)
 */
export async function get<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error: any) {
    // Detecta backend offline
    if (error.message?.includes('Failed to fetch') || 
        error.message?.includes('Network') ||
        error.message?.includes('fetch')) {
      
      // Retorna dados mockados baseados na URL
      return getMockedDataByUrl<T>(url);
    }
    
    throw error; // Erros reais são propagados
  }
}

/**
 * Retorna dados mockados baseado na URL completa
 */
function getMockedDataByUrl<T>(url: string): T {
  // Payment status
  if (url.includes('/payments/') && url.includes('/status')) {
    return {
      payment: {
        initialPaid: true,
        initialAmount: 50,
        finalPaid: false,
        finalAmount: 0,
        totalPrice: 150
      }
    } as T;
  }
  
  // Tax documents list
  if (url.includes('/tax-documents/list/')) {
    return {
      files: [
        {
          id: 'demo-file-1',
          name: 'T4_2024_Demo.pdf',
          size: 125000,
          category: 'income',
          url: '',
          createdAt: new Date().toISOString()
        }
      ]
    } as T;
  }
  
  // Default empty response
  return {} as T;
}

/**
 * Objeto apiHelper com métodos convenientes
 */
export const apiHelper = {
  get,
  post: postWithFallback,
  delete: deleteWithFallback,
  fetch: fetchWithFallback,
  isOffline: isBackendCurrentlyOffline
};