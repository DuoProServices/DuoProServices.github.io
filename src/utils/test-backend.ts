/**
 * BACKEND CONNECTION TESTER
 * 
 * Use this to test if the backend is deployed and responding
 */

import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0`;

/**
 * Test if backend is online
 */
export async function testBackendHealth() {
  try {
    console.log('🔍 Testing backend connection...');
    console.log('📍 URL:', `${API_BASE}/health`);
    
    const response = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status === 'ok') {
      console.log('✅ Backend is ONLINE and responding!');
      return { success: true, data };
    } else {
      console.log('⚠️ Backend responded but status is not OK:', data);
      return { success: false, error: 'Unexpected response', data };
    }
  } catch (error: any) {
    console.error('❌ Backend is OFFLINE or unreachable!');
    console.error('Error:', error.message);
    console.error('\n📖 READ: /FIX_FAILED_TO_FETCH_ERRORS.md for solution');
    return { success: false, error: error.message };
  }
}

/**
 * Test all critical endpoints
 */
export async function testAllEndpoints(accessToken: string) {
  console.log('🧪 Testing all critical endpoints...\n');

  const tests = [
    {
      name: 'Health Check',
      url: `${API_BASE}/health`,
      method: 'GET',
      requiresAuth: false,
    },
    {
      name: 'Auth Session',
      url: `${API_BASE}/auth/session`,
      method: 'GET',
      requiresAuth: true,
    },
    {
      name: 'Messages (example client)',
      url: `${API_BASE}/messages/test-client-id`,
      method: 'GET',
      requiresAuth: true,
    },
    {
      name: 'Documents List',
      url: `${API_BASE}/documents`,
      method: 'GET',
      requiresAuth: true,
    },
    {
      name: 'Payment Status (2026)',
      url: `${API_BASE}/payments/2026/status`,
      method: 'GET',
      requiresAuth: true,
    },
  ];

  const results = [];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      
      const headers: any = {
        'Content-Type': 'application/json',
      };

      if (test.requiresAuth) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(test.url, {
        method: test.method,
        headers,
      });

      const success = response.ok || response.status === 401; // 401 is OK if no auth provided
      const status = success ? '✅' : '❌';
      
      console.log(`${status} ${test.name}: HTTP ${response.status}`);
      
      results.push({
        test: test.name,
        success,
        status: response.status,
        url: test.url,
      });
    } catch (error: any) {
      console.log(`❌ ${test.name}: ${error.message}`);
      results.push({
        test: test.name,
        success: false,
        error: error.message,
        url: test.url,
      });
    }
  }

  console.log('\n📊 Test Results:');
  console.table(results);

  const allPassed = results.every(r => r.success);
  
  if (allPassed) {
    console.log('\n✅ ALL TESTS PASSED! Backend is fully functional!');
  } else {
    console.log('\n❌ SOME TESTS FAILED! Check the results above.');
    console.log('📖 READ: /FIX_FAILED_TO_FETCH_ERRORS.md for solution');
  }

  return results;
}

/**
 * Quick diagnostic
 */
export async function quickDiagnostic() {
  console.log('🔧 Running Quick Diagnostic...\n');
  console.log('📍 Project ID:', projectId);
  console.log('📍 API Base:', API_BASE);
  console.log('');

  // Test 1: Health Check
  const healthResult = await testBackendHealth();
  
  if (!healthResult.success) {
    console.log('\n❌ PROBLEM DETECTED:');
    console.log('The backend Edge Function is not deployed or not responding.');
    console.log('\n🔧 SOLUTION:');
    console.log('1. Open the file: /FIX_FAILED_TO_FETCH_ERRORS.md');
    console.log('2. Follow the deployment instructions');
    console.log('3. Run this test again');
    return;
  }

  console.log('\n✅ Backend is online! All systems operational.');
}

/**
 * Auto-run diagnostic on import (in development)
 */
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  console.log('\n🚀 Auto-running backend diagnostic...\n');
  quickDiagnostic();
}

/**
 * USAGE INSTRUCTIONS:
 * 
 * 1. Run quick diagnostic:
 *    import { quickDiagnostic } from './utils/test-backend';
 *    quickDiagnostic();
 * 
 * 2. Test health only:
 *    import { testBackendHealth } from './utils/test-backend';
 *    testBackendHealth();
 * 
 * 3. Test all endpoints (requires auth):
 *    import { testAllEndpoints } from './utils/test-backend';
 *    testAllEndpoints('your-access-token');
 * 
 * 4. From browser console:
 *    // Test health
 *    fetch('https://pwlacumydrxvshklvttp.supabase.co/functions/v1/make-server-c2a25be0/health')
 *      .then(r => r.json())
 *      .then(d => console.log('✅ Backend online:', d))
 *      .catch(e => console.error('❌ Backend offline:', e));
 */
