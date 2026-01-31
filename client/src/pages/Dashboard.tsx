import React from 'react';
import { motion } from 'framer-motion';
import { MetricCard } from '../components/MetricCard';
import { StatsChart } from '../components/StatsChart';
import { useDashboardMetrics, useUsageStats, useModelBreakdown } from '../hooks/useDashboard';
import { Activity, DollarSign, TrendingUp, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: usageStats, isLoading: statsLoading } = useUsageStats(7);
  const { data: modelBreakdown, isLoading: modelsLoading } = useModelBreakdown();

  if (metricsLoading || statsLoading || modelsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block p-4 bg-neon-blue/10 border border-neon-blue/50 rounded-lg mb-4">
            <Activity className="w-12 h-12 text-neon-blue animate-pulse" />
          </div>
          <p className="text-neon-blue font-mono">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(4)}`;
  };

  const getDailyProgress = () => {
    if (!metrics?.daily_limit) return 0;
    return (metrics.daily_tokens / metrics.daily_limit) * 100;
  };

  const getMonthlyProgress = () => {
    if (!metrics?.monthly_limit) return 0;
    return (metrics.monthly_tokens / metrics.monthly_limit) * 100;
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Alert Banner */}
      {metrics && metrics.alert_status !== 'safe' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border flex items-center space-x-3 ${
            metrics.alert_status === 'critical'
              ? 'bg-danger-red/10 border-danger-red/50'
              : 'bg-warning-orange/10 border-warning-orange/50'
          }`}
        >
          <AlertTriangle
            className={
              metrics.alert_status === 'critical' ? 'text-danger-red' : 'text-warning-orange'
            }
          />
          <div>
            <p
              className={`font-bold ${
                metrics.alert_status === 'critical' ? 'text-danger-red' : 'text-warning-orange'
              }`}
            >
              {metrics.alert_status === 'critical'
                ? 'CRITICAL: Usage Limit Approaching'
                : 'WARNING: High Token Usage Detected'}
            </p>
            <p className="text-sm text-gray-400 font-mono">
              Daily: {getDailyProgress().toFixed(1)}% | Monthly: {getMonthlyProgress().toFixed(1)}%
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Session Tokens"
          value={formatNumber(metrics?.current_session_tokens || 0)}
          subtitle="Current Session"
          icon={Activity}
          alertLevel="safe"
          delay={0}
        />

        <MetricCard
          title="Daily Tokens"
          value={formatNumber(metrics?.daily_tokens || 0)}
          subtitle={metrics?.daily_limit ? `of ${formatNumber(metrics.daily_limit)}` : undefined}
          icon={TrendingUp}
          alertLevel={
            getDailyProgress() >= 95 ? 'critical' : getDailyProgress() >= 80 ? 'warning' : 'safe'
          }
          delay={0.1}
        />

        <MetricCard
          title="Monthly Tokens"
          value={formatNumber(metrics?.monthly_tokens || 0)}
          subtitle={
            metrics?.monthly_limit ? `of ${formatNumber(metrics.monthly_limit)}` : undefined
          }
          icon={Zap}
          alertLevel={
            getMonthlyProgress() >= 95
              ? 'critical'
              : getMonthlyProgress() >= 80
              ? 'warning'
              : 'safe'
          }
          delay={0.2}
        />

        <MetricCard
          title="Monthly Cost"
          value={formatCurrency(metrics?.monthly_cost || 0)}
          subtitle={`Daily: ${formatCurrency(metrics?.daily_cost || 0)}`}
          icon={DollarSign}
          alertLevel="safe"
          delay={0.3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Trend Chart */}
        {usageStats && usageStats.length > 0 && (
          <StatsChart
            title="7-Day Token Usage Trend"
            data={usageStats.map((stat: any) => ({
              date: new Date(stat.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              }),
              tokens: parseInt(stat.tokens),
            }))}
            xKey="date"
            yKey="tokens"
            yLabel="Tokens"
          />
        )}

        {/* Model Breakdown Chart */}
        {modelBreakdown && modelBreakdown.length > 0 && (
          <StatsChart
            title="Model Usage Distribution"
            data={modelBreakdown.map((model: any) => ({
              model: model.model,
              tokens: parseInt(model.total_tokens),
            }))}
            xKey="model"
            yKey="tokens"
            yLabel="Tokens"
          />
        )}
      </div>

      {/* Model Breakdown Table */}
      {modelBreakdown && modelBreakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card-sci-fi"
        >
          <h3 className="text-xl font-bold text-neon-blue mb-6 glow-text">Model Breakdown</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neon-blue/20">
                  <th className="text-left py-3 px-4 text-gray-400 font-mono text-sm uppercase">
                    Model
                  </th>
                  <th className="text-right py-3 px-4 text-gray-400 font-mono text-sm uppercase">
                    Requests
                  </th>
                  <th className="text-right py-3 px-4 text-gray-400 font-mono text-sm uppercase">
                    Tokens
                  </th>
                  <th className="text-right py-3 px-4 text-gray-400 font-mono text-sm uppercase">
                    Cost
                  </th>
                  <th className="text-right py-3 px-4 text-gray-400 font-mono text-sm uppercase">
                    Avg Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {modelBreakdown.map((model: any, index: number) => (
                  <motion.tr
                    key={model.model}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="border-b border-neon-blue/10 hover:bg-neon-blue/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-neon-blue font-mono">{model.model}</td>
                    <td className="py-3 px-4 text-right font-mono text-gray-300">
                      {parseInt(model.request_count).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-300">
                      {formatNumber(parseInt(model.total_tokens))}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-neon-green">
                      {formatCurrency(parseFloat(model.total_cost))}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-400">
                      {formatCurrency(parseFloat(model.avg_cost))}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-center space-x-2 p-4 bg-neon-green/5 border border-neon-green/20 rounded-lg"
      >
        <CheckCircle className="w-5 h-5 text-neon-green" />
        <span className="text-neon-green font-mono text-sm">
          All Systems Operational | Last Updated: {new Date().toLocaleTimeString()}
        </span>
      </motion.div>
    </div>
  );
};
