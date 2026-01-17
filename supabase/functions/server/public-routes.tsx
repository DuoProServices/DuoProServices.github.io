import { Hono } from "npm:hono";

const app = new Hono();

// ==================== PUBLIC ROUTES (NO AUTH REQUIRED) ====================

// Ultra simple ping endpoint - returns plain text
app.get("/make-server-c2a25be0/ping", (c) => {
  console.log('🏓 [PING] Ultra simple ping called - NO AUTH');
  return c.text("PONG - Server is alive!", 200);
});

// Health check endpoint (no auth required)
app.get("/make-server-c2a25be0/health", (c) => {
  console.log('🏥 [Health] Health check called - NO AUTH');
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Server alive check endpoint (no auth required)
app.get("/make-server-c2a25be0/server-alive", (c) => {
  console.log('💓 [Server Alive] Server alive check called - NO AUTH');
  return c.json({ 
    status: 'alive',
    message: 'Main server is running!',
    timestamp: new Date().toISOString(),
    routes_mounted: true
  });
});

export default app;
