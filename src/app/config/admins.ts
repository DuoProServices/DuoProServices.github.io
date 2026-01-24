/**
 * ADMIN CONFIGURATION
 * 
 * Para adicionar um novo administrador:
 * 1. Adicione o email na lista ADMIN_EMAILS abaixo
 * 2. Salve o arquivo
 * 3. O usuário com esse email terá acesso ao painel admin
 * 
 * IMPORTANTE: Use emails em MINÚSCULAS
 */

export const ADMIN_EMAILS = [
  'veprass@gmail.com',
  'germana.canada@gmail.com',
  'jamila.coura15@gmail.com',
];

/**
 * Verifica se um email é de administrador
 */
export function isAdminEmail(email: string | undefined | null): boolean {
  console.log('🔍 [isAdminEmail] Checking email:', email);
  console.log('🔍 [isAdminEmail] Admin emails list:', ADMIN_EMAILS);
  
  if (!email) {
    console.log('❌ [isAdminEmail] Email is undefined/null');
    return false;
  }
  
  const normalizedEmail = email.toLowerCase();
  const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);
  
  console.log('🔍 [isAdminEmail] Normalized email:', normalizedEmail);
  console.log('🔍 [isAdminEmail] Is admin?', isAdmin);
  
  return isAdmin;
}