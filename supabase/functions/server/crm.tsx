import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import * as kv from "./kv_store.tsx";

export const crmApp = new Hono();

// Enable CORS for all CRM routes
crmApp.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  contactMethod: 'email' | 'whatsapp' | 'phone' | 'form' | 'referral' | 'linkedin' | 'instagram' | 'other';
  status: 'new' | 'contacted' | 'quote-sent' | 'negotiating' | 'won' | 'lost';
  estimatedValue?: number;
  notes?: string;
  quoteSent?: boolean;
  quoteSentDate?: string;
  closedDate?: string;
  lostReason?: string;
  source?: string;
  assignedTo?: string;
  activities: Activity[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'quote' | 'status-change';
  description: string;
  createdBy: string;
  createdAt: string;
}

// Get all leads
crmApp.get('/make-server-c2a25be0/crm/leads', async (c) => {
  try {
    const leads = await kv.getByPrefix('crm-lead:');
    const leadsData = leads.map(l => l.value).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    console.log(`✅ [CRM] Found ${leadsData.length} leads`);
    
    return c.json(leadsData);
  } catch (error) {
    console.error('❌ [CRM] Error getting leads:', error);
    return c.json({ error: 'Failed to get leads' }, 500);
  }
});

// Get single lead
crmApp.get('/make-server-c2a25be0/crm/leads/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const lead = await kv.get(`crm-lead:${id}`);
    
    if (!lead) {
      return c.json({ error: 'Lead not found' }, 404);
    }
    
    return c.json(lead);
  } catch (error) {
    console.error('❌ [CRM] Error getting lead:', error);
    return c.json({ error: 'Failed to get lead' }, 500);
  }
});

// Create lead
crmApp.post('/make-server-c2a25be0/crm/leads', async (c) => {
  try {
    const data = await c.req.json();
    
    if (!data.name) {
      return c.json({ error: 'Name is required' }, 400);
    }
    
    const leadId = `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const lead: Lead = {
      id: leadId,
      name: data.name,
      email: data.email || '',
      phone: data.phone || '',
      company: data.company || '',
      contactMethod: data.contactMethod || 'other',
      status: data.status || 'new',
      estimatedValue: data.estimatedValue || 0,
      notes: data.notes || '',
      quoteSent: false,
      source: data.source || '',
      assignedTo: data.assignedTo || '',
      activities: [{
        id: `activity-${Date.now()}`,
        type: 'note',
        description: `Lead created via ${data.contactMethod || 'unknown method'}`,
        createdBy: data.assignedTo || 'System',
        createdAt: new Date().toISOString(),
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`crm-lead:${leadId}`, lead);
    
    console.log(`✅ [CRM] Created lead: ${lead.name} (${leadId})`);
    
    return c.json(lead);
  } catch (error) {
    console.error('❌ [CRM] Error creating lead:', error);
    return c.json({ error: 'Failed to create lead' }, 500);
  }
});

// Update lead
crmApp.put('/make-server-c2a25be0/crm/leads/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(`crm-lead:${id}`);
    if (!existing) {
      return c.json({ error: 'Lead not found' }, 404);
    }
    
    // Track status changes
    const activities = [...existing.activities];
    if (updates.status && updates.status !== existing.status) {
      activities.push({
        id: `activity-${Date.now()}`,
        type: 'status-change',
        description: `Status changed from ${existing.status} to ${updates.status}`,
        createdBy: updates.updatedBy || 'System',
        createdAt: new Date().toISOString(),
      });
    }
    
    // Track quote sent
    if (updates.quoteSent && !existing.quoteSent) {
      activities.push({
        id: `activity-${Date.now()}`,
        type: 'quote',
        description: 'Quote sent to client',
        createdBy: updates.updatedBy || 'System',
        createdAt: new Date().toISOString(),
      });
      updates.quoteSentDate = new Date().toISOString();
    }
    
    // Track won/lost
    if (updates.status === 'won' && existing.status !== 'won') {
      updates.closedDate = new Date().toISOString();
    }
    
    const updatedLead: Lead = {
      ...existing,
      ...updates,
      activities,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`crm-lead:${id}`, updatedLead);
    
    console.log(`✅ [CRM] Updated lead: ${id}`);
    
    return c.json(updatedLead);
  } catch (error) {
    console.error('❌ [CRM] Error updating lead:', error);
    return c.json({ error: 'Failed to update lead' }, 500);
  }
});

// Add activity to lead
crmApp.post('/make-server-c2a25be0/crm/leads/:id/activities', async (c) => {
  try {
    const id = c.req.param('id');
    const activityData = await c.req.json();
    
    const lead = await kv.get(`crm-lead:${id}`);
    if (!lead) {
      return c.json({ error: 'Lead not found' }, 404);
    }
    
    const activity: Activity = {
      id: `activity-${Date.now()}`,
      type: activityData.type || 'note',
      description: activityData.description,
      createdBy: activityData.createdBy || 'System',
      createdAt: new Date().toISOString(),
    };
    
    lead.activities.push(activity);
    lead.updatedAt = new Date().toISOString();
    
    await kv.set(`crm-lead:${id}`, lead);
    
    console.log(`✅ [CRM] Added activity to lead: ${id}`);
    
    return c.json(lead);
  } catch (error) {
    console.error('❌ [CRM] Error adding activity:', error);
    return c.json({ error: 'Failed to add activity' }, 500);
  }
});

// Delete lead
crmApp.delete('/make-server-c2a25be0/crm/leads/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`crm-lead:${id}`);
    
    console.log(`✅ [CRM] Deleted lead: ${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('❌ [CRM] Error deleting lead:', error);
    return c.json({ error: 'Failed to delete lead' }, 500);
  }
});

// Get CRM statistics
crmApp.get('/make-server-c2a25be0/crm/stats', async (c) => {
  try {
    const leads = await kv.getByPrefix('crm-lead:');
    const leadsData = leads.map(l => l.value);
    
    const stats = {
      total: leadsData.length,
      new: leadsData.filter(l => l.status === 'new').length,
      contacted: leadsData.filter(l => l.status === 'contacted').length,
      quoteSent: leadsData.filter(l => l.status === 'quote-sent').length,
      negotiating: leadsData.filter(l => l.status === 'negotiating').length,
      won: leadsData.filter(l => l.status === 'won').length,
      lost: leadsData.filter(l => l.status === 'lost').length,
      conversionRate: leadsData.length > 0 ? 
        Math.round((leadsData.filter(l => l.status === 'won').length / leadsData.length) * 100) : 0,
      totalValue: leadsData
        .filter(l => l.status === 'won')
        .reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
      estimatedPipeline: leadsData
        .filter(l => !['won', 'lost'].includes(l.status))
        .reduce((sum, l) => sum + (l.estimatedValue || 0), 0),
      byContactMethod: {
        email: leadsData.filter(l => l.contactMethod === 'email').length,
        whatsapp: leadsData.filter(l => l.contactMethod === 'whatsapp').length,
        phone: leadsData.filter(l => l.contactMethod === 'phone').length,
        form: leadsData.filter(l => l.contactMethod === 'form').length,
        referral: leadsData.filter(l => l.contactMethod === 'referral').length,
        linkedin: leadsData.filter(l => l.contactMethod === 'linkedin').length,
        instagram: leadsData.filter(l => l.contactMethod === 'instagram').length,
        other: leadsData.filter(l => l.contactMethod === 'other').length,
      },
    };
    
    console.log(`✅ [CRM] Generated stats for ${leadsData.length} leads`);
    
    return c.json(stats);
  } catch (error) {
    console.error('❌ [CRM] Error getting stats:', error);
    return c.json({ error: 'Failed to get stats' }, 500);
  }
});

export default crmApp;