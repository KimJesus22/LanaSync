-- Create savings_goals table
create table if not exists public.savings_goals (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  target_amount numeric not null,
  current_amount numeric default 0,
  user_id uuid references auth.users(id) not null
);

-- Set up RLS (Row Level Security)
alter table public.savings_goals enable row level security;

create policy "Users can view their own savings goals"
  on public.savings_goals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own savings goals"
  on public.savings_goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own savings goals"
  on public.savings_goals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own savings goals"
  on public.savings_goals for delete
  using (auth.uid() = user_id);
