import React, { useState, useEffect } from 'react';
import theme from '../theme.json';

interface WalletProps {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

const Wallet: React.FC<WalletProps> = ({ balance, setBalance }) => {
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [displayBalance, setDisplayBalance] = useState(balance);

  useEffect(() => {
    let startValue = displayBalance;
    const endValue = balance;
    if (startValue === endValue) return;

    const duration = 500;
    const startTime = performance.now();
    let requestId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
      setDisplayBalance(currentValue);

      if (progress < 1) {
        requestId = requestAnimationFrame(animate);
      }
    };

    requestId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestId);
  }, [balance]);

  const handleAddFunds = () => {
    const parsedAmount = parseInt(amount, 10);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      setBalance((prev) => prev + parsedAmount);
      setAmount('');
      setIsAddingFunds(false);
      setError('');
    } else {
      setError('Invalid amount');
    }
  };

  return (
    <div className="bg-gray-900 text-yellow-400 p-4 rounded-lg border-4 border-yellow-600 flex items-center gap-4 shadow-lg font-mono text-2xl">
      <div className="flex flex-col">
        <span className="text-xs uppercase text-yellow-600 font-bold">Balance</span>
        <div className="flex items-center gap-2">
          <span className="font-bold">{displayBalance}</span>
          <span className="text-sm">{theme.currencyName}</span>
        </div>
      </div>

      {isAddingFunds ? (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              className="bg-gray-800 text-yellow-400 border-2 border-yellow-600 rounded px-2 py-1 w-24 text-xl font-mono focus:outline-none focus:border-yellow-400"
              autoFocus
            />
            <button
              onClick={handleAddFunds}
              className="bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-bold px-3 py-1 rounded text-lg transition-colors border-2 border-yellow-400"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAddingFunds(false);
                setAmount('');
                setError('');
              }}
              className="text-yellow-600 hover:text-yellow-400 text-sm underline"
            >
              Cancel
            </button>
          </div>
          {error && <span className="text-red-500 text-xs font-bold">{error}</span>}
        </div>
      ) : (
        <button
          onClick={() => setIsAddingFunds(true)}
          aria-label="Add funds"
          className="bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-bold w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-colors border-2 border-yellow-400"
        >
          +
        </button>
      )}
    </div>
  );
};

export default Wallet;
