import React, { useState } from 'react';
import Wallet from './components/Wallet';
import SlotMachine from './components/SlotMachine';
import { useGameLogic } from './hooks/useGameLogic';

function App() {
  const [balance, setBalance] = useState<number>(1000);
  const [currentBet, setCurrentBet] = useState<number>(10);

  const { reels, isSpinning, spin, lastWin, winningLines, spinningReels } = useGameLogic(
    balance,
    setBalance,
    currentBet
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold text-blue-600">Hello Gburanator!</h1>
      <SlotMachine
        reels={reels}
        isSpinning={isSpinning}
        spinningReels={spinningReels}
        spin={spin}
        winningLines={winningLines}
        lastWin={lastWin}
      />
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-bold text-gray-600 uppercase">Bet</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentBet(Math.max(1, currentBet - 1))}
              className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 font-bold"
            >
              -
            </button>
            <span className="text-xl font-mono font-bold w-12 text-center">{currentBet}</span>
            <button
              onClick={() => setCurrentBet(currentBet + 1)}
              className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 font-bold"
            >
              +
            </button>
          </div>
        </div>
        <Wallet balance={balance} setBalance={setBalance} />
      </div>
    </div>
  );
}

export default App;
