import React from 'react';
import { ExternalLink, Calendar, User, Database, Zap } from 'lucide-react';

interface Source {
  source: string;
  timestamp: string;
  role: string;
  url: string;
}

interface SourceMetadataProps {
  source: Source;
}

const SourceMetadata: React.FC<SourceMetadataProps> = ({ source }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-forensic-accent" />
          <span className="text-lg font-bold">{source.source}</span>
        </div>
        <a 
          href={source.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-forensic-accent hover:text-forensic-accent/80"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-forensic-bg p-2 rounded border border-forensic-border">
          <div className="flex items-center space-x-1 mb-1">
            <Calendar className="w-3 h-3 text-forensic-muted" />
            <span className="text-[10px] font-mono text-forensic-muted uppercase">First Detected</span>
          </div>
          <div className="text-xs font-mono">{new Date(source.timestamp).toLocaleString()}</div>
        </div>
        <div className="bg-forensic-bg p-2 rounded border border-forensic-border">
          <div className="flex items-center space-x-1 mb-1">
            <User className="w-3 h-3 text-forensic-muted" />
            <span className="text-[10px] font-mono text-forensic-muted uppercase">Forensic Role</span>
          </div>
          <div className="text-xs font-mono">{source.role}</div>
        </div>
      </div>

      <div className="flex items-start space-x-2 bg-blue-500/5 border border-blue-500/20 p-3 rounded-lg">
        <Zap className="w-4 h-4 text-blue-400 mt-0.5" />
        <div className="text-[11px] text-forensic-muted leading-relaxed">
          This source was identified as the earliest public appearance of the core claims. No prior records were found in the indexed archives at the time of analysis.
        </div>
      </div>
    </div>
  );
};

export default SourceMetadata;
