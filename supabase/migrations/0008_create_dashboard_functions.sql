-- Supabase migration script for dashboard metrics functions

-- Section: Function to calculate total spent
CREATE OR REPLACE FUNCTION public.get_total_spent(p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    total_spent NUMERIC;
BEGIN
    SELECT COALESCE(SUM(purchase_price), 0)
    INTO total_spent
    FROM public.stamps
    WHERE user_id = p_user_id;

    RETURN total_spent;
END;
$$ LANGUAGE plpgsql;

-- Section: Function to calculate total earned
CREATE OR REPLACE FUNCTION public.get_total_earned(p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    total_earned NUMERIC;
BEGIN
    SELECT COALESCE(SUM(sale_price), 0)
    INTO total_earned
    FROM public.sales
    WHERE user_id = p_user_id;

    RETURN total_earned;
END;
$$ LANGUAGE plpgsql;

-- Section: Function to get current budget
CREATE OR REPLACE FUNCTION public.get_current_budget(p_user_id UUID, p_period public.period_enum)
RETURNS NUMERIC AS $$
DECLARE
    current_budget NUMERIC;
BEGIN
    SELECT limit_amount
    INTO current_budget
    FROM public.budgets
    WHERE user_id = p_user_id AND period = p_period;

    RETURN current_budget;
END;
$$ LANGUAGE plpgsql;

-- Section: Function to calculate profit/loss
CREATE OR REPLACE FUNCTION public.get_profit_loss(p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    total_spent NUMERIC;
    total_earned NUMERIC;
BEGIN
    total_spent := public.get_total_spent(p_user_id);
    total_earned := public.get_total_earned(p_user_id);

    RETURN total_earned - total_spent;
END;
$$ LANGUAGE plpgsql;

-- Section: Function to get collection size
CREATE OR REPLACE FUNCTION public.get_collection_size(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    collection_size INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO collection_size
    FROM public.stamps
    WHERE user_id = p_user_id;

    RETURN collection_size;
END;
$$ LANGUAGE plpgsql;

-- Section: Add comments to functions
COMMENT ON FUNCTION public.get_total_spent(UUID) IS 'Calculates the total amount spent by a user on stamps.';
COMMENT ON FUNCTION public.get_total_earned(UUID) IS 'Calculates the total amount earned by a user from sales.';
COMMENT ON FUNCTION public.get_current_budget(UUID, public.period_enum) IS 'Retrieves the current budget for a user for a given period.';
COMMENT ON FUNCTION public.get_profit_loss(UUID) IS 'Calculates the profit or loss for a user.';
COMMENT ON FUNCTION public.get_collection_size(UUID) IS 'Counts the number of stamps in a user''s collection.';
