-- Migration: Add Features and Integrations Settings
-- Created: 2026-02-09
-- Description: Adds app_features and integrations settings to admin_settings table

-- Insert app_features setting (if not exists)
INSERT INTO admin_settings (key, value, category, description, is_active, metadata, created_at, updated_at)
VALUES (
  'app_features',
  '{"tasks":true,"workspace_prompts":true,"brands":{"content":true,"analytics":true,"ai_tracking":true,"backlinks":false,"technical_audit":true,"social_listening":true,"tasks":true}}'::jsonb,
  'features',
  'Enable or disable app features - disabled features show as ''Coming Soon''',
  true,
  '{}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- Insert integrations setting (if not exists)
INSERT INTO admin_settings (key, value, category, description, is_active, metadata, created_at, updated_at)
VALUES (
  'integrations',
  '{"google":true,"microsoft":false,"slack":false,"microsoft_teams":false,"linear":false,"adobe_analytics":false,"mixpanel":false,"wordpress":true,"webflow":true,"github":false,"twitter":false,"linkedin":false,"discord":false,"tiktok":false,"ahrefs":false,"moz":false,"semrush":false,"kw_finder":false,"zapier":false,"make":false,"n8n":false,"shopify":true,"meta_ads":false,"api":false,"mcp":false,"webhooks":true,"davinci":false,"fabriq":false,"klaviyo":false,"apifox":false,"airtable":false,"salesforce":false,"intercom":false,"hubspot":false,"perplexity":false,"gemini":false,"chatgpt":false}'::jsonb,
  'integrations',
  'Enable or disable third-party integrations - disabled integrations show as ''Coming Soon''',
  true,
  '{}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();
