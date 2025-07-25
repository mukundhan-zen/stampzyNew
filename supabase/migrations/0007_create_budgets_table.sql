-- Supabase migration script for budgets table

-- Section: Create period_enum type
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'period_enum') THEN
        CREATE TYPE public.period_enum AS ENUM ('week', 'month', 'quarter', 'year');
    END IF;
END$$;

-- Section: Create budgets table
CREATE TABLE public.budgets (
    -- Fields
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    user_id UUID NOT NULL,
    period public.period_enum NOT NULL,
    limit_amount NUMERIC NOT NULL,
    currency TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

    -- Constraints
    CONSTRAINT budgets_pkey PRIMARY KEY (id),
    CONSTRAINT budgets_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
    CONSTRAINT budgets_user_id_period_key UNIQUE (user_id, period)
);

-- Section: Add comments to budgets table
COMMENT ON TABLE public.budgets IS 'Stores user-defined budgets for specific periods.';
COMMENT ON COLUMN public.budgets.id IS 'Primary key for the budget.';
COMMENT ON COLUMN public.budgets.user_id IS 'Foreign key to the user who owns the budget.';
COMMENT ON COLUMN public.budgets.period IS 'The budget period (week, month, quarter, year).';
COMMENT ON COLUMN public.budgets.limit_amount IS 'The budget limit amount.';
COMMENT ON COLUMN public.budgets.currency IS 'Currency of the budget (e.g., USD, EUR).';
COMMENT ON COLUMN public.budgets.created_at IS 'Timestamp of when the record was created.';
COMMENT ON COLUMN public.budgets.updated_at IS 'Timestamp of when the record was last updated.';

-- Section: Add indexes to budgets table
CREATE INDEX idx_budgets_user_id_period ON public.budgets (user_id, period);

-- Section: Enable RLS for budgets table
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Section: Create RLS policies for budgets table
CREATE POLICY "Users can only access their own budgets"
ON public.budgets
FOR ALL
USING (auth.uid() = user_id);

-- Section: Auto-update updated_at timestamp
CREATE TRIGGER on_budgets_updated
BEFORE UPDATE ON public.budgets
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
