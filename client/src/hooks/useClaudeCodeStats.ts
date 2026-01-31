import { useQuery } from 'react-query';
import { claudeCodeService } from '../services/claudeCodeService';

/**
 * Hook to fetch Claude Code dashboard metrics
 * Auto-refreshes every 30 seconds
 */
export const useClaudeCodeStats = () => {
  return useQuery(
    'claude-code-stats',
    () => claudeCodeService.getStats(),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
      refetchOnWindowFocus: true,
      retry: 2,
      staleTime: 20000, // Consider data stale after 20 seconds
    }
  );
};

/**
 * Hook to fetch daily activity data
 * @param days Number of days to retrieve (default: 7)
 */
export const useClaudeCodeDailyActivity = (days: number = 7) => {
  return useQuery(
    ['claude-code-daily-activity', days],
    () => claudeCodeService.getDailyActivity(days),
    {
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
      retry: 2,
    }
  );
};

/**
 * Hook to fetch daily model token usage
 * @param days Number of days to retrieve (default: 7)
 */
export const useClaudeCodeDailyTokens = (days: number = 7) => {
  return useQuery(
    ['claude-code-daily-tokens', days],
    () => claudeCodeService.getDailyTokens(days),
    {
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
      retry: 2,
    }
  );
};

/**
 * Hook to fetch raw Claude Code stats
 */
export const useClaudeCodeRawStats = () => {
  return useQuery(
    'claude-code-raw-stats',
    () => claudeCodeService.getRawStats(),
    {
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
      retry: 2,
    }
  );
};

/**
 * Hook to fetch file information
 */
export const useClaudeCodeFileInfo = () => {
  return useQuery(
    'claude-code-file-info',
    () => claudeCodeService.getFileInfo(),
    {
      refetchInterval: 60000, // Refetch every minute
      retry: 1,
    }
  );
};
