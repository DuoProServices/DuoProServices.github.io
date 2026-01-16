import { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

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
    
    // Remove authentication for GET requests - allow reading with anon key
    // Get all tasks
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
    
    if (authError) {
      console.error('❌ [Admin Hub] Auth error:', authError);
      return c.json({ error: 'Authentication failed' }, 401);
    }
    
    if (!user) {
      console.error('❌ [Admin Hub] No user found');
      return c.json({ error: 'User not found' }, 401);
    }

    console.log('✅ [Admin Hub] User authenticated:', user.id);

    const task = await c.req.json();
    console.log('📋 [Admin Hub] Task data received:', { id: task.id, title: task.title });
    
    if (!task.id || !task.title) {
      console.error('❌ [Admin Hub] Missing required fields:', { 
        hasId: !!task.id, 
        hasTitle: !!task.title
      });
      return c.json({ error: 'Missing required fields: id or title' }, 400);
    }

    // Save task to KV store
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
    console.log('🗑️ [Admin Hub] DELETE task request received');
    
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      console.error('❌ [Admin Hub] No access token provided');
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError) {
      console.error('❌ [Admin Hub] Auth error:', authError);
      return c.json({ error: 'Authentication failed' }, 401);
    }
    
    if (!user) {
      console.error('❌ [Admin Hub] No user found');
      return c.json({ error: 'User not found' }, 401);
    }

    console.log('✅ [Admin Hub] User authenticated:', user.id);

    const taskId = c.req.param('taskId');
    console.log('🗑️ [Admin Hub] Deleting task:', taskId);
    
    await kv.del(`task:${taskId}`);
    console.log('✅ [Admin Hub] Task deleted successfully');
    
    return c.json({ 
      success: true, 
      message: 'Task deleted successfully' 
    });
  } catch (error) {
    console.error('❌ [Admin Hub] Error deleting task:', error);
    return c.json({ error: `Failed to delete task: ${error}` }, 500);
  }
});

// ==================== SOCIAL POSTS (Social Calendar) ====================

// Get all posts
app.get("/admin-hub/social-posts", async (c) => {
  try {
    console.log('📱 [Admin Hub] GET social posts request received');
    
    // Remove authentication for GET requests - allow reading with anon key
    // Get all posts
    const posts = await kv.getByPrefix('social-post:');
    console.log(`✅ [Admin Hub] Found ${posts.length} posts`);
    
    return c.json({ 
      success: true, 
      posts: posts.map(p => p.value) 
    });
  } catch (error) {
    console.error('❌ [Admin Hub] Error loading posts:', error);
    return c.json({ error: `Failed to load posts: ${error}` }, 500);
  }
});

// Save post
app.post("/admin-hub/social-posts", async (c) => {
  try {
    console.log('💾 [Admin Hub] POST social post request received');
    
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      console.error('❌ [Admin Hub] No access token provided');
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError) {
      console.error('❌ [Admin Hub] Auth error:', authError);
      return c.json({ error: 'Authentication failed' }, 401);
    }
    
    if (!user) {
      console.error('❌ [Admin Hub] No user found');
      return c.json({ error: 'User not found' }, 401);
    }

    console.log('✅ [Admin Hub] User authenticated:', user.id);
    
    const post = await c.req.json();
    console.log('📱 [Admin Hub] Post data received:', { id: post.id, platform: post.platform, date: post.date });
    
    if (!post.id || !post.date || !post.content) {
      console.error('❌ [Admin Hub] Missing required fields:', { 
        hasId: !!post.id, 
        hasDate: !!post.date, 
        hasContent: !!post.content 
      });
      return c.json({ error: 'Missing required fields: id, date, or content' }, 400);
    }

    // Save post to KV store
    await kv.set(`social-post:${post.id}`, post);
    console.log('✅ [Admin Hub] Post saved successfully:', post.id);
    
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

// Delete post
app.delete("/admin-hub/social-posts/:postId", async (c) => {
  try {
    console.log('🗑️ [Admin Hub] DELETE social post request received');
    
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      console.error('❌ [Admin Hub] No access token provided');
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError) {
      console.error('❌ [Admin Hub] Auth error:', authError);
      return c.json({ error: 'Authentication failed' }, 401);
    }
    
    if (!user) {
      console.error('❌ [Admin Hub] No user found');
      return c.json({ error: 'User not found' }, 401);
    }

    console.log('✅ [Admin Hub] User authenticated:', user.id);

    const postId = c.req.param('postId');
    console.log('🗑️ [Admin Hub] Deleting post:', postId);
    
    await kv.del(`social-post:${postId}`);
    console.log('✅ [Admin Hub] Post deleted successfully');
    
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

// Get all team activities
app.get("/admin-hub/activities", async (c) => {
  try {
    console.log('👥 [Team Activities] GET request received');
    
    const activities = await kv.getByPrefix('team-activity:');
    console.log(`✅ [Team Activities] Found ${activities.length} activities`);
    
    return c.json({ 
      success: true, 
      activities: activities.map(a => a.value) 
    });
  } catch (error) {
    console.error('❌ [Team Activities] Error loading activities:', error);
    return c.json({ error: `Failed to load activities: ${error}` }, 500);
  }
});

// TEST ENDPOINT - Simple response without any processing
app.post("/admin-hub/activities-test", async (c) => {
  console.log('🧪 [Team Activities TEST] POST request received!');
  return c.json({ 
    success: true, 
    message: 'Test endpoint works!',
    timestamp: new Date().toISOString()
  });
});

// Create or update team activity
app.post("/admin-hub/activities", async (c) => {
  console.log('🚀🚀🚀 [Team Activities] ========================================');
  console.log('🚀🚀🚀 [Team Activities] POST REQUEST RECEIVED!!!');
  console.log('🚀🚀🚀 [Team Activities] Request URL:', c.req.url);
  console.log('🚀🚀🚀 [Team Activities] Request method:', c.req.method);
  console.log('🚀🚀🚀 [Team Activities] ========================================');
  
  try {
    console.log('👥 [Team Activities] Step 1: Checking authentication...');
    
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    console.log('🔑 [Team Activities] Access token present?', !!accessToken);
    
    if (!accessToken) {
      console.error('❌ [Team Activities] No access token provided');
      return c.json({ error: 'No authorization token provided' }, 401);
    }
    
    console.log('👥 [Team Activities] Step 2: Validating user...');
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError) {
      console.error('❌ [Team Activities] Auth error:', authError);
      return c.json({ error: 'Authentication failed' }, 401);
    }
    
    if (!user) {
      console.error('❌ [Team Activities] No user found');
      return c.json({ error: 'User not found' }, 401);
    }

    console.log('✅ [Team Activities] User authenticated:', user.id, user.email);
    
    console.log('👥 [Team Activities] Step 3: Parsing request...');
    const contentType = c.req.header('Content-Type');
    console.log('📋 [Team Activities] Content-Type:', contentType);
    
    console.log('👥 [Team Activities] Step 4: Parsing JSON body...');
    const body = await c.req.json();
    console.log('📦 [Team Activities] Body received:', JSON.stringify(body, null, 2));
    
    const { activity } = body;
    console.log('🎯 [Team Activities] Step 5: Extracted activity:', activity ? 'Yes' : 'No');
    
    if (!activity || !activity.id) {
      console.error('❌ [Team Activities] Invalid activity data - missing id');
      console.error('❌ [Team Activities] Activity object:', activity);
      return c.json({ error: 'Invalid activity data' }, 400);
    }
    
    console.log('💾 [Team Activities] Step 6: Preparing to save to KV store...');
    console.log('💾 [Team Activities] Key:', `team-activity:${activity.id}`);
    console.log('💾 [Team Activities] Value preview:', {
      id: activity.id,
      title: activity.title,
      assignedTo: activity.assignedTo
    });
    
    console.log('💾 [Team Activities] Step 7: Saving to KV (with 5s timeout)...');
    
    // Save to KV store with timeout protection
    try {
      const savePromise = kv.set(`team-activity:${activity.id}`, activity);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('KV store timeout after 5 seconds')), 5000)
      );
      
      await Promise.race([savePromise, timeoutPromise]);
      console.log('✅ [Team Activities] Step 8: KV save completed!');
    } catch (kvError) {
      console.error('❌ [Team Activities] KV save error:', kvError);
      throw new Error(`KV save failed: ${kvError.message}`);
    }
    
    console.log('✅ [Team Activities] Step 9: Activity saved successfully!');
    console.log('✅ [Team Activities] Activity ID:', activity.id);
    
    const response = { 
      success: true, 
      activity 
    };
    
    console.log('📤 [Team Activities] Step 10: Sending response');
    console.log('🚀🚀🚀 [Team Activities] REQUEST COMPLETED SUCCESSFULLY!');
    console.log('🚀🚀🚀 [Team Activities] ========================================');
    
    return c.json(response);
  } catch (error) {
    console.error('❌❌❌ [Team Activities] ========================================');
    console.error('❌❌❌ [Team Activities] ERROR OCCURRED!!!');
    console.error('❌❌❌ [Team Activities] Error type:', error?.constructor?.name);
    console.error('❌❌❌ [Team Activities] Error message:', error?.message);
    console.error('❌❌❌ [Team Activities] Error stack:', error?.stack);
    console.error('❌❌❌ [Team Activities] ========================================');
    return c.json({ 
      error: `Failed to save activity: ${error?.message || error}`,
      details: error?.constructor?.name || 'Unknown error type'
    }, 500);
  }
});

// Delete team activity
app.delete("/admin-hub/activities/:id", async (c) => {
  try {
    const activityId = c.req.param('id');
    console.log('🗑️ [Team Activities] Deleting activity:', activityId);
    
    await kv.del(`team-activity:${activityId}`);
    console.log('✅ [Team Activities] Activity deleted successfully');
    
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