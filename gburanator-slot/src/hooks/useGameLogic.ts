import { useState, useCallback } from 'react';
import theme from '../theme.json';
import { Theme } from '../types';

const typedTheme = theme as Theme;
const symbolKeys = Object.keys(typedTheme.symbols);

const getRandomSymbol = () => symbolKeys[Math.floor(Math.random() * symbolKeys.length)];

const PAYLINES = [
  [1, 1, 1, 1, 1], // Middle row
  [0, 0, 0, 0, 0], // Top row
  [2, 2, 2, 2, 2], // Bottom row
  [0, 1, 2, 1, 0], // V-shape
  [2, 1, 0, 1, 2], // Inverse V
  [0, 0, 1, 2, 2], // Step down
  [2, 2, 1, 0, 0], // Step up
  [1, 0, 1, 0, 1], // Zigzag 1
  [1, 2, 1, 2, 1], // Zigzag 2
  [0, 1, 0, 1, 0], // Zigzag 3
  [2, 1, 2, 1, 2], // Zigzag 4
  [0, 0, 0, 1, 1], // 3 top, 2 mid
  [2, 2, 2, 1, 1], // 3 bot, 2 mid
  [1, 1, 0, 0, 0], // 2 mid, 3 top
  [1, 1, 2, 2, 2], // 2 mid, 3 bot
  [0, 2, 0, 2, 0], // Alternating top/bot
  [2, 0, 2, 0, 2], // Alternating bot/top
  [0, 1, 1, 1, 0], // Mid-concentrated 1
  [2, 1, 1, 1, 2], // Mid-concentrated 2
  [1, 0, 0, 0, 1], // Top-concentrated
];

export const useGameLogic = (balance: number, setBalance: React.Dispatch<React.SetStateAction<number>>, currentBet: number) => {
  const [reels, setReels] = useState<string[][]>(() =>
    Array.from({ length: 5 }, () =>
      Array.from({ length: 3 }, () => getRandomSymbol())
    )
  );
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(0);

  const calculateWin = (currentReels: string[][]) => {
    let totalWin = 0;

    PAYLINES.forEach((payline) => {
      const firstSymbol = currentReels[0][payline[0]];
      let matchCount = 1;

      for (let i = 1; i < 5; i++) {
        if (currentReels[i][payline[i]] === firstSymbol) {
          matchCount++;
        } else {
          break;
        }
      }

      if (matchCount >= 3) {
        const symbolValue = typedTheme.symbols[firstSymbol].value;
        // Multiply win by a simple multiplier based on match count
        const multiplier = matchCount === 3 ? 1 : matchCount === 4 ? 2 : 5;
        totalWin += symbolValue * currentBet * multiplier;
      }
    });

    return totalWin;
  };

  const spin = useCallback(async () => {
    if (isSpinning) return;

    if (balance < currentBet) {
      alert('Not enough truskawki!');
      return;
    }

    setBalance((prev) => prev - currentBet);
    setIsSpinning(true);
    setLastWin(0);

    for (let i = 0; i < 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setReels((prevReels) => {
        const newReels = [...prevReels];
        newReels[i] = Array.from({ length: 3 }, () => getRandomSymbol());
        return newReels;
      });
    }

    // Final win calculation
    // We need a way to get the final state of the reels.
    // Since setReels is async, we'll calculate the final result locally first.
    const finalReels = Array.from({ length: 5 }, () =>
      Array.from({ length: 3 }, () => getRandomSymbol())
    );

    // Update the state to the final reels we just calculated
    setReels(finalReels);

    const win = calculateWin(finalReels);
    setLastWin(win);
    if (win > 0) {
      setBalance((prev) => prev + win);
    }
    setIsSpinning(false);
  }, [balance, currentBet, setBalance, isSpinning]);

  return { reels, isSpinning, spin, lastWin };
};
