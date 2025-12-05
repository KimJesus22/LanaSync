-- Add user_id to members table
ALTER TABLE members ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Create a function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.members (user_id, name, color)
  VALUES (new.id, split_part(new.email, '@', 1), '#4ade80');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update RLS policies
-- Allow users to read their own member profile
CREATE POLICY "Users can read own member profile" ON members
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own member profile
CREATE POLICY "Users can update own member profile" ON members
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to insert their own member profile (though trigger handles this usually)
CREATE POLICY "Users can insert own member profile" ON members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update transactions policy to be user specific
DROP POLICY IF EXISTS "Enable all access for all users" ON transactions;

CREATE POLICY "Users can only access their own transactions" ON transactions
  FOR ALL USING (auth.uid()::text = user_id);
