/**
 * APP CONFIGURATION
 * Configurações globais da aplicação
 */

// Detecta se está em produção (GitHub Pages ou domínio customizado)
const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';

export const APP_CONFIG = {
  /**
   * LOGGING
   * Controla o comportamento de logs no console
   * 🔥 DESABILITADO EM PRODUÇÃO AUTOMATICAMENTE
   */
  logging: {
    // Habilita/desabilita todos os logs de desenvolvimento
    // ✅ Automático: true em dev, false em produção
    enabled: !isProduction,
    
    // Mostra avisos quando o backend está em modo demo
    showDemoWarnings: false,
    
    // Mostra logs de sucesso de API
    showApiSuccess: false,
    
    // Mostra logs detalhados de debug
    showDebugLogs: false,
  },
  
  /**
   * API
   * Configurações de comunicação com o backend
   */
  api: {
    // Tempo de timeout para requisições (ms)
    timeout: 10000,
    
    // Retry automático em caso de falha
    retryOnError: false,
    maxRetries: 3,
  },
  
  /**
   * UI
   * Configurações de interface
   */
  ui: {
    // Mostra banner de backend offline
    // ✅ Automático: false em produção para evitar poluição visual
    showOfflineBanner: !isProduction,
    
    // Animações
    enableAnimations: true,
    
    // Toast notifications duration (ms)
    toastDuration: 3000,
  },
};

/**
 * Exporta detecção de ambiente
 */
export { isProduction };
export const isDevelopment = !isProduction;