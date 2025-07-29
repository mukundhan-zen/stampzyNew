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

-- ============================================================================
-- STAMP COLLECTION TRACKER TABLES
-- ============================================================================

-- Collections table to organize stamps
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.collections IS 'Collections to organize and group stamps';

-- Stamps table with comprehensive metadata
CREATE TABLE public.stamps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  
  -- Basic Information
  title TEXT NOT NULL,
  country TEXT,
  year INTEGER,
  condition TEXT CHECK (condition IN ('mint', 'near_mint', 'fine', 'very_fine', 'good', 'poor')),
  
  -- Catalog Information
  scott_catalog_number TEXT,
  michel_catalog_number TEXT,
  stanley_gibbons_catalog_number TEXT,
  denomination TEXT,
  theme_subject TEXT,
  
  -- Purchase Information
  acquisition_date DATE,
  purchase_price DECIMAL(10,2),
  purchase_currency TEXT DEFAULT 'USD',
  seller TEXT,
  taxes DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  
  -- Valuation
  current_valuation DECIMAL(10,2),
  valuation_currency TEXT DEFAULT 'USD',
  valuation_date DATE,
  
  -- Additional Information
  notes TEXT,
  is_sold BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.stamps IS 'Individual stamps with comprehensive metadata and cataloging information';

-- Images table for stamp photographs
CREATE TABLE public.stamp_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stamp_id UUID NOT NULL REFERENCES public.stamps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Image Information
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  
  -- Image Metadata
  angle TEXT CHECK (angle IN ('front', 'back', 'detail', 'watermark', 'other')) DEFAULT 'front',
  description TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.stamp_images IS 'Images associated with stamps, supporting multiple angles and views';

-- Transactions table for purchase and sale records
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stamp_id UUID REFERENCES public.stamps(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  
  -- Transaction Details
  type TEXT NOT NULL CHECK (type IN ('purchase', 'sale')),
  transaction_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Additional Costs
  taxes DECIMAL(10,2) DEFAULT 0,
  shipping DECIMAL(10,2) DEFAULT 0,
  fees DECIMAL(10,2) DEFAULT 0,
  
  -- Party Information
  party_name TEXT, -- seller for purchases, buyer for sales
  party_contact TEXT,
  
  -- Transaction Details
  payment_method TEXT,
  reference_number TEXT,
  notes TEXT,
  
  -- For sales: residual value calculation
  residual_value DECIMAL(10,2),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.transactions IS 'Purchase and sale transactions for stamps and collections';

-- Add updated_at triggers for new tables
CREATE TRIGGER set_timestamp_collections
BEFORE UPDATE ON public.collections
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_stamps
BEFORE UPDATE ON public.stamps
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_stamp_images
BEFORE UPDATE ON public.stamp_images
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_transactions
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Collections indexes
CREATE INDEX idx_collections_user_id ON public.collections(user_id);
CREATE INDEX idx_collections_created_at ON public.collections(created_at DESC);

-- Stamps indexes
CREATE INDEX idx_stamps_user_id ON public.stamps(user_id);
CREATE INDEX idx_stamps_collection_id ON public.stamps(collection_id);
CREATE INDEX idx_stamps_country ON public.stamps(country);
CREATE INDEX idx_stamps_year ON public.stamps(year);
CREATE INDEX idx_stamps_condition ON public.stamps(condition);
CREATE INDEX idx_stamps_is_sold ON public.stamps(is_sold);
CREATE INDEX idx_stamps_created_at ON public.stamps(created_at DESC);

-- Full-text search on stamps
CREATE INDEX idx_stamps_search ON public.stamps USING gin(
  to_tsvector('english', 
    coalesce(title, '') || ' ' || 
    coalesce(country, '') || ' ' || 
    coalesce(theme_subject, '') || ' ' || 
    coalesce(scott_catalog_number, '') || ' ' || 
    coalesce(notes, '')
  )
);

-- Images indexes
CREATE INDEX idx_stamp_images_stamp_id ON public.stamp_images(stamp_id);
CREATE INDEX idx_stamp_images_user_id ON public.stamp_images(user_id);
CREATE INDEX idx_stamp_images_is_primary ON public.stamp_images(is_primary);

-- Transactions indexes
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_stamp_id ON public.transactions(stamp_id);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date DESC);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamp_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Collections policies
CREATE POLICY "Users can view their own collections"
  ON public.collections FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own collections"
  ON public.collections FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own collections"
  ON public.collections FOR UPDATE
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own collections"
  ON public.collections FOR DELETE
  USING ( auth.uid() = user_id );

-- Stamps policies
CREATE POLICY "Users can view their own stamps"
  ON public.stamps FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own stamps"
  ON public.stamps FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own stamps"
  ON public.stamps FOR UPDATE
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own stamps"
  ON public.stamps FOR DELETE
  USING ( auth.uid() = user_id );

-- Stamp images policies
CREATE POLICY "Users can view their own stamp images"
  ON public.stamp_images FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own stamp images"
  ON public.stamp_images FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own stamp images"
  ON public.stamp_images FOR UPDATE
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own stamp images"
  ON public.stamp_images FOR DELETE
  USING ( auth.uid() = user_id );

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own transactions"
  ON public.transactions FOR UPDATE
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own transactions"
  ON public.transactions FOR DELETE
  USING ( auth.uid() = user_id );
