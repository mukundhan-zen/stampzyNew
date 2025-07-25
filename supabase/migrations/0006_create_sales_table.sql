-- Supabase migration script for sales table

-- Section: Create sales table
CREATE TABLE public.sales (
    -- Fields
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id UUID NOT NULL,
    stamp_id UUID,
    collection_id UUID,
    sale_date DATE NOT NULL,
    sale_price NUMERIC NOT NULL,
    buyer TEXT,
    currency TEXT,
    taxes NUMERIC,
    shipping NUMERIC,
    partial_sale BOOLEAN DEFAULT false NOT NULL,
    residual_value NUMERIC,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

    -- Constraints
    CONSTRAINT sales_pkey PRIMARY KEY (id),
    CONSTRAINT sales_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
    CONSTRAINT sales_stamp_id_fkey FOREIGN KEY (stamp_id) REFERENCES public.stamps (id) ON DELETE SET NULL,
    CONSTRAINT sales_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections (id) ON DELETE SET NULL,
    CONSTRAINT chk_stamp_or_collection CHECK (stamp_id IS NOT NULL OR collection_id IS NOT NULL)
);

-- Section: Add comments to sales table
COMMENT ON TABLE public.sales IS 'Stores sales records for stamps and collections.';
COMMENT ON COLUMN public.sales.id IS 'Primary key for the sale.';
COMMENT ON COLUMN public.sales.user_id IS 'Foreign key to the user who made the sale.';
COMMENT ON COLUMN public.sales.stamp_id IS 'Foreign key to the stamp sold (nullable).';
COMMENT ON COLUMN public.sales.collection_id IS 'Foreign key to the collection sold (nullable).';
COMMENT ON COLUMN public.sales.sale_date IS 'Date of the sale.';
COMMENT ON COLUMN public.sales.sale_price IS 'Price at which the item was sold.';
COMMENT ON COLUMN public.sales.buyer IS 'Name or identifier of the buyer.';
COMMENT ON COLUMN public.sales.currency IS 'Currency of the sale (e.g., USD, EUR).';
COMMENT ON COLUMN public.sales.taxes IS 'Taxes associated with the sale.';
COMMENT ON COLUMN public.sales.shipping IS 'Shipping costs for the sale.';
COMMENT ON COLUMN public.sales.partial_sale IS 'Indicates if only part of a collection was sold.';
COMMENT ON COLUMN public.sales.residual_value IS 'Residual value of a partially sold collection.';
COMMENT ON COLUMN public.sales.notes IS 'Additional notes about the sale.';
COMMENT ON COLUMN public.sales.created_at IS 'Timestamp of when the record was created.';
COMMENT ON COLUMN public.sales.updated_at IS 'Timestamp of when the record was last updated.';

-- Section: Add indexes to sales table
CREATE INDEX idx_sales_user_id ON public.sales (user_id);
CREATE INDEX idx_sales_sale_date ON public.sales (sale_date);

-- Section: Enable RLS for sales table
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Section: Create RLS policies for sales table
CREATE POLICY "Users can only access their own sales"
ON public.sales
FOR ALL
USING (auth.uid() = user_id);

-- Section: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_sales_updated
BEFORE UPDATE ON public.sales
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
