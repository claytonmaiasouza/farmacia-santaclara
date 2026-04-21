-- =============================================
-- Tirzedral (Tirzepatida) — Inserção de produtos
-- Execute no SQL Editor do Supabase
-- =============================================

-- Garante que a marca Tirzedral existe
INSERT INTO brands (name, slug, active)
VALUES ('Tirzedral', 'tirzedral', true)
ON CONFLICT (slug) DO NOTHING;

-- Inserção dos produtos
INSERT INTO products (name, slug, short_description, description, price, original_price, stock, min_stock, image_url, active, requires_prescription, tags)
VALUES
(
  'Tirzedral Tirzepatida 2,5mg',
  'tirzedral-tirzepatida-2-5mg',
  'Tirzepatida 2,5mg — Caixa com 4 seringas pré-preenchidas. Dose inicial.',
  'Tirzedral é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Caixa com 4 seringas pré-preenchidas — 2,5mg
Fabricante: Cathedral
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tirzedral-2-5mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tirzedral', 'cathedral', 'peptideo']
),
(
  'Tirzedral Tirzepatida 5mg',
  'tirzedral-tirzepatida-5mg',
  'Tirzepatida 5mg — Caixa com 4 seringas pré-preenchidas.',
  'Tirzedral é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Caixa com 4 seringas pré-preenchidas — 5mg
Fabricante: Cathedral
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tirzedral-5mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tirzedral', 'cathedral', 'peptideo']
),
(
  'Tirzedral Tirzepatida 7,5mg',
  'tirzedral-tirzepatida-7-5mg',
  'Tirzepatida 7,5mg — Caixa com 4 seringas pré-preenchidas. Dose intermediária.',
  'Tirzedral é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Caixa com 4 seringas pré-preenchidas — 7,5mg
Fabricante: Cathedral
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tirzedral-7-5mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tirzedral', 'cathedral', 'peptideo']
),
(
  'Tirzedral Tirzepatida 10mg',
  'tirzedral-tirzepatida-10mg',
  'Tirzepatida 10mg — Caixa com 4 seringas pré-preenchidas. Dose avançada.',
  'Tirzedral é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Caixa com 4 seringas pré-preenchidas — 10mg
Fabricante: Cathedral
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tirzedral-10mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tirzedral', 'cathedral', 'peptideo']
),
(
  'Tirzedral Tirzepatida 15mg',
  'tirzedral-tirzepatida-15mg',
  'Tirzepatida 15mg — Caixa com 4 seringas pré-preenchidas. Dose máxima.',
  'Tirzedral é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Caixa com 4 seringas pré-preenchidas — 15mg
Fabricante: Cathedral
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tirzedral-15mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tirzedral', 'cathedral', 'peptideo']
)
ON CONFLICT (slug) DO NOTHING;

-- Associa a marca Tirzedral e a subcategoria peptideos-tirzedral aos produtos
UPDATE products
SET
  brand_id    = (SELECT id FROM brands WHERE slug = 'tirzedral'),
  category_id = (SELECT id FROM categories WHERE slug = 'peptideos-tirzedral')
WHERE slug IN (
  'tirzedral-tirzepatida-2-5mg',
  'tirzedral-tirzepatida-5mg',
  'tirzedral-tirzepatida-7-5mg',
  'tirzedral-tirzepatida-10mg',
  'tirzedral-tirzepatida-15mg'
);
