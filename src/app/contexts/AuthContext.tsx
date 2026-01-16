import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
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
        // Silencia AbortError (não é um erro real)
        if (error?.name === 'AbortError') {
          return;
        }
        // Só loga erros reais em desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.error('Error checking session:', error);
        }
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || email
        });
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      console.log("🚀 [AuthContext] Starting signup process for:", email);
      
      const serverUrl = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-c2a25be0/auth/signup`;
      console.log("🌐 [AuthContext] Server URL:", serverUrl);
      console.log("📦 [AuthContext] Payload:", { email, password: "***", name });
      
      // 🔥 USE SERVER ENDPOINT TO AUTO-CONFIRM EMAIL
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ email, password, name })
      });

      console.log("📡 [AuthContext] Server response status:", response.status);
      console.log("📡 [AuthContext] Server response ok:", response.ok);

      const result = await response.json();
      console.log("📦 [AuthContext] Server response body:", result);

      if (!response.ok || result.error) {
        console.error("❌ [AuthContext] Signup error from server:", result.error);
        throw new Error(result.error || 'Failed to create account');
      }

      console.log("✅ [AuthContext] User created successfully:", result.user);

      // Now sign in to get the session
      console.log("🔐 [AuthContext] Signing in user...");
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error("❌ [AuthContext] Sign in error after signup:", signInError);
        throw signInError;
      }

      console.log("✅ [AuthContext] User signed in successfully");
      console.log("👤 [AuthContext] User data:", signInData.user);

      // Set user state
      setUser({
        id: signInData.user.id,
        email: signInData.user.email!,
        name: signInData.user.user_metadata?.name || name
      });

      // Create user permissions in KV store (default: client with no modules)
      try {
        console.log("💾 [AuthContext] Creating user permissions in KV...");
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
          console.error("⚠️ [AuthContext] Failed to create permissions in KV store");
        } else {
          console.log("✅ [AuthContext] User permissions created in KV store successfully!");
        }
      } catch (kvError) {
        console.error("⚠️ [AuthContext] Error creating permissions in KV:", kvError);
      }

      console.log("🎉 [AuthContext] Signup process completed successfully!");
      return signInData;
    } catch (error: any) {
      console.error('❌ [AuthContext] Sign up error:', error);
      console.error('❌ [AuthContext] Error message:', error.message);
      console.error('❌ [AuthContext] Error stack:', error.stack);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
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
      console.error('Reset password error:', error);
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
      console.error('Update password error:', error);
      throw new Error(error.message || 'Failed to update password');
    }
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword
  }), [user, loading, signIn, signUp, signOut, resetPassword, updatePassword]);

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