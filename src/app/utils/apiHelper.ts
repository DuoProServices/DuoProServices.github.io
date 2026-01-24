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

// ⚠️ MOCK DATA REMOVIDO - USAR APENAS DADOS REAIS DO SUPABASE
// Todos os dados devem vir do Supabase ou retornar vazios se não existirem

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
 * Retorna dados VAZIOS quando backend offline
 * ⚠️ MUDANÇA: Não mais retorna mocks - apenas estruturas vazias
 */
function getMockDataForEndpoint(endpoint: string): any {
  if (endpoint.includes('/messages/unread-count')) {
    return { count: 0 };
  }

  if (endpoint.includes('/messages')) {
    return { messages: [] };
  }

  if (endpoint.includes('/dashboard/stats')) {
    return {
      totalClients: 0,
      activeReturns: 0,
      completedReturns: 0,
      pendingDocuments: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      upcomingDeadlines: 0,
      messagesCount: 0,
      recentActivities: [],
    };
  }

  if (endpoint.includes('/permissions')) {
    return {
      canAccessClientHub: false,
      canAccessContentCalendar: false,
      canAccessUserManagement: false,
      canAccessLaunchRoadmap: false,
      canAccessInvoices: false,
      canEditClients: false,
      canDeleteClients: false,
      canManageUsers: false,
      canManagePermissions: false,
      isAdmin: false,
    };
  }

  if (endpoint.includes('/roadmap/stats')) {
    return {
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      byPhase: {},
      byPerson: {},
      overallProgress: 0,
    };
  }

  if (endpoint.includes('/roadmap')) {
    return {
      tasks: [],
      teamMembers: {},
    };
  }

  if (endpoint.includes('/users/list')) {
    return [];
  }

  if (endpoint.includes('/admin/clients')) {
    return { clients: [] };
  }

  // Default vazio
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
 * Retorna dados VAZIOS baseado na URL completa
 * ⚠️ MUDANÇA: Não mais retorna mocks - apenas estruturas vazias
 */
function getMockedDataByUrl<T>(url: string): T {
  // Payment status
  if (url.includes('/payments/') && url.includes('/status')) {
    return {
      payment: {
        initialPaid: false,
        initialAmount: 0,
        finalPaid: false,
        finalAmount: 0,
        totalPrice: 0
      }
    } as T;
  }
  
  // Tax documents list
  if (url.includes('/tax-documents/list/')) {
    return {
      files: []
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