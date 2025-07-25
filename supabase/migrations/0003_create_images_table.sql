-- Create the images table
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stamp_id UUID REFERENCES stamps(id) ON DELETE SET NULL,
    url TEXT NOT NULL,
    angle VARCHAR(50),
    resolution JSONB,
    upload_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    file_size INTEGER, -- in bytes
    format VARCHAR(10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add comments to the columns
COMMENT ON TABLE images IS 'Stores images associated with stamps.';
COMMENT ON COLUMN images.id IS 'Primary key for the image.';
COMMENT ON COLUMN images.user_id IS 'Foreign key to the user who owns the image.';
COMMENT ON COLUMN images.stamp_id IS 'Foreign key to the stamp this image is associated with. Can be null for orphaned images.';
COMMENT ON COLUMN images.url IS 'The URL of the image, likely in Supabase Storage.';
COMMENT ON COLUMN images.angle IS 'The viewing angle of the image (e.g., ''front'', ''back'').';
COMMENT ON COLUMN images.resolution IS 'The resolution of the image, stored as JSON (e.g., {''width'': 800, ''height'': 600}).';
COMMENT ON COLUMN images.upload_date IS 'Timestamp of when the image was uploaded.';
COMMENT ON COLUMN images.file_size IS 'The size of the image file in bytes.';
COMMENT ON COLUMN images.format IS 'The file format of the image (e.g., ''webp'', ''jpeg'').';
COMMENT ON COLUMN images.created_at IS 'Timestamp of when the image record was created.';
COMMENT ON COLUMN images.updated_at IS 'Timestamp of when the image record was last updated.';

-- Trigger to update the updated_at timestamp on any modification
-- The handle_updated_at function is assumed to exist from the previous migration.
CREATE TRIGGER on_images_updated
BEFORE UPDATE ON images
FOR EACH ROW
EXECUTE PROCEDURE handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only manage their own images"
ON images
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
