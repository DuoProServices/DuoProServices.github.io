/**
 * CONTACT EMAIL HANDLER
 * Envia emails de contato via Resend
 */

import { Hono } from 'npm:hono';

const app = new Hono();

// Rate limiting simples (armazena últimos envios por IP)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 3600000; // 1 hora em ms
const RATE_LIMIT_MAX = 5; // 5 emails por hora

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Remove timestamps antigos
  const recentTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (recentTimestamps.length >= RATE_LIMIT_MAX) {
    return false; // Rate limit exceeded
  }
  
  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  return true;
}

function getClientIP(c: any): string {
  return c.req.header('x-forwarded-for')?.split(',')[0] || 
         c.req.header('x-real-ip') || 
         'unknown';
}

// Endpoint para enviar email de contato
app.post('/contact/send', async (c) => {
  try {
    console.log('📧 [Contact Email] Received request');
    
    // Check rate limit
    const clientIP = getClientIP(c);
    if (!checkRateLimit(clientIP)) {
      console.warn(`⚠️ [Contact Email] Rate limit exceeded for IP: ${clientIP}`);
      return c.json({ 
        error: 'Too many requests. Please try again in an hour.' 
      }, 429);
    }
    
    // Parse request body
    const body = await c.req.json();
    const { name, email, phone, subject, message } = body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.error('❌ [Contact Email] Missing required fields');
      return c.json({ 
        error: 'Missing required fields: name, email, subject, message' 
      }, 400);
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ [Contact Email] Invalid email format:', email);
      return c.json({ error: 'Invalid email format' }, 400);
    }
    
    console.log('✅ [Contact Email] Validation passed');
    console.log('📋 [Contact Email] From:', name, '<' + email + '>');
    console.log('📋 [Contact Email] Subject:', subject);
    
    // Get Resend API key from environment
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error('❌ [Contact Email] RESEND_API_KEY not configured');
      return c.json({ 
        error: 'Email service not configured. Please contact support directly at duopro@duoproservices.ca' 
      }, 500);
    }
    
    // Create email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: white;
      padding: 30px 20px;
      border-radius: 8px 8px 0 0;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      background: #f9fafb;
      padding: 30px 20px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .field {
      margin-bottom: 20px;
      background: white;
      padding: 15px;
      border-radius: 6px;
      border-left: 3px solid #2563eb;
    }
    .field-label {
      font-weight: 600;
      color: #1f2937;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .field-value {
      color: #374151;
      font-size: 15px;
    }
    .message-box {
      background: white;
      padding: 20px;
      border-radius: 6px;
      border-left: 3px solid #10b981;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .footer {
      background: #f3f4f6;
      padding: 20px;
      border-radius: 0 0 8px 8px;
      border: 1px solid #e5e7eb;
      border-top: none;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    .divider {
      border: none;
      border-top: 2px dashed #e5e7eb;
      margin: 20px 0;
    }
    .emoji {
      font-size: 18px;
      margin-right: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📨 Nova Mensagem de Contato</h1>
  </div>
  
  <div class="content">
    <div class="field">
      <div class="field-label"><span class="emoji">👤</span>Nome</div>
      <div class="field-value">${name}</div>
    </div>
    
    <div class="field">
      <div class="field-label"><span class="emoji">📧</span>Email</div>
      <div class="field-value"><a href="mailto:${email}">${email}</a></div>
    </div>
    
    ${phone ? `
    <div class="field">
      <div class="field-label"><span class="emoji">📱</span>Telefone</div>
      <div class="field-value">${phone}</div>
    </div>
    ` : ''}
    
    <div class="field">
      <div class="field-label"><span class="emoji">📋</span>Assunto</div>
      <div class="field-value">${subject}</div>
    </div>
    
    <hr class="divider">
    
    <div class="field-label" style="margin-bottom: 10px;">
      <span class="emoji">💬</span>Mensagem
    </div>
    <div class="message-box">${message}</div>
  </div>
  
  <div class="footer">
    <p style="margin: 0 0 10px 0;">
      ⏰ Recebido em: ${new Date().toLocaleString('pt-BR', { 
        timeZone: 'America/Toronto',
        dateStyle: 'full',
        timeStyle: 'short'
      })}
    </p>
    <p style="margin: 0;">
      Para responder, envie email para: <a href="mailto:${email}">${email}</a>
    </p>
  </div>
</body>
</html>
    `;
    
    // Create plain text version
    const emailText = `
Nova Mensagem de Contato
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 NOME:
${name}

📧 EMAIL:
${email}

${phone ? `📱 TELEFONE:\n${phone}\n\n` : ''}📋 ASSUNTO:
${subject}

💬 MENSAGEM:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Recebido em: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Toronto' })}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para responder, envie email para: ${email}
    `;
    
    // Send email via Resend
    console.log('📤 [Contact Email] Sending email via Resend...');
    
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'DuoPro Services <onboarding@resend.dev>', // Will change to noreply@duoproservices.ca after domain verification
        to: ['duopro@duoproservices.ca'],
        reply_to: email,
        subject: `Nova mensagem de contato: ${subject}`,
        html: emailHtml,
        text: emailText,
      }),
    });
    
    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('❌ [Contact Email] Resend API error:', resendResponse.status, errorText);
      
      // Try to parse error
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.message || errorText;
      } catch (e) {
        // Ignore parse error
      }
      
      return c.json({ 
        error: 'Failed to send email. Please try again or contact us directly at duopro@duoproservices.ca',
        details: errorDetails
      }, 500);
    }
    
    const resendData = await resendResponse.json();
    console.log('✅ [Contact Email] Email sent successfully!');
    console.log('📧 [Contact Email] Email ID:', resendData.id);
    
    return c.json({ 
      success: true,
      message: 'Email sent successfully',
      emailId: resendData.id
    });
    
  } catch (error) {
    console.error('❌ [Contact Email] Unexpected error:', error);
    return c.json({ 
      error: 'Internal server error. Please try again or contact us directly at duopro@duoproservices.ca',
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

export default app;
