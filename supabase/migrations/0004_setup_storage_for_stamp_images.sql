-- This script configures Supabase Storage for stamp images.

-- Step 1: Create the 'stamp-images' Bucket
-- This bucket is private by default. Access is controlled by RLS policies below.
-- You can also create this bucket via the Supabase Dashboard.
-- Name: stamp-images
-- Public: No
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('stamp-images', 'stamp-images', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create Storage Policies for the 'stamp-images' bucket

-- RLS policies are created on the 'storage.objects' table.

-- Policy 1: Read Access
-- This policy allows two types of read access:
-- 1. Public, unauthenticated access to any file inside a 'public/' folder. This is for thumbnails.
-- 2. Authenticated access for a user to read their own files, regardless of folder. This is for originals.
CREATE POLICY "Stamp images read access"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'stamp-images' AND (
    (storage.foldername(name))[1] = 'public' OR
    auth.uid() = owner
  )
);

-- Policy 2: Insert Access
-- Allows an authenticated user to upload an image.
-- The policy enforces that the uploader must set themselves as the 'owner' of the object.
CREATE POLICY "Stamp images insert access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'stamp-images' AND
  auth.uid() = owner
);

-- Policy 3: Update Access
-- Allows an authenticated user to update an image they own.
CREATE POLICY "Stamp images update access"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'stamp-images' AND
  auth.uid() = owner
)
WITH CHECK (
  auth.uid() = owner
);

-- Policy 4: Delete Access
-- Allows an authenticated user to delete an image they own.
CREATE POLICY "Stamp images delete access"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'stamp-images' AND
  auth.uid() = owner
);
