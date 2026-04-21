import sql from "@/lib/db";

export async function getProductsContext(): Promise<string> {
  const products = await sql`
    SELECT p.name, p.short_description, p.price, p.stock,
           c.name AS category_name, b.name AS brand_name
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN brands b ON b.id = p.brand_id
    WHERE p.active = true
    ORDER BY p.name
  `;

  if (!products.length) return "Nenhum produto disponível no momento.";

  return products.map((p) => {
    const price = Number(p.price) > 0
      ? `R$ ${Number(p.price).toFixed(2).replace(".", ",")}`
      : "Consulte o preço";
    const stock = Number(p.stock) > 0 ? "Em estoque" : "Fora de estoque";
    return `• ${p.name} | Marca: ${p.brand_name ?? "—"} | Categoria: ${p.category_name ?? "—"} | Preço: ${price} | ${stock}`;
  }).join("\n");
}
