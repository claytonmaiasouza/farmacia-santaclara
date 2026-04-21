-- =============================================
-- Corrige brand_id dos produtos existentes
-- Execute no SQL Editor do Supabase
-- =============================================

-- Garante que a marca ZPHC existe
INSERT INTO brands (name, slug, active)
VALUES ('ZPHC', 'zphc', true)
ON CONFLICT (slug) DO NOTHING;

-- Peptídeos ZPHC
UPDATE products SET brand_id = (SELECT id FROM brands WHERE slug = 'zphc')
WHERE slug IN (
  'ghrp-2-5mg',
  'ghrp-6-5mg',
  'ipamorelin-2mg',
  'aod-9604-5mg',
  'bpc-157-5mg',
  'tb-500-5mg',
  'semaglutida-5mg',
  'retatrutida-5mg',
  'cjc-1295-sem-dac-2mg',
  'pt-141-10mg',
  'selank-5mg',
  'semax-5mg'
);

-- Hormônios ZPHC
UPDATE products SET brand_id = (SELECT id FROM brands WHERE slug = 'zphc')
WHERE slug IN (
  'hcg-5000ui',
  'somatropina-10ui',
  'somatropina-36ui',
  'testosterona-enantato-250mg',
  'testosterona-cipionato-250mg',
  'testosterona-propionato-100mg',
  'sustanon-250mg',
  'nandrolona-decanoato-250mg',
  'nandrolona-fenilpropionato-100mg',
  'trembolona-enantato-200mg',
  'trembolona-acetato-100mg',
  'boldenona-undecilato-250mg',
  'drostanolona-propionato-100mg',
  'drostanolona-enantato-200mg',
  'primobolan-100mg',
  'winstrol-injetavel-50mg'
);

-- Suplementos ZPHC
UPDATE products SET brand_id = (SELECT id FROM brands WHERE slug = 'zphc')
WHERE slug IN (
  'oxandrolona-10mg-100tabs',
  'estanozolol-10mg-100tabs',
  'metandienona-10mg-100tabs',
  'oximetolona-50mg-100tabs',
  'turinabol-10mg-100tabs',
  'anastrozol-1mg-100tabs',
  'letrozol-2-5mg-100tabs',
  'clomifeno-50mg-100tabs',
  'tamoxifeno-20mg-100tabs',
  'exemestano-25mg-100tabs',
  'proviron-25mg-100tabs',
  'ostarina-mk2866-10mg-100tabs',
  'ligandrol-lgd4033-5mg-100tabs',
  'rad-140-10mg-100tabs',
  'cardarine-gw501516-10mg-100tabs',
  'mk-677-ibutamoren-10mg-100tabs'
);
