/**
 * Console Filter Utility
 * Suprime erros irrelevantes do Datadog e outros serviços externos
 */

// Store original console methods
const originalError = console.error;
const originalWarn = console.warn;

// Lista de padrões para filtrar (não exibir)
const FILTER_PATTERNS = [
  'datadog',
  'datadoghq.com',
  'ERR_BLOCKED_BY_CLIENT',
  'dd-api-key',
  'browser-intake',
  '/api/make/', // Erros internos do Figma Make
];

// Lista de padrões importantes (sempre exibir)
const IMPORTANT_PATTERNS = [
  '[SignIn]',
  '[AuthContext]',
  '[isAdminEmail]',
  '🔐',
  '🔍',
  '👑',
  '✅',
  '❌',
  'ADMIN',
  'AUTH',
];

/**
 * Verifica se uma mensagem deve ser filtrada (ocultada)
 */
function shouldFilter(args: any[]): boolean {
  const message = args.join(' ').toLowerCase();
  
  // Se contém padrões importantes, nunca filtra
  if (IMPORTANT_PATTERNS.some(pattern => message.includes(pattern.toLowerCase()))) {
    return false;
  }
  
  // Se contém padrões de filtro, oculta
  if (FILTER_PATTERNS.some(pattern => message.includes(pattern.toLowerCase()))) {
    return true;
  }
  
  return false;
}

/**
 * Instala o filtro de console
 */
export function installConsoleFilter() {
  console.error = (...args: any[]) => {
    if (!shouldFilter(args)) {
      originalError.apply(console, args);
    }
  };

  console.warn = (...args: any[]) => {
    if (!shouldFilter(args)) {
      originalWarn.apply(console, args);
    }
  };

  console.log('🧹 Console filter installed - Datadog noise will be suppressed');
}

/**
 * Remove o filtro de console (restaura comportamento original)
 */
export function uninstallConsoleFilter() {
  console.error = originalError;
  console.warn = originalWarn;
  console.log('🧹 Console filter removed - All logs restored');
}

/**
 * Log customizado para o app com formatação bonita
 */
export const appLogger = {
  auth: (message: string, data?: any) => {
    console.log(`🔐 [AUTH] ${message}`, data || '');
  },
  admin: (message: string, data?: any) => {
    console.log(`👑 [ADMIN] ${message}`, data || '');
  },
  success: (message: string, data?: any) => {
    console.log(`✅ [SUCCESS] ${message}`, data || '');
  },
  error: (message: string, data?: any) => {
    originalError(`❌ [ERROR] ${message}`, data || '');
  },
  info: (message: string, data?: any) => {
    console.log(`ℹ️ [INFO] ${message}`, data || '');
  },
  debug: (message: string, data?: any) => {
    console.log(`🔍 [DEBUG] ${message}`, data || '');
  }
};
