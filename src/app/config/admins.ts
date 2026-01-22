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
<<<<<<< HEAD
  'jamila.coura15@gmail.com',
=======
  'duoproservices.info@gmail.com',
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
];

/**
 * Verifica se um email é de administrador
 */
export function isAdminEmail(email: string | undefined | null): boolean {
<<<<<<< HEAD
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
=======
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
}