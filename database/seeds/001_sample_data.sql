-- Sample data for testing and development
-- This file provides sample token usage data for the AI Monitoring Dashboard

-- Insert sample API keys
INSERT INTO api_keys (name, key_hash, provider, daily_limit, monthly_limit)
VALUES
    ('Claude API Key', '$2a$10$sample_hash_here', 'anthropic', 1000000, 30000000),
    ('GPT-4 API Key', '$2a$10$sample_hash_here_2', 'openai', 500000, 15000000)
ON CONFLICT DO NOTHING;

-- Insert sample token usage data for the last 7 days
WITH sample_sessions AS (
    SELECT generate_series(
        CURRENT_DATE - INTERVAL '7 days',
        CURRENT_DATE,
        INTERVAL '1 day'
    ) AS usage_date
)
INSERT INTO token_usage (session_id, model, input_tokens, output_tokens, cost, created_at)
SELECT
    'session-' || EXTRACT(EPOCH FROM usage_date)::text,
    CASE (random() * 3)::int
        WHEN 0 THEN 'claude-opus-4'
        WHEN 1 THEN 'claude-sonnet-3.5'
        WHEN 2 THEN 'gpt-4-turbo'
        ELSE 'gpt-3.5-turbo'
    END,
    (random() * 5000 + 1000)::int,
    (random() * 3000 + 500)::int,
    (random() * 0.5 + 0.01)::numeric(10,6),
    usage_date + (random() * INTERVAL '23 hours')
FROM sample_sessions, generate_series(1, 5);

-- Verify the data
SELECT
    'Total Records' as metric,
    COUNT(*)::text as value
FROM token_usage
UNION ALL
SELECT
    'Total Cost' as metric,
    '$' || ROUND(SUM(cost)::numeric, 2)::text as value
FROM token_usage
UNION ALL
SELECT
    'Total Tokens' as metric,
    SUM(total_tokens)::text as value
FROM token_usage;
