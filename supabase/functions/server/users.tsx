<<<<<<< HEAD
import { Hono } from 'npm:hono@4'
import { cors } from 'npm:hono/cors'
import { createClient } from 'jsr:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors())

// GET /make-server-c2a25be0/users/list - List all users with permissions from KV store
app.get('/make-server-c2a25be0/users/list', async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get auth from request
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Missing authorization header' }, 401)
    }

    // Verify user is admin
    const token = authHeader.replace('Bearer ', '')
    const { data: { user: requestUser }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !requestUser) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Check if user is admin
    const adminEmails = ['veprass@gmail.com', 'germana.canada@gmail.com', 'jamila.coura15@gmail.com']
    if (!adminEmails.includes(requestUser.email?.toLowerCase() ?? '')) {
      return c.json({ error: 'Forbidden - Admin only' }, 403)
    }

    // Get all users from Supabase Auth
    const { data: { users: authUsers }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error('Error listing users from auth:', listError)
      return c.json({ error: listError.message }, 500)
    }

    console.log(`✅ [Users] Found ${authUsers.length} users in Supabase Auth`)

    // Get all user permissions from KV store
    const allPermissions = await kv.getByPrefix('user-permissions:')
    const permissionsMap = new Map()
    
    if (allPermissions && allPermissions.length > 0) {
      allPermissions.forEach((item: any) => {
        const userId = item.key.replace('user-permissions:', '')
        permissionsMap.set(userId, item.value)
      })
    }

    // Get all user profiles from KV store
    const allProfiles = await kv.getByPrefix('profile:')
    const profilesMap = new Map()
    
    if (allProfiles && allProfiles.length > 0) {
      allProfiles.forEach((item: any) => {
        const userId = item.key.replace('profile:', '')
        profilesMap.set(userId, item.value)
      })
    }

    // Merge data from Auth, KV permissions, and profiles
    const usersWithPermissions = authUsers.map((user: any) => {
      const permissions = permissionsMap.get(user.id) || {
        userId: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email,
        role: 'client', // Default role
        modules: [],
        isActive: true,
        createdAt: user.created_at,
        updatedAt: user.created_at
      }

      const profile = profilesMap.get(user.id)

      return {
        ...permissions,
        email: user.email,
        name: user.user_metadata?.name || profile?.name || user.email,
        phone: user.user_metadata?.phone || profile?.phone || '',
        emailConfirmed: user.email_confirmed_at !== null,
        lastSignIn: user.last_sign_in_at,
        createdAt: user.created_at,
        onboardingComplete: profile?.onboardingCompleted || false,
        userType: (permissions.role === 'admin' || permissions.role === 'accountant' || permissions.role === 'viewer') ? 'staff' : 'client'
      }
    })

    console.log(`✅ [Users] Returning ${usersWithPermissions.length} users with permissions`)

    return c.json(usersWithPermissions)
  } catch (error: any) {
    console.error('❌ [Users] Error in /users/list:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
})

// GET /make-server-c2a25be0/users - List all users from Supabase Auth (original endpoint)
app.get('/make-server-c2a25be0/users', async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get auth from request
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Missing authorization header' }, 401)
    }

    // Verify user is admin
    const token = authHeader.replace('Bearer ', '')
    const { data: { user: requestUser }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !requestUser) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Check if user is admin
    const adminEmails = ['veprass@gmail.com', 'germana.canada@gmail.com', 'jamila.coura15@gmail.com']
    if (!adminEmails.includes(requestUser.email?.toLowerCase() ?? '')) {
      return c.json({ error: 'Forbidden - Admin only' }, 403)
    }

    // List all users (using service role key)
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) {
      console.error('Error listing users:', error)
      return c.json({ error: error.message }, 500)
    }

    // Format user data
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email,
      phone: user.user_metadata?.phone || '',
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at,
      emailConfirmed: user.email_confirmed_at !== null,
      userMetadata: user.user_metadata
    }))

    return c.json({ users: formattedUsers })
  } catch (error: any) {
    console.error('Error in /users:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
})

// GET /make-server-c2a25be0/users/:userId - Get specific user details
app.get('/make-server-c2a25be0/users/:userId', async (c) => {
  try {
    const { userId } = c.req.param()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get auth from request
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Missing authorization header' }, 401)
    }

    // Verify user is admin
    const token = authHeader.replace('Bearer ', '')
    const { data: { user: requestUser }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !requestUser) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Check if user is admin
    const adminEmails = ['veprass@gmail.com', 'germana.canada@gmail.com', 'jamila.coura15@gmail.com']
    if (!adminEmails.includes(requestUser.email?.toLowerCase() ?? '')) {
      return c.json({ error: 'Forbidden - Admin only' }, 403)
    }

    // Get user details
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId)

    if (error) {
      console.error('Error getting user:', error)
      return c.json({ error: error.message }, 500)
    }

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    // Format user data
    const formattedUser = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email,
      phone: user.user_metadata?.phone || '',
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at,
      emailConfirmed: user.email_confirmed_at !== null,
      userMetadata: user.user_metadata,
      appMetadata: user.app_metadata
    }

    return c.json({ user: formattedUser })
  } catch (error: any) {
    console.error('Error in /users/:userId:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
})

// DELETE /make-server-c2a25be0/users/:userId - Delete user
app.delete('/make-server-c2a25be0/users/:userId', async (c) => {
  try {
    const { userId } = c.req.param()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get auth from request
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Missing authorization header' }, 401)
    }

    // Verify user is admin
    const token = authHeader.replace('Bearer ', '')
    const { data: { user: requestUser }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !requestUser) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Check if user is admin
    const adminEmails = ['veprass@gmail.com', 'germana.canada@gmail.com', 'jamila.coura15@gmail.com']
    if (!adminEmails.includes(requestUser.email?.toLowerCase() ?? '')) {
      return c.json({ error: 'Forbidden - Admin only' }, 403)
    }

    // Delete user from Supabase Auth
    const { error } = await supabase.auth.admin.deleteUser(userId)

    if (error) {
      console.error('Error deleting user:', error)
      return c.json({ error: error.message }, 500)
    }

    return c.json({ message: 'User deleted successfully' })
  } catch (error: any) {
    console.error('Error in DELETE /users/:userId:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
})

// POST /make-server-c2a25be0/admin/create-user - Create new user
app.post('/make-server-c2a25be0/admin/create-user', async (c) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get auth from request
    const authHeader = c.req.header('Authorization')
    if (!authHeader) {
      return c.json({ error: 'Missing authorization header' }, 401)
    }

    // Verify user is admin
    const token = authHeader.replace('Bearer ', '')
    const { data: { user: requestUser }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !requestUser) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Check if user is admin
    const adminEmails = ['veprass@gmail.com', 'germana.canada@gmail.com', 'jamila.coura15@gmail.com']
    if (!adminEmails.includes(requestUser.email?.toLowerCase() ?? '')) {
      return c.json({ error: 'Forbidden - Admin only' }, 403)
    }

    // Get request body
    const body = await c.req.json()
    const { email, password, name, role, modules, isActive } = body

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400)
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true // Auto-confirm email since SMTP might not be configured
    })

    if (error) {
      console.error('Error creating user:', error)
      return c.json({ error: error.message }, 500)
    }

    console.log('✅ User created successfully:', data.user.id)

    // Save user permissions to KV store
    const permissions = {
      userId: data.user.id,
      email: data.user.email,
      name: name,
      role: role || 'client',
      modules: modules || [],
      isActive: isActive !== undefined ? isActive : true,
      createdAt: data.user.created_at,
      updatedAt: new Date().toISOString()
    }

    await kv.set(`user-permissions:${data.user.id}`, permissions)
    console.log('✅ User permissions saved to KV store')

    return c.json({ 
      message: 'User created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        createdAt: data.user.created_at,
        permissions
      }
    })
  } catch (error: any) {
    console.error('Error in POST /admin/create-user:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
})

export default app
=======
import { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

export const usersApp = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

export interface UserPermissions {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'accountant' | 'viewer';
  modules: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Get user permissions
usersApp.get('/make-server-c2a25be0/users/permissions/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    const permissions = await kv.get(`user-permissions:${userId}`);
    
    if (!permissions) {
      // Return default admin permissions for first user or if not found
      const user = await kv.get(`user:${userId}`);
      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }
      
      const defaultPermissions: UserPermissions = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: 'admin',
        modules: ['dashboard', 'bookkeeping', 'financial', 'customers', 'marketing', 'users'],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Save default permissions
      await kv.set(`user-permissions:${userId}`, defaultPermissions);
      
      return c.json(defaultPermissions);
    }
    
    return c.json(permissions);
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return c.json({ error: 'Failed to get user permissions' }, 500);
  }
});

// Update user permissions
usersApp.put('/make-server-c2a25be0/users/permissions/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const updates = await c.req.json();
    
    const existing = await kv.get(`user-permissions:${userId}`) || {};
    
    const updated: UserPermissions = {
      ...existing,
      ...updates,
      userId,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`user-permissions:${userId}`, updated);
    
    return c.json(updated);
  } catch (error) {
    console.error('Error updating user permissions:', error);
    return c.json({ error: 'Failed to update user permissions' }, 500);
  }
});

// Create new user
usersApp.post('/make-server-c2a25be0/users/create', async (c) => {
  try {
    const { email, password, name, role, modules, isActive } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    // Create user in Supabase Auth
    const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        role: role || 'viewer'
      },
      email_confirm: true // Auto-confirm email since we don't have email server configured
    });

    if (authError || !newUser.user) {
      console.error('Error creating user in Supabase Auth:', authError);
      return c.json({ 
        error: authError?.message || 'Failed to create user in authentication system' 
      }, 500);
    }

    const userId = newUser.user.id;

    // Create user profile in KV store
    const userProfile = {
      id: userId,
      email,
      name,
      createdAt: new Date().toISOString(),
      onboardingComplete: false,
      personalInfo: {},
      taxFilings: []
    };

    await kv.set(`user:${userId}`, userProfile);

    // Create user permissions
    const permissions: UserPermissions = {
      userId,
      email,
      name,
      role: role || 'viewer',
      modules: modules || ['dashboard'],
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user-permissions:${userId}`, permissions);

    console.log(`✅ Successfully created user: ${email} (${userId})`);

    return c.json({ 
      success: true, 
      user: {
        ...permissions,
        casesCount: 0,
        pendingCases: 0,
        completedCases: 0
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return c.json({ 
      error: `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, 500);
  }
});

// List all users with permissions and stats
usersApp.get('/make-server-c2a25be0/users/list', async (c) => {
  try {
    // Get all user profiles
    const userKeys = await kv.getByPrefix('user:');
    const users = [];
    
    for (const userKey of userKeys) {
      const user = userKey.value;
      if (!user || !user.id) continue;
      
      // Get permissions
      const permissions = await kv.get(`user-permissions:${user.id}`) || {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: 'admin',
        modules: ['dashboard', 'bookkeeping', 'financial', 'customers', 'marketing', 'users'],
        isActive: true,
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Get case stats
      const allClients = await kv.getByPrefix('client:');
      let casesCount = 0;
      let pendingCases = 0;
      let completedCases = 0;
      
      for (const clientKey of allClients) {
        const client = clientKey.value;
        if (!client.taxFilings) continue;
        
        for (const filing of client.taxFilings) {
          if (filing.assignedTo === user.id) {
            casesCount++;
            if (filing.status === 'completed') completedCases++;
            if (filing.status === 'pending' || filing.status === 'in-progress') pendingCases++;
          }
        }
      }
      
      users.push({
        ...permissions,
        casesCount,
        pendingCases,
        completedCases,
      });
    }
    
    return c.json(users);
  } catch (error) {
    console.error('Error listing users:', error);
    return c.json({ error: 'Failed to list users' }, 500);
  }
});

// Assign case to user
usersApp.post('/make-server-c2a25be0/cases/assign', async (c) => {
  try {
    const { clientId, year, assignedTo } = await c.req.json();
    
    if (!clientId || !year || !assignedTo) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Get client
    const client = await kv.get(`client:${clientId}`);
    if (!client) {
      return c.json({ error: 'Client not found' }, 404);
    }
    
    // Update tax filing
    const updatedFilings = client.taxFilings.map((filing: any) => {
      if (filing.year === year) {
        return {
          ...filing,
          assignedTo,
          assignedAt: new Date().toISOString(),
        };
      }
      return filing;
    });
    
    await kv.set(`client:${clientId}`, {
      ...client,
      taxFilings: updatedFilings,
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error assigning case:', error);
    return c.json({ error: 'Failed to assign case' }, 500);
  }
});

// Transfer case to another user
usersApp.post('/make-server-c2a25be0/cases/transfer', async (c) => {
  try {
    const { clientId, year, fromUserId, toUserId, reason } = await c.req.json();
    
    if (!clientId || !year || !toUserId) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Get client
    const client = await kv.get(`client:${clientId}`);
    if (!client) {
      return c.json({ error: 'Client not found' }, 404);
    }
    
    // Update tax filing
    const updatedFilings = client.taxFilings.map((filing: any) => {
      if (filing.year === year) {
        // Add to transfer history
        const transferHistory = filing.transferHistory || [];
        transferHistory.push({
          from: fromUserId,
          to: toUserId,
          reason,
          date: new Date().toISOString(),
        });
        
        return {
          ...filing,
          assignedTo: toUserId,
          assignedAt: new Date().toISOString(),
          transferHistory,
        };
      }
      return filing;
    });
    
    await kv.set(`client:${clientId}`, {
      ...client,
      taxFilings: updatedFilings,
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error transferring case:', error);
    return c.json({ error: 'Failed to transfer case' }, 500);
  }
});

// Get productivity stats
usersApp.get('/make-server-c2a25be0/productivity', async (c) => {
  try {
    const period = c.req.query('period') || 'month';
    
    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    // Get all users
    const userKeys = await kv.getByPrefix('user:');
    const productivity = [];
    
    for (const userKey of userKeys) {
      const user = userKey.value;
      if (!user || !user.id) continue;
      
      // Get all clients
      const allClients = await kv.getByPrefix('client:');
      
      let totalCases = 0;
      let completedCases = 0;
      let inProgressCases = 0;
      let pendingCases = 0;
      let revenue = 0;
      const recentCases = [];
      const completionTimes: number[] = [];
      
      for (const clientKey of allClients) {
        const client = clientKey.value;
        if (!client.taxFilings) continue;
        
        for (const filing of client.taxFilings) {
          if (filing.assignedTo !== user.id) continue;
          
          // Check if within period
          const assignedDate = filing.assignedAt ? new Date(filing.assignedAt) : new Date(filing.createdAt || 0);
          if (assignedDate < startDate) continue;
          
          totalCases++;
          
          if (filing.status === 'completed') {
            completedCases++;
            
            // Calculate completion time
            const completedDate = new Date(filing.completedAt || filing.updatedAt || new Date());
            const days = Math.floor((completedDate.getTime() - assignedDate.getTime()) / (1000 * 60 * 60 * 24));
            completionTimes.push(days);
            
            // Add revenue
            if (filing.payment?.finalPrice) {
              revenue += filing.payment.finalPrice;
            }
          }
          
          if (filing.status === 'in-progress' || filing.status === 'under-review') {
            inProgressCases++;
          }
          
          if (filing.status === 'pending' || filing.status === 'awaiting-documents') {
            pendingCases++;
          }
          
          // Add to recent cases
          recentCases.push({
            id: client.id,
            clientName: client.name,
            year: filing.year,
            status: filing.status,
            assignedDate: assignedDate.toISOString(),
          });
        }
      }
      
      // Sort recent cases by date
      recentCases.sort((a, b) => 
        new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime()
      );
      
      // Calculate average completion time
      const avgCompletionTime = completionTimes.length > 0
        ? Math.round(completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length)
        : 0;
      
      productivity.push({
        userId: user.id,
        name: user.name,
        email: user.email,
        totalCases,
        completedCases,
        inProgressCases,
        pendingCases,
        revenue,
        avgCompletionTime,
        recentCases: recentCases.slice(0, 5),
      });
    }
    
    // Sort by total cases (top performers first)
    productivity.sort((a, b) => b.completedCases - a.completedCases);
    
    return c.json(productivity);
  } catch (error) {
    console.error('Error getting productivity stats:', error);
    return c.json({ error: 'Failed to get productivity stats' }, 500);
  }
});

export default usersApp;
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
