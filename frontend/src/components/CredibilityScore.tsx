import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface CredibilityScoreProps {
  score: number;
}

const CredibilityScore: React.FC<CredibilityScoreProps> = ({ score }) => {
  const data = [
    { name: 'Credibility', value: score },
    { name: 'Remaining', value: 1 - score },
  ];

  const COLORS = ['#3b82f6', '#1f2937'];

  const getStatus = (s: number) => {
    if (s >= 0.8) return { text: 'HIGH CONFIDENCE', color: 'text-forensic-success' };
    if (s >= 0.5) return { text: 'MODERATE CONFIDENCE', color: 'text-forensic-warning' };
    return { text: 'LOW CONFIDENCE', color: 'text-forensic-danger' };
  };

  const status = getStatus(score);

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={450}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-mono">{(score * 100).toFixed(0)}%</span>
          <span className="text-[10px] text-forensic-muted font-mono">CONFIDENCE</span>
        </div>
      </div>
      <div className={`mt-2 font-mono text-sm font-bold tracking-wider ${status.color}`}>
        {status.text}
      </div>
      <p className="mt-4 text-[10px] text-forensic-muted text-center leading-tight max-w-[200px]">
        Probabilistic score based on claim verification, source reputation, and propagation patterns.
      </p>
    </div>
  );
};

export default CredibilityScore;
