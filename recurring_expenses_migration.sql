-- Create recurring_expenses table
create table recurring_expenses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  amount numeric not null,
  category text not null,
  day_of_month integer not null check (day_of_month between 1 and 31),
  user_id text not null
);

-- Enable RLS
alter table recurring_expenses enable row level security;

-- Create policy to allow all access for anon users (Development)
create policy "Enable all access for anon users on recurring_expenses"
on recurring_expenses
for all
to anon
using (true)
with check (true);
