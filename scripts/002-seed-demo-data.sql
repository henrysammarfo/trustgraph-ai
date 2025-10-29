-- Seed Demo Data for TrustGraph
-- This creates realistic demo data to showcase the platform

-- Insert demo AI agents
INSERT INTO "AIAgent" ("id", "address", "name", "type", "trustScore", "status", "metadata", "createdAt", "updatedAt")
VALUES 
    ('agent-1', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 'DeFi Optimizer Pro', 'DeFi', 87.5, 'active', '{"version": "2.1.0", "deployedAt": "2024-01-15"}', NOW() - INTERVAL '30 days', NOW()),
    ('agent-2', '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 'Trading Bot Alpha', 'Trading', 72.3, 'active', '{"version": "1.5.2", "deployedAt": "2024-02-01"}', NOW() - INTERVAL '25 days', NOW()),
    ('agent-3', '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', 'Governance Delegate', 'Governance', 94.8, 'active', '{"version": "3.0.1", "deployedAt": "2023-12-10"}', NOW() - INTERVAL '45 days', NOW()),
    ('agent-4', '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 'Yield Farmer X', 'DeFi', 45.2, 'flagged', '{"version": "1.0.0", "deployedAt": "2024-03-01"}', NOW() - INTERVAL '10 days', NOW()),
    ('agent-5', '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 'Arbitrage Hunter', 'Trading', 81.7, 'active', '{"version": "2.3.0", "deployedAt": "2024-01-20"}', NOW() - INTERVAL '28 days', NOW())
ON CONFLICT ("address") DO NOTHING;

-- Insert demo transactions for each agent
INSERT INTO "Transaction" ("id", "hash", "agentId", "from", "to", "value", "gasUsed", "gasPrice", "status", "chainId", "blockNumber", "timestamp", "analyzed")
SELECT 
    'tx-' || generate_series || '-' || agent_id,
    '0x' || md5(random()::text || generate_series::text),
    agent_id,
    agent_address,
    '0x' || md5(random()::text),
    (random() * 10)::text || '000000000000000000',
    (21000 + random() * 50000)::bigint::text,
    (random() * 100)::text || '000000000',
    CASE WHEN random() > 0.95 THEN 'failed' ELSE 'success' END,
    137,
    (40000000 + generate_series * 100)::integer,
    NOW() - (generate_series || ' hours')::interval,
    true
FROM 
    generate_series(1, 50),
    (VALUES 
        ('agent-1', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'),
        ('agent-2', '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'),
        ('agent-3', '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6'),
        ('agent-4', '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'),
        ('agent-5', '0xc2132D05D31c914a87C6611C10748AEb04B58e8F')
    ) AS agents(agent_id, agent_address)
ON CONFLICT ("hash") DO NOTHING;

-- Insert trust scores history
INSERT INTO "TrustScore" ("id", "agentId", "score", "factors", "analysis", "confidence", "timestamp")
SELECT 
    'score-' || agent_id || '-' || generate_series,
    agent_id,
    base_score + (random() * 10 - 5),
    jsonb_build_object(
        'transactionVolume', random() * 100,
        'successRate', 85 + random() * 15,
        'gasEfficiency', 70 + random() * 30,
        'behaviorConsistency', 80 + random() * 20,
        'communityReputation', 75 + random() * 25,
        'timeActive', 90 + random() * 10
    ),
    'AI analysis: ' || CASE 
        WHEN base_score > 80 THEN 'Excellent performance with consistent behavior patterns and high success rates.'
        WHEN base_score > 60 THEN 'Good performance with minor anomalies detected in transaction patterns.'
        ELSE 'Concerning patterns detected. Recommend increased monitoring.'
    END,
    0.75 + random() * 0.2,
    NOW() - (generate_series * 6 || ' hours')::interval
FROM 
    generate_series(1, 20),
    (VALUES 
        ('agent-1', 87.5),
        ('agent-2', 72.3),
        ('agent-3', 94.8),
        ('agent-4', 45.2),
        ('agent-5', 81.7)
    ) AS agents(agent_id, base_score);

-- Insert alerts
INSERT INTO "Alert" ("id", "agentId", "type", "severity", "message", "details", "resolved", "createdAt")
VALUES 
    ('alert-1', 'agent-4', 'anomaly', 'high', 'Unusual transaction pattern detected', '{"pattern": "high_frequency", "threshold_exceeded": true}', false, NOW() - INTERVAL '2 hours'),
    ('alert-2', 'agent-4', 'risk', 'critical', 'Trust score dropped below 50', '{"previous_score": 52.1, "current_score": 45.2}', false, NOW() - INTERVAL '1 hour'),
    ('alert-3', 'agent-2', 'suspicious', 'medium', 'Multiple failed transactions detected', '{"failed_count": 5, "time_window": "1h"}', true, NOW() - INTERVAL '12 hours'),
    ('alert-4', 'agent-1', 'anomaly', 'low', 'Gas usage spike detected', '{"avg_gas": 25000, "current_gas": 65000}', true, NOW() - INTERVAL '24 hours'),
    ('alert-5', 'agent-5', 'risk', 'medium', 'Interaction with flagged address', '{"flagged_address": "0x...", "risk_level": "medium"}', false, NOW() - INTERVAL '6 hours')
ON CONFLICT ("id") DO NOTHING;
