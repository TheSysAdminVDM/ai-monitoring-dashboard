import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface StatsChartProps {
  data: any[];
  title: string;
  xKey: string;
  yKey: string;
  yLabel?: string;
}

export const StatsChart: React.FC<StatsChartProps> = ({
  data,
  title,
  xKey,
  yKey,
  yLabel = 'Value',
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-space-dark border border-neon-blue/50 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 font-mono text-sm mb-1">{label}</p>
          <p className="text-neon-blue font-bold font-mono">
            {yLabel}: {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card-sci-fi"
    >
      <h3 className="text-xl font-bold text-neon-blue mb-6 glow-text">{title}</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.1)" />
          <XAxis
            dataKey={xKey}
            stroke="#4ade80"
            style={{ fontSize: '12px', fontFamily: 'monospace' }}
          />
          <YAxis
            stroke="#4ade80"
            style={{ fontSize: '12px', fontFamily: 'monospace' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontFamily: 'monospace' }} />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="#00d9ff"
            strokeWidth={2}
            dot={{ fill: '#00d9ff', r: 4 }}
            activeDot={{ r: 6, fill: '#00d9ff', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="scanline" />
    </motion.div>
  );
};
