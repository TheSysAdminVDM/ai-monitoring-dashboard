import api from './api';
import {
  ClaudeCodeDashboardMetrics,
  ClaudeCodeDailyActivity,
  ClaudeCodeDailyModelTokens,
  ClaudeCodeStats,
  ApiResponse,
} from '@ai-monitoring/shared';

export const claudeCodeService = {
  /**
   * Get dashboard metrics from Claude Code stats
   */
  async getStats(): Promise<ClaudeCodeDashboardMetrics> {
    const response = await api.get<ApiResponse<ClaudeCodeDashboardMetrics>>('/claude-code/stats');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch Claude Code stats');
    }
    return response.data.data;
  },

  /**
   * Get daily activity data
   * @param days Number of days to retrieve (default: 7)
   */
  async getDailyActivity(days: number = 7): Promise<ClaudeCodeDailyActivity[]> {
    const response = await api.get<ApiResponse<ClaudeCodeDailyActivity[]>>(
      `/claude-code/daily?days=${days}`
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch daily activity');
    }
    return response.data.data;
  },

  /**
   * Get daily model token usage
   * @param days Number of days to retrieve (default: 7)
   */
  async getDailyTokens(days: number = 7): Promise<ClaudeCodeDailyModelTokens[]> {
    const response = await api.get<ApiResponse<ClaudeCodeDailyModelTokens[]>>(
      `/claude-code/daily-tokens?days=${days}`
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch daily tokens');
    }
    return response.data.data;
  },

  /**
   * Get raw Claude Code stats
   */
  async getRawStats(): Promise<ClaudeCodeStats> {
    const response = await api.get<ApiResponse<ClaudeCodeStats>>('/claude-code/raw');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch raw stats');
    }
    return response.data.data;
  },

  /**
   * Get file information
   */
  async getFileInfo(): Promise<{ exists: boolean; path: string; size?: number; lastModified?: string; lastComputedDate?: string }> {
    const response = await api.get<ApiResponse<{ exists: boolean; path: string; size?: number; lastModified?: string; lastComputedDate?: string }>>('/claude-code/file-info');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch file info');
    }
    return response.data.data;
  },
};
