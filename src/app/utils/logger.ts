/**
 * LOGGER UTILITY
 * Sistema centralizado de logs com formatação elegante e controle de verbosidade
 */

import { APP_CONFIG } from '../../config/app';

/**
 * Estilos CSS para logs formatados
 */
const STYLES = {
  success: 'background: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold',
  error: 'background: #ef4444; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold',
  warning: 'background: #f59e0b; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold',
  info: 'background: #3b82f6; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold',
  demo: 'background: #f59e0b; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold',
  muted: 'color: #6b7280; font-style: italic',
};

/**
 * Logger principal
 */
export const logger = {
  /**
   * Log de sucesso (verde)
   */
  success(message: string, category: 'API' | 'STORAGE' | 'AUTH' | 'DATA' | 'PAYMENT' = 'API', data?: any) {
    if (!APP_CONFIG.logging.enabled || !APP_CONFIG.logging.showApiSuccess) return;
    
    if (data) {
      console.log(`%c✅ ${message}`, STYLES.success, data);
    } else {
      console.log(`%c✅ ${message}`, STYLES.success);
    }
  },

  /**
   * Log de erro (vermelho) - sempre mostra erros críticos
   */
  error(message: string, category: 'API' | 'STORAGE' | 'AUTH' | 'DATA' | 'PAYMENT' = 'API', error?: any) {
    // Erros sempre aparecem, mesmo com logs desabilitados
    if (error) {
      console.error(`%c❌ ${message}`, STYLES.error, error);
    } else {
      console.error(`%c❌ ${message}`, STYLES.error);
    }
  },

  /**
   * Log de aviso (amarelo)
   */
  warning(message: string, category: 'API' | 'STORAGE' | 'AUTH' | 'DATA' | 'PAYMENT' = 'API', data?: any) {
    if (!APP_CONFIG.logging.enabled) return;
    
    if (data) {
      console.warn(`%c⚠️ ${message}`, STYLES.warning, data);
    } else {
      console.warn(`%c⚠️ ${message}`, STYLES.warning);
    }
  },

  /**
   * Log informativo (azul)
   */
  info(message: string, category: 'API' | 'STORAGE' | 'AUTH' | 'DATA' | 'PAYMENT' = 'API', data?: any) {
    if (!APP_CONFIG.logging.enabled) return;
    
    if (data) {
      console.log(`%cℹ️ ${message}`, STYLES.info, data);
    } else {
      console.log(`%cℹ️ ${message}`, STYLES.info);
    }
  },

  /**
   * Log de modo demo (laranja)
   */
  demo(endpoint: string, category: 'API' | 'STORAGE' | 'AUTH' | 'DATA' | 'PAYMENT' = 'API') {
    if (!APP_CONFIG.logging.enabled || !APP_CONFIG.logging.showDemoWarnings) return;
    
    console.log(
      `%c🎭 Demo Mode%c ${endpoint}`,
      STYLES.demo,
      STYLES.muted
    );
  },

  /**
   * Log silencioso - apenas em ambiente de desenvolvimento extremo
   */
  debug(message: string, data?: any) {
    // Só loga se explicitamente em modo debug
    if (APP_CONFIG.logging.enabled && APP_CONFIG.logging.showDebugLogs) {
      console.log(`🔍 ${message}`, data || '');
    }
  },

  /**
   * Grupo de logs relacionados
   */
  group(title: string, callback: () => void) {
    if (!APP_CONFIG.logging.enabled) return;
    
    console.group(title);
    callback();
    console.groupEnd();
  },
};