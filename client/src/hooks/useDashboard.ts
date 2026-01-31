import { useQuery } from 'react-query';
import { dashboardService } from '../services/dashboardService';

export const useDashboardMetrics = (sessionId?: string) => {
  return useQuery(
    ['dashboard-metrics', sessionId],
    () => dashboardService.getMetrics(sessionId),
    {
      refetchInterval: 10000, // Refetch every 10 seconds
      refetchOnWindowFocus: true,
    }
  );
};

export const useUsageStats = (days: number = 7) => {
  return useQuery(
    ['usage-stats', days],
    () => dashboardService.getUsageStats(days),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );
};

export const useModelBreakdown = () => {
  return useQuery(
    'model-breakdown',
    () => dashboardService.getModelBreakdown(),
    {
      refetchInterval: 30000,
    }
  );
};

export const useHourlyUsage = (date?: Date) => {
  return useQuery(
    ['hourly-usage', date],
    () => dashboardService.getHourlyUsage(date),
    {
      refetchInterval: 60000, // Refetch every minute
    }
  );
};
