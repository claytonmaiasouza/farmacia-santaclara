-- =============================================
-- Gluconex (Tirzepatida) — Inserção de produtos
-- Execute no SQL Editor do Supabase
-- =============================================

-- Garante que a marca Gluconex existe
INSERT INTO brands (name, slug, active)
VALUES ('Gluconex', 'gluconex', true)
ON CONFLICT (slug) DO NOTHING;

-- Inserção dos produtos
INSERT INTO products (name, slug, short_description, description, price, original_price, stock, min_stock, image_url, active, requires_prescription, tags)
VALUES
(
  'Gluconex Tirzepatida 2,5mg',
  'gluconex-tirzepatida-2-5mg',
  'Tirzepatida 2,5mg/0,25mL — Caixa com 4 seringas pré-preenchidas com dispositivo de segurança. Dose inicial.',
  'Gluconex é uma solução injetável subcutânea de tirzepatida desenvolvida pela Lasca Laboratorios, indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Cada seringa contém tirzepatida 2,50 mg em 0,25 mL de solução injetável.

Mecanismo de ação: Gluconex atua como agonista duplo dos receptores GLP-1 e GIP — dois hormônios naturais responsáveis pela regulação do apetite e do metabolismo da glicose — proporcionando:
• Redução significativa do apetite e da ingestão calórica
• Melhora da sensibilidade à insulina e controle glicêmico
• Perda de peso sustentada e clinicamente comprovada

Apresentação: Caixa com 4 seringas pré-preenchidas de 0,25 mL com dispositivo de segurança — 2,5mg
Fabricante: Lasca Laboratorios
Administração: Injeção subcutânea semanal nas regiões do abdômen, coxa ou parte superior do braço.

Armazenar sob refrigeração entre 2°C e 8°C, ao abrigo da luz.
Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/gluconex-2-5mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'gluconex', 'lasca', 'peptideo']
),
(
  'Gluconex Tirzepatida 5mg',
  'gluconex-tirzepatida-5mg',
  'Tirzepatida 5mg/0,50mL — Caixa com 4 seringas pré-preenchidas com dispositivo de segurança.',
  'Gluconex é uma solução injetável subcutânea de tirzepatida desenvolvida pela Lasca Laboratorios, indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Cada seringa contém tirzepatida 5,00 mg em 0,50 mL de solução injetável.

Mecanismo de ação: Gluconex atua como agonista duplo dos receptores GLP-1 e GIP — dois hormônios naturais responsáveis pela regulação do apetite e do metabolismo da glicose — proporcionando:
• Redução significativa do apetite e da ingestão calórica
• Melhora da sensibilidade à insulina e controle glicêmico
• Perda de peso sustentada e clinicamente comprovada

Apresentação: Caixa com 4 seringas pré-preenchidas de 0,50 mL com dispositivo de segurança — 5mg
Fabricante: Lasca Laboratorios
Administração: Injeção subcutânea semanal nas regiões do abdômen, coxa ou parte superior do braço.

Armazenar sob refrigeração entre 2°C e 8°C, ao abrigo da luz.
Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/gluconex-5mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'gluconex', 'lasca', 'peptideo']
),
(
  'Gluconex Tirzepatida 7,5mg',
  'gluconex-tirzepatida-7-5mg',
  'Tirzepatida 7,5mg/0,50mL — Caixa com 4 seringas pré-preenchidas com dispositivo de segurança. Dose intermediária.',
  'Gluconex é uma solução injetável subcutânea de tirzepatida desenvolvida pela Lasca Laboratorios, indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Cada seringa contém tirzepatida 7,50 mg em 0,50 mL de solução injetável.

Mecanismo de ação: Gluconex atua como agonista duplo dos receptores GLP-1 e GIP — dois hormônios naturais responsáveis pela regulação do apetite e do metabolismo da glicose — proporcionando:
• Redução significativa do apetite e da ingestão calórica
• Melhora da sensibilidade à insulina e controle glicêmico
• Perda de peso sustentada e clinicamente comprovada

Apresentação: Caixa com 4 seringas pré-preenchidas de 0,50 mL com dispositivo de segurança — 7,5mg
Fabricante: Lasca Laboratorios
Administração: Injeção subcutânea semanal nas regiões do abdômen, coxa ou parte superior do braço.

Armazenar sob refrigeração entre 2°C e 8°C, ao abrigo da luz.
Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/gluconex-7-5mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'gluconex', 'lasca', 'peptideo']
),
(
  'Gluconex Tirzepatida 10mg',
  'gluconex-tirzepatida-10mg',
  'Tirzepatida 10mg/0,67mL — Caixa com 4 seringas pré-preenchidas com dispositivo de segurança. Dose avançada.',
  'Gluconex é uma solução injetável subcutânea de tirzepatida desenvolvida pela Lasca Laboratorios, indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Cada seringa contém tirzepatida 10,00 mg em 0,67 mL de solução injetável.

Mecanismo de ação: Gluconex atua como agonista duplo dos receptores GLP-1 e GIP — dois hormônios naturais responsáveis pela regulação do apetite e do metabolismo da glicose — proporcionando:
• Redução significativa do apetite e da ingestão calórica
• Melhora da sensibilidade à insulina e controle glicêmico
• Perda de peso sustentada e clinicamente comprovada

Apresentação: Caixa com 4 seringas pré-preenchidas de 0,67 mL com dispositivo de segurança — 10mg
Fabricante: Lasca Laboratorios
Administração: Injeção subcutânea semanal nas regiões do abdômen, coxa ou parte superior do braço.

Armazenar sob refrigeração entre 2°C e 8°C, ao abrigo da luz.
Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/gluconex-10mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'gluconex', 'lasca', 'peptideo']
),
(
  'Gluconex Tirzepatida 12,5mg',
  'gluconex-tirzepatida-12-5mg',
  'Tirzepatida 12,5mg/0,83mL — Caixa com 4 seringas pré-preenchidas com dispositivo de segurança. Dose de manutenção.',
  'Gluconex é uma solução injetável subcutânea de tirzepatida desenvolvida pela Lasca Laboratorios, indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Cada seringa contém tirzepatida 12,50 mg em 0,83 mL de solução injetável.

Mecanismo de ação: Gluconex atua como agonista duplo dos receptores GLP-1 e GIP — dois hormônios naturais responsáveis pela regulação do apetite e do metabolismo da glicose — proporcionando:
• Redução significativa do apetite e da ingestão calórica
• Melhora da sensibilidade à insulina e controle glicêmico
• Perda de peso sustentada e clinicamente comprovada

Apresentação: Caixa com 4 seringas pré-preenchidas de 0,83 mL com dispositivo de segurança — 12,5mg
Fabricante: Lasca Laboratorios
Administração: Injeção subcutânea semanal nas regiões do abdômen, coxa ou parte superior do braço.

Armazenar sob refrigeração entre 2°C e 8°C, ao abrigo da luz.
Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/gluconex-12-5mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'gluconex', 'lasca', 'peptideo']
),
(
  'Gluconex Tirzepatida 15mg',
  'gluconex-tirzepatida-15mg',
  'Tirzepatida 15mg/1,00mL — Caixa com 4 seringas pré-preenchidas com dispositivo de segurança. Dose máxima.',
  'Gluconex é uma solução injetável subcutânea de tirzepatida desenvolvida pela Lasca Laboratorios, indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Cada seringa contém tirzepatida 15,00 mg em 1,00 mL de solução injetável.

Mecanismo de ação: Gluconex atua como agonista duplo dos receptores GLP-1 e GIP — dois hormônios naturais responsáveis pela regulação do apetite e do metabolismo da glicose — proporcionando:
• Redução significativa do apetite e da ingestão calórica
• Melhora da sensibilidade à insulina e controle glicêmico
• Perda de peso sustentada e clinicamente comprovada

Apresentação: Caixa com 4 seringas pré-preenchidas de 1,00 mL com dispositivo de segurança — 15mg
Fabricante: Lasca Laboratorios
Administração: Injeção subcutânea semanal nas regiões do abdômen, coxa ou parte superior do braço.

Armazenar sob refrigeração entre 2°C e 8°C, ao abrigo da luz.
Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/gluconex-15mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'gluconex', 'lasca', 'peptideo']
),
(
  'Gluconex Tirzepatida 15mg — Kit 4 Vials',
  'gluconex-tirzepatida-15mg-vial',
  'Tirzepatida 15mg/1,00mL — Caixa com 4 frascos vials de solução injetável.',
  'Gluconex é uma solução injetável subcutânea de tirzepatida desenvolvida pela Lasca Laboratorios, indicada para o tratamento de obesidade, sobrepeso e diabetes tipo 2.

Cada frasco contém tirzepatida 15,00 mg em 1,00 mL de solução injetável.

Mecanismo de ação: Gluconex atua como agonista duplo dos receptores GLP-1 e GIP — dois hormônios naturais responsáveis pela regulação do apetite e do metabolismo da glicose — proporcionando:
• Redução significativa do apetite e da ingestão calórica
• Melhora da sensibilidade à insulina e controle glicêmico
• Perda de peso sustentada e clinicamente comprovada

Apresentação: Caixa com 4 frascos vials de 1,00 mL de solução injetável — 15mg
Fabricante: Lasca Laboratorios
Administração: Injeção subcutânea semanal nas regiões do abdômen, coxa ou parte superior do braço.

Armazenar sob refrigeração entre 2°C e 8°C, ao abrigo da luz.
Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/gluconex-15mg-vial.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'gluconex', 'lasca', 'vial', 'peptideo']
)
ON CONFLICT (slug) DO NOTHING;

-- Associa a marca Gluconex e a subcategoria peptideos-gluconex aos produtos
UPDATE products
SET
  brand_id    = (SELECT id FROM brands WHERE slug = 'gluconex'),
  category_id = (SELECT id FROM categories WHERE slug = 'peptideos-gluconex')
WHERE slug IN (
  'gluconex-tirzepatida-2-5mg',
  'gluconex-tirzepatida-5mg',
  'gluconex-tirzepatida-7-5mg',
  'gluconex-tirzepatida-10mg',
  'gluconex-tirzepatida-12-5mg',
  'gluconex-tirzepatida-15mg',
  'gluconex-tirzepatida-15mg-vial'
);
