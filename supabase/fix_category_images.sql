-- Imagens das categorias
-- Execute no SQL Editor do Supabase

UPDATE categories SET image_url = 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE slug = 'peptideos';

UPDATE categories SET image_url = 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE slug = 'hormonios';

UPDATE categories SET image_url = 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE slug = 'vitaminas';

UPDATE categories SET image_url = 'https://images.pexels.com/photos/3621168/pexels-photo-3621168.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE slug = 'suplementos';

UPDATE categories SET image_url = 'https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg?auto=compress&cs=tinysrgb&w=800'
WHERE slug = 'insumos-hospitalares';
