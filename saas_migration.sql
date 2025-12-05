-- 1. Create groups table
CREATE TABLE IF NOT EXISTS groups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    invite_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create default group for existing data
INSERT INTO groups (name, invite_code)
VALUES ('Familia Default', 'DEFAULT')
ON CONFLICT (invite_code) DO NOTHING;

-- Capture the default group id
DO $$
DECLARE
    default_group_id UUID;
BEGIN
    SELECT id INTO default_group_id FROM groups WHERE invite_code = 'DEFAULT';

    -- 3. Add group_id to members (users)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'group_id') THEN
        ALTER TABLE members ADD COLUMN group_id UUID REFERENCES groups(id);
        UPDATE members SET group_id = default_group_id WHERE group_id IS NULL;
        ALTER TABLE members ALTER COLUMN group_id SET NOT NULL;
    END IF;

    -- 4. Add group_id to transactions
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'transactions' AND column_name = 'group_id') THEN
        ALTER TABLE transactions ADD COLUMN group_id UUID REFERENCES groups(id);
        UPDATE transactions SET group_id = default_group_id WHERE group_id IS NULL;
        ALTER TABLE transactions ALTER COLUMN group_id SET NOT NULL;
    END IF;

    -- 5. Add group_id to budgets
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'budgets' AND column_name = 'group_id') THEN
        ALTER TABLE budgets ADD COLUMN group_id UUID REFERENCES groups(id);
        UPDATE budgets SET group_id = default_group_id WHERE group_id IS NULL;
        ALTER TABLE budgets ALTER COLUMN group_id SET NOT NULL;
    END IF;

    -- 6. Add group_id to savings_goals
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'savings_goals' AND column_name = 'group_id') THEN
        ALTER TABLE savings_goals ADD COLUMN group_id UUID REFERENCES groups(id);
        UPDATE savings_goals SET group_id = default_group_id WHERE group_id IS NULL;
        ALTER TABLE savings_goals ALTER COLUMN group_id SET NOT NULL;
    END IF;

    -- 7. Add group_id to recurring_expenses
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recurring_expenses' AND column_name = 'group_id') THEN
        ALTER TABLE recurring_expenses ADD COLUMN group_id UUID REFERENCES groups(id);
        UPDATE recurring_expenses SET group_id = default_group_id WHERE group_id IS NULL;
        ALTER TABLE recurring_expenses ALTER COLUMN group_id SET NOT NULL;
    END IF;
END $$;

-- 8. Enable RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_expenses ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS Policies

-- Helper function to get current user's group_id
-- Note: This assumes auth.uid() matches a record in 'members' table with 'user_id' or 'id'.
-- Let's assume 'members' has a 'user_id' column that links to auth.users.
-- If 'members' IS the user profile table.

CREATE OR REPLACE FUNCTION get_my_group_id()
RETURNS UUID AS $$
DECLARE
  gid UUID;
BEGIN
  SELECT group_id INTO gid
  FROM members
  WHERE id = auth.uid() OR user_id = auth.uid() -- Handle both cases just to be safe
  LIMIT 1;
  RETURN gid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policy for groups: Users can view their own group
CREATE POLICY "Users can view their own group" ON groups
FOR SELECT USING (
  id = get_my_group_id()
);

-- Policy for members: Users can view members of their group
CREATE POLICY "Users can view members of their group" ON members
FOR ALL USING (
  group_id = get_my_group_id()
);

-- Policy for transactions
CREATE POLICY "Users can view transactions of their group" ON transactions
FOR ALL USING (
  group_id = get_my_group_id()
);

-- Policy for budgets
CREATE POLICY "Users can view budgets of their group" ON budgets
FOR ALL USING (
  group_id = get_my_group_id()
);

-- Policy for savings_goals
CREATE POLICY "Users can view savings_goals of their group" ON savings_goals
FOR ALL USING (
  group_id = get_my_group_id()
);

-- Policy for recurring_expenses
CREATE POLICY "Users can view recurring_expenses of their group" ON recurring_expenses
FOR ALL USING (
  group_id = get_my_group_id()
);
