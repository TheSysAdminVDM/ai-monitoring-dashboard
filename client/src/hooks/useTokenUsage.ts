import { useQuery, useMutation, useQueryClient } from 'react-query';
import { tokenUsageService } from '../services/tokenUsageService';
import { CreateTokenUsageDto } from '@ai-monitoring/shared';

export const useCreateTokenUsage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (data: CreateTokenUsageDto) => tokenUsageService.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('dashboard-metrics');
        queryClient.invalidateQueries('usage-stats');
        queryClient.invalidateQueries('model-breakdown');
      },
    }
  );
};

export const useSessionTokenUsage = (sessionId: string) => {
  return useQuery(
    ['session-token-usage', sessionId],
    () => tokenUsageService.getBySession(sessionId),
    {
      enabled: !!sessionId,
    }
  );
};

export const useRecentSessions = (limit: number = 10) => {
  return useQuery(
    ['recent-sessions', limit],
    () => tokenUsageService.getRecentSessions(limit),
    {
      refetchInterval: 30000,
    }
  );
};
