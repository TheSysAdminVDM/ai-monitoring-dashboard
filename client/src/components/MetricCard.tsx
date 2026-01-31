import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  alertLevel?: 'safe' | 'warning' | 'critical';
  delay?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  alertLevel = 'safe',
  delay = 0,
}) => {
  const getAlertClass = () => {
    switch (alertLevel) {
      case 'warning':
        return 'alert-warning';
      case 'critical':
        return 'alert-critical';
      default:
        return 'alert-safe';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-neon-green';
      case 'down':
        return 'text-danger-red';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="stat-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${getAlertClass()}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-sm font-mono ${getTrendColor()}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <p className="metric-label">{title}</p>
        <p className="metric-value">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 font-mono">{subtitle}</p>
        )}
      </div>

      <div className="scanline" />
    </motion.div>
  );
};
