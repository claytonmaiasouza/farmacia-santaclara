-- =============================================
-- Lipoless (Tirzepatida) — Inserção de produtos
-- Execute no SQL Editor do Supabase
-- =============================================

-- Garante que a marca Lipoless existe
INSERT INTO brands (name, slug, active)
VALUES ('Lipoless', 'lipoless', true)
ON CONFLICT (slug) DO NOTHING;

-- Inserção dos produtos
INSERT INTO products (name, slug, short_description, description, price, original_price, stock, min_stock, image_url, active, requires_prescription, tags)
VALUES
(
  'Lipoless Tirzepatida 2,5mg',
  'lipoless-tirzepatida-2-5mg',
  'Tirzepatida 2,5mg — Dose inicial para tratamento de obesidade e diabetes tipo 2.',
  'Lipoless é o nome comercial da tirzepatida, um tratamento injetável que atua de forma muito específica sobre o metabolismo, indicado para obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Lipoless funciona como agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Frasco multidose (vial MD) — 2,5mg
Administração: Injeção subcutânea semanal, podendo ser autoaplicada após orientação profissional nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/lipoless-2-5mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'lipoless', 'peptideo']
),
(
  'Lipoless Tirzepatida 5mg',
  'lipoless-tirzepatida-5mg',
  'Tirzepatida 5mg — Tratamento injetável semanal para obesidade e diabetes tipo 2.',
  'Lipoless é o nome comercial da tirzepatida, um tratamento injetável que atua de forma muito específica sobre o metabolismo, indicado para obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Lipoless funciona como agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Frasco multidose (vial MD) — 5mg
Administração: Injeção subcutânea semanal, podendo ser autoaplicada após orientação profissional nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/lipoless-5mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'lipoless', 'peptideo']
),
(
  'Lipoless Tirzepatida 7,5mg',
  'lipoless-tirzepatida-7-5mg',
  'Tirzepatida 7,5mg — Dose intermediária para controle do peso e glicemia.',
  'Lipoless é o nome comercial da tirzepatida, um tratamento injetável que atua de forma muito específica sobre o metabolismo, indicado para obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Lipoless funciona como agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Frasco multidose (vial MD) — 7,5mg
Administração: Injeção subcutânea semanal, podendo ser autoaplicada após orientação profissional nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/lipoless-7-5mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'lipoless', 'peptideo']
),
(
  'Lipoless Tirzepatida 10mg',
  'lipoless-tirzepatida-10mg',
  'Tirzepatida 10mg — Dose avançada para perda de peso e controle glicêmico.',
  'Lipoless é o nome comercial da tirzepatida, um tratamento injetável que atua de forma muito específica sobre o metabolismo, indicado para obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Lipoless funciona como agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Frasco multidose (vial MD) — 10mg
Administração: Injeção subcutânea semanal, podendo ser autoaplicada após orientação profissional nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/lipoless-10mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'lipoless', 'peptideo']
),
(
  'Lipoless Tirzepatida 12,5mg',
  'lipoless-tirzepatida-12-5mg',
  'Tirzepatida 12,5mg — Dose de manutenção para tratamento contínuo.',
  'Lipoless é o nome comercial da tirzepatida, um tratamento injetável que atua de forma muito específica sobre o metabolismo, indicado para obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Lipoless funciona como agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Frasco multidose (vial MD) — 12,5mg
Administração: Injeção subcutânea semanal, podendo ser autoaplicada após orientação profissional nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/lipoless-12-5mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'lipoless', 'peptideo']
),
(
  'Lipoless Tirzepatida 15mg',
  'lipoless-tirzepatida-15mg',
  'Tirzepatida 15mg — Dose máxima para resultados clínicos expressivos.',
  'Lipoless é o nome comercial da tirzepatida, um tratamento injetável que atua de forma muito específica sobre o metabolismo, indicado para obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Lipoless funciona como agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Frasco multidose (vial MD) — 15mg
Administração: Injeção subcutânea semanal, podendo ser autoaplicada após orientação profissional nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/lipoless-15mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'lipoless', 'peptideo']
)
ON CONFLICT (slug) DO NOTHING;

-- Associa a marca Lipoless aos produtos inseridos
UPDATE products
SET brand_id = (SELECT id FROM brands WHERE slug = 'lipoless')
WHERE slug IN (
  'lipoless-tirzepatida-2-5mg',
  'lipoless-tirzepatida-5mg',
  'lipoless-tirzepatida-7-5mg',
  'lipoless-tirzepatida-10mg',
  'lipoless-tirzepatida-12-5mg',
  'lipoless-tirzepatida-15mg'
);
