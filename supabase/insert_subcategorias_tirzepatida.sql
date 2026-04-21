-- =============================================
-- Subcategorias de Tirzepatida dentro de Peptídeos
-- Execute no SQL Editor do Supabase
-- =============================================

-- Cria as subcategorias dentro de "peptideos"
INSERT INTO categories (name, slug, description, parent_id, active, sort_order)
SELECT 'Lipoless',          'peptideos-lipoless',          'Tirzepatida marca Lipoless',          id, true, 10 FROM categories WHERE slug = 'peptideos'
UNION ALL
SELECT 'TG',                'peptideos-tg',                'Tirzepatida marca TG',                id, true, 20 FROM categories WHERE slug = 'peptideos'
UNION ALL
SELECT 'Lipoland',          'peptideos-lipoland',          'Tirzepatida marca Lipoland',          id, true, 30 FROM categories WHERE slug = 'peptideos'
UNION ALL
SELECT 'Tirzec',            'peptideos-tirzec',            'Tirzepatida marca Tirzec',            id, true, 40 FROM categories WHERE slug = 'peptideos'
UNION ALL
SELECT 'Tirzedral',         'peptideos-tirzedral',         'Tirzepatida marca Tirzedral',         id, true, 50 FROM categories WHERE slug = 'peptideos'
UNION ALL
SELECT 'Tirzepatide ZPHC',  'peptideos-tirzepatide-zphc',  'Tirzepatida marca ZPHC',              id, true, 60 FROM categories WHERE slug = 'peptideos'
UNION ALL
SELECT 'Gluconex',          'peptideos-gluconex',          'Tirzepatida marca Gluconex',          id, true, 70 FROM categories WHERE slug = 'peptideos'
ON CONFLICT (slug) DO NOTHING;

-- Move os produtos Lipoless para a nova subcategoria
UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'peptideos-lipoless')
WHERE slug IN (
  'lipoless-tirzepatida-2-5mg',
  'lipoless-tirzepatida-5mg',
  'lipoless-tirzepatida-7-5mg',
  'lipoless-tirzepatida-10mg',
  'lipoless-tirzepatida-12-5mg',
  'lipoless-tirzepatida-15mg'
);
