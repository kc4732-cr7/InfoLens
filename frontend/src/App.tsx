import React, { useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import InputSection from './components/InputSection';
import CredibilityScore from './components/CredibilityScore';
import ClaimVerification from './components/ClaimVerification';
import PropagationGraph from './components/PropagationGraph';
import SourceMetadata from './components/SourceMetadata';

export interface AnalysisResult {
  article_text: string;
  claims: any[];
  entities: any[];
  earliest_source: any;
  propagation_graph: any;
  credibility_score: number;
  forensic_notes: string;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (data: { url?: string; text?: string }) => {
    setLoading(true);
    setError(null);
    console.log('Starting analysis with:', data);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await axios.post(`${baseUrl}/api/forensics/analyze`, data);
      setResult(response.data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.detail || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e5e7eb] selection:bg-blue-500/30 selection:text-blue-200">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between border-b border-[#2a2a30] pb-8 pt-4">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="bg-[#3b82f6] p-3 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Shield className="text-white w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tighter text-white">
                INFO<span className="text-[#3b82f6]">LENS</span>
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-[#9ca3af] text-[10px] font-mono uppercase tracking-widest bg-[#141417] px-2 py-0.5 rounded border border-[#2a2a30]">
                  Digital Forensics Engine
                </span>
                <span className="text-[#9ca3af] text-[10px] font-mono px-2 py-0.5">
                  v1.0.0-PROD
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex flex-col items-end text-right">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-[10px] font-bold text-[#10b981] font-mono tracking-widest">CORE ACTIVE</span>
              </div>
              <span className="text-[9px] text-[#9ca3af] font-mono mt-1 uppercase">Node Connection Stable</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        {!result ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-10">
            <div className="text-center max-w-2xl space-y-4">
              <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">
                Analyze Information <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Provenance</span>
              </h2>
              <p className="text-[#9ca3af] text-lg leading-relaxed">
                InfoLens utilizes real-time NLP, Wikipedia cross-verification, and propagation forensics to calculate probabilistic credibility estimates for digital content.
              </p>
            </div>
            
            <div className="w-full flex justify-center scale-110 md:scale-125 transform transition-all">
              <InputSection onAnalyze={handleAnalyze} loading={loading} />
            </div>

            {error && (
              <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 text-[#ef4444] px-6 py-3 rounded-xl flex items-center space-x-3 animate-in slide-in-from-bottom-2 duration-300">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12 opacity-50">
              {[
                { label: 'CLAIM EXTRACTION', desc: 'Auto-identifies factual assertions' },
                { label: 'WEB VERIFICATION', desc: 'Real-time Wikipedia & Search lookup' },
                { label: 'PROPAGATION GRAPH', desc: 'Trace source-to-amplifier spread' }
              ].map((feature, i) => (
                <div key={i} className="p-4 rounded-lg border border-[#2a2a30] bg-[#141417]/50 text-center">
                  <div className="text-[10px] font-mono text-[#3b82f6] font-bold mb-1 tracking-widest">{feature.label}</div>
                  <div className="text-[11px] text-[#9ca3af]">{feature.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in zoom-in-95 duration-700">
            {/* Left Column: Forensic Profile */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-[#141417] border border-[#2a2a30] rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Shield className="w-24 h-24 text-white" />
                </div>
                <h3 className="text-[#3b82f6] font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-6 border-b border-[#2a2a30] pb-2">
                  Evidence Profile
                </h3>
                <CredibilityScore score={result.credibility_score} />
                <div className="mt-8 p-4 bg-[#0a0a0c] rounded-xl border border-[#2a2a30]">
                  <p className="text-xs text-[#9ca3af] font-mono leading-relaxed italic">
                    {result.forensic_notes}
                  </p>
                </div>
              </div>
              
              <div className="bg-[#141417] border border-[#2a2a30] rounded-2xl p-6 shadow-2xl">
                <h3 className="text-[#3b82f6] font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-6 border-b border-[#2a2a30] pb-2">
                  Earliest Source Detected
                </h3>
                <SourceMetadata source={result.earliest_source} />
              </div>

              <button 
                onClick={() => setResult(null)}
                className="w-full py-4 bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20 border border-[#3b82f6]/30 text-[#3b82f6] rounded-xl font-mono text-xs font-bold tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                RESET ANALYSIS CORE
              </button>
            </div>

            {/* Right Column: Claims & Forensics */}
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-[#141417] border border-[#2a2a30] rounded-2xl p-6 shadow-2xl">
                <h3 className="text-[#3b82f6] font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-6 border-b border-[#2a2a30] pb-2 flex justify-between items-center">
                  <span>Claim-Level Verification Matrix</span>
                  <span className="bg-[#3b82f6]/10 text-[#3b82f6] px-2 py-0.5 rounded text-[9px] tracking-normal lowercase">Live Verification Active</span>
                </h3>
                <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  <ClaimVerification claims={result.claims} />
                </div>
              </div>

              <div className="bg-[#141417] border border-[#2a2a30] rounded-2xl p-6 shadow-2xl overflow-hidden">
                <h3 className="text-[#3b82f6] font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-6 border-b border-[#2a2a30] pb-2">
                  Propagation Forensics Map
                </h3>
                <PropagationGraph data={result.propagation_graph} />
              </div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <footer className="pt-12 pb-8 border-t border-[#2a2a30] flex flex-col md:flex-row items-center justify-between gap-4 opacity-40">
          <p className="text-[9px] text-[#9ca3af] font-mono tracking-wider">
            &copy; 2026 INFOLENS FORENSIC SYSTEMS. ALL ANALYSES ARE PROBABILISTIC ESTIMATES.
          </p>
          <div className="flex space-x-6 text-[9px] font-mono text-[#9ca3af] uppercase tracking-widest">
            <span>ISO-9001-COMPLIANT</span>
            <span>DATA-ETHICS-CERTIFIED</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
