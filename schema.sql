-- OSSCCU Database Schema & Supabase Configuration
-- Execute in Supabase SQL Editor or PostgreSQL database

-- -------------------------------------------------------------
-- 1. Projects Table
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT NOT NULL,
  demo_url TEXT,
  cover_image TEXT,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_github TEXT,
  author_avatar TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  moderator_feedback TEXT,
  user_id TEXT,
  user_email TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) policies for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for approved projects"
  ON projects FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Allow users to view own projects"
  ON projects FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Allow public submissions"
  ON projects FOR INSERT
  WITH CHECK (status = 'pending');

CREATE POLICY "Allow owners to update own pending projects"
  ON projects FOR UPDATE
  USING (auth.uid()::text = user_id AND status = 'pending');

CREATE POLICY "Allow full access for service role or admin"
  ON projects FOR ALL
  USING (true);

-- -------------------------------------------------------------
-- 2. Events Table
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  venue TEXT,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'upcoming',
  registration_url TEXT,
  banner_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 3. Users Table Schema & Extended Profiles
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  student_id TEXT,
  batch TEXT DEFAULT 'City University Student',
  department TEXT DEFAULT 'Dept. of Computer Science & Engineering',
  avatar_url TEXT,
  role TEXT DEFAULT 'member',
  executive_role TEXT,
  github_handle TEXT,
  gitlab_handle TEXT,
  linkedin_url TEXT,
  codeforces_handle TEXT,
  leetcode_handle TEXT,
  hackerrank_handle TEXT,
  codechef_handle TEXT,
  portfolio_url TEXT,
  pinned_project_ids TEXT[] DEFAULT '{}',
  bookmarked_project_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on users"
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated user upsert own profile"
  ON public.users FOR ALL
  USING (true);

-- -------------------------------------------------------------
-- 4. SQL Trigger: Synchronize Supabase auth.users to public.users
-- -------------------------------------------------------------
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
    'member'
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

-- -------------------------------------------------------------
-- 5. Supabase Storage for Profile Photos (avatars bucket)
-- -------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "User Upload Avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
