import { NextResponse } from "next/server";
import sql from "@/lib/db";
import PDFDocument from "pdfkit";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await sql`
    SELECT p.name, p.price, p.stock,
           c.name AS category_name, b.name AS brand_name
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN brands b ON b.id = p.brand_id
    WHERE p.active = true
    ORDER BY c.name, p.name
  `;

  const grouped: Record<string, typeof products> = {};
  for (const p of products) {
    const cat = (p.category_name as string) ?? "Outros";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  }

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", resolve);
    doc.on("error", reject);

    // Cabeçalho
    doc.fontSize(20).fillColor("#16a34a").text("Farmácia Santa Clara", { align: "center" });
    doc.fontSize(11).fillColor("#555").text("Catálogo de Produtos — Cidade del Este, Paraguai", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(9).fillColor("#888").text(`Atualizado em ${new Date().toLocaleDateString("pt-BR")}`, { align: "center" });
    doc.moveDown(1);

    for (const [category, items] of Object.entries(grouped)) {
      // Cabeçalho da categoria
      doc.fontSize(12).fillColor("#ffffff")
        .rect(40, doc.y, doc.page.width - 80, 18).fill("#16a34a");
      doc.fillColor("#ffffff").text(category.toUpperCase(), 45, doc.y - 15);
      doc.moveDown(0.8);

      // Cabeçalho da tabela
      const y = doc.y;
      doc.fontSize(8).fillColor("#333")
        .text("Produto", 40, y, { width: 230 })
        .text("Marca", 275, y, { width: 110 })
        .text("Preço", 390, y, { width: 70 })
        .text("Estoque", 465, y, { width: 65 });
      doc.moveTo(40, y + 12).lineTo(doc.page.width - 40, y + 12).strokeColor("#ccc").stroke();
      doc.moveDown(0.5);

      items.forEach((p, i) => {
        if (doc.y > doc.page.height - 80) doc.addPage();
        const rowY = doc.y;
        const bg = i % 2 === 0 ? "#f9f9f9" : "#ffffff";
        doc.rect(40, rowY, doc.page.width - 80, 14).fill(bg);
        const price = Number(p.price) > 0
          ? `R$ ${Number(p.price).toFixed(2).replace(".", ",")}`
          : "Consulte";
        const stock = Number(p.stock) > 0 ? "Em estoque" : "Esgotado";
        doc.fontSize(8).fillColor("#222")
          .text(String(p.name), 42, rowY + 2, { width: 228 })
          .text(String(p.brand_name ?? "—"), 275, rowY + 2, { width: 110 })
          .text(price, 390, rowY + 2, { width: 70 })
          .text(stock, 465, rowY + 2, { width: 65 });
        doc.moveDown(0.5);
      });

      doc.moveDown(0.8);
    }

    // Rodapé
    doc.fontSize(9).fillColor("#888")
      .text("Preços sujeitos a alteração. Pagamento combinado via WhatsApp.", 40, doc.page.height - 50, { align: "center" });

    doc.end();
  });

  const pdf = Buffer.concat(chunks);
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="catalogo-santa-clara.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
