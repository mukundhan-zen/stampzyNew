-- Create the stamps table
CREATE TABLE stamps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    country VARCHAR(255),
    "year" INTEGER,
    condition VARCHAR(255),
    catalog_numbers JSONB,
    denomination VARCHAR(255),
    theme VARCHAR(255),
    acquisition_date DATE,
    purchase_price NUMERIC,
    seller VARCHAR(255),
    taxes NUMERIC,
    shipping NUMERIC,
    valuation NUMERIC,
    notes TEXT,
    images UUID[],
    currency VARCHAR(3),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add comments to the columns
COMMENT ON TABLE stamps IS 'Stores individual stamps owned by users.';
COMMENT ON COLUMN stamps.id IS 'Primary key for the stamp.';
COMMENT ON COLUMN stamps.user_id IS 'Foreign key to the user who owns the stamp.';
COMMENT ON COLUMN stamps.collection_id IS 'Foreign key to the collection this stamp belongs to (optional).';
COMMENT ON COLUMN stamps.title IS 'The title or name of the stamp.';
COMMENT ON COLUMN stamps.country IS 'The country of origin for the stamp.';
COMMENT ON COLUMN stamps."year" IS 'The year the stamp was issued.';
COMMENT ON COLUMN stamps.condition IS 'The condition of the stamp (e.g., Mint, Used).';
COMMENT ON COLUMN stamps.catalog_numbers IS 'Catalog numbers from various sources (e.g., Scott, Michel, Gibbons). Stored as JSON.';
COMMENT ON COLUMN stamps.denomination IS 'The face value of the stamp.';
COMMENT ON COLUMN stamps.theme IS 'The theme or topic of the stamp.';
COMMENT ON COLUMN stamps.acquisition_date IS 'The date the stamp was acquired.';
COMMENT ON COLUMN stamps.purchase_price IS 'The price paid for the stamp.';
COMMENT ON COLUMN stamps.seller IS 'The person or entity from whom the stamp was purchased.';
COMMENT ON COLUMN stamps.taxes IS 'Any taxes paid on the purchase.';
COMMENT ON COLUMN stamps.shipping IS 'Shipping costs for the acquisition.';
COMMENT ON COLUMN stamps.valuation IS 'The current estimated value of the stamp.';
COMMENT ON COLUMN stamps.notes IS 'User notes about the stamp.';
COMMENT ON COLUMN stamps.images IS 'An array of UUIDs for images of the stamp.';
COMMENT ON COLUMN stamps.currency IS 'The currency for pricing fields (e.g., USD, EUR).';
COMMENT ON COLUMN stamps.created_at IS 'Timestamp of when the stamp record was created.';
COMMENT ON COLUMN stamps.updated_at IS 'Timestamp of when the stamp record was last updated.';

-- Trigger to update the updated_at timestamp on any modification
-- The handle_updated_at function is assumed to exist from the previous migration.
CREATE TRIGGER on_stamps_updated
BEFORE UPDATE ON stamps
FOR EACH ROW
EXECUTE PROCEDURE handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE stamps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only manage their own stamps"
ON stamps
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
