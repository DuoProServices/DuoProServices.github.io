import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
<<<<<<< HEAD
import { fetchWithFallback } from '../utils/apiHelper';
=======
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8

export type ModulePermission = 
  | 'dashboard' 
  | 'bookkeeping' 
  | 'financial' 
  | 'customers' 
  | 'marketing' 
  | 'users';

export interface UserPermissions {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'accountant' | 'viewer';
  modules: ModulePermission[];
  isActive: boolean;
}

export function usePermissions() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPermissions();
    } else {
      setPermissions(null);
      setLoading(false);
    }
  }, [user]);

  const loadPermissions = async () => {
    if (!user) return;

    try {
<<<<<<< HEAD
      const { data, isMocked } = await fetchWithFallback(
        `/users/permissions/${user.id}`,
=======
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c2a25be0/users/permissions/${user.id}`,
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

<<<<<<< HEAD
      // Se recebeu dados mockados ou dados reais
      if (isMocked) {
        // Usar dados mockados
        const defaultPermissions: UserPermissions = {
          userId: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
=======
      if (!response.ok) {
        // Se não encontrar permissões, assumir admin padrão (primeiro usuário)
        const defaultPermissions: UserPermissions = {
          userId: user.id,
          email: user.email,
          name: user.name,
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
          role: 'admin',
          modules: ['dashboard', 'bookkeeping', 'financial', 'customers', 'marketing', 'users'],
          isActive: true,
        };
        setPermissions(defaultPermissions);
<<<<<<< HEAD
      } else {
        // Usar dados reais do backend
        setPermissions(data);
      }
=======
        return;
      }

      const data = await response.json();
      setPermissions(data);
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
    } catch (error) {
      console.error('Error loading permissions:', error);
      // Em caso de erro, dar permissões de admin por padrão
      setPermissions({
        userId: user.id,
<<<<<<< HEAD
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
=======
        email: user.email,
        name: user.name,
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
        role: 'admin',
        modules: ['dashboard', 'bookkeeping', 'financial', 'customers', 'marketing', 'users'],
        isActive: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (module: ModulePermission): boolean => {
    if (!permissions) return false;
    if (permissions.role === 'admin') return true;
    return permissions.modules.includes(module);
  };

  const isAdmin = (): boolean => {
    return permissions?.role === 'admin' || false;
  };

  return {
    permissions,
    loading,
    hasPermission,
    isAdmin,
    refresh: loadPermissions,
  };
<<<<<<< HEAD
}
=======
}
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
