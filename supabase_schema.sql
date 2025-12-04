-- Create transactions table
create table transactions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  amount numeric not null,
  type text check (type in ('ingreso', 'gasto')) not null,
  category text not null,
  payment_method text check (payment_method in ('efectivo', 'vales')) not null,
  user_id text not null, -- Can be 'user-1' or 'user-2' for now, or auth.uid() if using Auth
  description text
);

-- Enable Row Level Security
alter table transactions enable row level security;

-- Policy to allow all operations for now (Development Mode)
-- WARNING: Disable this and create proper policies before production if using real user data
create policy "Enable all access for all users" on transactions
  for all using (true) with check (true);

-- Enable Realtime
alter publication supabase_realtime add table transactions;
