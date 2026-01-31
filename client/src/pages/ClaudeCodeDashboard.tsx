import React from 'react';
import { motion } from 'framer-motion';
import { MetricCard } from '../components/MetricCard';
import { StatsChart } from '../components/StatsChart';
import {
  useClaudeCodeStats,
  useClaudeCodeDailyActivity,
  useClaudeCodeFileInfo,
} from '../hooks/useClaudeCodeStats';
import {
  Activity,
  MessageSquare,
  TrendingUp,
  Zap,
  AlertTriangle,
  CheckCircle,
  Database,
  Cpu,
} from 'lucide-react';

export const ClaudeCodeDashboard: React.FC = () => {
  const { data: stats, isLoading: statsLoading, error: statsError, dataUpdatedAt } = useClaudeCodeStats();
  const { data: dailyActivity, isLoading: activityLoading } = useClaudeCodeDailyActivity(7);
  const { data: fileInfo } = useClaudeCodeFileInfo();

  if (statsLoading || activityLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block p-4 bg-neon-blue/10 border border-neon-blue/50 rounded-lg mb-4">
            <Activity className="w-12 h-12 text-neon-blue animate-pulse" />
          </div>
          <p className="text-neon-blue font-mono">Loading Claude Code Stats...</p>
        </div>
      </div>
    );
  }

  // Handle error state (stats file not found)
  if (statsError || !stats || !fileInfo?.exists) {
    return (
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="card-sci-fi p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-warning-orange mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-warning-orange mb-4">
              Claude Code Stats Not Found
            </h2>
            <p className="text-gray-300 mb-4 font-mono">
              The Claude Code stats file could not be found at:
            </p>
            <code className="block bg-deep-space/50 p-3 rounded border border-neon-blue/20 mb-6 text-neon-blue">
              {fileInfo?.path || '~/.claude/stats-cache.json'}
            </code>
            <div className="text-left space-y-3 text-gray-400">
              <p className="font-mono text-sm">To fix this:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4 font-mono text-sm">
                <li>Make sure Claude Code is installed</li>
                <li>Use Claude Code at least once to generate stats</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header with file info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-neon-blue glow-text mb-2">
            Claude Code Statistics
          </h1>
          <p className="text-gray-400 font-mono text-sm">
            Live data from: {fileInfo?.path}
          </p>
        </div>
        {fileInfo?.lastModified && (
          <div className="text-right">
            <p className="text-gray-400 font-mono text-xs">Stats Updated</p>
            <p className="text-neon-green font-mono text-sm">
              {new Date(fileInfo.lastModified).toLocaleString()}
            </p>
          </div>
        )}
      </motion.div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Sessions"
          value={formatNumber(stats.totalSessions)}
          subtitle="All time"
          icon={Activity}
          alertLevel="safe"
          delay={0}
        />

        <MetricCard
          title="Total Messages"
          value={formatNumber(stats.totalMessages)}
          subtitle={`${stats.todayMessages} today`}
          icon={MessageSquare}
          alertLevel="safe"
          delay={0.1}
        />

        <MetricCard
          title="Input Tokens"
          value={formatNumber(stats.totalInputTokens)}
          subtitle="Total processed"
          icon={TrendingUp}
          alertLevel="safe"
          delay={0.2}
        />

        <MetricCard
          title="Cache Reads"
          value={formatNumber(stats.totalCacheReadTokens)}
          subtitle="Tokens from cache"
          icon={Database}
          alertLevel="safe"
          delay={0.3}
        />
      </div>

      {/* Today's Live Metrics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="card-sci-fi border-neon-green/30"
      >
        <h3 className="text-lg font-bold text-neon-green mb-4 glow-text flex items-center gap-2">
          <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
          Today's Live Usage
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold font-mono text-neon-green">
              {formatNumber(stats.todayInputTokens || 0)}
            </p>
            <p className="text-xs text-gray-400 font-mono">Input Tokens</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold font-mono text-neon-blue">
              {formatNumber(stats.todayOutputTokens || 0)}
            </p>
            <p className="text-xs text-gray-400 font-mono">Output Tokens</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold font-mono text-neon-purple">
              {formatNumber(stats.todayCacheCreationTokens || 0)}
            </p>
            <p className="text-xs text-gray-400 font-mono">Cache Created</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold font-mono text-warning-orange">
              {formatNumber(stats.todayMessages || 0)}
            </p>
            <p className="text-xs text-gray-400 font-mono">Messages</p>
          </div>
        </div>
      </motion.div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Output Tokens"
          value={formatNumber(stats.totalOutputTokens)}
          subtitle="All time total"
          icon={Zap}
          alertLevel="safe"
          delay={0.4}
        />

        <MetricCard
          title="Today's Messages"
          value={formatNumber(stats.todayMessages)}
          subtitle={`${stats.todayToolCalls} tool calls`}
          icon={MessageSquare}
          alertLevel="safe"
          delay={0.5}
        />

        <MetricCard
          title="Today's Tool Calls"
          value={formatNumber(stats.todayToolCalls)}
          subtitle="Functions executed"
          icon={Cpu}
          alertLevel="safe"
          delay={0.6}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        {dailyActivity && dailyActivity.length > 0 && (
          <StatsChart
            title="7-Day Message Activity"
            data={dailyActivity.map((activity) => ({
              date: new Date(activity.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              }),
              messages: activity.messageCount,
            }))}
            xKey="date"
            yKey="messages"
            yLabel="Messages"
          />
        )}

        {/* Daily Sessions Chart */}
        {dailyActivity && dailyActivity.length > 0 && (
          <StatsChart
            title="7-Day Session Activity"
            data={dailyActivity.map((activity) => ({
              date: new Date(activity.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              }),
              sessions: activity.sessionCount,
            }))}
            xKey="date"
            yKey="sessions"
            yLabel="Sessions"
          />
        )}
      </div>

      {/* Model Breakdown Table */}
      {stats.modelBreakdown && stats.modelBreakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card-sci-fi"
        >
          <h3 className="text-xl font-bold text-neon-blue mb-6 glow-text">
            Model Usage Breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neon-blue/20">
                  <th className="text-left py-3 px-4 text-gray-400 font-mono text-sm uppercase">
                    Model
                  </th>
                  <th className="text-right py-3 px-4 text-gray-400 font-mono text-sm uppercase">
                    Input Tokens
                  </th>
                  <th className="text-right py-3 px-4 text-gray-400 font-mono text-sm uppercase">
                    Output Tokens
                  </th>
                  <th className="text-right py-3 px-4 text-gray-400 font-mono text-sm uppercase">
                    Cache Reads
                  </th>
                  <th className="text-right py-3 px-4 text-gray-400 font-mono text-sm uppercase">
                    Total Tokens
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.modelBreakdown.map((model, index) => (
                  <motion.tr
                    key={model.model}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="border-b border-neon-blue/10 hover:bg-neon-blue/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-neon-blue font-mono text-sm">
                      {model.model}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-300">
                      {formatNumber(model.inputTokens)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-300">
                      {formatNumber(model.outputTokens)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-neon-green">
                      {formatNumber(model.cacheReadTokens)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-neon-blue">
                      {formatNumber(model.totalTokens)}
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
          Claude Code Stats Loaded | Auto-refresh: 30s | Data Fetched:{' '}
          {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Loading...'}
        </span>
      </motion.div>
    </div>
  );
};
