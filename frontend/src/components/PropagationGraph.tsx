import React, { useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

interface PropagationGraphProps {
  data: {
    nodes: any[];
    edges: any[];
  };
}

const PropagationGraph: React.FC<PropagationGraphProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert edges to ForceGraph format (links)
  const graphData = {
    nodes: data.nodes.map(n => ({ ...n })),
    links: data.edges.map(e => ({ source: e.source, target: e.target }))
  };

  return (
    <div ref={containerRef} className="w-full h-[400px] bg-forensic-bg rounded-lg overflow-hidden border border-forensic-border relative">
      <ForceGraph2D
        graphData={graphData}
        width={containerRef.current?.clientWidth || 800}
        height={400}
        nodeLabel={(node: any) => `${node.id} (${node.role})`}
        nodeColor={(node: any) => {
          if (node.role === 'Primary Publisher') return '#3b82f6';
          if (node.role === 'Secondary Reporter') return '#10b981';
          return '#9ca3af';
        }}
        nodeRelSize={6}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        linkColor={() => '#2a2a30'}
        backgroundColor="#0a0a0c"
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex flex-col space-y-2 bg-forensic-card/80 p-3 rounded border border-forensic-border backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-[10px] font-mono">PRIMARY PUBLISHER</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-mono">SECONDARY REPORTER</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <span className="text-[10px] font-mono">AMPLIFIER / AGGREGATOR</span>
        </div>
      </div>
    </div>
  );
};

export default PropagationGraph;
