import { Hono } from "npm:hono";

const app = new Hono();

console.log('🚀 [ADMIN HUB SIMPLE] Module loading...');

// Simple test endpoint - NO DEPENDENCIES
app.get("/admin-hub/test-simple", (c) => {
  console.log('🧪 [Admin Hub Simple] TEST endpoint called!');
  return c.json({ 
    success: true,
    message: 'Simple test endpoint works!',
    timestamp: new Date().toISOString()
  });
});

// Ping endpoint
app.get("/admin-hub/ping", (c) => {
  console.log('🏓 [Admin Hub Simple] PING endpoint called!');
  return c.json({ 
    status: 'ok',
    message: 'Admin Hub Simple is responding',
    timestamp: new Date().toISOString()
  });
});

console.log('✅ [ADMIN HUB SIMPLE] Module loaded successfully!');

export default app;
