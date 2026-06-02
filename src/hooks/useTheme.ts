import { useState, useEffect, useCallback } from 'react';
import theme from '../theme.json';

const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3/b/';

interface JsonBinResponse {
  record: {
    background: string;
  };
}

export const useTheme = () => {
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
      const cloudBackground = data.record?.background;
      if (cloudBackground) {
        setBackgroundUrl(cloudBackground);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Theme fetch error, using fallback:', errorMessage);
      setError('Using default theme');
    } finally {
      setIsLoading(false);
    }
  }, [API_KEY, BIN_ID]);

  const updateBackground = useCallback(async (newUrl: string) => {
    if (!API_KEY || !BIN_ID) {
      console.warn('JSONBin API key or Bin ID is missing. Cannot update theme.');
      return { success: false, error: 'API configuration missing' };
    }

    try {
      const response = await fetch(`${JSONBIN_BASE_URL}${BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY
        },
        body: JSON.stringify({ background: newUrl })
      });
      if (!response.ok) throw new Error('Failed to update theme');
      setBackgroundUrl(newUrl);
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Theme update error:', errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [API_KEY, BIN_ID]);

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  return { backgroundUrl, isLoading, error, updateBackground, fetchTheme };
};
