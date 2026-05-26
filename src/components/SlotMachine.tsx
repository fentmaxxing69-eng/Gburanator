import React from 'react';
import theme from '../theme.json';
import { Theme } from '../types';

const typedTheme = theme as Theme;
const symbolKeys = Object.keys(typedTheme.symbols);

interface SlotMachineProps {
  reels: string[][];
  isSpinning: boolean;
  spin: () => void;
  winningLines: number[][];
  lastWin: number;
  spinningReels: boolean[];
}

const SlotMachine: React.FC<SlotMachineProps> = ({
  reels,
  isSpinning,
  spin,
  winningLines,
  lastWin,
  spinningReels,
}) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="p-6 bg-gray-900 rounded-xl border-4 border-yellow-500 shadow-2xl">
        <div className="grid grid-cols-5 gap-4 bg-black p-4 rounded-lg border-2 border-yellow-700 shadow-inner">
          {reels.map((col, colIndex) => (
            <div
              key={`col-${colIndex}`}
              className={`flex flex-col gap-4 transition-all duration-300 ${
                spinningReels[colIndex] ? 'animate-reel-spin blur-[1px]' : ''
              }`}
            >
              {col.map((symbolKey, rowIndex) => {
                const symbol = typedTheme.symbols[symbolKey];
                const isWinning = winningLines.some((line) => line[colIndex] === rowIndex);

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-gray-800 border-2 rounded-md shadow-lg overflow-hidden transition-all duration-500 ${
                      isWinning
                        ? 'border-yellow-400 scale-110 animate-winning-glow'
                        : 'border-yellow-600'
                    }`}
                  >
                    <img
                      src={symbol.image}
                      alt={symbolKey}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        spinningReels[colIndex] ? 'translate-y-4' : 'translate-y-0'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-yellow-500 font-bold text-xl uppercase tracking-widest">
            {typedTheme.siteName}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {lastWin > 0 && (
          <div className="text-3xl font-bold text-yellow-400 animate-bounce">
            WIN: {lastWin} {typedTheme.currencyName}!
          </div>
        )}
        <button
          onClick={spin}
          disabled={isSpinning}
          className={`px-8 py-4 text-2xl font-bold rounded-full transition-all transform active:scale-95 shadow-xl border-4 ${
            isSpinning
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed border-gray-500'
              : 'bg-yellow-500 text-gray-900 hover:bg-yellow-400 border-yellow-300 hover:scale-105'
          }`}
        >
          {isSpinning ? 'SPINNING...' : 'SPIN!'}
        </button>
      </div>
    </div>
  );
};

export default SlotMachine;
