-- =============================================
-- LanderGold — Farmácia Santa Clara
-- =============================================

INSERT INTO brands (name, slug, active)
VALUES ('LanderGold', 'landergold', true)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- INJETÁVEIS (categoria: Hormônios)
-- =============================================

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Boldenona Undecilenato 250mg 10ml', 'landergold-boldenona-250mg-10ml',
  'Esteroide anabólico injetável para ganhos musculares de qualidade com baixa retenção hídrica.',
  'Boldenona Undecilenato é um esteroide anabólico injetável amplamente utilizado para ganhos musculares de alta qualidade com baixa retenção de água. Índice anabólico: 100% | Índice androgênico: 50%. Meia-vida: 8-10 dias. Dosagem recomendada: 250-500mg por semana. Retenção hídrica: Baixa. Fabricante: LanderGold. Uso sob prescrição médica.',
  200.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['boldenona','undecilenato','injetável','anabolizante','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-boldenona-250mg-10ml');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Cipionato de Testosterona Testoland Depot 200mg 10ml', 'landergold-cipionato-testosterona-200mg-10ml',
  'Cipionato de testosterona para ganhos de massa muscular, força e desempenho físico.',
  'Testoland Depot (Cipionato de Testosterona) é indicado para ganhos expressivos de massa muscular, aumento de força e melhora do desempenho físico. Fórmula: Enantato de Testosterona (C21H30O3). Índice anabólico: 100% | Índice androgênico: 100%. Meia-vida: 4-5 dias. Dosagem: 200-500mg por semana. Retenção hídrica: Moderada. Fabricante: LanderGold. Uso sob prescrição médica.',
  180.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['cipionato','testosterona','testoland','injetável','anabolizante','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-cipionato-testosterona-200mg-10ml');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Decaland Depot Nandrolona Decanoato 200mg 10ml', 'landergold-decaland-depot-200mg-10ml',
  'Nandrolona decanoato para ganhos de massa muscular limpa e aumento de força.',
  'Decaland Depot (Nandrolona Decanoato) é um dos esteroides injetáveis mais utilizados para ganhos de massa muscular magra e aumento de força. Fórmula: 19-Nortestosterona Decanoato (C28H44O3). Índice anabólico: 125% | Índice androgênico: 37%. Meia-vida: 7-10 dias. Dosagem: 200-600mg por semana. Retenção hídrica: Moderada. Fabricante: LanderGold. Uso sob prescrição médica.',
  200.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['nandrolona','decanoato','decaland','deca','injetável','anabolizante','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-decaland-depot-200mg-10ml');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Durateston Ampola 250mg 1ml', 'landergold-durateston-ampola-250mg-1ml',
  'Blend de ésteres de testosterona em ampola de 1ml. Ação rápida e prolongada.',
  'Durateston é um blend de ésteres de testosterona (propionato, fenilpropionato, isocaproato e decanoato) em apresentação de ampola de 1ml/250mg. Índice anabólico: 100% | Índice androgênico: 100%. Meia-vida: 7-10 dias. Dosagem: 250-500mg por semana. Retenção hídrica: Moderada. Fabricante: LanderGold. Uso sob prescrição médica.',
  28.00, null, 50,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['durateston','testosterona','blend','sustanon','ampola','injetável','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-durateston-ampola-250mg-1ml');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Durateston Plus 250mg 10ml', 'landergold-durateston-plus-250mg-10ml',
  'Blend de testosterona com ésteres rápidos e de longa ação em frasco de 10ml.',
  'Durateston Plus é um blend de testosterona com ésteres de ação rápida e prolongada (propionato, fenilpropionato, isocaproato e decanoato) em frasco de 10ml. Índice anabólico: 100% | Índice androgênico: 100%. Meia-vida: Ação dual rápida e prolongada. Dosagem: 250-500mg por semana. Retenção hídrica: Moderada. Fabricante: LanderGold. Uso sob prescrição médica.',
  200.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['durateston','testosterona','blend','sustanon','injetável','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-durateston-plus-250mg-10ml');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Enantato de Testosterona Testenat Depot 250mg 10ml', 'landergold-enantato-testosterona-250mg-10ml',
  'Enantato de testosterona para ganhos expressivos de massa muscular e força.',
  'Testenat Depot (Enantato de Testosterona) é indicado para ganhos significativos de massa muscular e melhora da força. Fórmula: 17β-Hidroxiandrost-4-en-3-ona enantato (C21H30O3). Índice anabólico: 100% | Índice androgênico: 100%. Meia-vida: 4-5 dias. Dosagem: 250-500mg por semana. Retenção hídrica: Moderada. Fabricante: LanderGold. Uso sob prescrição médica.',
  200.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['enantato','testosterona','testenat','injetável','anabolizante','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-enantato-testosterona-250mg-10ml');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'HCG 5000ui com Diluente', 'landergold-hcg-5000ui',
  'Gonadotrofina coriônica humana 5000ui com diluente incluso. Estimula produção de testosterona.',
  'HCG (Gonadotrofina Coriônica Humana) 5000ui com diluente incluso. Indicado para estimulação da produção endógena de testosterona em homens. Amplamente utilizado em terapia pós-ciclo (TPC). Dosagem: 5000 UI conforme orientação médica. Fabricante: LanderGold. Uso sob prescrição médica.',
  250.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['hcg','gonadotrofina','tpc','testosterona','injetável','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-hcg-5000ui');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Landertropin Hormônio do Crescimento 100UI', 'landergold-landertropin-hgh-100ui',
  'Hormônio do Crescimento Humano (HGH) 100UI — 10 frascos de 10UI. Para crescimento muscular, recuperação e definição.',
  'Landertropin é o Hormônio do Crescimento Humano (HGH) da LanderGold, apresentado em caixa com 10 frascos de 10UI cada (100UI total). Indicado para ganhos de massa muscular magra, redução de gordura corporal, melhora da densidade óssea e qualidade da pele. Dosagem recomendada: 2-4 UI diárias. Fabricante: LanderGold. Uso sob prescrição médica.',
  2200.00, null, 5,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, true, true, true,
  ARRAY['hgh','hormônio do crescimento','somatropina','landertropin','injetável','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-landertropin-hgh-100ui');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Masteron Drostanolona Propionato 100mg 10ml', 'landergold-masteron-drostanolona-100mg-10ml',
  'Drostanolona propionato para ganhos musculares e definição. Baixa retenção hídrica.',
  'Masteron (Drostanolona Propionato) é um esteroide injetável para ganhos de massa muscular com excelente definição. Fórmula: 17α-Hidroxi-5α-androstan-3-ona propionato (C20H30O2). Índice anabólico: 320% | Índice androgênico: 30%. Meia-vida: 2-3 dias. Dosagem: 100-300mg por semana. Retenção hídrica: Baixa. Fabricante: LanderGold. Uso sob prescrição médica.',
  220.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['masteron','drostanolona','propionato','injetável','anabolizante','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-masteron-drostanolona-100mg-10ml');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'NPP Nandrolona Fenilpropionato 100mg 10ml', 'landergold-npp-nandrolona-100mg-10ml',
  'Nandrolona fenilpropionato para ganhos de massa muscular e força com baixa retenção.',
  'NPP (Nandrolona Fenilpropionato) é um esteroide injetável para ganhos de massa muscular e força com mínimo acúmulo de gordura. Fórmula: C25H34O3. Meia-vida: 5 dias. Dosagem: 200-600mg por semana. Retenção hídrica: Baixa. Benefícios: Ganhos musculares limpos com mínimo acúmulo de gordura. Fabricante: LanderGold. Uso sob prescrição médica.',
  200.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['nandrolona','fenilpropionato','npp','injetável','anabolizante','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-npp-nandrolona-100mg-10ml');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Primobolan Metenolona Enantato 100mg 10ml', 'landergold-primobolan-metenolona-enantato-100mg-10ml',
  'Metenolona enantato para definição muscular e ganhos de força com mínima retenção hídrica.',
  'Primobolan (Metenolona Enantato) é um esteroide injetável indicado para definição muscular e ganhos de força com mínima retenção hídrica. Fórmula: C20H30O2. Índice anabólico: 88% | Índice androgênico: 44%. Meia-vida: 8-10 dias. Dosagem: 100-200mg por semana. Retenção hídrica: Baixa. Ideal para ciclos de definição. Fabricante: LanderGold. Uso sob prescrição médica.',
  340.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['primobolan','metenolona','enantato','injetável','anabolizante','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-primobolan-metenolona-enantato-100mg-10ml');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Propionato de Testosterona 100mg 10ml', 'landergold-propionato-testosterona-100mg-10ml',
  'Testosterona propionato de ação rápida para ganhos musculares e força.',
  'Propionato de Testosterona é um éster de ação rápida indicado para ganhos musculares e força de forma acelerada. Fórmula: C21H30O3. Índice anabólico: 100% | Índice androgênico: 100%. Meia-vida: 1-2 dias. Dosagem: 100-300mg por semana. Retenção hídrica: Baixa. Fabricante: LanderGold. Uso sob prescrição médica.',
  180.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['propionato','testosterona','injetável','anabolizante','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-propionato-testosterona-100mg-10ml');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Stanzoland Depot Stanozolol 50mg 30ml', 'landergold-stanzoland-depot-50mg-30ml',
  'Stanozolol injetável para definição muscular e ganhos de força. Ciclos de cutting.',
  'Stanzoland Depot (Stanozolol Injetável) é indicado para definição muscular e ganhos de força em ciclos de cutting. Fórmula: C21H32N2O. Índice anabólico: 320% | Índice androgênico: 30%. Meia-vida: 7-9 dias. Dosagem: 50-100mg por semana. Retenção hídrica: Baixa. Resultado: Musculatura seca e definida. Fabricante: LanderGold. Uso sob prescrição médica.',
  170.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['stanozolol','winstrol','stanzoland','injetável','cutting','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-stanzoland-depot-50mg-30ml');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Testoland Depot 200mg 2ml', 'landergold-testoland-depot-200mg-2ml',
  'Enantato de testosterona 200mg em apresentação de 3 frascos de 2ml. Ganhos consistentes.',
  'Testoland Depot (Enantato de Testosterona) 200mg em apresentação com 3 frascos de 2ml cada. Indicado para ganhos consistentes de massa muscular e força. Fórmula: C21H30O3. Índice anabólico: 100% | Índice androgênico: 100%. Meia-vida: 4-5 dias. Dosagem: 200-500mg por semana. Retenção hídrica: Moderada. Fabricante: LanderGold. Uso sob prescrição médica.',
  85.00, null, 20,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['enantato','testosterona','testoland','injetável','anabolizante','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-testoland-depot-200mg-2ml');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Trembolona Acetato 100mg 10ml', 'landergold-trembolona-acetato-100mg-10ml',
  'Trembolona acetato de ação rápida para ganhos de massa muscular magra. Potência máxima.',
  'Trembolona Acetato é um dos esteroides mais potentes disponíveis, indicado para ganhos rápidos de massa muscular magra. Fórmula: 17β-Hidroxiestra-4,9,11-trien-3-ona acetato (C20H28O3). Índice anabólico: 500% | Índice androgênico: 500%. Meia-vida: 2-3 dias. Dosagem: 100-300mg por semana. Retenção hídrica: Baixa. Fabricante: LanderGold. Uso sob prescrição médica.',
  230.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['trembolona','acetato','tren','injetável','anabolizante','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-trembolona-acetato-100mg-10ml');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Trembolona Enantato 200mg 10ml', 'landergold-trembolona-enantato-200mg-10ml',
  'Um dos esteroides anabólicos mais potentes para ganhos de massa e força.',
  'Trembolona Enantato é considerada uma das mais potentes moléculas anabólicas para ganhos de massa muscular e força. Fórmula: 17β-Hidroxiestra-4,9,11-trien-3-ona enantato (C20H28O3). Índice anabólico: 500% | Índice androgênico: 500%. Meia-vida: 5-7 dias. Dosagem: 200-600mg por semana. Retenção hídrica: Baixa. Fabricante: LanderGold. Uso sob prescrição médica.',
  250.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['trembolona','enantato','tren','injetável','anabolizante','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-trembolona-enantato-200mg-10ml');

-- =============================================
-- ORAIS (categoria: Suplementos)
-- =============================================

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Clembuterol Clorhidrato 0,04mg 50 Comprimidos', 'landergold-clembuterol-004mg-50comp',
  'Termogênico para queima de gordura e ciclos de cutting. 50 comprimidos de 0,04mg.',
  'Clembuterol Clorhidrato é um agente termogênico agonista beta-2 indicado para queima de gordura e ciclos de definição. Apresentação: 50 comprimidos de 0,04mg. Dosagem: 1 comprimido (0,04mg) diário, ajustável conforme orientação médica. Benefícios: Aceleração do metabolismo, redução de gordura corporal, aumento de energia. Fabricante: LanderGold. Uso sob prescrição médica.',
  140.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['clembuterol','termogênico','cutting','queima de gordura','oral','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-clembuterol-004mg-50comp');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Dianabol Metandrostenolona 10mg 100 Comprimidos', 'landergold-dianabol-10mg-100comp',
  'Metandrostenolona para ganhos rápidos de massa muscular e força. 100 comprimidos de 10mg.',
  'Dianabol (Metandrostenolona) é um dos esteroides orais mais conhecidos para ganhos rápidos de massa muscular e força. Apresentação: 100 comprimidos de 10mg. Dosagem: 20-50mg diários. Ciclo típico: 4-6 semanas. Benefícios: Rápido aumento de volume muscular, retenção de nitrogênio, síntese proteica aumentada. Fabricante: LanderGold. Uso sob prescrição médica.',
  125.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['dianabol','metandrostenolona','dbol','oral','anabolizante','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-dianabol-10mg-100comp');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Oxitoland Oximetolona 50mg 20 Comprimidos', 'landergold-oxitoland-50mg-20comp',
  'Oximetolona (Hemogenin/Anadrol) para ganhos rápidos de massa muscular. 20 comprimidos de 50mg.',
  'Oxitoland (Oximetolona) é um potente esteroide oral para ganhos rápidos de massa muscular e força. Apresentação: 20 comprimidos de 50mg. Dosagem: 50-100mg diários. Ciclo: máximo 4-6 semanas. Benefícios: Ganhos expressivos de volume, retenção de nitrogênio, síntese proteica. Fabricante: LanderGold. Uso sob prescrição médica.',
  125.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['oximetolona','hemogenin','anadrol','oxitoland','oral','anabolizante','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-oxitoland-50mg-20comp');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Oxandroland Oxandrolona 5mg 100 Comprimidos', 'landergold-oxandroland-5mg-100comp',
  'Oxandrolona 5mg — esteroide oral suave para força e definição muscular. 100 comprimidos.',
  'Oxandroland (Oxandrolona) 5mg é um esteroide oral de baixo impacto androgênico, ideal para ganhos de força e definição. Apresentação: 100 comprimidos de 5mg. Dosagem homens: 10-50mg/dia | Mulheres: 5-10mg/dia. Benefícios: Retenção de nitrogênio, ganhos musculares limpos, baixo impacto hepático, mínima retenção hídrica. Fabricante: LanderGold. Uso sob prescrição médica.',
  290.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['oxandrolona','anavar','oxandroland','oral','cutting','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-oxandroland-5mg-100comp');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Oxandroland Oxandrolona 10mg 50 Comprimidos', 'landergold-oxandroland-10mg-50comp',
  'Oxandrolona 10mg — esteroide oral suave para força e definição muscular. 50 comprimidos.',
  'Oxandroland (Oxandrolona) 10mg é um esteroide oral de baixo impacto androgênico para ganhos de força e definição muscular. Apresentação: 50 comprimidos de 10mg. Dosagem homens: 10-20mg/dia | Mulheres: 5-10mg/dia. Benefícios: Ganhos musculares limpos, mínima retenção hídrica, ideal para fases de definição. Fabricante: LanderGold. Uso sob prescrição médica.',
  290.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['oxandrolona','anavar','oxandroland','oral','cutting','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-oxandroland-10mg-50comp');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Primobolan Oral Metenolona Acetato 25mg 30 Comprimidos', 'landergold-primobolan-oral-25mg-30comp',
  'Metenolona acetato oral para definição muscular e força. 30 comprimidos de 25mg.',
  'Primobolan Oral (Metenolona Acetato) é um esteroide oral premium para definição muscular e ganhos de força com aparência seca e vascularizada. Fórmula: C20H30O2. Índice anabólico: 88% | Índice androgênico: 44%. Apresentação: 30 comprimidos de 25mg. Dosagem: 25-50mg diários. Retenção hídrica: Baixa. Fabricante: LanderGold. Uso sob prescrição médica.',
  450.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['primobolan','metenolona','acetato','oral','cutting','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-primobolan-oral-25mg-30comp');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Proviron Mesterolona Androlic 25mg 20 Comprimidos', 'landergold-proviron-androlic-25mg-20comp',
  'Mesterolona para aumento da testosterona livre e definição muscular. 20 comprimidos de 25mg.',
  'Androlic (Mesterolona/Proviron) é indicado para aumento dos níveis de testosterona livre e definição muscular. Apresentação: 20 comprimidos de 25mg. Dosagem: 25-100mg diários. Ciclo: 4-6 semanas. Benefícios: Aumento da testosterona livre, síntese proteica, definição muscular. Fabricante: LanderGold. Uso sob prescrição médica.',
  135.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['proviron','mesterolona','androlic','oral','tpc','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-proviron-androlic-25mg-20comp');

INSERT INTO products (name, slug, short_description, description, price, original_price, stock, category_id, brand_id, image_url, featured, active, requires_prescription, tags)
SELECT 'Stanozoland Stanozolol Oral 10mg 100 Comprimidos', 'landergold-stanozoland-10mg-100comp',
  'Stanozolol oral (Winstrol) para força, definição e redução de gordura. 100 comprimidos de 10mg.',
  'Stanozoland (Stanozolol Oral) é indicado para ganhos de força, definição muscular e redução de gordura em ciclos de cutting. Princípio ativo: Stanozolol (10mg por comprimido). Apresentação: 100 comprimidos. Dosagem homens: 10-50mg/dia | Mulheres: 5-10mg/dia. Retenção hídrica: Nenhuma. Benefícios: Definição muscular, vascularidade, ganhos de massa magra. Fabricante: LanderGold. Uso sob prescrição médica.',
  125.00, null, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  (SELECT id FROM brands WHERE slug = 'landergold'),
  null, false, true, true,
  ARRAY['stanozolol','winstrol','stanozoland','oral','cutting','landergold']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'landergold-stanozoland-10mg-100comp');
