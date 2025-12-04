-- 1. Policies for Transactions Table
-- Allow anonymous users to SELECT, INSERT, UPDATE, DELETE
-- (Development only)
create policy "Enable all access for anon users on transactions"
on transactions
for all
to anon
using (true)
with check (true);

-- 2. Policies for Members Table
-- Allow anonymous users to SELECT, INSERT, UPDATE, DELETE
-- (Development only)
create policy "Enable all access for anon users on members"
on members
for all
to anon
using (true)
with check (true);

-- PRODUCTION NOTE:
-- To secure this for production, you should:
-- 1. Enable Auth in Supabase.
-- 2. Change policies to:
--    using (auth.uid() = user_id)
--    with check (auth.uid() = user_id)
