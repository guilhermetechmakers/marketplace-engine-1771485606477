-- Order Booking History API: orders, line items, state timeline, payment metadata
-- Supports paginated lists, filters, detailed view, receipts, and dispute workflows.

-- Orders table (buyer_id = purchaser, seller_id = listing owner)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listing_detail_page(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'usd',
  payment_intent_id TEXT,
  payout_id TEXT,
  message_thread_id UUID,
  dispute_case_id UUID REFERENCES dispute_refund_case_page(id) ON DELETE SET NULL,
  receipt_pdf_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_listing_id ON orders(listing_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Order line items
CREATE TABLE IF NOT EXISTS order_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listing_detail_page(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_line_items_order_id ON order_line_items(order_id);

-- Order state timeline (state transitions, audit trail)
CREATE TABLE IF NOT EXISTS order_state_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  triggered_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  note TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_state_timeline_order_id ON order_state_timeline(order_id);

-- RLS for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Buyers can read their own orders
CREATE POLICY "orders_read_buyer" ON orders
  FOR SELECT USING (auth.uid() = buyer_id);

-- Sellers can read orders where they are the seller
CREATE POLICY "orders_read_seller" ON orders
  FOR SELECT USING (auth.uid() = seller_id);

-- Admin/operator: allow read for service role (handled in Edge Function with service key)
-- No direct admin policy on RLS; Edge Function uses service role for admin view

-- RLS for order_line_items
ALTER TABLE order_line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_line_items_read_via_order" ON order_line_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_line_items.order_id
      AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())
    )
  );

-- RLS for order_state_timeline
ALTER TABLE order_state_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_state_timeline_read_via_order" ON order_state_timeline
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_state_timeline.order_id
      AND (o.buyer_id = auth.uid() OR o.seller_id = auth.uid())
    )
  );
