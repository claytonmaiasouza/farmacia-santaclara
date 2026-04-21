-- =============================================
-- Tirzepatide ZPHC — Inserção de produtos
-- Execute no SQL Editor do Supabase
-- =============================================

-- Garante que a marca ZPHC existe
INSERT INTO brands (name, slug, active)
VALUES ('ZPHC', 'zphc', true)
ON CONFLICT (slug) DO NOTHING;

-- Inserção dos produtos
INSERT INTO products (name, slug, short_description, description, price, original_price, stock, min_stock, image_url, active, requires_prescription, tags)
VALUES
(
  'Tirze ZPHC 15mg — 1 Vial',
  'zphc-tirze-15mg',
  'Tirzepatida 15mg — 1 vial liofilizado para reconstituição. ZPHC.',
  'Tirze da ZPHC é uma tirzepatida liofilizada de alta pureza para uso injetável subcutâneo, indicada para controle de peso e tratamento de diabetes tipo 2.

Cada vial contém 15mg de tirzepatida liofilizada para reconstituição com água bacteriostática.

Mecanismo de ação: Agonista duplo dos receptores GLP-1 e GIP, atuando em duas vias hormonais simultaneamente para:
• Supressão do apetite e redução da ingestão calórica
• Melhora da sensibilidade à insulina e controle da glicemia
• Perda de peso expressiva e sustentada

Apresentação: 1 vial × 15mg liofilizado
Fabricante: ZPHC (Zhengzhou Pharmaceutical Co.)
Administração: Injeção subcutânea semanal após reconstituição, nas regiões do abdômen, coxa ou braço.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/zphc-tirze-15mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'zphc', 'tirze', 'peptideo']
),
(
  'Tirze ZPHC 25mg — Kit 5 Vials (5mg cada)',
  'zphc-tirze-25mg',
  'Tirzepatida 25mg — Kit com 5 vials de 5mg cada. Tratamento de 5 semanas.',
  'Tirze da ZPHC é uma tirzepatida liofilizada de alta pureza para uso injetável subcutâneo, indicada para controle de peso e tratamento de diabetes tipo 2.

Kit com 5 vials contendo 5mg de tirzepatida cada (total 25mg).

Mecanismo de ação: Agonista duplo dos receptores GLP-1 e GIP, atuando em duas vias hormonais simultaneamente para:
• Supressão do apetite e redução da ingestão calórica
• Melhora da sensibilidade à insulina e controle da glicemia
• Perda de peso expressiva e sustentada

Apresentação: 5 vials × 5mg liofilizado (total 25mg)
Fabricante: ZPHC (Zhengzhou Pharmaceutical Co.)
Administração: Injeção subcutânea semanal após reconstituição, nas regiões do abdômen, coxa ou braço.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/zphc-tirze-25mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'zphc', 'tirze', 'kit', 'peptideo']
),
(
  'Tirze ZPHC 37,5mg — Kit 5 Vials (7,5mg cada)',
  'zphc-tirze-37-5mg',
  'Tirzepatida 37,5mg — Kit com 5 vials de 7,5mg cada. Tratamento de 5 semanas.',
  'Tirze da ZPHC é uma tirzepatida liofilizada de alta pureza para uso injetável subcutâneo, indicada para controle de peso e tratamento de diabetes tipo 2.

Kit com 5 vials contendo 7,5mg de tirzepatida cada (total 37,5mg).

Mecanismo de ação: Agonista duplo dos receptores GLP-1 e GIP, atuando em duas vias hormonais simultaneamente para:
• Supressão do apetite e redução da ingestão calórica
• Melhora da sensibilidade à insulina e controle da glicemia
• Perda de peso expressiva e sustentada

Apresentação: 5 vials × 7,5mg liofilizado (total 37,5mg)
Fabricante: ZPHC (Zhengzhou Pharmaceutical Co.)
Administração: Injeção subcutânea semanal após reconstituição, nas regiões do abdômen, coxa ou braço.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/zphc-tirze-37-5mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'zphc', 'tirze', 'kit', 'peptideo']
),
(
  'Tirze ZPHC 50mg — Kit 5 Vials (10mg cada)',
  'zphc-tirze-50mg',
  'Tirzepatida 50mg — Kit com 5 vials de 10mg cada. Tratamento de 5 semanas.',
  'Tirze da ZPHC é uma tirzepatida liofilizada de alta pureza para uso injetável subcutâneo, indicada para controle de peso e tratamento de diabetes tipo 2.

Kit com 5 vials contendo 10mg de tirzepatida cada (total 50mg).

Mecanismo de ação: Agonista duplo dos receptores GLP-1 e GIP, atuando em duas vias hormonais simultaneamente para:
• Supressão do apetite e redução da ingestão calórica
• Melhora da sensibilidade à insulina e controle da glicemia
• Perda de peso expressiva e sustentada

Apresentação: 5 vials × 10mg liofilizado (total 50mg)
Fabricante: ZPHC (Zhengzhou Pharmaceutical Co.)
Administração: Injeção subcutânea semanal após reconstituição, nas regiões do abdômen, coxa ou braço.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/zphc-tirze-50mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'zphc', 'tirze', 'kit', 'peptideo']
),
(
  'Tirze ZPHC 150mg — Kit 5 Vials (30mg cada)',
  'zphc-tirze-150mg',
  'Tirzepatida 150mg — Kit com 5 vials de 30mg cada. Tratamento de 5 semanas em dose alta.',
  'Tirze da ZPHC é uma tirzepatida liofilizada de alta pureza para uso injetável subcutâneo, indicada para controle de peso e tratamento de diabetes tipo 2.

Kit com 5 vials contendo 30mg de tirzepatida cada (total 150mg).

Mecanismo de ação: Agonista duplo dos receptores GLP-1 e GIP, atuando em duas vias hormonais simultaneamente para:
• Supressão do apetite e redução da ingestão calórica
• Melhora da sensibilidade à insulina e controle da glicemia
• Perda de peso expressiva e sustentada

Apresentação: 5 vials × 30mg liofilizado (total 150mg)
Fabricante: ZPHC (Zhengzhou Pharmaceutical Co.)
Administração: Injeção subcutânea semanal após reconstituição, nas regiões do abdômen, coxa ou braço.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/zphc-tirze-150mg.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'zphc', 'tirze', 'kit', 'peptideo']
),
(
  'Tirze ZPHC 30mg — Caneta Pré-misturada',
  'zphc-tirze-30mg-pen',
  'Tirzepatida 30mg — Caneta premixed pronta para uso. Sem necessidade de reconstituição.',
  'Tirze Pen da ZPHC é a versão em caneta pré-misturada de tirzepatida, pronta para uso, sem necessidade de reconstituição com água bacteriostática.

Cada caneta contém 30mg de tirzepatida em solução injetável pronta.

Mecanismo de ação: Agonista duplo dos receptores GLP-1 e GIP, atuando em duas vias hormonais simultaneamente para:
• Supressão do apetite e redução da ingestão calórica
• Melhora da sensibilidade à insulina e controle da glicemia
• Perda de peso expressiva e sustentada

Apresentação: Caneta premixed 30mg — solução pronta para injeção
Fabricante: ZPHC (Zhengzhou Pharmaceutical Co.)
Administração: Injeção subcutânea semanal nas regiões do abdômen, coxa ou braço.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/zphc-tirze-30mg-pen.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'zphc', 'tirze', 'caneta', 'pen', 'peptideo']
),
(
  'Tirze ZPHC 75mg — Caneta Dual Cartridge',
  'zphc-tirze-75mg-pen',
  'Tirzepatida 75mg — Caneta dual cartridge de alta capacidade para uso prolongado.',
  'Tirze 75mg Dual Cartridge Pen da ZPHC é uma caneta injetável de alta capacidade com cartucho duplo de tirzepatida, oferecendo praticidade para tratamentos de maior duração.

Cada caneta contém 75mg de tirzepatida em cartucho duplo.

Mecanismo de ação: Agonista duplo dos receptores GLP-1 e GIP, atuando em duas vias hormonais simultaneamente para:
• Supressão do apetite e redução da ingestão calórica
• Melhora da sensibilidade à insulina e controle da glicemia
• Perda de peso expressiva e sustentada

Apresentação: Caneta dual cartridge 75mg
Fabricante: ZPHC (Zhengzhou Pharmaceutical Co.)
Administração: Injeção subcutânea semanal nas regiões do abdômen, coxa ou braço.

Uso sob prescrição e acompanhamento médico obrigatório.',
  0.00, null, 10, 3,
  '/images/products/zphc-tirze-75mg-pen.webp',
  true, true,
  ARRAY['tirzepatida', 'glp-1', 'gip', 'emagrecimento', 'diabetes', 'zphc', 'tirze', 'caneta', 'pen', 'peptideo']
)
ON CONFLICT (slug) DO NOTHING;

-- Associa a marca ZPHC e a subcategoria peptideos-tirzepatide-zphc aos produtos
UPDATE products
SET
  brand_id    = (SELECT id FROM brands WHERE slug = 'zphc'),
  category_id = (SELECT id FROM categories WHERE slug = 'peptideos-tirzepatide-zphc')
WHERE slug IN (
  'zphc-tirze-15mg',
  'zphc-tirze-25mg',
  'zphc-tirze-37-5mg',
  'zphc-tirze-50mg',
  'zphc-tirze-150mg',
  'zphc-tirze-30mg-pen',
  'zphc-tirze-75mg-pen'
);
