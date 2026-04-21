-- =============================================
-- Tirzec (Tirzepatida) — Inserção de produtos
-- Execute no SQL Editor do Supabase
-- =============================================

-- Garante que a marca Tirzec existe
INSERT INTO brands (name, slug, active)
VALUES ('Tirzec', 'tirzec', true)
ON CONFLICT (slug) DO NOTHING;

-- Inserção dos produtos
INSERT INTO products (name, slug, short_description, description, price, original_price, stock, min_stock, image_url, active, requires_prescription, tags)
VALUES
(
  'Tirzec Tirzepatida 2,5mg — Vial + Seringas',
  'tirzec-tirzepatida-2-5mg-vial',
  'Tirzepatida 2,5mg — Solução injetável 2ml com 4 seringas. Dose inicial.',
  'Tirzec é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Solução injetável 2,5mg x 2ml + 4 seringas
Fabricante: QUIMFA
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tirzec-2-5mg-vial.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tirzec', 'quimfa', 'peptideo']
),
(
  'Tirzec Tirzepatida 5mg — Vial + Seringas',
  'tirzec-tirzepatida-5mg-vial',
  'Tirzepatida 5mg — Solução injetável 2ml com 4 seringas.',
  'Tirzec é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Solução injetável 5mg x 2ml + 4 seringas
Fabricante: QUIMFA
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tirzec-5mg-vial.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tirzec', 'quimfa', 'peptideo']
),
(
  'Tirzec Tirzepatida 7,5mg — Vial + Seringas',
  'tirzec-tirzepatida-7-5mg-vial',
  'Tirzepatida 7,5mg — Solução injetável 2ml com 4 seringas. Dose intermediária.',
  'Tirzec é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Solução injetável 7,5mg x 2ml + 4 seringas
Fabricante: QUIMFA
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tirzec-7-5mg-vial.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tirzec', 'quimfa', 'peptideo']
),
(
  'Tirzec Tirzepatida 10mg — Vial + Seringas',
  'tirzec-tirzepatida-10mg-vial',
  'Tirzepatida 10mg — Solução injetável 2ml com 4 seringas. Dose avançada.',
  'Tirzec é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Solução injetável 10mg x 2ml + 4 seringas
Fabricante: QUIMFA
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tirzec-10mg-vial.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tirzec', 'quimfa', 'peptideo']
),
(
  'Tirzec Tirzepatida 12,5mg — Vial + Seringas',
  'tirzec-tirzepatida-12-5mg-vial',
  'Tirzepatida 12,5mg — Solução injetável 2ml com 4 seringas. Dose de manutenção.',
  'Tirzec é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Solução injetável 12,5mg x 2ml + 4 seringas
Fabricante: QUIMFA
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tirzec-12-5mg-vial.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tirzec', 'quimfa', 'peptideo']
),
(
  'Tirzec Tirzepatida 15mg — Vial + Seringas',
  'tirzec-tirzepatida-15mg-vial',
  'Tirzepatida 15mg — Solução injetável 2ml com 4 seringas. Dose máxima.',
  'Tirzec é uma apresentação de tirzepatida injetável indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Solução injetável 15mg x 2ml + 4 seringas
Fabricante: QUIMFA
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tirzec-15mg-vial.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tirzec', 'quimfa', 'peptideo']
),
(
  'Tirzec Tirzepatida 2,5mg — Pen + Agulhas',
  'tirzec-tirzepatida-2-5mg-pen',
  'Tirzepatida 2,5mg — Caneta injetável 2ml com 4 agulhas. Dose inicial.',
  'Tirzec Pen é a versão em caneta injetável de tirzepatida, indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Caneta injetável 2,5mg x 2ml + 4 agulhas
Fabricante: QUIMFA
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tirzec-2-5mg-pen.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tirzec', 'quimfa', 'caneta', 'pen', 'peptideo']
),
(
  'Tirzec Tirzepatida 5mg — Pen + Agulhas',
  'tirzec-tirzepatida-5mg-pen',
  'Tirzepatida 5mg — Caneta injetável 2ml com 4 agulhas.',
  'Tirzec Pen é a versão em caneta injetável de tirzepatida, indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Caneta injetável 5mg x 2ml + 4 agulhas
Fabricante: QUIMFA
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tirzec-5mg-pen.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tirzec', 'quimfa', 'caneta', 'pen', 'peptideo']
),
(
  'Tirzec Tirzepatida 10mg — Pen + Agulhas',
  'tirzec-tirzepatida-10mg-pen',
  'Tirzepatida 10mg — Caneta injetável 2ml com 4 agulhas. Dose avançada.',
  'Tirzec Pen é a versão em caneta injetável de tirzepatida, indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Mecanismo de ação: Agonista dual dos receptores GLP-1 e GIP, imitando dois hormônios naturais que regulam o apetite e o açúcar no sangue, promovendo:
• Redução do apetite
• Melhora da sensibilidade à insulina
• Perda de peso sustentada e clinicamente significativa

Apresentação: Caneta injetável 10mg x 2ml + 4 agulhas
Fabricante: QUIMFA
Administração: Injeção subcutânea semanal nas regiões do abdômen ou coxas.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/tirzec-10mg-pen.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'tirzec', 'quimfa', 'caneta', 'pen', 'peptideo']
)
ON CONFLICT (slug) DO NOTHING;

-- Associa a marca Tirzec e a subcategoria peptideos-tirzec aos produtos
UPDATE products
SET
  brand_id    = (SELECT id FROM brands WHERE slug = 'tirzec'),
  category_id = (SELECT id FROM categories WHERE slug = 'peptideos-tirzec')
WHERE slug IN (
  'tirzec-tirzepatida-2-5mg-vial',
  'tirzec-tirzepatida-5mg-vial',
  'tirzec-tirzepatida-7-5mg-vial',
  'tirzec-tirzepatida-10mg-vial',
  'tirzec-tirzepatida-12-5mg-vial',
  'tirzec-tirzepatida-15mg-vial',
  'tirzec-tirzepatida-2-5mg-pen',
  'tirzec-tirzepatida-5mg-pen',
  'tirzec-tirzepatida-10mg-pen'
);
