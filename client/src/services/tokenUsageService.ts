import api from './api';
import { CreateTokenUsageDto, TokenUsage } from '@ai-monitoring/shared';

export const tokenUsageService = {
  async create(data: CreateTokenUsageDto): Promise<TokenUsage> {
    const response = await api.post('/token-usage', data);
    return response.data.data;
  },

  async getBySession(sessionId: string): Promise<TokenUsage[]> {
    const response = await api.get(`/token-usage/session/${sessionId}`);
    return response.data.data;
  },

  async getDailyStats(date?: Date) {
    const params = date ? { date: date.toISOString() } : {};
    const response = await api.get('/token-usage/daily-stats', { params });
    return response.data.data;
  },

  async getMonthlyStats(year?: number, month?: number) {
    const response = await api.get('/token-usage/monthly-stats', {
      params: { year, month }
    });
    return response.data.data;
  },

  async getSessionSummary(sessionId: string) {
    const response = await api.get(`/token-usage/session-summary/${sessionId}`);
    return response.data.data;
  },

  async getRecentSessions(limit: number = 10) {
    const response = await api.get('/token-usage/recent-sessions', { params: { limit } });
    return response.data.data;
  },
};
