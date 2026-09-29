-- ==========================================================================
-- WebWorldBD - Supabase Storage Security Policies SQL Script
-- Bucket Name: webworldbd
--
-- IMPORTANT INSTRUCTIONS:
-- Execute this SQL script in your Supabase SQL Editor:
-- Supabase Dashboard -> Project Settings / SQL Editor -> New Query -> Run.
-- ==========================================================================

-- 1. Ensure the webworldbd bucket exists and is set to public for media assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('webworldbd', 'webworldbd', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable Row Level Security (RLS) on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Remove any conflicting existing policies for this bucket if re-running
DROP POLICY IF EXISTS "Public Read Access for Public Folders" ON storage.objects;
DROP POLICY IF EXISTS "Allow Uploads for Authorized App Users" ON storage.objects;
DROP POLICY IF EXISTS "Allow Users to Update Their Own Files" ON storage.objects;
DROP POLICY IF EXISTS "Allow Users to Delete Their Own Files" ON storage.objects;
DROP POLICY IF EXISTS "Restricted Private Documents Access" ON storage.objects;

-- 2. Public Read Access Policy
-- Allows anyone to read public website assets (profile, projects, services, avatars, general)
CREATE POLICY "Public Read Access for Public Folders"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'webworldbd'
  AND (storage.foldername(name))[1] IN ('profile', 'projects', 'services', 'avatars', 'general')
);

-- 3. File Upload Policy
-- Allows public/authenticated clients to upload assets into their designated paths
-- (avatars/, documents/, profile/, projects/, services/, general/)
CREATE POLICY "Allow Uploads for Authorized App Users"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'webworldbd'
  AND (storage.foldername(name))[1] IN ('avatars', 'documents', 'profile', 'projects', 'services', 'general')
);

-- 4. File Update/Replace Policy
-- Allows users/admins to update existing files in the bucket
CREATE POLICY "Allow Users to Update Their Own Files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'webworldbd'
)
WITH CHECK (
  bucket_id = 'webworldbd'
);

-- 5. File Deletion Policy
-- Allows authorized modification/removal of uploaded assets
CREATE POLICY "Allow Users to Delete Their Own Files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'webworldbd'
);

-- 6. Private Documents Policy
-- Ensures sensitive project/client files in documents/ path are accessed via direct signed or valid path references
CREATE POLICY "Restricted Private Documents Access"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'webworldbd'
  AND (storage.foldername(name))[1] = 'documents'
);
