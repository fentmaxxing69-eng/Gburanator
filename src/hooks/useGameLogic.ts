import { useState, useCallback } from 'react';
import theme from '../theme.json';

export const useGameLogic = (
  balance: number,
  currentBet: number,
  setBalance: (balance: number) => void
) => {
  const [reels, setReels] = useState<string[][]>([
    ['cherry', 'cherry', 'cherry'],
    ['cherry', 'cherry', 'cherry'],
    ['cherry', 'cherry', 'cherry'],
    ['cherry', 'cherry', 'cherry'],
    ['cherry', 'cherry', 'cherry'],
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [stoppingReels, setStoppingReels] = useState<number[]>([]);

  const symbolKeys = Object.keys(theme.symbols);

  const getRandomSymbol = () => {
    return symbolKeys[Math.floor(Math.random() * symbolKeys.length)];
  };

  const spin = useCallback(async () => {
    if (balance < currentBet) {
      return;
    }

    setBalance(balance - currentBet);
    setIsSpinning(true);
    setStoppingReels([]);

    for (let i = 0; i < 5; i++) {
      // Wait 500ms before stopping each reel
      await new Promise((resolve) => setTimeout(resolve, 500));

      setReels((prevReels) => {
        const newReels = [...prevReels];
        newReels[i] = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        return newReels;
      });

      setStoppingReels((prev) => [...prev, i]);
    }

    setIsSpinning(false);
  }, [balance, currentBet, setBalance]);

  return { reels, isSpinning, spin };
};
