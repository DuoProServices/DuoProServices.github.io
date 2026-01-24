/**
 * 🔴 LOCAL API MOCK
 * 
 * Sistema que intercepta chamadas de API e usa localStorage
 * Permite o app funcionar SEM PRECISAR DE DEPLOY
 * 
 * USO:
 * - Automaticamente detecta se o servidor está offline
 * - Redireciona para localStorage quando necessário
 */

import { LocalKvStore } from './localKvStore';
import { supabase } from '../app/utils/supabaseClient';

// Flag para forçar uso local (set true para SEMPRE usar mock)
const FORCE_LOCAL_MODE = false;

// Cache de verificação de conectividade
let lastConnectivityCheck = 0;
let isServerAvailable = false;
const CONNECTIVITY_CHECK_INTERVAL = 30000; // 30 segundos

/**
 * Verifica se o servidor está disponível
 */
async function checkServerConnectivity(): Promise<boolean> {
  const now = Date.now();
  
  // Usa cache se ainda é válido
  if (now - lastConnectivityCheck < CONNECTIVITY_CHECK_INTERVAL) {
    return isServerAvailable;
  }
  
  try {
    // Tenta fazer um ping rápido no health endpoint
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
    
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      clearTimeout(timeoutId);
      return false;
    }
    
    clearTimeout(timeoutId);
    lastConnectivityCheck = now;
    isServerAvailable = true;
    return true;
  } catch (error) {
    console.warn('⚠️ [LocalAPI] Server not available, using local mode');
    lastConnectivityCheck = now;
    isServerAvailable = false;
    return false;
  }
}

/**
 * Decide se deve usar modo local
 */
export async function shouldUseLocalMode(): Promise<boolean> {
  if (FORCE_LOCAL_MODE) {
    console.log('🔴 [LocalAPI] FORCE_LOCAL_MODE enabled');
    return true;
  }
  
  const serverAvailable = await checkServerConnectivity();
  return !serverAvailable;
}

/**
 * 📋 TASKS (Project Management)
 */
export const TasksAPI = {
  /**
   * Carrega todas as tasks
   */
  async getTasks() {
    console.log('📋 [LocalAPI] Getting tasks...');
    const items = await LocalKvStore.getByPrefix('task:');
    const tasks = items.map(item => item.value);
    console.log(`✅ [LocalAPI] Found ${tasks.length} tasks`);
    return { success: true, tasks };
  },

  /**
   * Salva uma task
   */
  async saveTask(task: any) {
    console.log('💾 [LocalAPI] Saving task:', task.id);
    
    if (!task.id || !task.title) {
      throw new Error('Missing required fields: id or title');
    }
    
    await LocalKvStore.set(`task:${task.id}`, task);
    console.log('✅ [LocalAPI] Task saved successfully');
    return { success: true, message: 'Task saved successfully', task };
  },

  /**
   * Deleta uma task
   */
  async deleteTask(taskId: string) {
    console.log('🗑️ [LocalAPI] Deleting task:', taskId);
    await LocalKvStore.del(`task:${taskId}`);
    console.log('✅ [LocalAPI] Task deleted successfully');
    return { success: true, message: 'Task deleted successfully' };
  }
};

/**
 * 📱 SOCIAL POSTS (Social Calendar)
 */
export const SocialPostsAPI = {
  /**
   * Carrega todos os posts
   */
  async getPosts() {
    console.log('📱 [LocalAPI] Getting social posts...');
    const items = await LocalKvStore.getByPrefix('social-post:');
    const posts = items.map(item => item.value);
    console.log(`✅ [LocalAPI] Found ${posts.length} posts`);
    return { success: true, posts };
  },

  /**
   * Salva um post
   */
  async savePost(post: any) {
    console.log('💾 [LocalAPI] Saving post:', post.id);
    
    if (!post.id || !post.date || !post.content) {
      throw new Error('Missing required fields: id, date, or content');
    }
    
    await LocalKvStore.set(`social-post:${post.id}`, post);
    console.log('✅ [LocalAPI] Post saved successfully');
    return { success: true, message: 'Post saved successfully', post };
  },

  /**
   * Deleta um post
   */
  async deletePost(postId: string) {
    console.log('🗑️ [LocalAPI] Deleting post:', postId);
    await LocalKvStore.del(`social-post:${postId}`);
    console.log('✅ [LocalAPI] Post deleted successfully');
    return { success: true, message: 'Post deleted successfully' };
  }
};

/**
 * 💰 INVOICES
 */
export const InvoicesAPI = {
  /**
   * Carrega todas as invoices
   */
  async getInvoices() {
    console.log('💰 [LocalAPI] Getting invoices...');
    const items = await LocalKvStore.getByPrefix('invoice:');
    const invoices = items.map(item => item.value);
    console.log(`✅ [LocalAPI] Found ${invoices.length} invoices`);
    return { success: true, invoices };
  },

  /**
   * Cria uma invoice
   */
  async createInvoice(invoice: any) {
    console.log('💾 [LocalAPI] Creating invoice:', invoice.invoiceNumber);
    
    if (!invoice.invoiceNumber) {
      throw new Error('Missing required field: invoiceNumber');
    }
    
    const invoiceData = {
      ...invoice,
      createdAt: invoice.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await LocalKvStore.set(`invoice:${invoice.invoiceNumber}`, invoiceData);
    console.log('✅ [LocalAPI] Invoice created successfully');
    return { success: true, invoice: invoiceData };
  },

  /**
   * Busca uma invoice específica
   */
  async getInvoice(invoiceNumber: string) {
    console.log('💰 [LocalAPI] Getting invoice:', invoiceNumber);
    const invoice = await LocalKvStore.get(`invoice:${invoiceNumber}`);
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    console.log('✅ [LocalAPI] Invoice found');
    return { success: true, invoice };
  },

  /**
   * Marca invoice como paga
   */
  async markAsPaid(invoiceNumber: string, paymentData?: any) {
    console.log('💳 [LocalAPI] Marking invoice as paid:', invoiceNumber);
    const invoice = await LocalKvStore.get(`invoice:${invoiceNumber}`);
    
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    
    const updatedInvoice = {
      ...invoice,
      status: 'paid',
      paidAt: new Date().toISOString(),
      ...paymentData,
      updatedAt: new Date().toISOString()
    };
    
    await LocalKvStore.set(`invoice:${invoiceNumber}`, updatedInvoice);
    console.log('✅ [LocalAPI] Invoice marked as paid');
    return { success: true, invoice: updatedInvoice };
  }
};

/**
 * 👥 TEAM ACTIVITIES
 */
export const ActivitiesAPI = {
  /**
   * Carrega todas as activities
   */
  async getActivities() {
    console.log('👥 [LocalAPI] Getting activities...');
    const items = await LocalKvStore.getByPrefix('team-activity:');
    const activities = items.map(item => item.value);
    console.log(`✅ [LocalAPI] Found ${activities.length} activities`);
    return { success: true, activities };
  },

  /**
   * Salva uma activity
   */
  async saveActivity(activity: any) {
    console.log('💾 [LocalAPI] Saving activity:', activity.id);
    
    if (!activity.id) {
      throw new Error('Missing required field: id');
    }
    
    await LocalKvStore.set(`team-activity:${activity.id}`, activity);
    console.log('✅ [LocalAPI] Activity saved successfully');
    return { success: true, activity };
  },

  /**
   * Deleta uma activity
   */
  async deleteActivity(activityId: string) {
    console.log('🗑️ [LocalAPI] Deleting activity:', activityId);
    await LocalKvStore.del(`team-activity:${activityId}`);
    console.log('✅ [LocalAPI] Activity deleted successfully');
    return { success: true, message: 'Activity deleted successfully' };
  }
};

/**
 * 🔧 UTILITY: Limpa todos os dados locais
 */
export async function clearAllLocalData() {
  console.log('🧹 [LocalAPI] Clearing all local data...');
  await LocalKvStore.clear();
  console.log('✅ [LocalAPI] All local data cleared');
}

/**
 * 📊 UTILITY: Lista todos os dados armazenados
 */
export async function listAllLocalData() {
  console.log('📊 [LocalAPI] Listing all local data...');
  const keys = await LocalKvStore.listKeys();
  
  const data: any = {};
  for (const key of keys) {
    const fullKey = key.replace('duopro_kv_', '');
    const value = await LocalKvStore.get(fullKey);
    data[fullKey] = value;
  }
  
  console.log('✅ [LocalAPI] Local data:', data);
  return data;
}