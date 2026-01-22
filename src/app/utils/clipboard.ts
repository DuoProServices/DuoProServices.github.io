/**
<<<<<<< HEAD
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
=======
 * Copy text to clipboard with fallback support
 * 
 * This function tries multiple methods to copy text:
 * 1. Modern Clipboard API (navigator.clipboard.writeText)
 * 2. Legacy execCommand('copy') method
 * 3. Alert dialog as last resort
 * 
 * @param text - The text to copy
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for when clipboard API is blocked
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }
    
    document.body.removeChild(textArea);
    
    if (success) {
      return true;
    }
    
    // If all else fails, show the text in an alert
    alert(`Copy this text:\n\n${text}`);
    return false;
  } catch (err) {
    console.error("Failed to copy:", err);
    // Last resort: show the text in an alert
    alert(`Copy this text:\n\n${text}`);
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
    return false;
  }
}

<<<<<<< HEAD
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
=======
// Export alias for backward compatibility
>>>>>>> 4611dd44203dcbfb0e686683575a9f9bd31460a8
export const safeCopyToClipboard = copyToClipboard;