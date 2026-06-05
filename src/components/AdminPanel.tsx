import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { SymbolConfig } from '../types';

const AdminPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { theme, backgroundUrl, updateTheme } = useTheme();
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const [inputUrl, setInputUrl] = useState(backgroundUrl);
  const [symbolsEdit, setSymbolsEdit] = useState<Record<string, { image: string; value: string | number }>>(theme.symbols);
  const [isSavingBackground, setIsSavingBackground] = useState(false);
  const [isSavingSymbols, setIsSavingSymbols] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'LipkaCipka') {
      setPasswordVerified(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };


  const handleSave = async () => {
    setIsSavingBackground(true);
    setMessage(null);
    const result = await updateTheme({ background: inputUrl });
    if (result.success) {
      setMessage({ text: 'Background updated successfully!', type: 'success' });
    } else {
      setMessage({ text: `Error: ${result.error}`, type: 'error' });
    }
    setIsSavingBackground(false);
  };

  const handleSymbolChange = (symbolKey: string, field: 'image' | 'value', value: string) => {
    setSymbolsEdit(prev => ({
      ...prev,
      [symbolKey]: {
        ...prev[symbolKey],
        [field]: value
      }
    }));
  };

  const handleSaveSymbols = async () => {
    setIsSavingSymbols(true);
    setMessage(null);

    const updatedSymbols: Record<string, SymbolConfig> = {};
    for (const [key, config] of Object.entries(symbolsEdit)) {
      updatedSymbols[key] = {
        image: config.image,
        value: typeof config.value === 'string' ? parseInt(config.value, 10) || 0 : config.value
      };
    }

    const result = await updateTheme({ symbols: updatedSymbols });
    if (result.success) {
      setMessage({ text: 'Symbols updated successfully!', type: 'success' });
    } else {
      setMessage({ text: `Error: ${result.error}`, type: 'error' });
    }
    setIsSavingSymbols(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 text-white transition-all duration-500"
      style={{
        backgroundImage: `url(${inputUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {!passwordVerified ? (
        <div className="bg-gray-900/90 p-8 rounded-3xl border-4 border-yellow-500 shadow-2xl max-w-md w-full backdrop-blur-md text-center">
          <h1 className="text-3xl font-black text-yellow-500 italic uppercase mb-6 tracking-tighter">
            Admin Access
          </h1>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className={`w-full bg-gray-800 border-2 ${passwordError ? 'border-red-500' : 'border-yellow-600'} rounded-xl p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors font-mono`}
              placeholder="Enter Password"
              required
            />
            {passwordError && (
              <p className="text-red-500 text-xs font-bold uppercase">Invalid Password</p>
            )}
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black py-3 rounded-xl transition-all active:scale-95 uppercase italic"
            >
              Unlock Panel
            </button>
          </form>
          <button
            onClick={onBack}
            className="mt-6 text-yellow-600 hover:text-yellow-400 text-sm underline"
          >
            Return to Game
          </button>
        </div>
      ) : (
        <div className="bg-gray-900/90 p-8 rounded-3xl border-4 border-yellow-500 shadow-2xl max-w-3xl w-full backdrop-blur-md">
          <h1 className="text-3xl font-black text-yellow-500 italic uppercase text-center mb-6 tracking-tighter">
            Admin Panel
          </h1>


        <div className="flex flex-col gap-6">
          {/* Background Editor */}
          <div className="flex flex-col gap-4 p-4 bg-gray-800/50 rounded-2xl border border-yellow-600/30">
            <label htmlFor="bg-url" className="text-xs uppercase font-bold text-yellow-600">Background Image URL</label>
            <div className="flex gap-2">
              <input
                id="bg-url"
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1 bg-gray-800 border-2 border-yellow-600 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors font-mono"
                placeholder="https://example.com/image.jpg"
              />
              <button
                onClick={handleSave}
                disabled={isSavingBackground}
                className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black px-6 rounded-xl transition-all active:scale-95 disabled:opacity-50 uppercase italic whitespace-nowrap"
              >
                {isSavingBackground ? 'Saving...' : 'Update'}
              </button>
            </div>
          </div>

          {/* Symbol Editor */}
          <div className="flex flex-col gap-4 p-4 bg-gray-800/50 rounded-2xl border border-yellow-600/30">
            <label className="text-xs uppercase font-bold text-yellow-600">Symbol Configuration</label>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-yellow-600">
                    <th className="py-2 px-2 text-xs uppercase font-bold text-yellow-500">Symbol</th>
                    <th className="py-2 px-2 text-xs uppercase font-bold text-yellow-500">Image URL</th>
                    <th className="py-2 px-2 text-xs uppercase font-bold text-yellow-500">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(symbolsEdit).map(([key, config]) => (
                    <tr key={key} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                      <td className="py-2 px-2 font-mono text-sm text-gray-400 capitalize">{key}</td>
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={config.image}
                          onChange={(e) => handleSymbolChange(key, 'image', e.target.value)}
                          className="w-full bg-gray-900 border border-yellow-600/50 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-yellow-400 transition-colors font-mono"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={config.value}
                          onChange={(e) => handleSymbolChange(key, 'value', e.target.value)}
                          className="w-20 bg-gray-900 border border-yellow-600/50 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-yellow-400 transition-colors font-mono"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={handleSaveSymbols}
              disabled={isSavingSymbols}
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 uppercase italic"
            >
              {isSavingSymbols ? 'Saving...' : 'Save All Symbols'}
            </button>
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-center font-bold ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {message.text}
            </div>
          )}
        </div>

        <button
          onClick={onBack}
          className="mt-6 w-full text-yellow-600 hover:text-yellow-400 text-sm underline text-center"
        >
          Return to Game
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;
