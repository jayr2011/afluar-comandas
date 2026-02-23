-- ============================================
-- MIGRATION: Feature Toggles
-- Created: 2026-02-23
-- Description: Cria estrutura para habilitar/desabilitar funcionalidades pelo admin
-- ============================================

CREATE TABLE IF NOT EXISTS public.feature_toggles (
  key TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID
);

ALTER TABLE public.feature_toggles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Feature toggles leitura pública" ON public.feature_toggles;
CREATE POLICY "Feature toggles leitura pública"
  ON public.feature_toggles
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Feature toggles admin gerencia" ON public.feature_toggles;
CREATE POLICY "Feature toggles admin gerencia"
  ON public.feature_toggles
  FOR ALL
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

GRANT SELECT ON public.feature_toggles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.feature_toggles TO authenticated;

DROP TRIGGER IF EXISTS set_feature_toggles_updated_at ON public.feature_toggles;
CREATE TRIGGER set_feature_toggles_updated_at
  BEFORE UPDATE ON public.feature_toggles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

INSERT INTO public.feature_toggles (key, enabled)
VALUES
  ('checkout_enabled', true),
  ('blog_enabled', true),
  ('eventos_enabled', true),
  ('beach_tennis_enabled', true)
ON CONFLICT (key) DO NOTHING;
