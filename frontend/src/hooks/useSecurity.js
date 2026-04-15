import { useEffect } from 'react';

/**
 * useSecurity
 * Implements global protections to prevent unauthorized content duplication.
 * Blocks Right-click, View Source, and common Screen Capture shortcuts.
 */
export const useSecurity = () => {
  useEffect(() => {
    const handleGlobalSecurity = (e) => {
      // Logic from App.jsx - bypass for admin dashboard if needed
      // (Bypassing is handled better by checking the route outside or here)
      if (window.location.pathname.includes('admin/dashboard')) return;

      if (e.type === 'contextmenu') {
        e.preventDefault();
        return false;
      }

      if (e.type === 'keydown') {
        // Ctrl+S (Save), Ctrl+U (View Source), Ctrl+P (Print)
        if (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U' || e.key === 'p' || e.key === 'P')) {
          e.preventDefault();
          return false;
        }
        
        // F12 (DevTools), Ctrl+Shift+I (Inspect)
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i'))) {
          e.preventDefault();
          return false;
        }
        
        // PrintScreen
        if (e.key === 'PrintScreen') {
          navigator.clipboard.writeText(''); 
          // We can't really block PrintScreen via JS, but we can clear the clipboard or show a warning
          console.warn('Screen capture is restricted on this portfolio.');
        }
      }
    };

    window.addEventListener('contextmenu', handleGlobalSecurity);
    window.addEventListener('keydown', handleGlobalSecurity);
    
    return () => {
      window.removeEventListener('contextmenu', handleGlobalSecurity);
      window.removeEventListener('keydown', handleGlobalSecurity);
    };
  }, []);
};
