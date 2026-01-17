import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";

const app = new Hono();

console.log('🚀 [MINIMAL SERVER] Starting...');

// Enable CORS for all routes
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check - NO AUTH, NO DEPENDENCIES
app.get("/make-server-c2a25be0/health", (c) => {
  console.log('🏥 [HEALTH] Called');
  return c.json({ 
    status: "ok",
    message: "Minimal server is healthy",
    timestamp: new Date().toISOString()
  });
});

// Ping - NO AUTH, NO DEPENDENCIES
app.get("/make-server-c2a25be0/ping", (c) => {
  console.log('🏓 [PING] Called');
  return c.json({ 
    pong: true,
    timestamp: new Date().toISOString()
  });
});

// Admin hub ping - NO AUTH, NO DEPENDENCIES
app.get("/make-server-c2a25be0/admin-hub/ping", (c) => {
  console.log('🏓 [ADMIN HUB PING] Called');
  return c.json({ 
    status: "ok",
    message: "Admin hub is responding",
    timestamp: new Date().toISOString()
  });
});

// Admin hub activities mock - NO AUTH, NO DEPENDENCIES
app.get("/make-server-c2a25be0/admin-hub/activities-mock", (c) => {
  console.log('🧪 [ACTIVITIES MOCK] Called');
  return c.json({ 
    success: true,
    activities: [
      {
        id: '1',
        title: 'Test Activity',
        description: 'Mock data',
        status: 'in-progress'
      }
    ],
    mock: true,
    timestamp: new Date().toISOString()
  });
});

console.log('✅ [MINIMAL SERVER] All routes registered');

Deno.serve(app.fetch);

console.log('✅ [MINIMAL SERVER] Server started successfully!');
