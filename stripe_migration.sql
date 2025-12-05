-- Add subscription_status and stripe_customer_id to members table
ALTER TABLE members 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'FREE',
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Create an index for faster lookups by stripe_customer_id
CREATE INDEX IF NOT EXISTS idx_members_stripe_customer_id ON members(stripe_customer_id);
