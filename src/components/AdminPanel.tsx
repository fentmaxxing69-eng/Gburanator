import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

const AdminPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { theme, backgroundUrl, updateTheme } = useTheme();
  const [inputUrl, setInputUrl] = useState(backgroundUrl);
  const [symbolsEdit, setSymbolsEdit] = useState(theme.symbols);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    const result = await updateTheme({ background: inputUrl });
    if (result.success) {
      setMessage({ text: 'Background updated successfully!', type: 'success' });
    } else {
      setMessage({ text: `Error: ${result.error}`, type: 'error' });
    }
    setIsSaving(false);
  };

  const handleSymbolChange = (symbolKey: string, field: 'image' | 'value', value: string) => {
    setSymbolsEdit(prev => ({
      ...prev,
      [symbolKey]: {
        ...prev[symbolKey],
        [field]: field === 'value' ? parseInt(value, 10) || 0 : value
      }
    }));
  };

  const handleSaveSymbols = async () => {
    setIsSaving(true);
    setMessage(null);
    const result = await updateTheme({ symbols: symbolsEdit });
    if (result.success) {
      setMessage({ text: 'Symbols updated successfully!', type: 'success' });
    } else {
      setMessage({ text: `Error: ${result.error}`, type: 'error' });
    }
    setIsSaving(false);
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
                disabled={isSaving}
                className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black px-6 rounded-xl transition-all active:scale-95 disabled:opacity-50 uppercase italic whitespace-nowrap"
              >
                {isSaving ? 'Saving...' : 'Update'}
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
              disabled={isSaving}
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 uppercase italic"
            >
              {isSaving ? 'Saving...' : 'Save All Symbols'}
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
