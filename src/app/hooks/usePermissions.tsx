import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { fetchWithFallback } from '../utils/apiHelper';

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
      const { data, isMocked } = await fetchWithFallback(
        `/users/permissions/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Se recebeu dados mockados ou dados reais
      if (isMocked) {
        // Usar dados mockados
        const defaultPermissions: UserPermissions = {
          userId: user.id,
          email: user.email || '',
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          role: 'admin',
          modules: ['dashboard', 'bookkeeping', 'financial', 'customers', 'marketing', 'users'],
          isActive: true,
        };
        setPermissions(defaultPermissions);
      } else {
        // Usar dados reais do backend
        setPermissions(data);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      // Em caso de erro, dar permissões de admin por padrão
      setPermissions({
        userId: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
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
}