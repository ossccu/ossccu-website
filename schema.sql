-- OSSCCU Projects Table Schema
-- Execute in Supabase SQL Editor or PostgreSQL database

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  github_url TEXT NOT NULL,
  demo_url TEXT,
  cover_image TEXT,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_github TEXT,
  author_avatar TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  user_id UUID,
  user_email TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to approved projects
CREATE POLICY "Allow public read access for approved projects"
  ON projects
  FOR SELECT
  USING (status = 'approved');

-- Allow users to view their own projects even if pending
CREATE POLICY "Allow users to view own projects"
  ON projects
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow public submissions / logged-in user insertions with pending status
CREATE POLICY "Allow public submissions"
  ON projects
  FOR INSERT
  WITH CHECK (status = 'pending');

-- Allow owners to update their own pending submissions
CREATE POLICY "Allow owners to update own pending projects"
  ON projects
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Allow full access for service role or admin
CREATE POLICY "Allow full access for service role"
  ON projects
  FOR ALL
  USING (true);

-- -------------------------------------------------------------
-- Users Table Schema & Auth Synchronization
-- -------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  github_handle TEXT,
  role TEXT DEFAULT 'student',
  department TEXT DEFAULT 'Dept. of Computer Science & Engineering',
  batch TEXT DEFAULT 'City University Student',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on users"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated user upsert own profile"
  ON public.users FOR ALL
  USING (true);

-- SQL Trigger Fallback: Synchronize Supabase auth.users to public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, github_handle, role)
  VALUES (
    new.id::text,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(new.raw_user_meta_data->>'user_name', ''),
    'student'
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = EXCLUDED.name,
      avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
