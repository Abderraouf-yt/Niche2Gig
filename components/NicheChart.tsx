import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ScoredNiche } from '../types';

interface NicheChartProps {
  data: ScoredNiche[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-3 rounded-md shadow-lg">
        <p className="font-bold text-cyan-400">{`${label}`}</p>
        <p className="text-sm text-gray-300">{`Score: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export const NicheChart: React.FC<NicheChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
        <XAxis type="number" stroke="#9CA3AF" domain={[0, 100]} tick={{ fontSize: 12 }} />
        <YAxis
          dataKey="niche"
          type="category"
          width={150}
          tick={{ fill: '#D1D5DB', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          interval={0}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(107, 114, 128, 0.2)' }}/>
        <Bar dataKey="score" fill="#22D3EE" barSize={20} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};