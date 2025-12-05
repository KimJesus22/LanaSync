-- Create budgets table
create table budgets (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  category text not null,
  amount_limit numeric not null,
  user_id uuid references auth.users(id) not null
);

-- Enable RLS
alter table budgets enable row level security;

-- Policies
create policy "Users can view their own budgets" on budgets
  for select using (auth.uid() = user_id);

create policy "Users can insert their own budgets" on budgets
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own budgets" on budgets
  for update using (auth.uid() = user_id);

create policy "Users can delete their own budgets" on budgets
  for delete using (auth.uid() = user_id);

-- Enable Realtime
alter publication supabase_realtime add table budgets;
