-- AI Monitoring Dashboard - Initial Database Schema
-- Migration: 001
-- Created: 2026-01-31

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- API Keys Table
-- Stores API key information for different AI providers
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(512) NOT NULL,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('anthropic', 'openai', 'other')),
    daily_limit BIGINT,
    monthly_limit BIGINT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on provider for faster lookups
CREATE INDEX idx_api_keys_provider ON api_keys(provider);
CREATE INDEX idx_api_keys_active ON api_keys(is_active);

-- Token Usage Table
-- Tracks all token usage across sessions
CREATE TABLE IF NOT EXISTS token_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    model VARCHAR(100) NOT NULL,
    input_tokens INTEGER NOT NULL CHECK (input_tokens >= 0),
    output_tokens INTEGER NOT NULL CHECK (output_tokens >= 0),
    total_tokens INTEGER GENERATED ALWAYS AS (input_tokens + output_tokens) STORED,
    cost DECIMAL(10, 6) NOT NULL CHECK (cost >= 0),
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX idx_token_usage_session ON token_usage(session_id);
CREATE INDEX idx_token_usage_model ON token_usage(model);
CREATE INDEX idx_token_usage_created_at ON token_usage(created_at DESC);
CREATE INDEX idx_token_usage_api_key ON token_usage(api_key_id);

-- Create composite index for daily/monthly aggregations
CREATE INDEX idx_token_usage_date_range ON token_usage(created_at, session_id);

-- Usage Limits Table
-- Defines spending and usage limits
CREATE TABLE IF NOT EXISTS usage_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    limit_type VARCHAR(20) NOT NULL CHECK (limit_type IN ('daily', 'monthly', 'session')),
    limit_value BIGINT NOT NULL CHECK (limit_value > 0),
    alert_threshold INTEGER NOT NULL CHECK (alert_threshold >= 0 AND alert_threshold <= 100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on limit type for faster lookups
CREATE INDEX idx_usage_limits_type ON usage_limits(limit_type);
CREATE INDEX idx_usage_limits_active ON usage_limits(is_active);

-- Usage Alerts Table
-- Stores alerts when thresholds are exceeded
CREATE TABLE IF NOT EXISTS usage_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
    message TEXT NOT NULL,
    current_value BIGINT,
    threshold_value BIGINT,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create index for unresolved alerts
CREATE INDEX idx_usage_alerts_unresolved ON usage_alerts(is_resolved, created_at DESC);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_limits_updated_at BEFORE UPDATE ON usage_limits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for daily usage statistics
CREATE OR REPLACE VIEW daily_usage_stats AS
SELECT
    DATE(created_at) as usage_date,
    model,
    COUNT(*) as request_count,
    SUM(input_tokens) as total_input_tokens,
    SUM(output_tokens) as total_output_tokens,
    SUM(total_tokens) as total_tokens,
    SUM(cost) as total_cost,
    AVG(cost) as avg_cost_per_request
FROM token_usage
GROUP BY DATE(created_at), model
ORDER BY usage_date DESC, model;

-- Create a view for session summaries
CREATE OR REPLACE VIEW session_summaries AS
SELECT
    session_id,
    COUNT(*) as request_count,
    SUM(input_tokens) as total_input_tokens,
    SUM(output_tokens) as total_output_tokens,
    SUM(total_tokens) as total_tokens,
    SUM(cost) as total_cost,
    MIN(created_at) as session_start,
    MAX(created_at) as session_end,
    ARRAY_AGG(DISTINCT model) as models_used
FROM token_usage
GROUP BY session_id
ORDER BY session_start DESC;

-- Insert default usage limits
INSERT INTO usage_limits (limit_type, limit_value, alert_threshold) VALUES
    ('daily', 1000000, 80),      -- 1M tokens per day, alert at 80%
    ('monthly', 30000000, 85),   -- 30M tokens per month, alert at 85%
    ('session', 500000, 90)      -- 500K tokens per session, alert at 90%
ON CONFLICT DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE api_keys IS 'Stores API key information for different AI providers';
COMMENT ON TABLE token_usage IS 'Tracks all token usage across sessions with detailed metrics';
COMMENT ON TABLE usage_limits IS 'Defines spending and usage limits with alert thresholds';
COMMENT ON TABLE usage_alerts IS 'Stores alerts when usage thresholds are exceeded';
COMMENT ON VIEW daily_usage_stats IS 'Aggregated daily usage statistics by model';
COMMENT ON VIEW session_summaries IS 'Summary statistics for each session';
