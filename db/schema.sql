-- Create the public.users table to store profile information
-- This table is linked to the auth.users table via the user's ID.
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.users IS 'Public user profile information, linked to Supabase auth users.';

-- Function and trigger to automatically update the updated_at timestamp on any change.
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Function to copy a new user from auth.users to public.users
-- This populates the profile table when a new user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, username, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger that calls the function after a new user is inserted into auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Row Level Security (RLS) for the users table to protect user data.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Policy: Allow users to read their own profile.
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING ( auth.uid() = id );

-- Policy: Allow users to update their own profile.
CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING ( auth.uid() = id );
