-- =============================================
-- Bayer — Hormônios e Anticoncepcionais
-- Preços convertidos de PYG para BRL (taxa ~1400 PYG/BRL)
-- Fonte de referência: farmacenter.com.py
-- Execute no SQL Editor do Supabase
-- =============================================

-- Garante que a marca Bayer existe
INSERT INTO brands (name, slug, active)
VALUES ('Bayer', 'bayer', true)
ON CONFLICT (slug) DO NOTHING;

-- Garante que a subcategoria anticoncepcionais existe dentro de hormonios
INSERT INTO categories (name, slug, description, parent_id, active, sort_order)
SELECT
  'Anticoncepcionais', 'anticoncepcionais',
  'Anticoncepcionais hormonais orais e injetáveis',
  id, true, 10
FROM categories WHERE slug = 'hormonios'
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- Inserção dos produtos
-- =============================================
INSERT INTO products (
  name, slug, short_description, description,
  price, original_price, stock, min_stock,
  image_url, active, requires_prescription, tags
)
VALUES

-- 1. Microgynon
(
  'Microgynon Cj x 21 Unid',
  'microgynon-cj-x-21-unid',
  'Anticoncepcional oral — Levonorgestrel 150mcg + Etinilestradiol 30mcg — Caixa com 21 comprimidos.',
  'Microgynon é um anticoncepcional oral combinado de baixa dosagem fabricado pela Bayer, indicado para a prevenção de gravidez.

Composição: Levonorgestrel 150 mcg + Etinilestradiol 30 mcg por comprimido.

Mecanismo de ação:
• Inibe a ovulação por supressão das gonadotrofinas hipofisárias (LH e FSH)
• Altera o muco cervical, dificultando a penetração dos espermatozoides
• Modifica o endométrio, reduzindo a possibilidade de implantação

Apresentação: Caixa com 21 comprimidos revestidos.
Fabricante: Bayer
Administração: 1 comprimido por dia durante 21 dias, seguido de pausa de 7 dias.

Armazenar em temperatura ambiente (15–30°C), ao abrigo de luz e umidade.
Uso sob prescrição médica obrigatório.',
  15.18, 18.07, 30, 5,
  'https://f.fcdn.app/imgs/05fb28/www.farmacenter.com.py/farmpy/a7f0/original/catalogo/10000857_10000857_1/700x700/microgynon-cj-x-21-unidad-unica.jpg',
  true, true,
  ARRAY['anticoncepcional', 'levonorgestrel', 'etinilestradiol', 'bayer', 'hormonio', 'contraceptivo', 'pilula']
),

-- 2. Primosiston
(
  'Primosiston Cj x 30 Comprimidos',
  'primosiston-cj-x-30-comprimidos',
  'Regulação do ciclo menstrual — Noretisterona 5mg + Etinilestradiol 0,05mg — Caixa com 30 comprimidos.',
  'Primosiston é um medicamento hormonal combinado fabricado pela Bayer, indicado para o tratamento de irregularidades menstruais, sangramentos uterinos disfuncionais e adiamento controlado da menstruação.

Composição: Noretisterona 5 mg + Etinilestradiol 0,05 mg por comprimido.

Indicações:
• Sangramento uterino disfuncional
• Irregularidade e controle do ciclo menstrual
• Adiamento temporário da menstruação em situações especiais

Apresentação: Caixa com 30 comprimidos.
Fabricante: Bayer
Administração: Conforme orientação médica, geralmente 1 comprimido 2–3 vezes ao dia.

Armazenar em temperatura ambiente (15–30°C), ao abrigo de luz e umidade.
Uso sob prescrição médica obrigatório.',
  61.01, 72.64, 20, 5,
  'https://f.fcdn.app/imgs/f319df/www.farmacenter.com.py/farmpy/cf41/original/catalogo/10000858_10000858_1/700x700/primosiston-cj-x-30-comprimidos-unica.jpg',
  true, true,
  ARRAY['primosiston', 'noretisterona', 'etinilestradiol', 'bayer', 'ciclo menstrual', 'sangramento', 'hormonio']
),

-- 3. Mesigyna
(
  'Mesigyna Cj x 1 Ampola',
  'mesigyna-cj-x-1-ampola',
  'Anticoncepcional injetável mensal — Noretisterona Enantato 50mg + Estradiol Valerato 5mg — Ampola de 1 mL.',
  'Mesigyna é um anticoncepcional injetável mensal combinado fabricado pela Bayer, altamente eficaz para a prevenção de gravidez com aplicação uma vez por mês.

Composição: Noretisterona Enantato 50 mg + Estradiol Valerato 5 mg em 1 mL de solução injetável oleosa.

Mecanismo de ação:
• Inibe a ovulação por supressão das gonadotrofinas
• Altera o muco cervical e a motilidade tubária
• Proporciona ciclos menstruais mais regulares em comparação a injetáveis só de progesterona

Apresentação: Caixa com 1 ampola de 1 mL.
Fabricante: Bayer
Administração: Injeção intramuscular profunda a cada 30 dias (±3 dias).

Armazenar em temperatura ambiente (15–30°C), ao abrigo de luz e umidade. Não congelar.
Uso sob prescrição médica obrigatório.',
  20.40, 24.29, 25, 5,
  'https://f.fcdn.app/imgs/7cf783/www.farmacenter.com.py/farmpy/1435/original/catalogo/10001602_10001602_1/700x700/mesigyna-cj-x-1-ampolla-unica.jpg',
  true, true,
  ARRAY['mesigyna', 'anticoncepcional injetavel', 'noretisterona', 'estradiol', 'bayer', 'mensal', 'hormonio', 'contraceptivo']
),

-- 4. Yasmin
(
  'Yasmin Cj x 21 Comprimidos',
  'yasmin-cj-x-21-comprimidos',
  'Anticoncepcional oral — Drospirenona 3mg + Etinilestradiol 30mcg — Caixa com 21 comprimidos.',
  'Yasmin é um anticoncepcional oral combinado de quarta geração fabricado pela Bayer, indicado para prevenção de gravidez. A drospirenona, seu progestagênio, possui efeito antimineralocorticoide, reduzindo retenção hídrica.

Composição: Drospirenona 3 mg + Etinilestradiol 30 mcg por comprimido.

Benefícios adicionais:
• Redução de retenção de líquidos e inchaço
• Melhora de acne e oleosidade da pele relacionadas ao ciclo
• Ciclos mais regulares e menor dismenorreia

Mecanismo de ação:
• Inibe a ovulação por supressão das gonadotrofinas (LH e FSH)
• Altera muco cervical e endométrio

Apresentação: Caixa com 21 comprimidos revestidos.
Fabricante: Bayer
Administração: 1 comprimido por dia durante 21 dias, seguido de pausa de 7 dias.

Armazenar em temperatura ambiente (15–30°C), ao abrigo de luz e umidade.
Uso sob prescrição médica obrigatório.',
  51.50, 61.31, 30, 5,
  'https://f.fcdn.app/imgs/0b24f8/www.farmacenter.com.py/farmpy/9d63/original/catalogo/10001823_10001823_1/700x700/yasmin-cj-x-21-comprimidos-unica.jpg',
  true, true,
  ARRAY['yasmin', 'drospirenona', 'etinilestradiol', 'bayer', 'anticoncepcional', 'hormonio', 'pilula', 'acne', 'retencao hidrica']
),

-- 5. Angeliq
(
  'Angeliq Cj x 28 Comprimidos',
  'angeliq-cj-x-28-comprimidos',
  'Terapia hormonal da menopausa — Drospirenona 2mg + Estradiol 1mg — Caixa com 28 comprimidos.',
  'Angeliq é um medicamento de terapia hormonal combinada fabricado pela Bayer, indicado para o alívio dos sintomas climatéricos (menopausa) em mulheres com útero.

Composição: Drospirenona 2 mg + Estradiol 1 mg por comprimido.

Indicações:
• Alívio de fogachos (ondas de calor) e suores noturnos
• Redução de sintomas urogenitais da menopausa (secura vaginal, atrofia)
• Prevenção de osteoporose pós-menopausa em mulheres com alto risco

Benefício diferencial:
• A drospirenona possui propriedade antimineralocorticoide, reduzindo retenção hídrica e pressão arterial
• Proteção endometrial pelo componente progestagênico

Apresentação: Caixa com 28 comprimidos revestidos.
Fabricante: Bayer
Administração: 1 comprimido por dia de forma contínua, sem pausa.

Armazenar em temperatura ambiente (15–30°C), ao abrigo de luz e umidade.
Uso sob prescrição médica obrigatório.',
  77.99, 92.86, 20, 5,
  'https://f.fcdn.app/imgs/a976df/www.farmacenter.com.py/farmpy/afe9/original/catalogo/10002484_10002484_1/700x700/angeliq-cj-x-28-comprimidos-unica.jpg',
  true, true,
  ARRAY['angeliq', 'drospirenona', 'estradiol', 'bayer', 'menopausa', 'terapia hormonal', 'climatério', 'hormonio', 'thr']
),

-- 6. Triquilar
(
  'Triquilar Cj x 21 Unid',
  'triquilar-cj-x-21-unid',
  'Anticoncepcional oral trifásico — Levonorgestrel + Etinilestradiol (3 fases) — Caixa com 21 comprimidos.',
  'Triquilar é um anticoncepcional oral combinado trifásico fabricado pela Bayer. Sua formulação em três fases mimetiza as variações hormonais naturais do ciclo feminino, utilizando a menor dose total de hormônio para máxima eficácia.

Composição (trifásica):
• Fase 1 (6 comprimidos marrons): Levonorgestrel 50 mcg + Etinilestradiol 30 mcg
• Fase 2 (5 comprimidos brancos): Levonorgestrel 75 mcg + Etinilestradiol 40 mcg
• Fase 3 (10 comprimidos ocres): Levonorgestrel 125 mcg + Etinilestradiol 30 mcg

Mecanismo de ação:
• Inibe a ovulação por supressão das gonadotrofinas hipofisárias
• Altera o muco cervical e o endométrio
• Dosagem variável reduz a exposição hormonal total ao mês

Apresentação: Caixa com 21 comprimidos revestidos (3 cores).
Fabricante: Bayer
Administração: 1 comprimido por dia na ordem indicada durante 21 dias, pausa de 7 dias.

Armazenar em temperatura ambiente (15–30°C), ao abrigo de luz e umidade.
Uso sob prescrição médica obrigatório.',
  18.24, 21.71, 30, 5,
  'https://f.fcdn.app/imgs/298243/www.farmacenter.com.py/farmpy/dc27/original/catalogo/10002970_10002970_1/700x700/triquilar-cj-x-21-unidad-unica.jpg',
  true, true,
  ARRAY['triquilar', 'levonorgestrel', 'etinilestradiol', 'bayer', 'anticoncepcional', 'trifasico', 'pilula', 'hormonio']
),

-- 7. Neogynon
(
  'Neogynon Cj x 21 Unid',
  'neogynon-cj-x-21-unid',
  'Anticoncepcional oral de alta dose — Levonorgestrel 250mcg + Etinilestradiol 50mcg — Caixa com 21 comprimidos.',
  'Neogynon é um anticoncepcional oral combinado de dosagem elevada fabricado pela Bayer. É indicado para mulheres que necessitam de maior controle hormonal ou que não respondem adequadamente a formulações de baixa dosagem.

Composição: Levonorgestrel 250 mcg + Etinilestradiol 50 mcg por comprimido.

Indicações:
• Contracepção oral em casos onde baixas doses são insuficientes
• Controle de distúrbios menstruais

Mecanismo de ação:
• Inibe a ovulação por supressão das gonadotrofinas hipofisárias (LH e FSH)
• Altera o muco cervical, dificultando a penetração de espermatozoides
• Modifica o endométrio, reduzindo a possibilidade de implantação

Apresentação: Caixa com 21 comprimidos revestidos.
Fabricante: Bayer
Administração: 1 comprimido por dia durante 21 dias, seguido de pausa de 7 dias.

Armazenar em temperatura ambiente (15–30°C), ao abrigo de luz e umidade.
Uso sob prescrição médica obrigatório.',
  12.60, 15.00, 30, 5,
  'https://f.fcdn.app/imgs/fbb2b9/www.farmacenter.com.py/farmpy/4f40/original/catalogo/10002971_10002971_1/700x700/neogynon-cj-x-21-unidad-unica.jpg',
  true, true,
  ARRAY['neogynon', 'levonorgestrel', 'etinilestradiol', 'bayer', 'anticoncepcional', 'alta dose', 'pilula', 'hormonio']
),

-- 8. Yaz
(
  'Yaz Cj x 28 Comprimidos Revestidos',
  'yaz-cj-x-28-comprimidos-revestidos',
  'Anticoncepcional oral 24+4 — Drospirenona 3mg + Etinilestradiol 20mcg — Caixa com 28 comprimidos.',
  'Yaz é um anticoncepcional oral combinado de quarta geração fabricado pela Bayer, com regime diferenciado 24+4 (24 comprimidos ativos + 4 placebos). Sua ultrabaixa dose de etinilestradiol (20 mcg) o torna uma opção com menor impacto estrogênico.

Composição: Drospirenona 3 mg + Etinilestradiol 20 mcg por comprimido ativo.

Indicações aprovadas:
• Contracepção oral
• Tratamento de acne moderada
• Tratamento do transtorno disfórico pré-menstrual (TDPM)

Benefícios:
• Ultrabaixa dose estrogênica (20 mcg) — menor risco de efeitos estrogênicos
• Regime 24+4 — período de pausa reduzido para 4 dias, menor flutuação hormonal
• Efeito antimineralocorticoide da drospirenona: reduz retenção hídrica e inchaço

Apresentação: Caixa com 28 comprimidos revestidos (24 rosas ativos + 4 brancos placebos).
Fabricante: Bayer
Administração: 1 comprimido por dia de forma contínua, sem pausa prolongada.

Armazenar em temperatura ambiente (15–30°C), ao abrigo de luz e umidade.
Uso sob prescrição médica obrigatório.',
  53.93, 64.21, 30, 5,
  'https://f.fcdn.app/imgs/65ee94/www.farmacenter.com.py/farmpy/ee29/original/catalogo/10003356_10003356_1/700x700/yaz-cj-x-28-comp-rec-unica.jpg',
  true, true,
  ARRAY['yaz', 'drospirenona', 'etinilestradiol', 'bayer', 'anticoncepcional', 'acne', 'tdpm', 'pilula', 'hormonio', 'ultrabaixa dose']
),

-- 9. Qlaira
(
  'Qlaira Cj x 28 Comprimidos',
  'qlaira-cj-x-28-comprimidos',
  'Anticoncepcional oral natural 4 fases — Valerato de Estradiol + Dienogest — Caixa com 28 comprimidos.',
  'Qlaira é um anticoncepcional oral combinado de quatro fases fabricado pela Bayer. É o único anticoncepcional oral que utiliza exclusivamente estradiol natural (valerato de estradiol), em vez do estrogênio sintético etinilestradiol, oferecendo um perfil hormonal mais próximo ao natural.

Composição (quadrifásica):
• 2 comprimidos rosas escuros: Valerato de Estradiol 3 mg
• 5 comprimidos médio-rosas: Valerato de Estradiol 2 mg + Dienogest 2 mg
• 17 comprimidos claros-rosas: Valerato de Estradiol 2 mg + Dienogest 3 mg
• 2 comprimidos vermelhos: Valerato de Estradiol 1 mg
• 2 comprimidos brancos: placebo

Características diferenciais:
• Estrogênio natural (valerato de estradiol) — menor impacto metabólico
• Dienogest: progestagênio com forte atividade antiandrogênica
• Redução do volume e duração do fluxo menstrual
• Indicado também para sangramento uterino intenso

Apresentação: Caixa com 28 comprimidos revestidos (5 cores diferentes).
Fabricante: Bayer
Administração: 1 comprimido por dia de forma contínua na ordem indicada, sem pausa.

Armazenar em temperatura ambiente (15–30°C), ao abrigo de luz e umidade.
Uso sob prescrição médica obrigatório.',
  59.33, 70.64, 25, 5,
  'https://f.fcdn.app/imgs/efce87/www.farmacenter.com.py/farmpy/bcd4/original/catalogo/10004712_10004712_1/700x700/qlaira-cj-x-28-comp-unica.jpg',
  true, true,
  ARRAY['qlaira', 'valerato de estradiol', 'dienogest', 'bayer', 'anticoncepcional', 'estrogênio natural', 'quadrifasico', 'hormonio', 'sangramento uterino']
)

ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- Associa marca Bayer e categoria anticoncepcionais aos produtos
-- =============================================
UPDATE products
SET
  brand_id    = (SELECT id FROM brands WHERE slug = 'bayer'),
  category_id = (SELECT id FROM categories WHERE slug = 'anticoncepcionais')
WHERE slug IN (
  'microgynon-cj-x-21-unid',
  'primosiston-cj-x-30-comprimidos',
  'mesigyna-cj-x-1-ampola',
  'yasmin-cj-x-21-comprimidos',
  'angeliq-cj-x-28-comprimidos',
  'triquilar-cj-x-21-unid',
  'neogynon-cj-x-21-unid',
  'yaz-cj-x-28-comprimidos-revestidos',
  'qlaira-cj-x-28-comprimidos'
);
