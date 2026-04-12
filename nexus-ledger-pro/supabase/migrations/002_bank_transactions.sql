CREATE TABLE bank_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid(),
  source TEXT NOT NULL,       -- e.g., 'SBI', 'Axis', 'Cash'
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount NUMERIC(12,2) NOT NULL,
  note TEXT,
  txn_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own bank transactions"
  ON bank_transactions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
