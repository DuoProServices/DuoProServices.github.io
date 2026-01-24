/**
 * CLIPBOARD UTILITY
 * Universal copy function that works in all browsers and contexts
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  // Method 1: Try modern Clipboard API (only in secure contexts)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Silently fall through to fallback methods
      // Don't log warnings - this is expected in some contexts
    }
  }

  // Method 2: Fallback to execCommand (works in more contexts)
  try {
    // Create a temporary textarea
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make it invisible but still focusable
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    
    // For iOS compatibility
    if (navigator.userAgent.match(/ipad|iphone/i)) {
      const range = document.createRange();
      range.selectNodeContents(textArea);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      textArea.setSelectionRange(0, text.length);
    } else {
      textArea.focus();
      textArea.select();
    }
    
    // Try to copy
    const successful = document.execCommand('copy');
    
    // Clean up
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    // Only log if all methods fail
    console.error('All clipboard methods failed:', err);
    return false;
  }
}

/**
 * Copy with toast notification
 */
export async function copyWithToast(
  text: string,
  successMessage: string = 'Copiado!',
  errorMessage: string = 'Erro ao copiar'
): Promise<boolean> {
  const success = await copyToClipboard(text);
  
  if (success) {
    // Show success message (you can import toast from sonner if needed)
    console.log('✅', successMessage);
  } else {
    // Show error message
    console.error('❌', errorMessage);
  }
  
  return success;
}

/**
 * Alias for backward compatibility
 */
export const safeCopyToClipboard = copyToClipboard;