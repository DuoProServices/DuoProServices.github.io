/**
 * 🔴 LOCAL KV STORE MOCK
 * 
 * Sistema de armazenamento local que simula o Supabase KV Store
 * Permite que o app funcione LOCALMENTE sem precisar de deploy
 * 
 * IMPORTANTE: Dados são salvos no localStorage do navegador
 */

const KV_PREFIX = 'duopro_kv_';

export class LocalKvStore {
  /**
   * Salva um valor no localStorage
   */
  static async set(key: string, value: any): Promise<void> {
    try {
      const fullKey = KV_PREFIX + key;
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(fullKey, jsonValue);
      console.log(`✅ [LocalKV] Saved key: ${key}`);
    } catch (error) {
      console.error(`❌ [LocalKV] Error saving key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Busca um valor do localStorage
   */
  static async get(key: string): Promise<any> {
    try {
      const fullKey = KV_PREFIX + key;
      const jsonValue = localStorage.getItem(fullKey);
      
      if (!jsonValue) {
        console.log(`⚠️ [LocalKV] Key not found: ${key}`);
        return null;
      }
      
      const value = JSON.parse(jsonValue);
      console.log(`✅ [LocalKV] Retrieved key: ${key}`);
      return value;
    } catch (error) {
      console.error(`❌ [LocalKV] Error getting key ${key}:`, error);
      return null;
    }
  }

  /**
   * Deleta um valor do localStorage
   */
  static async del(key: string): Promise<void> {
    try {
      const fullKey = KV_PREFIX + key;
      localStorage.removeItem(fullKey);
      console.log(`✅ [LocalKV] Deleted key: ${key}`);
    } catch (error) {
      console.error(`❌ [LocalKV] Error deleting key ${key}:`, error);
      throw error;
    }
  }

  /**
   * Busca todos os valores que começam com um prefixo
   */
  static async getByPrefix(prefix: string): Promise<any[]> {
    try {
      const fullPrefix = KV_PREFIX + prefix;
      const results: any[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(fullPrefix)) {
          const jsonValue = localStorage.getItem(key);
          if (jsonValue) {
            const value = JSON.parse(jsonValue);
            results.push({ key: key.replace(KV_PREFIX, ''), value });
          }
        }
      }
      
      console.log(`✅ [LocalKV] Found ${results.length} items with prefix: ${prefix}`);
      return results;
    } catch (error) {
      console.error(`❌ [LocalKV] Error getting by prefix ${prefix}:`, error);
      return [];
    }
  }

  /**
   * Limpa TODOS os dados do localStorage (cuidado!)
   */
  static async clear(): Promise<void> {
    try {
      const keysToDelete: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(KV_PREFIX)) {
          keysToDelete.push(key);
        }
      }
      
      keysToDelete.forEach(key => localStorage.removeItem(key));
      console.log(`✅ [LocalKV] Cleared ${keysToDelete.length} items`);
    } catch (error) {
      console.error('❌ [LocalKV] Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Retorna todas as chaves armazenadas
   */
  static async listKeys(): Promise<string[]> {
    try {
      const keys: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(KV_PREFIX)) {
          keys.push(key.replace(KV_PREFIX, ''));
        }
      }
      
      console.log(`✅ [LocalKV] Found ${keys.length} keys`);
      return keys;
    } catch (error) {
      console.error('❌ [LocalKV] Error listing keys:', error);
      return [];
    }
  }
}
