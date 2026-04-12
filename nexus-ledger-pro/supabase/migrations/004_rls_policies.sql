-- Enable RLS
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_transactions ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "owner_only" ON credit_cards
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "owner_only" ON cc_history
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "owner_only" ON bank_transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "owner_only" ON friends
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "owner_only" ON friend_transactions
  FOR ALL USING (auth.uid() = user_id);
