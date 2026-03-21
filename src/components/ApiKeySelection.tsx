import React, { useState, useEffect } from 'react';

export const ApiKeySelection = ({ onKeySelected }: { onKeySelected: () => void }) => {
  const [hasKey, setHasKey] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      try {
        // @ts-ignore
        if (typeof window.aistudio === 'undefined') {
          setHasKey(true);
          return;
        }
        // @ts-ignore
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(!!selected);
      } catch (e) {
        console.error("Error checking API key:", e);
      } finally {
        setLoading(false);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    try {
      // @ts-ignore
      await window.aistudio?.openSelectKey();
      // Assume success as per instructions
      setHasKey(true);
      onKeySelected();
    } catch (e) {
      console.error("Error selecting API key:", e);
      // Reset state if error contains "Requested entity was not found."
      if (e instanceof Error && e.message.includes("Requested entity was not found.")) {
        setHasKey(false);
      }
    }
  };

  useEffect(() => {
    if (hasKey) {
      onKeySelected();
    }
  }, [hasKey, onKeySelected]);

  if (loading) return null;

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-brand-950 flex flex-col items-center justify-center p-6 text-white font-display">
        <div className="max-w-md w-full bg-brand-900 border border-brand-800 p-8 rounded-2xl shadow-2xl text-center">
          <div className="w-16 h-16 bg-white text-brand-900 flex items-center justify-center font-bold text-2xl rounded-full mx-auto mb-6">DC</div>
          <h1 className="text-2xl font-bold mb-4 uppercase tracking-widest">API Key Required</h1>
          <p className="text-gray-400 mb-8 font-sans">
            To generate high-quality Shopify mockups, please select your Gemini API key from a paid Google Cloud project.
            <br /><br />
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-white underline hover:text-gray-300 transition-colors">
              View Billing Documentation
            </a>
          </p>
          <button 
            onClick={handleSelectKey}
            className="w-full py-4 bg-white text-brand-900 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors rounded-lg"
          >
            Select API Key
          </button>
        </div>
      </div>
    );
  }

  return null;
};
