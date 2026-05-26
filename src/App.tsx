import React, { useState } from 'react';
import Wallet from './components/Wallet';
import SlotMachine from './components/SlotMachine';

function App() {
  const [balance, setBalance] = useState<number>(0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold text-blue-600">Hello Gburanator!</h1>
      <SlotMachine />
      <Wallet balance={balance} setBalance={setBalance} />
    </div>
  );
}

export default App;
