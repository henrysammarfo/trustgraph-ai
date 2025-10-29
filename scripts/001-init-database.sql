-- Initial database setup script
-- This will be executed to create the database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_aiagent_address ON "AIAgent"(address);
CREATE INDEX IF NOT EXISTS idx_aiagent_trustscore ON "AIAgent"("trustScore");
CREATE INDEX IF NOT EXISTS idx_transaction_timestamp ON "Transaction"(timestamp);
CREATE INDEX IF NOT EXISTS idx_trustscore_timestamp ON "TrustScore"(timestamp);
CREATE INDEX IF NOT EXISTS idx_alert_created ON "Alert"("createdAt");
