-- =============================================
-- Lipoland (Tirzepatida) — Inserção de produtos
-- Execute no SQL Editor do Supabase
-- =============================================

-- Garante que a marca Lipoland existe
INSERT INTO brands (name, slug, active)
VALUES ('Lipoland', 'lipoland', true)
ON CONFLICT (slug) DO NOTHING;

-- Inserção dos produtos
INSERT INTO products (name, slug, short_description, description, price, original_price, stock, min_stock, image_url, active, requires_prescription, tags)
VALUES
(
  'Lipoland Tirzepatida 10mg',
  'lipoland-tirzepatida-10mg',
  'Tirzepatida 10mg — Tratamento injetável semanal para obesidade e diabetes tipo 2. Referência Mounjaro.',
  'Lipoland é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2, desenvolvida como referência ao Mounjaro.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Frasco — 10mg
Fabricante: Landerlan
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/lipoland-10mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'lipoland', 'landerlan', 'mounjaro', 'peptideo']
),
(
  'Lipoland Tirzepatida 15mg',
  'lipoland-tirzepatida-15mg',
  'Tirzepatida 15mg — Dose máxima, tratamento injetável semanal. Referência Mounjaro.',
  'Lipoland é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2, desenvolvida como referência ao Mounjaro.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Frasco — 15mg
Fabricante: Landerlan
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/lipoland-15mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'lipoland', 'landerlan', 'mounjaro', 'peptideo']
),
(
  'Lipoland Tirzepatida 15mg — Kit 4 Frascos',
  'lipoland-tirzepatida-15mg-4frascos',
  'Tirzepatida 15mg — Kit com 4 frascos para tratamento mensal. Referência Mounjaro.',
  'Lipoland é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2, desenvolvida como referência ao Mounjaro.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Kit com 4 frascos — 15mg cada
Fabricante: Landerlan
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/lipoland-15mg-4frascos.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'lipoland', 'landerlan', 'mounjaro', 'kit', 'peptideo']
)
ON CONFLICT (slug) DO NOTHING;

-- Associa a marca Lipoland e a subcategoria peptideos-lipoland aos produtos
UPDATE products
SET
  brand_id    = (SELECT id FROM brands WHERE slug = 'lipoland'),
  category_id = (SELECT id FROM categories WHERE slug = 'peptideos-lipoland')
WHERE slug IN (
  'lipoland-tirzepatida-10mg',
  'lipoland-tirzepatida-15mg',
  'lipoland-tirzepatida-15mg-4frascos'
);
