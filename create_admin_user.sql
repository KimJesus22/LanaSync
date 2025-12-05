-- 1. Fix the constraint: group_id should be nullable for new users (Onboarding flow)
ALTER TABLE public.members ALTER COLUMN group_id DROP NOT NULL;

-- 2. Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  new_group_id uuid := gen_random_uuid();
  user_email text := 'adminuser@gmail.com';
  user_password text := 'password12345';
  user_name text := 'admin';
BEGIN
  -- 3. Create a Group for the Admin
  INSERT INTO public.groups (id, name, created_at)
  VALUES (new_group_id, 'Admin Team', now());

  -- 4. Insert into auth.users
  -- This will fire the handle_new_user trigger.
  -- Since we made group_id nullable, the trigger will succeed (inserting NULL group_id).
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    ''
  );

  -- 5. Update the member record created by the trigger
  -- The trigger created a member with user_id = new_user_id, but default role 'user' and null group_id.
  -- We update it to be 'admin' and assign the group.
  UPDATE public.members
  SET 
    role = 'admin',
    group_id = new_group_id,
    name = user_name -- Ensure name is correct
  WHERE user_id = new_user_id;

  RAISE NOTICE 'User % created with ID % and Admin role.', user_email, new_user_id;
END $$;
