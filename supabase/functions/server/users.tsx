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