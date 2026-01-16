import { API_ENDPOINTS } from '../config/api';

export async function testApiConnection() {
  console.log('🔍 Testing API Connection...');
  console.log('📍 Health Check URL:', API_ENDPOINTS.health);
  
  try {
    const response = await fetch(API_ENDPOINTS.health, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 Response Status:', response.status);
    console.log('📡 Response OK:', response.ok);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('❌ Health check failed:', text);
      return { success: false, error: text };
    }
    
    const data = await response.json();
    console.log('✅ Health check passed:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Network error:', error);
    return { success: false, error: String(error) };
  }
}

export async function testAdminHubConnection(accessToken: string) {
  console.log('🔍 Testing Admin Hub Connection...');
  
  const healthUrl = API_ENDPOINTS.adminHubTasks.replace('/tasks', '/health');
  console.log('📍 Admin Hub Health URL:', healthUrl);
  
  try {
    const response = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    console.log('📡 Response Status:', response.status);
    console.log('📡 Response OK:', response.ok);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('❌ Admin Hub health check failed:', text);
      return { success: false, error: text };
    }
    
    const data = await response.json();
    console.log('✅ Admin Hub health check passed:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Network error:', error);
    return { success: false, error: String(error) };
  }
}
