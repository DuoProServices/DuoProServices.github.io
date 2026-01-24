import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { logger } from '../utils/logger';
import { isAdminEmail } from '../config/admins';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    let isMounted = true;
    
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        // Ignora AbortError silenciosamente
        if (error && error.name === 'AbortError') {
          return;
        }
        
        if (error) throw error;
        
        // Só atualiza o estado se o componente ainda está montado
        if (isMounted && data.session && data.session.user) {
          // Use Supabase user data directly instead of backend
          setUser({
            id: data.session.user.id,
            email: data.session.user.email!,
            name: data.session.user.user_metadata?.name || data.session.user.email!
          });
        }
      } catch (error: any) {
        // Silencia AbortError completamente (não é um erro real, é cancelamento intencional)
        if (error?.name === 'AbortError' || error?.message?.includes('abort')) {
          return;
        }
        // Loga apenas erros reais
        logger.error('Error checking session', 'AUTH', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    checkSession();
    
    // Cleanup: previne updates após unmount
    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 [SignIn] Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || email
        };
        
        console.log('✅ [SignIn] User authenticated:', userData);
        console.log('🔍 [SignIn] Checking admin status for:', userData.email);
        console.log('🔍 [SignIn] Is admin?', isAdminEmail(userData.email));
        
        setUser(userData);
      }
    } catch (error: any) {
      logger.error('Sign in error', 'AUTH', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      logger.info(`Starting signup process for: ${email}`, 'AUTH');
      
      const serverUrl = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-c2a25be0/auth/signup`;
      logger.debug(`Server URL: ${serverUrl}`);
      
      // 🔥 USE SERVER ENDPOINT TO AUTO-CONFIRM EMAIL
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ email, password, name })
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        logger.error(`Signup error from server: ${result.error}`, 'AUTH');
        throw new Error(result.error || 'Failed to create account');
      }

      logger.success('User created successfully', 'AUTH');

      // Now sign in to get the session
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        logger.error('Sign in error after signup', 'AUTH', signInError);
        throw signInError;
      }

      logger.success('User signed in successfully', 'AUTH');

      // Set user state
      setUser({
        id: signInData.user.id,
        email: signInData.user.email!,
        name: signInData.user.user_metadata?.name || name
      });

      // Create user permissions in KV store (default: client with no modules)
      try {
        logger.info('Creating user permissions in KV store', 'AUTH');
        const permissionsRes = await fetch(
          `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-c2a25be0/kv/set`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${signInData.session.access_token}`
            },
            body: JSON.stringify({
              key: `user-permissions:${signInData.user.id}`,
              value: {
                userId: signInData.user.id,
                email: signInData.user.email!,
                name: signInData.user.user_metadata?.name || name,
                role: 'client',
                modules: [],
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            })
          }
        );
        
        if (!permissionsRes.ok) {
          logger.warning('Failed to create permissions in KV store', 'AUTH');
        } else {
          logger.success('User permissions created in KV store', 'AUTH');
        }
      } catch (kvError) {
        logger.warning('Error creating permissions in KV', 'AUTH', kvError);
      }

      logger.success('Signup process completed successfully!', 'AUTH');
      return signInData;
    } catch (error: any) {
      logger.error('Sign up error', 'AUTH', error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      logger.error('Sign out error', 'AUTH', error);
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
    } catch (error: any) {
      logger.error('Reset password error', 'AUTH', error);
      throw new Error(error.message || 'Failed to send reset email');
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
    } catch (error: any) {
      logger.error('Update password error', 'AUTH', error);
      throw new Error(error.message || 'Failed to update password');
    }
  }, []);

  const isAdmin = useMemo(() => {
    const result = user ? isAdminEmail(user.email) : false;
    console.log('👑 [AuthContext] Admin status calculated:', {
      userEmail: user?.email,
      isAdmin: result
    });
    return result;
  }, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  }), [user, loading, isAdmin, signIn, signUp, signOut, resetPassword, updatePassword]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}