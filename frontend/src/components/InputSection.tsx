import React, { useState } from 'react';
import { Search, FileText, Link } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (data: { url?: string; text?: string }) => void;
  loading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, loading }) => {
  const [mode, setMode] = useState<'url' | 'text'>('url');
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    if (mode === 'url') {
      onAnalyze({ url: inputValue });
    } else {
      onAnalyze({ text: inputValue });
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-4">
      <div className="flex space-x-2 bg-forensic-card p-1 rounded-lg border border-forensic-border w-fit mx-auto">
        <button 
          onClick={() => setMode('url')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${mode === 'url' ? 'bg-forensic-accent text-white shadow-lg' : 'text-forensic-muted hover:text-forensic-text'}`}
        >
          <Link className="w-4 h-4" />
          <span className="text-sm font-medium">URL</span>
        </button>
        <button 
          onClick={() => setMode('text')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${mode === 'text' ? 'bg-forensic-accent text-white shadow-lg' : 'text-forensic-muted hover:text-forensic-text'}`}
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">Article Text</span>
        </button>
      </div>

      <div className="relative">
        {mode === 'url' ? (
          <input 
            type="text"
            placeholder="Paste article URL here..."
            className="w-full bg-[#141417] border border-[#2a2a30] text-white rounded-2xl px-8 py-6 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 transition-all placeholder:text-[#9ca3af]/30 shadow-2xl text-lg font-medium"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        ) : (
          <textarea 
            placeholder="Paste article text here..."
            className="w-full bg-[#141417] border border-[#2a2a30] text-white rounded-2xl px-8 py-6 min-h-[250px] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 transition-all placeholder:text-[#9ca3af]/30 resize-none shadow-2xl text-lg font-medium"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
        
        <button 
          onClick={handleSubmit}
          disabled={loading || !inputValue.trim()}
          className="absolute bottom-6 right-6 bg-[#3b82f6] hover:bg-[#3b82f6]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold flex items-center space-x-3 shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all active:scale-95"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>ANALYZE</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputSection;
