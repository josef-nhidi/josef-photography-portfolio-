import { useState, useEffect } from 'react';
import api from '../api/axios';

/**
 * useSettings
 * Fetches site configuration (branding, labels, SEO) and applies dynamic CSS variables.
 * Returns the settings object and loading state.
 */
export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('settings');
      setSettings(res.data);
      
      // Dynamically apply primary branding colors to the CSS root
      const root = document.documentElement;
      if (res.data.primary_color) root.style.setProperty('--primary', res.data.primary_color);
      if (res.data.accent_color) root.style.setProperty('--accent', res.data.accent_color);
      if (res.data.bg_color) root.style.setProperty('--bg', res.data.bg_color);
      if (res.data.site_title) document.title = res.data.site_title;
    } catch (e) {
      console.error("Failed to load settings", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, refreshSettings: fetchSettings };
};
