-- =============================================
-- TG (Tirzepatida) — Inserção de produtos
-- Execute no SQL Editor do Supabase
-- =============================================

-- Garante que a marca TG existe
INSERT INTO brands (name, slug, active)
VALUES ('TG', 'tg', true)
ON CONFLICT (slug) DO NOTHING;

-- Inserção dos produtos
INSERT INTO products (name, slug, short_description, description, price, original_price, stock, min_stock, image_url, active, requires_prescription, tags)
VALUES
(
  'T.G Tirzepatida 2,5mg',
  'tg-tirzepatida-2-5mg',
  'Tirzepatida 2,5mg — Caixa com 4 vials + seringas. Dose inicial para obesidade e diabetes tipo 2.',
  'T.G é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Caixa com 4 vials de 0,5mL + seringas — 2,5mg
Fabricante: INDUFAR
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tg-2-5mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tg', 'indufar', 'peptideo']
),
(
  'T.G Tirzepatida 5mg',
  'tg-tirzepatida-5mg',
  'Tirzepatida 5mg — Caixa com 4 vials + seringas. Tratamento injetável semanal.',
  'T.G é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Caixa com 4 vials de 0,5mL + seringas — 5mg
Fabricante: INDUFAR
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tg-5mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tg', 'indufar', 'peptideo']
),
(
  'T.G Tirzepatida 7,5mg',
  'tg-tirzepatida-7-5mg',
  'Tirzepatida 7,5mg — Caixa com 4 vials + seringas. Dose intermediária.',
  'T.G é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Caixa com 4 vials de 0,5mL + seringas — 7,5mg
Fabricante: INDUFAR
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tg-7-5mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tg', 'indufar', 'peptideo']
),
(
  'T.G Tirzepatida 10mg',
  'tg-tirzepatida-10mg',
  'Tirzepatida 10mg — Caixa com 4 vials + seringas. Dose avançada.',
  'T.G é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Caixa com 4 vials de 0,5mL + seringas — 10mg
Fabricante: INDUFAR
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tg-10mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tg', 'indufar', 'peptideo']
),
(
  'T.G Tirzepatida 12,5mg',
  'tg-tirzepatida-12-5mg',
  'Tirzepatida 12,5mg — Caixa com 4 vials + seringas. Dose de manutenção.',
  'T.G é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Caixa com 4 vials de 0,5mL + seringas — 12,5mg
Fabricante: INDUFAR
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tg-12-5mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tg', 'indufar', 'peptideo']
),
(
  'T.G Tirzepatida 15mg',
  'tg-tirzepatida-15mg',
  'Tirzepatida 15mg — Caixa com 4 vials + seringas. Dose máxima.',
  'T.G é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Caixa com 4 vials de 0,5mL + seringas — 15mg
Fabricante: INDUFAR
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tg-15mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tg', 'indufar', 'peptideo']
)
ON CONFLICT (slug) DO NOTHING;

-- Associa a marca TG e a subcategoria peptideos-tg aos produtos
UPDATE products
SET
  brand_id    = (SELECT id FROM brands WHERE slug = 'tg'),
  category_id = (SELECT id FROM categories WHERE slug = 'peptideos-tg')
WHERE slug IN (
  'tg-tirzepatida-2-5mg',
  'tg-tirzepatida-5mg',
  'tg-tirzepatida-7-5mg',
  'tg-tirzepatida-10mg',
  'tg-tirzepatida-12-5mg',
  'tg-tirzepatida-15mg'
);
