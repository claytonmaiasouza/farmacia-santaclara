-- =============================================
-- Cooper Pharma — Farmácia Santa Clara
-- =============================================

INSERT INTO brands (name, slug, active)
VALUES ('Cooper Pharma', 'cooperpharma', true)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, parent_id, active, sort_order)
VALUES ('Cooper Pharma', 'hormonios-cooperpharma',
  (SELECT id FROM categories WHERE slug = 'hormonios'), true, 20)
ON CONFLICT (slug) DO NOTHING;

-- 1. Anastrozole Tablet 1mg (ANAZBOL)
INSERT INTO products (name, slug, short_description, description, price, stock, category_id, brand_id, image_url, active, requires_prescription, tags)
SELECT 'Anastrozol 1mg — ANAZBOL (Cooper Pharma)', 'cooperpharma-anazbol-anastrozol-1mg',
  'Inibidor de aromatase potente e seletivo. 1mg por comprimido. Marca: ANAZBOL.',
  'ANAZBOL (Anastrozol 1mg) é um inibidor de aromatase não-esteroidal potente e altamente seletivo. Reduz os níveis de estradiol em mais de 80% na dose padrão. Composição: Anastrozol 1mg por comprimido. Apresentação: 5 blisteres com 10 comprimidos cada. Indicações: Tratamento do câncer de mama avançado em mulheres pós-menopáusicas; terapia adjuvante para câncer de mama invasivo receptor hormonal positivo. Fabricante: Cooper Pharma. Uso sob prescrição médica.',
  200.00, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios-cooperpharma'),
  (SELECT id FROM brands WHERE slug = 'cooperpharma'),
  'https://cooperpharma.com/images/products/anazbol.jpg',
  true, true,
  ARRAY['anastrozol','aromatase','anazbol','anti-estrogênico','tpc','cooperpharma']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'cooperpharma-anazbol-anastrozol-1mg');

-- 2. Ecdysterone Tablet 10mg (CDYSTERON)
INSERT INTO products (name, slug, short_description, description, price, stock, category_id, brand_id, image_url, active, requires_prescription, tags)
SELECT 'Ecdysterona 10mg — CDYSTERON (Cooper Pharma)', 'cooperpharma-cdysteron-ecdysterona-10mg',
  'Suplemento anabólico natural para crescimento muscular, força e resistência. 10mg por comprimido.',
  'CDYSTERON (Ecdysterona 10mg) é um suplemento anabólico natural projetado para apoiar o crescimento muscular, força e resistência, promovendo a síntese proteica e retenção de nitrogênio sem efeitos colaterais significativos. Composição: Ecdysterona 10mg por comprimido. Indicado para atletas e praticantes de atividade física que buscam melhora de desempenho e desenvolvimento muscular. Fabricante: Cooper Pharma.',
  200.00, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios-cooperpharma'),
  (SELECT id FROM brands WHERE slug = 'cooperpharma'),
  'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=600',
  true, false,
  ARRAY['ecdysterona','ecdysterone','cdysteron','anabólico natural','cooperpharma']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'cooperpharma-cdysteron-ecdysterona-10mg');

-- 3. HGH Somatropin 10IU / 12IU
INSERT INTO products (name, slug, short_description, description, price, stock, category_id, brand_id, image_url, active, requires_prescription, tags)
SELECT 'HGH Somatropina 10UI/12UI (Cooper Pharma)', 'cooperpharma-hgh-somatropina',
  'Hormônio do Crescimento Humano (HGH) liofilizado. Disponível em 10UI (3,33mg) e 12UI (4mg) por frasco.',
  'HGH (Somatropina) da Cooper Pharma é um pó liofilizado estéril e apirógeno terapeuticamente equivalente ao hormônio do crescimento humano de ocorrência natural. Composição: Somatropina 10 UI/3,33mg ou 12 UI/4mg por frasco. Apresentação: Pó liofilizado para injeção subcutânea ou intramuscular após reconstituição. Indicações: Tratamento a longo prazo de falha no crescimento pediátrico por secreção inadequada de hormônio do crescimento; terapia de reposição em adultos com deficiência de GH; redução de massa gorda e aumento de massa magra. Fabricante: Cooper Pharma. Uso sob prescrição médica.',
  200.00, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios-cooperpharma'),
  (SELECT id FROM brands WHERE slug = 'cooperpharma'),
  'https://cooperpharma.com/images/products/HGJ.png',
  true, true,
  ARRAY['hgh','somatropina','hormônio do crescimento','gh','injetável','cooperpharma']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'cooperpharma-hgh-somatropina');

-- 4. HCG 5000IU (COTROPIN)
INSERT INTO products (name, slug, short_description, description, price, stock, category_id, brand_id, image_url, active, requires_prescription, tags)
SELECT 'HCG 5000UI — COTROPIN (Cooper Pharma)', 'cooperpharma-cotropin-hcg-5000ui',
  'Gonadotrofina Coriônica Humana 5000UI. Estimula produção de testosterona. Marca: COTROPIN.',
  'COTROPIN (HCG 5000UI) imita a função do LH hipofisário, estimulando a produção de hormônios esteroides gonadais através da ação nas células de Leydig e no corpo lúteo. Composição: Gonadotrofina Coriônica BP 5000 UI. Apresentação: Injetável (intramuscular e subcutâneo). Indicações: Criptorquidia pré-puberal; Hipogonadismo hipogonadotrópico em homens; Indução da ovulação; Maturação final do folículo em tratamentos de fertilidade e FIV; Estimulação de testosterona em terapia pós-ciclo (TPC). Fabricante: Cooper Pharma. Uso sob prescrição médica.',
  200.00, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios-cooperpharma'),
  (SELECT id FROM brands WHERE slug = 'cooperpharma'),
  'https://cooperpharma.com/images/products/cotropin-5000.png',
  true, true,
  ARRAY['hcg','gonadotrofina','cotropin','tpc','testosterona','injetável','cooperpharma']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'cooperpharma-cotropin-hcg-5000ui');

-- 5. Hydrocortisone 100mg (CORTIS)
INSERT INTO products (name, slug, short_description, description, price, stock, category_id, brand_id, image_url, active, requires_prescription, tags)
SELECT 'Hidrocortisona Injetável 100mg — CORTIS (Cooper Pharma)', 'cooperpharma-cortis-hidrocortisona-100mg',
  'Corticosteroide de ação rápida 100mg. Reduz inflamação e resposta imune. Marca: CORTIS.',
  'CORTIS (Hidrocortisona Injetável 100mg) é um corticosteroide de ação rápida que reduz a resposta imune para aliviar inchaço, vermelhidão e dor. Composição: Hidrocortisona 100mg. Apresentação: Injetável. Indicações: Artrite; Asma; Insuficiência adrenal; Distúrbios alérgicos ou inflamatórios; Condições graves como choque ou crise adrenal. Fabricante: Cooper Pharma. Uso sob prescrição médica.',
  200.00, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios-cooperpharma'),
  (SELECT id FROM brands WHERE slug = 'cooperpharma'),
  'https://images.pexels.com/photos/3683101/pexels-photo-3683101.jpeg?auto=compress&cs=tinysrgb&w=600',
  true, true,
  ARRAY['hidrocortisona','corticosteroide','cortis','anti-inflamatório','injetável','cooperpharma']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'cooperpharma-cortis-hidrocortisona-100mg');

-- 6. Levothyroxine + Liothyronine (BTBOLIC)
INSERT INTO products (name, slug, short_description, description, price, stock, category_id, brand_id, image_url, active, requires_prescription, tags)
SELECT 'T4+T3 Levotiroxina 50mcg + Liotironina 12,5mcg — BTBOLIC (Cooper Pharma)', 'cooperpharma-btbolic-t4-t3',
  'Combinação de hormônios tireoidianos T4 50mcg + T3 12,5mcg. Aumenta taxa metabólica. Marca: BTBOLIC.',
  'BTBOLIC (Levotiroxina 50mcg + Liotironina 12,5mcg) é uma preparação sintética de hormônio tireoidiano que combina T4 e T3 na proporção 4:1, aumentando a taxa metabólica e o consumo de oxigênio nos tecidos. Composição: Levotiroxina (T4) 50mcg + Liotironina (T3) 12,5mcg por comprimido. Apresentação: 5 blisteres com 10 comprimidos cada. Indicações: Reposição para hipotireoidismo; Supressão de TSH em bócios e nódulos tireoidianos; Manejo do câncer de tireoide. Fabricante: Cooper Pharma. Uso sob prescrição médica.',
  200.00, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios-cooperpharma'),
  (SELECT id FROM brands WHERE slug = 'cooperpharma'),
  'https://cooperpharma.com/images/products/bt-bolic.png',
  true, true,
  ARRAY['levotiroxina','liotironina','t3','t4','tireóide','btbolic','cooperpharma']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'cooperpharma-btbolic-t4-t3');

-- 7. Nandrolone Decanoate 50mg
INSERT INTO products (name, slug, short_description, description, price, stock, category_id, brand_id, image_url, active, requires_prescription, tags)
SELECT 'Nandrolona Decanoato Injetável 50mg (Cooper Pharma)', 'cooperpharma-nandrolona-decanoato-50mg',
  'Nandrolona Decanoato 50mg/ml. Esteroide anabólico para anemia renal. Injetável intramuscular.',
  'Nandrolona Decanoato Injetável 50mg da Cooper Pharma é um esteroide anabólico que estimula a resposta hematopoiética em pacientes com anemia relacionada a doença renal, aumentando hemoglobina e massa de glóbulos vermelhos. Composição: Nandrolona Decanoato USP 50mg por ml. Apresentação: Injetável intramuscular, ampolas de 1ml. Indicações: Tratamento da anemia por insuficiência renal. Fabricante: Cooper Pharma. Uso sob prescrição médica.',
  200.00, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios-cooperpharma'),
  (SELECT id FROM brands WHERE slug = 'cooperpharma'),
  'https://cooperpharma.com/images/products/nandrolone.png',
  true, true,
  ARRAY['nandrolona','decanoato','deca','injetável','anabolizante','cooperpharma']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'cooperpharma-nandrolona-decanoato-50mg');

-- 8. Testosterone Phenylpropionate 100mg (POBOLIC-PH)
INSERT INTO products (name, slug, short_description, description, price, stock, category_id, brand_id, image_url, active, requires_prescription, tags)
SELECT 'Testosterona Fenilpropionato 100mg — POBOLIC-PH (Cooper Pharma)', 'cooperpharma-pobolic-testosterona-fenilpropionato-100mg',
  'Testosterona fenilpropionato 100mg/ml em base oleosa. Ação anabólica e androgênica. 10 ampolas de 1ml.',
  'POBOLIC-PH (Testosterona Fenilpropionato USP 100mg/ml) é um injetável de testosterona à base de óleo com éster fenilpropionato, altamente anabólico e androgênico, que estende a atividade da testosterona com aplicação a cada três dias. Composição: Testosterona Fenilpropionato USP 100mg/ml em base oleosa. Apresentação: 10 ampolas de 1ml. Indicações: Ganhos de massa muscular e força em fases de volume. Fabricante: Cooper Pharma. Uso sob prescrição médica.',
  200.00, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios-cooperpharma'),
  (SELECT id FROM brands WHERE slug = 'cooperpharma'),
  'https://images.pexels.com/photos/3683101/pexels-photo-3683101.jpeg?auto=compress&cs=tinysrgb&w=600',
  true, true,
  ARRAY['testosterona','fenilpropionato','pobolic','injetável','anabolizante','cooperpharma']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'cooperpharma-pobolic-testosterona-fenilpropionato-100mg');

-- 9. Tamoxifen Citrate 20mg (NOLVABOLIC)
INSERT INTO products (name, slug, short_description, description, price, stock, category_id, brand_id, image_url, active, requires_prescription, tags)
SELECT 'Tamoxifeno 20mg — NOLVABOLIC (Cooper Pharma)', 'cooperpharma-nolvabolic-tamoxifeno-20mg',
  'Citrato de tamoxifeno 20mg. Agente anti-estrogênico para TPC e tratamento oncológico. Marca: NOLVABOLIC.',
  'NOLVABOLIC (Citrato de Tamoxifeno 20mg) é um agente anti-estrogênico que bloqueia as funções periféricas dos estrogênios nos tecidos-alvo, ligando-se aos receptores de estrogênio e prevenindo a inibição de feedback normal. Composição: Citrato de tamoxifeno 20mg por comprimido. Apresentação: 3 blisteres com 10 comprimidos cada. Indicações: Tratamento paliativo do carcinoma mamário avançado em mulheres pós-menopáusicas; terapia pós-ciclo (TPC). Fabricante: Cooper Pharma. Uso sob prescrição médica.',
  200.00, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios-cooperpharma'),
  (SELECT id FROM brands WHERE slug = 'cooperpharma'),
  'https://cooperpharma.com/images/products/nolvabolic.png',
  true, true,
  ARRAY['tamoxifeno','nolvabolic','anti-estrogênico','tpc','nolvadex','cooperpharma']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'cooperpharma-nolvabolic-tamoxifeno-20mg');

-- 10. Testosterone Undecanoate 1000mg/4ml (TESTOBOLIC)
INSERT INTO products (name, slug, short_description, description, price, stock, category_id, brand_id, image_url, active, requires_prescription, tags)
SELECT 'Testosterona Undecanoato 1000mg/4ml — TESTOBOLIC (Cooper Pharma)', 'cooperpharma-testobolic-testosterona-undecanoato-1000mg',
  'Testosterona undecanoato de longa ação 1000mg/4ml. Reposição hormonal e desempenho. Marca: TESTOBOLIC.',
  'TESTOBOLIC (Testosterona Undecanoato 1000mg/4ml) é uma formulação de testosterona de longa ação projetada para restaurar e manter níveis normais de testosterona, aumentando a síntese proteica para suporte ao desenvolvimento muscular magro e melhora da recuperação. Composição: Undecanoato de Testosterona 1000mg por frasco de 4ml. Apresentação: Frasco injetável de 4ml. Indicações: Terapia de reposição hormonal (TRH) em homens com deficiência de testosterona; suporte ao desempenho físico e vitalidade. Fabricante: Cooper Pharma. Uso sob prescrição médica.',
  200.00, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios-cooperpharma'),
  (SELECT id FROM brands WHERE slug = 'cooperpharma'),
  'https://cooperpharma.com/images/products/testobolic.png',
  true, true,
  ARRAY['testosterona','undecanoato','testobolic','injetável','trt','cooperpharma']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'cooperpharma-testobolic-testosterona-undecanoato-1000mg');

-- 11. Thyroid Liothyronine 25mcg (T3BOLIC)
INSERT INTO products (name, slug, short_description, description, price, stock, category_id, brand_id, image_url, active, requires_prescription, tags)
SELECT 'T3 Liotironina 25mcg — T3BOLIC (Cooper Pharma)', 'cooperpharma-t3bolic-liotironina-25mcg',
  'Liotironina sódica (T3) 25mcg. Hormônio tireoidiano de ação rápida para hipotireoidismo. Marca: T3BOLIC.',
  'T3BOLIC (Liotironina Sódica 25mcg) é um hormônio tireoidiano de ocorrência natural com início de ação rápido (efeitos em poucas horas) e curta duração (desaparecem em 24-48 horas). Composição: Liotironina sódica 25mcg por comprimido. Apresentação: 5 blisteres com 10 comprimidos cada. Indicações: Coma mixedematoso; Deficiência tireoidiana crônica grave; Estados hipotireoideos; Adjuvante na terapia com carbimazol para prevenir hipotireoidismo. Fabricante: Cooper Pharma. Uso sob prescrição médica.',
  200.00, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios-cooperpharma'),
  (SELECT id FROM brands WHERE slug = 'cooperpharma'),
  'https://cooperpharma.com/images/products/t3bolic%20copy.png',
  true, true,
  ARRAY['liotironina','t3','tireóide','t3bolic','hipotireoidismo','cooperpharma']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'cooperpharma-t3bolic-liotironina-25mcg');
