import React from 'react';
import theme from '../theme.json';
import { Theme } from '../types';

const typedTheme = theme as Theme;

interface ControlsProps {
  currentBet: number;
  setCurrentBet: React.Dispatch<React.SetStateAction<number>>;
  spin: () => void;
  isSpinning: boolean;
  balance: number;
}

const Controls: React.FC<ControlsProps> = ({ currentBet, setCurrentBet, spin, isSpinning, balance }) => {
  return (
    <div className="flex items-center gap-8 bg-gray-900 p-6 rounded-2xl border-4 border-yellow-600 shadow-2xl font-mono">
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs uppercase text-yellow-600 font-bold">Current Bet</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentBet(typedTheme.minBet)}
            disabled={isSpinning}
            className="px-3 h-10 flex items-center justify-center bg-gray-800 text-yellow-400 border-2 border-yellow-600 rounded-md hover:bg-yellow-600 hover:text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase text-xs"
          >
            Min
          </button>
          <span className="text-3xl font-bold text-yellow-400 min-w-[60px] text-center">
            {currentBet}
          </span>
          <button
            onClick={() => setCurrentBet(balance > 0 ? balance : typedTheme.minBet)}
            disabled={isSpinning}
            className="px-3 h-10 flex items-center justify-center bg-gray-800 text-yellow-400 border-2 border-yellow-600 rounded-md hover:bg-yellow-600 hover:text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase text-xs"
          >
            Max
          </button>
        </div>
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        className={`px-12 py-4 text-3xl font-black rounded-full transition-all transform active:scale-95 shadow-xl border-4 uppercase italic ${
          isSpinning
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed border-gray-600'
            : 'bg-yellow-500 text-gray-900 hover:bg-yellow-400 border-yellow-300 hover:scale-105 animate-pulse'
        }`}
      >
        {isSpinning ? 'Spinning...' : typedTheme.text.spin}
      </button>
    </div>
  );
};

export default Controls;
