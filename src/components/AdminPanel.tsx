import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

const AdminPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { backgroundUrl, updateTheme } = useTheme();
  const [inputUrl, setInputUrl] = useState(backgroundUrl);
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

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 text-white transition-all duration-500"
      style={{
        backgroundImage: `url(${inputUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="bg-gray-900/90 p-8 rounded-3xl border-4 border-yellow-500 shadow-2xl max-w-lg w-full backdrop-blur-md">
        <h1 className="text-3xl font-black text-yellow-500 italic uppercase text-center mb-6 tracking-tighter">
          Admin Panel
        </h1>

        <div className="flex flex-col gap-4">
          <label htmlFor="bg-url" className="text-xs uppercase font-bold text-yellow-600">Background Image URL</label>
          <input
            id="bg-url"
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="bg-gray-800 border-2 border-yellow-600 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-400 transition-colors font-mono"
            placeholder="https://example.com/image.jpg"
          />

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50 uppercase italic"
          >
            {isSaving ? 'Saving...' : 'Update Background'}
          </button>

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
