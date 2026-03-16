-- =============================================
-- Produtos ZPHC — Farmácia Santa Clara
-- Execute no SQL Editor do Supabase
-- =============================================

-- =============================================
-- PEPTÍDEOS
-- =============================================

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'BPC-157 5mg',
  'bpc-157-5mg',
  'BPC-157 (Body Protection Compound-157) é um pentadecapeptídeo composto por 15 aminoácidos. Amplamente estudado por suas propriedades de reparo tecidual, regeneração de ligamentos e tendões, proteção gástrica e efeitos anti-inflamatórios. Cada frasco contém 5mg de BPC-157 liofilizado, com alta pureza e solubilidade.',
  'Pentadecapeptídeo para reparo tecidual e regeneração. 5mg por frasco.',
  189.90, 219.90, 10,
  (SELECT id FROM categories WHERE slug = 'peptideos'),
  'https://zphc.store/wp-content/uploads/BPC-157.jpg',
  true, true, true,
  ARRAY['bpc-157','peptídeo','reparo tecidual','regeneração','anti-inflamatório']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'bpc-157-5mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'TB-500 5mg',
  'tb-500-5mg',
  'TB-500 (Thymosin Beta-4) é um peptídeo de ocorrência natural presente em praticamente todas as células e tecidos do organismo humano e animal. Estudado por seu papel na regeneração celular, cicatrização acelerada, flexibilidade tecidual e redução da inflamação. Apresentação liofilizada de 5mg por frasco.',
  'Thymosin Beta-4 para regeneração celular e cicatrização. 5mg por frasco.',
  189.90, 219.90, 10,
  (SELECT id FROM categories WHERE slug = 'peptideos'),
  'https://zphc.store/wp-content/uploads/TB-500.jpg',
  true, true, true,
  ARRAY['tb-500','thymosin beta-4','peptídeo','regeneração','cicatrização']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'tb-500-5mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Semaglutida 5mg',
  'semaglutida-5mg',
  'Semaglutida é um análogo do GLP-1 (peptídeo semelhante ao glucagon tipo 1) de longa ação, com meia-vida de aproximadamente 7 dias. Atua como agonista do receptor GLP-1, estimulando a secreção de insulina dependente de glicose, reduzindo o glucagon e retardando o esvaziamento gástrico. Apresentação: 5mg liofilizado.',
  'Análogo GLP-1 de longa ação. 5mg por frasco.',
  379.90, 429.90, 10,
  (SELECT id FROM categories WHERE slug = 'peptideos'),
  'https://zphc.store/wp-content/uploads/Semaglutide.jpg',
  true, true, true,
  ARRAY['semaglutida','glp-1','peptídeo','análogo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'semaglutida-5mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Tirzepatida 5mg',
  'tirzepatida-5mg',
  'Tirzepatida é um agonista duplo dos receptores GIP e GLP-1, representando uma nova classe de moléculas denominadas twincretinas. Age simultaneamente nos dois receptores incretínicos, potencializando os efeitos sobre o controle glicêmico e o metabolismo energético. Apresentação: 5mg liofilizado por frasco.',
  'Agonista duplo GIP/GLP-1. 5mg por frasco.',
  449.90, 519.90, 10,
  (SELECT id FROM categories WHERE slug = 'peptideos'),
  'https://zphc.store/wp-content/uploads/Tirzepatide.jpg',
  true, true, true,
  ARRAY['tirzepatida','gip','glp-1','twincretina','peptídeo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'tirzepatida-5mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Retatrutida 5mg',
  'retatrutida-5mg',
  'Retatrutida é um agonista triplo dos receptores GLP-1, GIP e glucagon (GCG), sendo considerada a molécula de próxima geração para manejo metabólico. O mecanismo triplo proporciona efeitos sinérgicos no metabolismo da glicose, no gasto energético e na composição corporal. Apresentação: 5mg liofilizado por frasco.',
  'Agonista triplo GLP-1/GIP/Glucagon. 5mg por frasco.',
  579.90, 649.90, 10,
  (SELECT id FROM categories WHERE slug = 'peptideos'),
  'https://zphc.store/wp-content/uploads/Retatrutide.jpg',
  true, true, true,
  ARRAY['retatrutida','glp-1','gip','glucagon','peptídeo','triplo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'retatrutida-5mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'GHRP-2 5mg',
  'ghrp-2-5mg',
  'GHRP-2 (Growth Hormone Releasing Peptide-2) é um hexapeptídeo sintético que estimula a liberação do hormônio do crescimento pela hipófise anterior via receptor de grelina. Apresenta forte atividade secretagoga de GH, com leve efeito sobre prolactina e cortisol. Apresentação: 5mg liofilizado por frasco.',
  'Secretagogo de GH via receptor de grelina. 5mg por frasco.',
  159.90, 189.90, 10,
  (SELECT id FROM categories WHERE slug = 'peptideos'),
  'https://zphc.store/wp-content/uploads/GHRP-2.jpg',
  false, true, true,
  ARRAY['ghrp-2','secretagogo','gh','hormônio do crescimento','peptídeo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ghrp-2-5mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'GHRP-6 5mg',
  'ghrp-6-5mg',
  'GHRP-6 (Growth Hormone Releasing Peptide-6) é um hexapeptídeo secretagogo de GH com forte capacidade de estimular a liberação pulsátil do hormônio do crescimento. Além do efeito sobre o GH, apresenta propriedades gastroprotetoras e é um potente estimulante do apetite via ativação do receptor de grelina. Apresentação: 5mg liofilizado.',
  'Secretagogo de GH com efeito gastroprotetor. 5mg por frasco.',
  159.90, 189.90, 10,
  (SELECT id FROM categories WHERE slug = 'peptideos'),
  'https://zphc.store/wp-content/uploads/GHRP-6.jpg',
  false, true, true,
  ARRAY['ghrp-6','secretagogo','gh','grelina','peptídeo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ghrp-6-5mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'CJC-1295 sem DAC 2mg',
  'cjc-1295-sem-dac-2mg',
  'CJC-1295 sem DAC (também denominado MOD GRF 1-29) é um análogo sintético de 29 aminoácidos do GHRH (hormônio liberador do hormônio do crescimento) com meia-vida aumentada em relação ao GHRH nativo. Estimula a liberação pulsátil de GH quando combinado com um GHRP. Apresentação: 2mg liofilizado.',
  'Análogo do GHRH para pulsos fisiológicos de GH. 2mg por frasco.',
  159.90, 189.90, 10,
  (SELECT id FROM categories WHERE slug = 'peptideos'),
  'https://zphc.store/wp-content/uploads/CJC-1295.jpg',
  false, true, true,
  ARRAY['cjc-1295','mod-grf','ghrh','secretagogo','peptídeo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'cjc-1295-sem-dac-2mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Ipamorelin 2mg',
  'ipamorelin-2mg',
  'Ipamorelin é um pentapeptídeo secretagogo de GH altamente seletivo, considerado o mais específico da sua classe por apresentar mínimo efeito sobre cortisol e prolactina. Atua nos receptores de grelina da hipófise, produzindo liberação pulsátil e fisiológica de GH. Apresentação: 2mg liofilizado por frasco.',
  'Secretagogo de GH seletivo e fisiológico. 2mg por frasco.',
  149.90, 179.90, 10,
  (SELECT id FROM categories WHERE slug = 'peptideos'),
  'https://zphc.store/wp-content/uploads/Ipamorelin.jpg',
  false, true, true,
  ARRAY['ipamorelin','secretagogo','gh','peptídeo','seletivo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ipamorelin-2mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'PT-141 10mg',
  'pt-141-10mg',
  'PT-141 (Bremelanotida) é um análogo cíclico da α-MSH (hormônio estimulador de melanócitos alfa) que atua nos receptores de melanocortina MC3-R e MC4-R no sistema nervoso central. Diferentemente dos inibidores de PDE5, seu mecanismo de ação é central, não dependendo de estímulo vascular periférico. Apresentação: 10mg liofilizado.',
  'Agonista de melanocortina de ação central. 10mg por frasco.',
  269.90, 319.90, 10,
  (SELECT id FROM categories WHERE slug = 'peptideos'),
  'https://zphc.store/wp-content/uploads/PT-141.jpg',
  false, true, true,
  ARRAY['pt-141','bremelanotida','melanocortina','peptídeo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'pt-141-10mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'AOD-9604 5mg',
  'aod-9604-5mg',
  'AOD-9604 é um fragmento sintético da região C-terminal do HGH (aminoácidos 177-191) que retém as propriedades lipolíticas do hormônio do crescimento sem os efeitos proliferativos. Estimula a lipólise e inibe a lipogênese por mecanismo independente do receptor de IGF-1. Apresentação: 5mg liofilizado por frasco.',
  'Fragmento do HGH com ação lipolítica. 5mg por frasco.',
  219.90, 259.90, 10,
  (SELECT id FROM categories WHERE slug = 'peptideos'),
  'https://zphc.store/wp-content/uploads/AOD-9604.jpg',
  false, true, true,
  ARRAY['aod-9604','fragmento hgh','lipólise','peptídeo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'aod-9604-5mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Selank 5mg',
  'selank-5mg',
  'Selank é um peptídeo sintético ansiolítico derivado da tuftsin, desenvolvido pelo Instituto de Genética Molecular da Academia Russa de Ciências. Apresenta propriedades nootrópicas, ansiolíticas e imunomoduladoras. Estudado pela estabilização do metabolismo de neurotransmissores monoaminérgicos e do GABA. Apresentação: 5mg liofilizado.',
  'Peptídeo ansiolítico e nootrópico derivado da tuftsin. 5mg.',
  199.90, 239.90, 10,
  (SELECT id FROM categories WHERE slug = 'peptideos'),
  'https://zphc.store/wp-content/uploads/Selank.jpg',
  false, true, true,
  ARRAY['selank','ansiolítico','nootrópico','peptídeo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'selank-5mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Semax 5mg',
  'semax-5mg',
  'Semax é um heptapeptídeo sintético análogo ao ACTH (4-7) com propriedades nootrópicas e neuroprotetoras. Desenvolvido na Rússia para estudo de funções cognitivas, estresse e regulação do tônus vascular cerebral. Apresenta atividade sobre o sistema dopaminérgico, serotoninérgico e sobre o BDNF. Apresentação: 5mg liofilizado.',
  'Peptídeo nootrópico e neuroprotetor análogo ao ACTH. 5mg.',
  199.90, 239.90, 10,
  (SELECT id FROM categories WHERE slug = 'peptideos'),
  'https://zphc.store/wp-content/uploads/Semax.jpg',
  false, true, true,
  ARRAY['semax','nootrópico','neuroprotetor','acth','peptídeo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'semax-5mg');

-- =============================================
-- HORMÔNIOS
-- =============================================

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'HCG 5000 UI',
  'hcg-5000ui',
  'HCG (Gonadotrofina Coriônica Humana) 5000 UI é uma glicoproteína que mimetiza a ação do LH (hormônio luteinizante), estimulando as células de Leydig a produzirem testosterona endógena. Amplamente utilizada no contexto de terapia de reposição hormonal e fertilidade masculina. Apresentação: frasco liofilizado 5000 UI + ampola de diluente.',
  'Gonadotrofina coriônica para estimulação testicular. 5000 UI.',
  199.90, 239.90, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  'https://zphc.store/wp-content/uploads/HCG.jpg',
  true, true, true,
  ARRAY['hcg','gonadotrofina','lh','testosterona','fertilidade']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'hcg-5000ui');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Somatropina 10 UI',
  'somatropina-10ui',
  'Somatropina (HGH recombinante) 10 UI por frasco. Hormônio do crescimento humano produzido por tecnologia de DNA recombinante, com sequência idêntica ao GH endógeno de 191 aminoácidos. Estudado por seus efeitos sobre composição corporal, metabolismo lipídico, síntese proteica e bem-estar geral. Alta pureza e bioatividade.',
  'Hormônio do crescimento humano recombinante. 10 UI por frasco.',
  299.90, 359.90, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  'https://zphc.store/wp-content/uploads/HGH.jpg',
  true, true, true,
  ARRAY['somatropina','hgh','hormônio do crescimento','gh','recombinante']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'somatropina-10ui');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Somatropina 36 UI',
  'somatropina-36ui',
  'Somatropina (HGH recombinante) 36 UI em frasco multidose (cartucho). Hormônio do crescimento humano de 191 aminoácidos produzido por tecnologia de DNA recombinante. Apresentação em maior volume para protocolos de maior duração. Alta pureza, bioatividade e estabilidade. Acompanha instruções para reconstituição.',
  'Hormônio do crescimento humano recombinante. 36 UI por frasco.',
  849.90, 999.90, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  'https://zphc.store/wp-content/uploads/HGH-36IU.jpg',
  true, true, true,
  ARRAY['somatropina','hgh','hormônio do crescimento','36ui','recombinante']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'somatropina-36ui');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Testosterona Enantato 250mg/ml',
  'testosterona-enantato-250mg',
  'Testosterona Enantato 250mg/ml — éster de ação longa da testosterona com meia-vida de aproximadamente 7-8 dias. Utilizado em terapia de reposição de testosterona (TRT) e em contextos de endocrinologia clínica. Apresentação: ampola de 1ml com 250mg de testosterona enantato em óleo de gergelim. ZPHC — alta pureza.',
  'Éster de testosterona de ação prolongada. 250mg/ml, ampola 1ml.',
  189.90, 219.90, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  'https://zphc.store/wp-content/uploads/Testosterone-Enanthate.jpg',
  true, true, true,
  ARRAY['testosterona','enantato','trt','hormônio','androgênio']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'testosterona-enantato-250mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Testosterona Cipionato 250mg/ml',
  'testosterona-cipionato-250mg',
  'Testosterona Cipionato 250mg/ml — éster de ação longa com meia-vida de 8-10 dias, amplamente utilizado na América do Norte para terapia de reposição de testosterona. Perfil farmacocinético estável com níveis séricos mantidos. Apresentação: ampola de 1ml com 250mg em óleo. ZPHC — fabricado em condições GMP.',
  'Éster de testosterona de ação prolongada. 250mg/ml, ampola 1ml.',
  189.90, 219.90, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  'https://zphc.store/wp-content/uploads/Testosterone-Cypionate.jpg',
  false, true, true,
  ARRAY['testosterona','cipionato','trt','hormônio','androgênio']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'testosterona-cipionato-250mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Testosterona Propionato 100mg/ml',
  'testosterona-propionato-100mg',
  'Testosterona Propionato 100mg/ml — éster de ação curta com meia-vida de 2-3 dias, permitindo ajustes rápidos nos níveis séricos. Amplamente estudado em contextos de TRT de precisão e transição de protocolos. Apresentação: ampola de 1ml com 100mg de testosterona propionato em óleo. ZPHC — alta pureza certificada.',
  'Éster curto de testosterona para ajustes precisos. 100mg/ml.',
  169.90, 199.90, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  'https://zphc.store/wp-content/uploads/Testosterone-Propionate.jpg',
  false, true, true,
  ARRAY['testosterona','propionato','éster curto','hormônio','androgênio']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'testosterona-propionato-100mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Sustanon 250mg/ml',
  'sustanon-250mg',
  'Sustanon 250mg/ml — blend de quatro ésteres de testosterona: propionato 30mg, fenilpropionato 60mg, isocapronato 60mg e decanoato 100mg. Formulação desenvolvida para proporcionar liberação rápida (propionato) e sustentada (decanoato) de testosterona, mantendo níveis séricos estáveis. Ampola 1ml. ZPHC.',
  'Blend de 4 ésteres de testosterona. 250mg/ml, ampola 1ml.',
  199.90, 239.90, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  'https://zphc.store/wp-content/uploads/Sustanon.jpg',
  false, true, true,
  ARRAY['sustanon','testosterona','blend','ésteres','hormônio']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'sustanon-250mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Nandrolona Decanoato 250mg/ml',
  'nandrolona-decanoato-250mg',
  'Nandrolona Decanoato 250mg/ml — éster de longa ação do esteroide anabólico nandrolona (19-nortestosterona) com meia-vida de aproximadamente 8 dias. Apresenta alta razão anabólica/androgênica (125/37) em relação à testosterona. Estudado em contextos de anemia, osteoporose e caquexia. Ampola 1ml. ZPHC.',
  'Esteroide anabólico de ação longa. 250mg/ml, ampola 1ml.',
  209.90, 249.90, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  'https://zphc.store/wp-content/uploads/Nandrolone-Decanoate.jpg',
  false, true, true,
  ARRAY['nandrolona','decanoato','deca','19-nor','anabólico']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'nandrolona-decanoato-250mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Nandrolona Fenilpropionato 100mg/ml',
  'nandrolona-fenilpropionato-100mg',
  'Nandrolona Fenilpropionato (NPP) 100mg/ml — éster de ação curta da nandrolona com meia-vida de 2-4 dias. Apresenta o mesmo perfil farmacológico da nandrolona decanoato com liberação mais rápida, permitindo controle mais preciso. Alta razão anabólica/androgênica. Ampola 1ml. ZPHC — fabricado em condições GMP.',
  'Nandrolona de ação rápida. 100mg/ml, ampola 1ml.',
  189.90, 219.90, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  'https://zphc.store/wp-content/uploads/Nandrolone-Phenylpropionate.jpg',
  false, true, true,
  ARRAY['nandrolona','fenilpropionato','npp','19-nor','anabólico']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'nandrolona-fenilpropionato-100mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Trembolona Enantato 200mg/ml',
  'trembolona-enantato-200mg',
  'Trembolona Enantato 200mg/ml — éster de longa ação da trembolona (19-nor-testosterona modificada) com meia-vida de 5-7 dias. Apresenta alta afinidade pelo receptor androgênico (5x maior que a testosterona). Não se converte em estrogênio pela aromatase. Ampola 1ml com 200mg. ZPHC — alta pureza.',
  'Esteroide de alta atividade androgênica. 200mg/ml, ampola 1ml.',
  289.90, 339.90, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  'https://zphc.store/wp-content/uploads/Trenbolone-Enanthate.jpg',
  false, true, true,
  ARRAY['trembolona','enantato','tren','androgênico','19-nor']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'trembolona-enantato-200mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Trembolona Acetato 100mg/ml',
  'trembolona-acetato-100mg',
  'Trembolona Acetato 100mg/ml — éster de ação curta com meia-vida de 1-2 dias, considerado o padrão ouro para início e ajuste de protocolos com trembolona. Alta afinidade pelo receptor androgênico, sem conversão estrogênica. Ampola 1ml com 100mg de trembolona acetato. ZPHC — pureza superior a 99%.',
  'Trembolona de ação rápida. 100mg/ml, ampola 1ml.',
  269.90, 319.90, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  'https://zphc.store/wp-content/uploads/Trenbolone-Acetate.jpg',
  false, true, true,
  ARRAY['trembolona','acetato','tren','androgênico','curta ação']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'trembolona-acetato-100mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Boldenona Undecilato 250mg/ml',
  'boldenona-undecilato-250mg',
  'Boldenona Undecilato (Equipoise) 250mg/ml — éster de longa ação da boldenona com meia-vida de 14 dias. Derivada estruturalmente da testosterona, apresenta maior atividade anabólica e menor atividade androgênica. Estimula a eritropoiese e a síntese proteica. Aromatiza moderadamente. Ampola 1ml. ZPHC.',
  'Esteroide anabólico de ação prolongada. 250mg/ml, ampola 1ml.',
  229.90, 269.90, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  'https://zphc.store/wp-content/uploads/Boldenone-Undecylenate.jpg',
  false, true, true,
  ARRAY['boldenona','equipoise','undecilato','anabólico','eritropoiese']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'boldenona-undecilato-250mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Drostanolona Propionato 100mg/ml',
  'drostanolona-propionato-100mg',
  'Drostanolona Propionato (Masteron) 100mg/ml — éster de ação curta do androstano derivado da DHT. Apresenta propriedades androgênicas e anti-estrogênicas intrínsecas por competição com aromatase. Não se converte em estrogênio. Meia-vida de 2-3 dias. Ampola 1ml. ZPHC — fabricado sob rigoroso controle de qualidade.',
  'Derivado de DHT com ação anti-estrogênica. 100mg/ml, ampola 1ml.',
  269.90, 319.90, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  'https://zphc.store/wp-content/uploads/Drostanolone-Propionate.jpg',
  false, true, true,
  ARRAY['drostanolona','masteron','propionato','dht','anti-estrogênico']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'drostanolona-propionato-100mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Drostanolona Enantato 200mg/ml',
  'drostanolona-enantato-200mg',
  'Drostanolona Enantato (Masteron Enantato) 200mg/ml — versão de longa ação da drostanolona com meia-vida de 5-7 dias. Derivado da DHT, apresenta propriedades androgênicas e anti-estrogênicas intrínsecas. Mantém os benefícios da drostanolona propionato com menor frequência de aplicação. Ampola 1ml. ZPHC.',
  'Masteron de ação longa. 200mg/ml, ampola 1ml.',
  289.90, 339.90, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  'https://zphc.store/wp-content/uploads/Drostanolone-Enanthate.jpg',
  false, true, true,
  ARRAY['drostanolona','masteron','enantato','dht','anti-estrogênico']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'drostanolona-enantato-200mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Primobolan 100mg/ml',
  'primobolan-100mg',
  'Metenolona Enantato (Primobolan) 100mg/ml — esteroide anabólico derivado da DHT com alta razão anabólica/androgênica e baixa propensão a efeitos colaterais. Não se converte em estrogênio, não causa retenção hídrica significativa. Meia-vida de 5-7 dias. Ampola 1ml. ZPHC — uma das formulações mais puras do mercado.',
  'Metenolona injetável de alta qualidade. 100mg/ml, ampola 1ml.',
  339.90, 399.90, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  'https://zphc.store/wp-content/uploads/Primobolan.jpg',
  false, true, true,
  ARRAY['primobolan','metenolona','enantato','dht','anabólico']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'primobolan-100mg');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Winstrol Injetável 50mg/ml',
  'winstrol-injetavel-50mg',
  'Estanozolol Injetável (Winstrol Depot) 50mg/ml — suspensão aquosa do estanozolol, derivado sintético da DHT. Apresenta alta biodisponibilidade e não é convertido em estrogênio. Meia-vida de 24h para a forma injetável. Ampola 1ml com 50mg. ZPHC — produto de referência em pureza e consistência.',
  'Estanozolol em suspensão aquosa. 50mg/ml, ampola 1ml.',
  209.90, 249.90, 10,
  (SELECT id FROM categories WHERE slug = 'hormonios'),
  'https://zphc.store/wp-content/uploads/Stanozolol-Injectable.jpg',
  false, true, true,
  ARRAY['winstrol','estanozolol','stanozolol','dht','suspensão']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'winstrol-injetavel-50mg');

-- =============================================
-- SUPLEMENTOS (Orais / Tabletes)
-- =============================================

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Oxandrolona 10mg (100 tabs)',
  'oxandrolona-10mg-100tabs',
  'Oxandrolona 10mg — esteroide anabólico sintético derivado da DHT com excepcional razão anabólica/androgênica. Apresenta baixa hepatotoxicidade em relação a outros 17α-alquilados e praticamente não aromatiza. Estudado em contextos de ganho de força, perda de gordura e preservação de massa magra. 100 comprimidos por embalagem. ZPHC.',
  'Esteroide oral de alta razão anabólica. 10mg × 100 comprimidos.',
  189.90, 229.90, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  'https://zphc.store/wp-content/uploads/Oxandrolone.jpg',
  true, true, true,
  ARRAY['oxandrolona','anavar','oral','dht','anabólico']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'oxandrolona-10mg-100tabs');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Estanozolol 10mg (100 tabs)',
  'estanozolol-10mg-100tabs',
  'Estanozolol Oral 10mg — derivado oral da DHT com alta biodisponibilidade. Apresenta atividade anabólica sem conversão estrogênica. Utilizado em estudos de anemia aplásica e angioedema hereditário. Não requer conversão hepática para ativação. 100 comprimidos por embalagem. ZPHC — fabricação com controle analítico rigoroso.',
  'Estanozolol oral. 10mg × 100 comprimidos.',
  169.90, 199.90, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  'https://zphc.store/wp-content/uploads/Stanozolol-Oral.jpg',
  false, true, true,
  ARRAY['estanozolol','winstrol','oral','dht','anabólico']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'estanozolol-10mg-100tabs');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Metandienona 10mg (100 tabs)',
  'metandienona-10mg-100tabs',
  'Metandienona 10mg (Dianabol) — um dos esteroides anabólicos mais estudados da história, com alta atividade anabólica e androgênica moderada. Aromatiza parcialmente em estrogênio. Apresenta efeito rápido sobre síntese proteica e balanço nitrogenado positivo. 100 comprimidos por embalagem. ZPHC.',
  'Metandienona oral clássica. 10mg × 100 comprimidos.',
  159.90, 189.90, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  'https://zphc.store/wp-content/uploads/Methandienone.jpg',
  false, true, true,
  ARRAY['metandienona','dianabol','dbol','oral','anabólico']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'metandienona-10mg-100tabs');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Oximetolona 50mg (100 tabs)',
  'oximetolona-50mg-100tabs',
  'Oximetolona 50mg (Anadrol) — esteroide anabólico derivado da DHT com alta potência anabólica. Historicamente utilizado no tratamento de anemia e osteoporose. Não converte diretamente em estrogênio pela aromatase, mas apresenta atividade estrogênica intrínseca. 100 comprimidos por embalagem. ZPHC — pureza garantida.',
  'Oximetolona oral de alta potência. 50mg × 100 comprimidos.',
  189.90, 229.90, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  'https://zphc.store/wp-content/uploads/Oxymetholone.jpg',
  false, true, true,
  ARRAY['oximetolona','anadrol','oral','dht','anabólico']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'oximetolona-50mg-100tabs');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Turinabol 10mg (100 tabs)',
  'turinabol-10mg-100tabs',
  'Turinabol 10mg (4-clorodehidrometiltestosterona) — esteroide anabólico oral desenvolvido originalmente na Alemanha Oriental. Caracteriza-se pela ausência de aromatização, baixo perfil androgênico e discreta retenção hídrica. Apresenta boa absorção oral e perfil anabólico favorável. 100 comprimidos. ZPHC.',
  'Turinabol oral sem aromatização. 10mg × 100 comprimidos.',
  179.90, 209.90, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  'https://zphc.store/wp-content/uploads/Turinabol.jpg',
  false, true, true,
  ARRAY['turinabol','tbol','oral','clorodehidrometiltestosterona','anabólico']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'turinabol-10mg-100tabs');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Anastrozol 1mg (100 tabs)',
  'anastrozol-1mg-100tabs',
  'Anastrozol 1mg — inibidor de aromatase de terceira geração, não esteroidal. Atua bloqueando competitivamente a enzima aromatase (CYP19A1), reduzindo a conversão de androgênios em estrogênio de forma potente e seletiva. Indicado clinicamente no tratamento de câncer de mama hormônio-dependente em mulheres. 100 comprimidos. ZPHC.',
  'Inibidor de aromatase não esteroidal. 1mg × 100 comprimidos.',
  189.90, 219.90, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  'https://zphc.store/wp-content/uploads/Anastrozole.jpg',
  true, true, true,
  ARRAY['anastrozol','inibidor de aromatase','ia','anti-estrogênico','oral']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'anastrozol-1mg-100tabs');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Letrozol 2,5mg (100 tabs)',
  'letrozol-2-5mg-100tabs',
  'Letrozol 2,5mg — inibidor de aromatase de terceira geração, não esteroidal, com alta potência e seletividade. Suprime os níveis de estrogênio sérico em até 98%. Indicado clinicamente no tratamento de câncer de mama hormônio-dependente. Menor impacto sobre cortisol e aldosterona em comparação ao aminoglutetimida. 100 comprimidos. ZPHC.',
  'Inibidor de aromatase de alta potência. 2,5mg × 100 comprimidos.',
  189.90, 219.90, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  'https://zphc.store/wp-content/uploads/Letrozole.jpg',
  false, true, true,
  ARRAY['letrozol','inibidor de aromatase','ia','anti-estrogênico','oral']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'letrozol-2-5mg-100tabs');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Clomifeno 50mg (100 tabs)',
  'clomifeno-50mg-100tabs',
  'Clomifeno 50mg (Clomid) — modulador seletivo do receptor de estrogênio (SERM) com atividade mista agonista/antagonista. Age como antagonista nos receptores hipotalâmicos, aumentando a pulsatilidade do GnRH e consequentemente os níveis de FSH e LH. Indicado clinicamente para indução de ovulação e hipogonadismo masculino. 100 comprimidos. ZPHC.',
  'SERM para estimulação do eixo hipotálamo-hipófise-gônadas. 50mg × 100 tabs.',
  169.90, 199.90, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  'https://zphc.store/wp-content/uploads/Clomiphene.jpg',
  false, true, true,
  ARRAY['clomifeno','clomid','serm','lh','fsh','antiestrogênico']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'clomifeno-50mg-100tabs');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Tamoxifeno 20mg (100 tabs)',
  'tamoxifeno-20mg-100tabs',
  'Tamoxifeno 20mg (Nolvadex) — SERM (modulador seletivo do receptor de estrogênio) de primeira geração com atividade antagonista nos receptores de estrogênio mamários e agonista parcial no útero e no osso. Indicado clinicamente no tratamento e prevenção do câncer de mama. No contexto hormonal masculino, estimula o eixo HPG. 100 comprimidos. ZPHC.',
  'SERM antagonista de estrogênio. 20mg × 100 comprimidos.',
  159.90, 189.90, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  'https://zphc.store/wp-content/uploads/Tamoxifen.jpg',
  false, true, true,
  ARRAY['tamoxifeno','nolvadex','serm','antiestrogênico','oral']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'tamoxifeno-20mg-100tabs');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Exemestano 25mg (100 tabs)',
  'exemestano-25mg-100tabs',
  'Exemestano 25mg (Aromasin) — inibidor de aromatase esteroidal de terceira geração (tipo I, inativador irreversível). Liga-se de forma covalente e permanente ao sítio ativo da aromatase, inativando-a. Por ser esteroidal, apresenta leve atividade androgênica intrínseca. Indicado clinicamente no câncer de mama. 100 comprimidos. ZPHC.',
  'Inibidor irreversível de aromatase esteroidal. 25mg × 100 tabs.',
  199.90, 239.90, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  'https://zphc.store/wp-content/uploads/Exemestane.jpg',
  false, true, true,
  ARRAY['exemestano','aromasin','inibidor de aromatase','esteroidal','suicida']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'exemestano-25mg-100tabs');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Proviron 25mg (100 tabs)',
  'proviron-25mg-100tabs',
  'Mesterolona 25mg (Proviron) — androgênio oral derivado da DHT com propriedades únicas: não é 17α-alquilado, apresenta alta biodisponibilidade oral pelo perfil metabólico distinto, e possui atividade antiestrogênica intrínseca por competição com aromatase. Estudado em hipogonadismo masculino e infertilidade. 100 comprimidos. ZPHC.',
  'Androgênio oral derivado da DHT. 25mg × 100 comprimidos.',
  169.90, 199.90, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  'https://zphc.store/wp-content/uploads/Mesterolone.jpg',
  false, true, true,
  ARRAY['proviron','mesterolona','dht','androgênio','anti-estrogênico']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'proviron-25mg-100tabs');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Ostarina (MK-2866) 10mg (100 tabs)',
  'ostarina-mk2866-10mg-100tabs',
  'Ostarina (MK-2866, Enobosarm) 10mg — SARM (modulador seletivo do receptor androgênico) de primeira geração com alta seletividade tecidual para músculo e osso. Apresenta atividade agonista no receptor androgênico sem os efeitos androgênicos clássicos em tecidos como próstata e folículo piloso. 100 comprimidos. ZPHC.',
  'SARM seletivo para músculo e osso. 10mg × 100 comprimidos.',
  209.90, 249.90, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  'https://zphc.store/wp-content/uploads/Ostarine.jpg',
  true, true, true,
  ARRAY['ostarina','mk-2866','enobosarm','sarm','seletivo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ostarina-mk2866-10mg-100tabs');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Ligandrol (LGD-4033) 5mg (100 tabs)',
  'ligandrol-lgd4033-5mg-100tabs',
  'Ligandrol (LGD-4033) 5mg — SARM de segunda geração com alta potência e seletividade pelo receptor androgênico. Apresenta maior afinidade de ligação ao receptor AR em comparação à Ostarina, com forte atividade anabólica em tecido muscular e ósseo. Meia-vida de 24-36h. 100 comprimidos. ZPHC.',
  'SARM de alta potência. 5mg × 100 comprimidos.',
  229.90, 269.90, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  'https://zphc.store/wp-content/uploads/Ligandrol.jpg',
  true, true, true,
  ARRAY['ligandrol','lgd-4033','sarm','anabólico','seletivo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ligandrol-lgd4033-5mg-100tabs');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'RAD-140 10mg (100 tabs)',
  'rad-140-10mg-100tabs',
  'RAD-140 (Testolone) 10mg — SARM com alta afinidade pelo receptor androgênico (Ki = 7nM), superior à testosterona em seletividade tecidual. Apresenta razão anabólica/androgênica de 90:1 em modelos animais. Demonstra atividade neuroprotetora em estudos pré-clínicos. Meia-vida de 15-20h. 100 comprimidos. ZPHC.',
  'SARM de alta afinidade androgênica. 10mg × 100 comprimidos.',
  259.90, 299.90, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  'https://zphc.store/wp-content/uploads/RAD140.jpg',
  true, true, true,
  ARRAY['rad-140','testolone','sarm','androgênico','seletivo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'rad-140-10mg-100tabs');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Cardarine (GW-501516) 10mg (100 tabs)',
  'cardarine-gw501516-10mg-100tabs',
  'Cardarine (GW-501516) 10mg — agonista do receptor PPAR-δ (receptor ativado por proliferadores de peroxissoma delta). Não é um SARM, mas frequentemente categorizado com eles. Ativa genes envolvidos no metabolismo energético, oxidação de ácidos graxos e biogênese mitocondrial. Meia-vida de 16-24h. 100 comprimidos. ZPHC.',
  'Agonista PPAR-δ para metabolismo energético. 10mg × 100 comprimidos.',
  209.90, 249.90, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  'https://zphc.store/wp-content/uploads/Cardarine.jpg',
  false, true, true,
  ARRAY['cardarine','gw-501516','ppar-delta','metabolismo','lipólise']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'cardarine-gw501516-10mg-100tabs');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'MK-677 (Ibutamoren) 10mg (100 tabs)',
  'mk-677-ibutamoren-10mg-100tabs',
  'MK-677 (Ibutamoren) 10mg — secretagogo oral de GH, agonista do receptor de grelina (GHSR-1a) não peptídico. Estimula a liberação pulsátil de GH e IGF-1 sem afetar outros hormônios hipofisários. Meia-vida de 24h, permitindo administração oral uma vez ao dia. 100 comprimidos. ZPHC — excelente biodisponibilidade oral.',
  'Secretagogo oral de GH. 10mg × 100 comprimidos.',
  289.90, 339.90, 10,
  (SELECT id FROM categories WHERE slug = 'suplementos'),
  'https://zphc.store/wp-content/uploads/MK677.jpg',
  true, true, true,
  ARRAY['mk-677','ibutamoren','secretagogo','gh','grelina','oral']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'mk-677-ibutamoren-10mg-100tabs');

-- =============================================
-- INSUMOS HOSPITALARES
-- =============================================

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Água Bacteriostática 30ml',
  'agua-bacteriostatica-30ml',
  'Água Bacteriostática 30ml — água estéril para injeção contendo 0,9% de álcool benzílico como agente bacteriostático, que inibe o crescimento microbiano permitindo múltiplas retiradas do frasco. Utilizada para reconstituição de peptídeos liofilizados e hormônios. Frasco multidose de vidro com tampa de borracha. Essencial para uso com peptídeos.',
  'Diluente bacteriostático para reconstituição de peptídeos. 30ml.',
  49.90, 59.90, 10,
  (SELECT id FROM categories WHERE slug = 'insumos-hospitalares'),
  'https://zphc.store/wp-content/uploads/Bacteriostatic-Water.jpg',
  true, true, false,
  ARRAY['água bacteriostática','diluente','reconstituição','peptídeos','insumo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'agua-bacteriostatica-30ml');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Seringas Insulina 1ml BD (caixa 10 un)',
  'seringas-insulina-1ml-bd-10un',
  'Seringas para insulina BD Ultra-Fine 1ml — seringas de precisão com agulha integrada ultra-fina (31G × 8mm), ideais para aplicação subcutânea de peptídeos e insulina. Graduação de 0,01ml para dosagem precisa. Embalagem com 10 unidades individuais estéreis. Produto registrado na ANVISA. BD — referência mundial em seringas.',
  'Seringas de precisão para aplicação subcutânea. 1ml, caixa com 10 un.',
  34.90, 44.90, 10,
  (SELECT id FROM categories WHERE slug = 'insumos-hospitalares'),
  'https://images.tcdn.com.br/img/img_prod/463992/seringa_insulina_1ml_31gx8mm_bd_ultrafine_10_unidades_1_1_20200507153601.jpg',
  true, true, false,
  ARRAY['seringa','insulina','subcutânea','agulha','insumo','bd']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'seringas-insulina-1ml-bd-10un');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Agulhas Hipodérmicas 25G × 1" (caixa 100 un)',
  'agulhas-hipodermicas-25g-1-100un',
  'Agulhas Hipodérmicas 25G × 25mm (1 polegada) — para aplicações intramusculares com menor calibre. Embalagem com 100 unidades individuais estéreis, embaladas em papel grau cirúrgico. Bevel (bisel) de corte trifacetado para menor dor na aplicação. Adequadas para aplicações intramusculares em glúteos e quadríceps. Produto registrado ANVISA.',
  'Agulhas para aplicação intramuscular. 25G × 1", caixa 100 un.',
  39.90, 49.90, 10,
  (SELECT id FROM categories WHERE slug = 'insumos-hospitalares'),
  'https://images.tcdn.com.br/img/img_prod/463992/agulha_hipodérmica_descartável_25g_100_unidades_1_1_20200507153601.jpg',
  false, true, false,
  ARRAY['agulha','hipodérmica','intramuscular','25g','insumo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'agulhas-hipodermicas-25g-1-100un');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Álcool Isopropílico 70% (frasco 250ml)',
  'alcool-isopropilico-70-250ml',
  'Álcool Isopropílico (Isopropanol) 70% — solução antisséptica e desinfetante de uso tópico e para superfícies. A concentração de 70% apresenta maior eficácia germicida por permitir melhor penetração nas membranas bacterianas em comparação ao 99%. Essencial para antissepsia antes de aplicações e desinfecção de ampolas e frascos. Frasco 250ml.',
  'Álcool isopropílico 70% para antissepsia. Frasco 250ml.',
  24.90, 34.90, 10,
  (SELECT id FROM categories WHERE slug = 'insumos-hospitalares'),
  'https://images.tcdn.com.br/img/img_prod/alcool-isopropilico.jpg',
  false, true, false,
  ARRAY['álcool isopropílico','antissepsia','desinfetante','70%','insumo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'alcool-isopropilico-70-250ml');

INSERT INTO products (name, slug, description, short_description, price, original_price, stock, category_id, image_url, featured, active, requires_prescription, tags)
SELECT
  'Swabs de Álcool (caixa 100 un)',
  'swabs-alcool-100un',
  'Swabs de Álcool Isopropílico 70% — lenços individuais impregnados com álcool isopropílico 70% para antissepsia rápida antes de injeções. Embalagem individual hermética que mantém a umidade e esterilidade. Ideais para assepsia da pele antes de aplicações subcutâneas e intramusculares, e para desinfecção de tampas de borracha de frascos. Caixa com 100 unidades.',
  'Lenços antissépticos individuais. Caixa com 100 unidades.',
  19.90, 29.90, 10,
  (SELECT id FROM categories WHERE slug = 'insumos-hospitalares'),
  'https://images.tcdn.com.br/img/img_prod/swab-alcool.jpg',
  false, true, false,
  ARRAY['swab','álcool','antissepsia','lenço','insumo']
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'swabs-alcool-100un');
