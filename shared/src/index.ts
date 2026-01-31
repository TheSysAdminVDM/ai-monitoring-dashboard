// Shared types and interfaces for AI Monitoring Dashboard

export interface TokenUsage {
  id: string;
  session_id: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost: number;
  created_at: Date;
}

export interface UsageLimit {
  id: string;
  limit_type: 'daily' | 'monthly' | 'session';
  limit_value: number;
  alert_threshold: number;
  created_at: Date;
}

export interface ApiKey {
  id: string;
  name: string;
  key_hash: string;
  provider: 'anthropic' | 'openai' | 'other';
  daily_limit?: number;
  monthly_limit?: number;
  created_at: Date;
}

export interface UsageStats {
  total_tokens: number;
  total_cost: number;
  session_count: number;
  model_breakdown: {
    model: string;
    tokens: number;
    cost: number;
  }[];
}

export interface DashboardMetrics {
  current_session_tokens: number;
  daily_tokens: number;
  monthly_tokens: number;
  daily_cost: number;
  monthly_cost: number;
  daily_limit?: number;
  monthly_limit?: number;
  alert_status: 'safe' | 'warning' | 'critical';
}

export interface CreateTokenUsageDto {
  session_id: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost: number;
}

export interface CreateUsageLimitDto {
  limit_type: 'daily' | 'monthly' | 'session';
  limit_value: number;
  alert_threshold: number;
}

export interface CreateApiKeyDto {
  name: string;
  key: string;
  provider: 'anthropic' | 'openai' | 'other';
  daily_limit?: number;
  monthly_limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Claude Code Stats Types
export interface ClaudeCodeDailyActivity {
  date: string;
  messageCount: number;
  sessionCount: number;
  toolCallCount: number;
}

export interface ClaudeCodeDailyModelTokens {
  date: string;
  tokensByModel: Record<string, number>;
}

export interface ClaudeCodeModelUsage {
  inputTokens: number;
  outputTokens: number;
  cacheReadInputTokens: number;
  cacheWriteInputTokens?: number;
}

export interface ClaudeCodeStats {
  dailyActivity: ClaudeCodeDailyActivity[];
  dailyModelTokens: ClaudeCodeDailyModelTokens[];
  modelUsage: Record<string, ClaudeCodeModelUsage>;
  totalSessions: number;
  totalMessages: number;
}

export interface ClaudeCodeDashboardMetrics {
  totalSessions: number;
  totalMessages: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCacheReadTokens: number;
  todayMessages: number;
  todayToolCalls: number;
  // Live session data for today
  todayInputTokens?: number;
  todayOutputTokens?: number;
  todayCacheReadTokens?: number;
  todayCacheCreationTokens?: number;
  modelBreakdown: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    cacheReadTokens: number;
    totalTokens: number;
  }[];
}
