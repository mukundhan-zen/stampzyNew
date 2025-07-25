-- Create the collections table
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    stamp_ids UUID[],
    CONSTRAINT collections_user_id_title_key UNIQUE (user_id, title)
);

-- Add comments to the columns
COMMENT ON TABLE collections IS 'Stores user-created collections of stamps.';
COMMENT ON COLUMN collections.id IS 'Primary key for the collection.';
COMMENT ON COLUMN collections.user_id IS 'Foreign key to the user who owns the collection.';
COMMENT ON COLUMN collections.title IS 'The title of the collection, unique per user.';
COMMENT ON COLUMN collections.description IS 'A description of the collection.';
COMMENT ON COLUMN collections.created_at IS 'Timestamp of when the collection was created.';
COMMENT ON COLUMN collections.updated_at IS 'Timestamp of when the collection was last updated.';
COMMENT ON COLUMN collections.stamp_ids IS 'An array of UUIDs for the stamps in this collection.';

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update the updated_at timestamp on any modification
CREATE TRIGGER on_collections_updated
BEFORE UPDATE ON collections
FOR EACH ROW
EXECUTE PROCEDURE handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only manage their own collections"
ON collections
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

