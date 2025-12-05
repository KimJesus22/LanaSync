-- Add role column to members
ALTER TABLE members ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Create app_config table for global settings
CREATE TABLE IF NOT EXISTS app_config (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL
);

-- Enable RLS on app_config
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can do everything on app_config
CREATE POLICY "Admins can do everything on app_config" ON app_config
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid() AND members.role = 'admin'
    )
  );

-- Policy: Everyone can read app_config (for pricing display)
CREATE POLICY "Everyone can read app_config" ON app_config
  FOR SELECT
  USING (true);

-- Insert default pricing config
INSERT INTO app_config (key, value)
VALUES (
  'pricing_plans',
  '{
    "basic": { "price": 0, "features": ["50 Gastos/mes", "1 Presupuesto", "Modo Offline"] },
    "pro": { "price": 9, "features": ["Gastos Ilimitados", "Presupuestos Ilimitados", "Escáner IA", "Metas Compartidas"] }
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;
