-- Credit cards master table
CREATE TABLE credit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid(),
  name TEXT NOT NULL,
  total_limit NUMERIC(12,2) NOT NULL,
  spent NUMERIC(12,2) NOT NULL DEFAULT 0,
  reset_day INTEGER NOT NULL CHECK (reset_day BETWEEN 1 AND 31),
  last_reset_month TEXT, -- stored as 'YYYY-MM' for idempotency
  created_at TIMESTAMPTZ DEFAULT now()
);

-- History archive (one row per monthly cycle)
CREATE TABLE cc_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES credit_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  cycle_month TEXT NOT NULL, -- 'YYYY-MM'
  spent NUMERIC(12,2) NOT NULL,
  archived_at TIMESTAMPTZ DEFAULT now()
);

-- RLS (enable in phase 5 — keep open for dev)
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow individual users full access on credit_cards" 
ON credit_cards
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow individual users full access on cc_history" 
ON cc_history
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);
