/**
 * APP CONFIGURATION
 * Configurações globais da aplicação
 */

export const APP_CONFIG = {
  /**
   * LOGGING
   * Controla o comportamento de logs no console
   */
  logging: {
    // Habilita/desabilita todos os logs de desenvolvimento
    // Mude para false para silenciar completamente
    enabled: true,
    
    // Mostra avisos quando o backend está em modo demo
    // Mude para false para ocultar avisos de "Demo Mode"
    showDemoWarnings: false, // ⬅️ DESLIGADO - Console limpo!
    
    // Mostra logs de sucesso de API
    showApiSuccess: false, // false = menos verboso
    
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
    showOfflineBanner: false, // ⬅️ DESLIGADO - Remove o aviso amarelo do topo
    
    // Animações
    enableAnimations: true,
    
    // Toast notifications duration (ms)
    toastDuration: 3000,
  },
};

/**
 * Verifica se está em modo de produção
 */
export const isProduction = process.env.NODE_ENV === 'production';

/**
 * Verifica se está em modo de desenvolvimento
 */
export const isDevelopment = process.env.NODE_ENV === 'development';