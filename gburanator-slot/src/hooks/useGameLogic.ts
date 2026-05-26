import { useState, useCallback } from 'react';
import theme from '../theme.json';
import { Theme } from '../types';

const typedTheme = theme as Theme;
const symbolKeys = Object.keys(typedTheme.symbols);

const getRandomSymbol = () => symbolKeys[Math.floor(Math.random() * symbolKeys.length)];

export const useGameLogic = (balance: number, setBalance: React.Dispatch<React.SetStateAction<number>>, currentBet: number) => {
  const [reels, setReels] = useState<string[][]>(() =>
    Array.from({ length: 5 }, () =>
      Array.from({ length: 3 }, () => getRandomSymbol())
    )
  );
  const [isSpinning, setIsSpinning] = useState(false);

  const spin = useCallback(async () => {
    if (balance < currentBet) {
      alert('Not enough truskawki!');
      return;
    }

    // Deduct bet
    setBalance((prev) => prev - currentBet);
    setIsSpinning(true);

    // Sequential stop logic
    for (let i = 0; i < 5; i++) {
      // Wait for the reel to stop (500ms delay between reels)
      await new Promise((resolve) => setTimeout(resolve, 500));

      setReels((prevReels) => {
        const newReels = [...prevReels];
        // Generate 3 new random symbols for this column
        newReels[i] = Array.from({ length: 3 }, () => getRandomSymbol());
        return newReels;
      });
    }

    setIsSpinning(false);
  }, [balance, currentBet, setBalance]);

  return { reels, isSpinning, spin };
};
