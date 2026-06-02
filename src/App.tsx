import React, { useState } from 'react';
import Wallet from './components/Wallet';
import SlotMachine from './components/SlotMachine';
import Controls from './components/Controls';
import AdminPanel from './components/AdminPanel';
import { useGameLogic } from './hooks/useGameLogic';
import { useTheme } from './hooks/useTheme';
import theme from './theme.json';
import { Theme } from './types';

const typedTheme = theme as Theme;

function App() {
  const { backgroundUrl } = useTheme();
  const [view, setView] = useState(window.location.pathname === '/cwel' ? 'admin' : 'game');
  const [balance, setBalance] = useState<number>(0);
  const [currentBet, setCurrentBet] = useState<number>(10);

  const { reels, isSpinning, spin, lastWin, winningLines, spinningReels } = useGameLogic(
    balance,
    setBalance,
    currentBet
  );

  return (
    <>
      {view === 'admin' ? (
        <AdminPanel onBack={() => setView('game')} />
      ) : (
        <div
          className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 overflow-hidden transition-all duration-500"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#f3f4f6'
          }}
        >
          <h1 className="text-4xl font-black text-blue-600 italic uppercase tracking-tighter drop-shadow-sm">
            {typedTheme.siteName}
          </h1>

          <SlotMachine
            reels={reels}
            isSpinning={isSpinning}
            spinningReels={spinningReels}
            winningLines={winningLines}
            spin={spin}
            lastWin={lastWin}
          />

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Wallet balance={balance} setBalance={setBalance} />
            <Controls
              currentBet={currentBet}
              setCurrentBet={setCurrentBet}
              spin={spin}
              isSpinning={isSpinning}
              balance={balance}
            />
          </div>

          {lastWin > 0 && !isSpinning && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className="bg-yellow-400 text-gray-900 px-12 py-8 rounded-3xl border-8 border-white shadow-[0_0_50px_rgba(250,204,21,0.8)] animate-bounce text-center">
                <h2 className="text-6xl font-black italic uppercase leading-none mb-2">
                  BIG WIN!
                </h2>
                <p className="text-4xl font-bold font-mono">
                  {lastWin} {typedTheme.currencyName}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
