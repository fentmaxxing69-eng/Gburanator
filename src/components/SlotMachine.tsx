import React, { useMemo } from 'react';
import theme from '../theme.json';
import { Theme } from '../types';

const typedTheme = theme as Theme;
const symbolKeys = Object.keys(typedTheme.symbols);

const SlotMachine: React.FC = () => {
  const reels = useMemo(() => {
    return Array.from({ length: 3 }, () =>
      Array.from({ length: 5 }, () =>
        symbolKeys[Math.floor(Math.random() * symbolKeys.length)]
      )
    );
  }, [symbolKeys]);

  return (
    <div className="p-6 bg-gray-900 rounded-xl border-4 border-yellow-500 shadow-2xl">
      <div className="grid grid-cols-5 gap-4 bg-black p-4 rounded-lg border-2 border-yellow-700 shadow-inner">
        {reels.map((row, rowIndex) => (
          row.map((symbolKey, colIndex) => {
            const symbol = typedTheme.symbols[symbolKey];
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-gray-800 border-2 border-yellow-600 rounded-md shadow-lg overflow-hidden"
              >
                <img
                  src={symbol.image}
                  alt={symbolKey}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })
        ))}
      </div>
      <div className="mt-4 text-center">
        <p className="text-yellow-500 font-bold text-xl uppercase tracking-widest">
          {typedTheme.siteName}
        </p>
      </div>
    </div>
  );
};

export default SlotMachine;
