-- ============================================
-- MIGRATION: Blog Tags Update
-- Created: 2026-02-22
-- Description: Adiciona novas tags e remove a tag manaus
-- ============================================

INSERT INTO public.tags (name, slug) VALUES
  ('Tacacá', 'tacaca'),
  ('Pirarucu', 'pirarucu'),
  ('Açaí', 'acai'),
  ('Festival', 'festival'),
  ('Tradição', 'tradicao'),
  ('Culinária', 'culinaria'),
  ('Dica', 'dica'),
  ('História', 'historia'),
  ('Entrevista', 'entrevista'),
  ('Curiosidade', 'curiosidade'),
  ('Receita Rápida', 'receita-rapida'),
  ('Gastronomia', 'gastronomia'),
  ('Sustentabilidade', 'sustentabilidade'),
  ('Bélem', 'belem')
ON CONFLICT (slug) DO NOTHING;

DELETE FROM public.tags
WHERE slug = 'manaus';
