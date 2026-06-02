import { useState, useEffect } from 'react';
import theme from '../theme.json';

export const useTheme = () => {
  const [backgroundUrl, setBackgroundUrl] = useState<string>(theme.background);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY;
  const BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID;

  const fetchTheme = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
      });
      if (!response.ok) throw new Error('Failed to fetch theme');
      const data = await response.json();
      const cloudBackground = data.record?.background;
      if (cloudBackground) {
        setBackgroundUrl(cloudBackground);
      }
    } catch (err) {
      console.error('Theme fetch error, using fallback:', err);
      setError('Using default theme');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBackground = async (newUrl: string) => {
    try {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
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
    } catch (err) {
      console.error('Theme update error:', err);
      return { success: false, error: (err as Error).message };
    }
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  return { backgroundUrl, isLoading, error, updateBackground, fetchTheme };
};
