-- Create members table
create table members (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  color text,
  avatar_url text
);

-- Enable RLS
alter table members enable row level security;

-- Create policy to allow read access for all
create policy "Enable read access for all users" on members
  for select using (true);

-- Insert initial members
insert into members (name, color) values
  ('Yo', '#4ade80'),
  ('Hermano', '#facc15'),
  ('Primo', '#60a5fa');
