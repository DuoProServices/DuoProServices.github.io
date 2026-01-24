import { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.ts";

const app = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

console.log('🚀🚀🚀 [ADMIN HUB MODULE] ============================================');
console.log('✅ [ADMIN HUB MODULE] Loaded and initialized successfully!');
console.log('📋 [ADMIN HUB MODULE] Available routes:');
console.log('   - GET  /admin-hub/ping (test)');
console.log('   - GET  /admin-hub/health');
console.log('   - GET  /admin-hub/tasks');
console.log('   - POST /admin-hub/tasks');
console.log('   - GET  /admin-hub/social-posts');
console.log('   - POST /admin-hub/social-posts');
console.log('   - GET  /admin-hub/activities');
console.log('   - POST /admin-hub/activities');
console.log('🚀🚀🚀 [ADMIN HUB MODULE] ============================================');

// ==================== TASKS (Project Management) ====================

// Simple test endpoint WITHOUT authentication
app.get("/admin-hub/ping", (c) => {
  console.log('🏓 [Admin Hub] PING endpoint called - NO AUTH');
  return c.json({ 
    status: 'ok',
    message: 'Admin Hub is responding',
    timestamp: new Date().toISOString(),
    test: 'This endpoint works without authentication'
  });
});

// Health check for admin hub
app.get("/admin-hub/health", async (c) => {
  console.log('🏥 [Admin Hub] Health check called');
  return c.json({ 
    status: 'ok',
    message: 'Admin Hub is running',
    timestamp: new Date().toISOString()
  });
});

// Get all tasks
app.get("/admin-hub/tasks", async (c) => {
  try {
    console.log('📋 [Admin Hub] GET tasks request received');
    
    const tasks = await kv.getByPrefix('task:');
    console.log(`✅ [Admin Hub] Found ${tasks.length} tasks`);
    
    return c.json({ 
      success: true, 
      tasks: tasks.map(t => t.value) 
    });
  } catch (error) {
    console.error('❌ [Admin Hub] Error loading tasks:', error);
    return c.json({ error: `Failed to load tasks: ${error}` }, 500);
  }
});

// Save task
app.post("/admin-hub/tasks", async (c) => {
  try {
    console.log('💾 [Admin Hub] POST task request received');
    
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      console.error('❌ [Admin Hub] No access token provided');
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error('❌ [Admin Hub] Auth error:', authError);
      return c.json({ error: 'Authentication failed' }, 401);
    }

    console.log('✅ [Admin Hub] User authenticated:', user.id);

    const task = await c.req.json();
    console.log('📋 [Admin Hub] Task data received:', { id: task.id, title: task.title });
    
    if (!task.id || !task.title) {
      console.error('❌ [Admin Hub] Missing required fields');
      return c.json({ error: 'Missing required fields: id or title' }, 400);
    }

    await kv.set(`task:${task.id}`, task);
    console.log('✅ [Admin Hub] Task saved successfully:', task.id);
    
    return c.json({ 
      success: true, 
      message: 'Task saved successfully',
      task 
    });
  } catch (error) {
    console.error('❌ [Admin Hub] Error saving task:', error);
    return c.json({ error: `Failed to save task: ${error}` }, 500);
  }
});

// Delete task
app.delete("/admin-hub/tasks/:taskId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Authentication failed' }, 401);
    }

    const taskId = c.req.param('taskId');
    await kv.del(`task:${taskId}`);
    
    return c.json({ 
      success: true, 
      message: 'Task deleted successfully' 
    });
  } catch (error) {
    console.error('❌ [Admin Hub] Error deleting task:', error);
    return c.json({ error: `Failed to delete task: ${error}` }, 500);
  }
});

// ==================== SOCIAL POSTS ====================

app.get("/admin-hub/social-posts", async (c) => {
  try {
    const posts = await kv.getByPrefix('social-post:');
    return c.json({ 
      success: true, 
      posts: posts.map(p => p.value) 
    });
  } catch (error) {
    console.error('❌ [Admin Hub] Error loading posts:', error);
    return c.json({ error: `Failed to load posts: ${error}` }, 500);
  }
});

app.post("/admin-hub/social-posts", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Authentication failed' }, 401);
    }
    
    const post = await c.req.json();
    
    if (!post.id || !post.date || !post.content) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    await kv.set(`social-post:${post.id}`, post);
    
    return c.json({ 
      success: true, 
      message: 'Post saved successfully',
      post 
    });
  } catch (error) {
    console.error('❌ [Admin Hub] Error saving post:', error);
    return c.json({ error: `Failed to save post: ${error}` }, 500);
  }
});

app.delete("/admin-hub/social-posts/:postId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Authentication failed' }, 401);
    }

    const postId = c.req.param('postId');
    await kv.del(`social-post:${postId}`);
    
    return c.json({ 
      success: true, 
      message: 'Post deleted successfully' 
    });
  } catch (error) {
    console.error('❌ [Admin Hub] Error deleting post:', error);
    return c.json({ error: `Failed to delete post: ${error}` }, 500);
  }
});

// ==================== TEAM ACTIVITIES ====================

// Test endpoint that returns mock data (no KV access)
app.get("/admin-hub/activities-mock", async (c) => {
  console.log('🧪 [Team Activities MOCK] Request received');
  
  const mockActivities = [
    {
      id: '1',
      title: 'Mock Activity 1',
      description: 'This is a test activity from the mock endpoint',
      assignedTo: '1',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2026-01-20',
      createdAt: new Date().toISOString(),
      createdBy: 'system'
    },
    {
      id: '2',
      title: 'Mock Activity 2',
      description: 'Another test activity',
      assignedTo: '2',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-01-25',
      createdAt: new Date().toISOString(),
      createdBy: 'system'
    }
  ];
  
  console.log('✅ [Team Activities MOCK] Returning', mockActivities.length, 'activities');
  
  return c.json({ 
    success: true, 
    activities: mockActivities,
    mock: true
  });
});

app.get("/admin-hub/activities", async (c) => {
  try {
    console.log('👥 [Team Activities] GET request received');
    console.log('👥 [Team Activities] Attempting to access KV store...');
    
    const startTime = Date.now();
    const activities = await kv.getByPrefix('team-activity:');
    const duration = Date.now() - startTime;
    
    console.log(`✅ [Team Activities] KV query completed in ${duration}ms`);
    console.log(`✅ [Team Activities] Found ${activities.length} activities`);
    
    return c.json({ 
      success: true, 
      activities: activities.map(a => a.value),
      queryTime: duration
    });
  } catch (error) {
    console.error('❌ [Team Activities] Error loading activities:', error);
    console.error('❌ [Team Activities] Error details:', error?.message, error?.stack);
    return c.json({ error: `Failed to load activities: ${error}` }, 500);
  }
});

app.post("/admin-hub/activities-test", async (c) => {
  console.log('🧪 [Team Activities TEST] POST request received!');
  return c.json({ 
    success: true, 
    message: 'Test endpoint works!',
    timestamp: new Date().toISOString()
  });
});

app.post("/admin-hub/activities", async (c) => {
  console.log('🚀 [Team Activities] POST REQUEST RECEIVED');
  
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      console.error('❌ [Team Activities] No access token');
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      console.error('❌ [Team Activities] Auth error:', authError);
      return c.json({ error: 'Authentication failed' }, 401);
    }

    console.log('✅ [Team Activities] User authenticated:', user.email);
    
    const body = await c.req.json();
    const { activity } = body;
    
    if (!activity || !activity.id) {
      console.error('❌ [Team Activities] Invalid activity data');
      return c.json({ error: 'Invalid activity data' }, 400);
    }
    
    console.log('💾 [Team Activities] Saving activity:', activity.id);
    await kv.set(`team-activity:${activity.id}`, activity);
    console.log('✅ [Team Activities] Activity saved successfully!');
    
    return c.json({ 
      success: true, 
      activity 
    });
  } catch (error) {
    console.error('❌ [Team Activities] Error:', error);
    return c.json({ 
      error: `Failed to save activity: ${error?.message || error}`
    }, 500);
  }
});

app.delete("/admin-hub/activities/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Authentication failed' }, 401);
    }

    const activityId = c.req.param('id');
    await kv.del(`team-activity:${activityId}`);
    
    return c.json({ 
      success: true, 
      message: 'Activity deleted successfully' 
    });
  } catch (error) {
    console.error('❌ [Team Activities] Error deleting activity:', error);
    return c.json({ error: `Failed to delete activity: ${error}` }, 500);
  }
});

export default app;