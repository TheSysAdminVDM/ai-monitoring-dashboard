import api from './api';
import { DashboardMetrics } from '@ai-monitoring/shared';

export const dashboardService = {
  async getMetrics(sessionId?: string): Promise<DashboardMetrics> {
    const params = sessionId ? { sessionId } : {};
    const response = await api.get('/dashboard/metrics', { params });
    return response.data.data;
  },

  async getUsageStats(days: number = 7) {
    const response = await api.get('/dashboard/usage-stats', { params: { days } });
    return response.data.data;
  },

  async getModelBreakdown() {
    const response = await api.get('/dashboard/model-breakdown');
    return response.data.data;
  },

  async getHourlyUsage(date?: Date) {
    const params = date ? { date: date.toISOString() } : {};
    const response = await api.get('/dashboard/hourly-usage', { params });
    return response.data.data;
  },
};
