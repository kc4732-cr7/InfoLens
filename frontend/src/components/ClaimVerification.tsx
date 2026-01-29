import React from 'react';
import { CheckCircle, XCircle, HelpCircle, Info } from 'lucide-react';

interface Claim {
  id: number;
  text: string;
  verification: {
    best_match_source: string;
    similarity_score: number;
    nli_label: string;
    nli_score: number;
    confidence: number;
  };
}

interface ClaimVerificationProps {
  claims: Claim[];
}

const ClaimVerification: React.FC<ClaimVerificationProps> = ({ claims }) => {
  return (
    <div className="space-y-4">
      {claims.map((claim) => (
        <div key={claim.id} className="bg-forensic-bg/50 border border-forensic-border rounded-lg p-4 transition-all hover:border-forensic-accent/30 group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-[10px] font-mono text-forensic-muted px-1.5 py-0.5 border border-forensic-border rounded">CLAIM #{claim.id}</span>
                {claim.verification.nli_label === 'entailment' ? (
                  <div className="flex items-center space-x-1 text-forensic-success text-[10px] font-bold">
                    <CheckCircle className="w-3 h-3" />
                    <span>SUPPORTED</span>
                  </div>
                ) : claim.verification.nli_label === 'contradiction' ? (
                  <div className="flex items-center space-x-1 text-forensic-danger text-[10px] font-bold">
                    <XCircle className="w-3 h-3" />
                    <span>CONTRADICTED</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-forensic-muted text-[10px] font-bold">
                    <HelpCircle className="w-3 h-3" />
                    <span>NEUTRAL / UNVERIFIED</span>
                  </div>
                )}
              </div>
              <p className="text-sm font-medium leading-relaxed">{claim.text}</p>
            </div>
            <div className="ml-4 text-right">
              <div className="text-[10px] font-mono text-forensic-muted">VERIF. CONFIDENCE</div>
              <div className="text-sm font-bold font-mono">{(claim.verification.confidence * 100).toFixed(1)}%</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-forensic-border/50 hidden group-hover:block animate-in slide-in-from-top-1 duration-200">
            <div className="flex items-start space-x-2">
              <Info className="w-3 h-3 text-forensic-accent mt-0.5" />
              <div className="text-[11px] text-forensic-muted">
                <span className="font-bold text-forensic-accent uppercase mr-1">Semantic Match:</span>
                "{claim.verification.best_match_source}"
                <div className="mt-1 flex items-center space-x-3">
                  <span>Similarity: {(claim.verification.similarity_score * 100).toFixed(1)}%</span>
                  <span>NLI Label: {claim.verification.nli_label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClaimVerification;
