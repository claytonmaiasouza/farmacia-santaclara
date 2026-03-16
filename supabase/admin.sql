-- =============================================
-- Admin: execute no SQL Editor do Supabase
-- =============================================

-- Adiciona campo is_admin na tabela profiles
alter table profiles add column if not exists is_admin boolean not null default false;

-- Torna um usuário admin pelo e-mail (substitua pelo seu e-mail)
-- update profiles set is_admin = true
-- where id = (select id from auth.users where email = 'seu@email.com');

-- Políticas admin para produtos (admin pode criar/editar/deletar)
create policy "Admin gerencia produtos"
  on products for all
  using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admin gerencia categorias"
  on categories for all
  using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admin gerencia marcas"
  on brands for all
  using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admin gerencia imagens"
  on product_images for all
  using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admin gerencia pedidos"
  on orders for all
  using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admin gerencia itens de pedidos"
  on order_items for all
  using (
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- Storage bucket para imagens de produtos
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "Imagens públicas"
  on storage.objects for select
  using (bucket_id = 'products');

create policy "Admin faz upload"
  on storage.objects for insert
  with check (
    bucket_id = 'products'
    and exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admin deleta imagens"
  on storage.objects for delete
  using (
    bucket_id = 'products'
    and exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );
