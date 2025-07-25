-- Supabase Migration Script: Sales, Budgets, and Dashboard Metrics
-- This script creates the necessary tables for sales and budgets,
-- and a function to calculate key dashboard metrics for a user.

-- ====================================================================
-- Section 1: Create the 'sales' table
-- This table stores records of stamp and collection sales.
-- ====================================================================
CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('stamp', 'collection')),
    item_id UUID NOT NULL,
    sale_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    sale_price NUMERIC NOT NULL CHECK (sale_price >= 0),
    buyer TEXT,
    taxes NUMERIC DEFAULT 0,
    shipping NUMERIC DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    is_partial_sale BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    residual_value NUMERIC DEFAULT 0, -- The value of the item remaining after a partial sale
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comments for the 'sales' table
COMMENT ON TABLE sales IS 'Stores records of stamp and collection sales.';
COMMENT ON COLUMN sales.user_id IS 'The user who made the sale.';
COMMENT ON COLUMN sales.item_type IS 'The type of item sold (''stamp'' or ''collection'').';
COMMENT ON COLUMN sales.item_id IS 'The ID of the stamp or collection that was sold.';
COMMENT ON COLUMN sales.sale_price IS 'The price at which the item was sold.';

-- Indexes for the 'sales' table
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_item_id ON sales(item_id);

-- RLS for the 'sales' table
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own sales records" 
ON sales
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at on 'sales'
CREATE TRIGGER on_sales_updated
BEFORE UPDATE ON sales
FOR EACH ROW
EXECUTE PROCEDURE handle_updated_at();

-- ====================================================================
-- Section 2: Create the 'budgets' table
-- This table stores user-defined budget limits.
-- ====================================================================
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    weekly_limit NUMERIC,
    monthly_limit NUMERIC,
    quarterly_limit NUMERIC,
    yearly_limit NUMERIC,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Comments for the 'budgets' table
COMMENT ON TABLE budgets IS 'Stores user-defined spending budgets.';
COMMENT ON COLUMN budgets.user_id IS 'The user these budget settings belong to.';
COMMENT ON COLUMN budgets.yearly_limit IS 'The total budget allocated for the year.';

-- Index for the 'budgets' table
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);

-- RLS for the 'budgets' table
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own budget" 
ON budgets
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Trigger for updated_at on 'budgets'
CREATE TRIGGER on_budgets_updated
BEFORE UPDATE ON budgets
FOR EACH ROW
EXECUTE PROCEDURE handle_updated_at();

-- ====================================================================
-- Section 3: Create the 'get_dashboard_metrics' function
-- This function calculates and returns key metrics for the current user.
-- ====================================================================
CREATE OR REPLACE FUNCTION get_dashboard_metrics(p_user_id UUID)
RETURNS TABLE(
    total_spent NUMERIC,
    total_earned NUMERIC,
    current_budget NUMERIC,
    profit_loss NUMERIC,
    stamp_count BIGINT,
    collection_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH user_metrics AS (
        SELECT
            -- Calculate total spent from the 'stamps' table
            (SELECT COALESCE(SUM(purchase_price), 0) FROM stamps WHERE user_id = p_user_id) AS calculated_spent,
            
            -- Calculate total earned from the 'sales' table
            (SELECT COALESCE(SUM(sale_price), 0) FROM sales WHERE user_id = p_user_id) AS calculated_earned,
            
            -- Get the yearly budget from the 'budgets' table
            (SELECT COALESCE(yearly_limit, 0) FROM budgets WHERE user_id = p_user_id) AS budget,
            
            -- Count the number of stamps
            (SELECT COUNT(*) FROM stamps WHERE user_id = p_user_id) AS s_count,

            -- Count the number of collections
            (SELECT COUNT(*) FROM collections WHERE user_id = p_user_id) AS c_count
    )
    SELECT
        um.calculated_spent AS total_spent,
        um.calculated_earned AS total_earned,
        um.budget AS current_budget,
        (um.calculated_earned - um.calculated_spent) AS profit_loss,
        um.s_count AS stamp_count,
        um.c_count AS collection_count
    FROM user_metrics um;
END;
$$;

-- Grant execution rights to the function
GRANT EXECUTE ON FUNCTION get_dashboard_metrics(UUID) TO authenticated;
