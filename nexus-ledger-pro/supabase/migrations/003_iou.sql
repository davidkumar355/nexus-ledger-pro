CREATE TABLE friends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE friend_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  friend_id UUID REFERENCES friends(id) ON DELETE CASCADE,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  type TEXT NOT NULL CHECK (type IN ('lent', 'borrowed', 'settled')),
  amount NUMERIC(12,2) NOT NULL,
  note TEXT,
  txn_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own friends"
  ON friends FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own friend transactions"
  ON friend_transactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
