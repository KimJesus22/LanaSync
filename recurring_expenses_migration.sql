-- Create recurring_expenses table
create table recurring_expenses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  amount numeric not null,
  day_of_month integer not null,
  category text not null,
  user_id uuid references auth.users(id) not null
);

-- Enable RLS
alter table recurring_expenses enable row level security;

-- Policies
create policy "Users can view their own recurring expenses" on recurring_expenses
  for select using (auth.uid() = user_id);

create policy "Users can insert their own recurring expenses" on recurring_expenses
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own recurring expenses" on recurring_expenses
  for update using (auth.uid() = user_id);

create policy "Users can delete their own recurring expenses" on recurring_expenses
  for delete using (auth.uid() = user_id);
