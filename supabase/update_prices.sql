-- =============================================
-- Preços direto da coluna "Price BR" do PDF ZPHC
-- Execute no SQL Editor do Supabase
-- =============================================

-- PEPTÍDEOS
UPDATE products SET price = 366.12, original_price = 421.04 WHERE slug = 'bpc-157-5mg';           -- BPC-157 25mg (5x5mg)
UPDATE products SET price = 439.58, original_price = 505.52 WHERE slug = 'tb-500-5mg';             -- TB-500 25mg (5x5mg)
UPDATE products SET price = 162.07, original_price = 186.38 WHERE slug = 'semaglutida-5mg';        -- Semaglutide 5mg (5x1mg)
UPDATE products SET price = 514.21, original_price = 591.34 WHERE slug = 'tirzepatida-5mg';        -- T 25mg (5x5mg)
UPDATE products SET price = 307.82, original_price = 354.00 WHERE slug = 'retatrutida-5mg';        -- Reta 10mg (5x2mg)
UPDATE products SET price = 181.90, original_price = 209.18 WHERE slug = 'ghrp-2-5mg';             -- GHRP-2 25mg (5x5mg)
UPDATE products SET price = 181.90, original_price = 209.18 WHERE slug = 'ghrp-6-5mg';             -- GHRP-6 25mg (5x5mg)
UPDATE products SET price = 439.58, original_price = 505.52 WHERE slug = 'cjc-1295-sem-dac-2mg';   -- Wellness Mix (CJC+Ipamorelin)
UPDATE products SET price = 436.08, original_price = 501.49 WHERE slug = 'ipamorelin-2mg';         -- Ipamorelin 25mg (5x5mg)
UPDATE products SET price = 328.81, original_price = 378.13 WHERE slug = 'pt-141-10mg';            -- estimativa similar
UPDATE products SET price = 115.43, original_price = 132.75 WHERE slug = 'aod-9604-5mg';           -- AOD 9604 5mg (1 vial + BW)
UPDATE products SET price = 218.04, original_price = 250.75 WHERE slug = 'selank-5mg';             -- estimativa GHK-Cu similar
UPDATE products SET price = 218.04, original_price = 250.75 WHERE slug = 'semax-5mg';              -- estimativa GHK-Cu similar

-- HORMÔNIOS
UPDATE products SET price = 156.24, original_price = 179.68 WHERE slug = 'hcg-5000ui';             -- HP-hCG 5000IU
UPDATE products SET price = 321.82, original_price = 370.09 WHERE slug = 'somatropina-10ui';       -- ZPtrop AQ pen 36IU
UPDATE products SET price = 321.82, original_price = 370.09 WHERE slug = 'somatropina-36ui';       -- ZPtrop AQ pen 36IU premixed
UPDATE products SET price = 159.74, original_price = 183.70 WHERE slug = 'testosterona-enantato-250mg';     -- Test.Enan 250 (10 amps)
UPDATE products SET price = 159.74, original_price = 183.70 WHERE slug = 'testosterona-cipionato-250mg';    -- Test.Cyp 250 (10 amps)
UPDATE products SET price = 124.76, original_price = 143.47 WHERE slug = 'testosterona-propionato-100mg';   -- Test.Prop 100 (10 amps)
UPDATE products SET price = 163.24, original_price = 187.73 WHERE slug = 'sustanon-250mg';         -- Test.Mix 250 (10 amps)
UPDATE products SET price = 187.73, original_price = 215.89 WHERE slug = 'nandrolona-decanoato-250mg';      -- Nand.Dec 250 (10 amps)
UPDATE products SET price = 170.24, original_price = 195.77 WHERE slug = 'nandrolona-fenilpropionato-100mg'; -- NPP 100 (10 amps)
UPDATE products SET price = 274.01, original_price = 315.11 WHERE slug = 'trembolona-enantato-200mg';       -- Tren.Enan 200 (10 amps)
UPDATE products SET price = 233.20, original_price = 268.18 WHERE slug = 'trembolona-acetato-100mg';        -- Tren.Acet 100 (10 amps)
UPDATE products SET price = 184.23, original_price = 211.86 WHERE slug = 'boldenona-undecilato-250mg';      -- Boldenone 250 (10 amps)
UPDATE products SET price = 198.22, original_price = 227.95 WHERE slug = 'drostanolona-propionato-100mg';   -- Drost.Prop 100 (10 amps)
UPDATE products SET price = 270.51, original_price = 311.09 WHERE slug = 'drostanolona-enantato-200mg';     -- Drost.Enan 200 (10 amps)
UPDATE products SET price = 340.47, original_price = 391.54 WHERE slug = 'primobolan-100mg';               -- Methenolone 100 (10 amps)
UPDATE products SET price = 152.75, original_price = 175.66 WHERE slug = 'winstrol-injetavel-50mg';        -- Stanozolol AQ 50 (10 amps)

-- SUPLEMENTOS (orais)
UPDATE products SET price = 261.18, original_price = 300.36 WHERE slug = 'oxandrolona-10mg-100tabs';        -- Oxandrolone 10mg 100 tabs
UPDATE products SET price = 103.77, original_price = 119.34 WHERE slug = 'estanozolol-10mg-100tabs';        -- Stanozolol 10mg 100 tabs
UPDATE products SET price = 103.77, original_price = 119.34 WHERE slug = 'metandienona-10mg-100tabs';       -- Methandienone 10mg 100 tabs
UPDATE products SET price = 152.75, original_price = 175.66 WHERE slug = 'oximetolona-50mg-100tabs';        -- Oxymetholone 25mg 100 tabs
UPDATE products SET price = 135.26, original_price = 155.54 WHERE slug = 'turinabol-10mg-100tabs';          -- Turinabol 10mg 100 tabs
UPDATE products SET price = 173.73, original_price = 199.79 WHERE slug = 'anastrozol-1mg-100tabs';          -- Anastrozole 1mg 100 tabs
UPDATE products SET price = 156.24, original_price = 179.68 WHERE slug = 'letrozol-2-5mg-100tabs';          -- estimativa similar clomiphene
UPDATE products SET price = 156.24, original_price = 179.68 WHERE slug = 'clomifeno-50mg-100tabs';          -- Clomiphene 25mg 100 tabs
UPDATE products SET price = 122.43, original_price = 140.79 WHERE slug = 'tamoxifeno-20mg-100tabs';         -- estimativa Liothyronine similar
UPDATE products SET price = 191.22, original_price = 219.90 WHERE slug = 'exemestano-25mg-100tabs';         -- estimativa Mesterolone similar
UPDATE products SET price = 191.22, original_price = 219.90 WHERE slug = 'proviron-25mg-100tabs';           -- Mesterolone 25mg 100 tabs
UPDATE products SET price = 374.29, original_price = 430.43 WHERE slug = 'ostarina-mk2866-10mg-100tabs';    -- Ostarine 20mg 100 tabs
UPDATE products SET price = 298.50, original_price = 343.27 WHERE slug = 'ligandrol-lgd4033-5mg-100tabs';   -- Ligandrol 10mg 100 tabs
UPDATE products SET price = 284.50, original_price = 327.18 WHERE slug = 'rad-140-10mg-100tabs';            -- RAD140 10mg 100 tabs
UPDATE products SET price = 416.26, original_price = 478.70 WHERE slug = 'cardarine-gw501516-10mg-100tabs'; -- Cardarine 20mg 100 tabs
UPDATE products SET price = 447.74, original_price = 514.90 WHERE slug = 'mk-677-ibutamoren-10mg-100tabs';  -- Ibutamoren 20mg 100 tabs

-- INSUMOS HOSPITALARES
-- Bacteriostatic Water 11ml = R$ 17.49 → 30ml ≈ R$ 47.70
UPDATE products SET price = 47.70,  original_price = 59.90  WHERE slug = 'agua-bacteriostatica-30ml';
UPDATE products SET price = 34.90,  original_price = 44.90  WHERE slug = 'seringas-insulina-1ml-bd-10un';
UPDATE products SET price = 39.90,  original_price = 49.90  WHERE slug = 'agulhas-hipodermicas-25g-1-100un';
UPDATE products SET price = 24.90,  original_price = 34.90  WHERE slug = 'alcool-isopropilico-70-250ml';
UPDATE products SET price = 19.90,  original_price = 29.90  WHERE slug = 'swabs-alcool-100un';
