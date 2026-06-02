import { useState, useEffect, useCallback } from 'react';
import theme from '../theme.json';
import { Theme } from '../types';

const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3/b/';

interface JsonBinResponse {
  record: Theme;
}

export const useTheme = () => {
  const [themeState, setThemeState] = useState<Theme>(theme as Theme);
  const [backgroundUrl, setBackgroundUrl] = useState<string>(theme.background);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY;
  const BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID;

  const fetchTheme = useCallback(async () => {
    if (!API_KEY || !BIN_ID) {
      console.warn('JSONBin API key or Bin ID is missing. Using default theme.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${JSONBIN_BASE_URL}${BIN_ID}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
      });
      if (!response.ok) throw new Error('Failed to fetch theme');
      const data = (await response.json()) as JsonBinResponse;
      const cloudTheme = data.record;
      if (cloudTheme) {
        setThemeState(cloudTheme);
        setBackgroundUrl(cloudTheme.background);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Theme fetch error, using fallback:', errorMessage);
      setError('Using default theme');
    } finally {
      setIsLoading(false);
    }
  }, [API_KEY, BIN_ID]);

  const updateTheme = useCallback(async (newTheme: Partial<Theme>) => {
    if (!API_KEY || !BIN_ID) {
      console.warn('JSONBin API key or Bin ID is missing. Cannot update theme.');
      return { success: false, error: 'API configuration missing' };
    }

    try {
      // Merge current theme with updates
      const updatedTheme = { ...themeState, ...newTheme };

      const response = await fetch(`${JSONBIN_BASE_URL}${BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify(updatedTheme)
      });
      if (!response.ok) throw new Error('Failed to update theme');

      // Update local state
      setThemeState(updatedTheme);
      setBackgroundUrl(updatedTheme.background);

      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Theme update error:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [API_KEY, BIN_ID, themeState]);

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  return { backgroundUrl, isLoading, error, updateTheme, fetchTheme };
};
