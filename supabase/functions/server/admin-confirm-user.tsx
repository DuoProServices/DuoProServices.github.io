/**
 * ADMIN USER CONFIRMATION ROUTE
 * Allows admins to manually confirm users who are pending email verification
 */

import { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

/**
 * POST /make-server-c2a25be0/admin/confirm-user
 * Confirms a user account that is pending email verification
 * 
 * Body: { email: string }
 */
app.post('/make-server-c2a25be0/admin/confirm-user', async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ 
        success: false, 
        error: 'Email is required' 
      }, 400);
    }

    console.log(`Admin confirming user: ${email}`);

    // Get user by email
    const { data: users, error: getUserError } = await supabase.auth.admin.listUsers();

    if (getUserError) {
      console.error('Error listing users:', getUserError);
      return c.json({ 
        success: false, 
        error: `Failed to find user: ${getUserError.message}` 
      }, 500);
    }

    const user = users.users.find(u => u.email === email);

    if (!user) {
      return c.json({ 
        success: false, 
        error: `User with email ${email} not found` 
      }, 404);
    }

    // Update user to confirm email
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { 
        email_confirm: true 
      }
    );

    if (updateError) {
      console.error('Error confirming user:', updateError);
      return c.json({ 
        success: false, 
        error: `Failed to confirm user: ${updateError.message}` 
      }, 500);
    }

    console.log(`Successfully confirmed user: ${email}`);

    return c.json({ 
      success: true, 
      message: `User ${email} has been confirmed successfully`,
      user: {
        id: updatedUser.user.id,
        email: updatedUser.user.email,
        confirmed_at: updatedUser.user.email_confirmed_at
      }
    });

  } catch (error: any) {
    console.error('Error in confirm-user route:', error);
    return c.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, 500);
  }
});

export default app;
