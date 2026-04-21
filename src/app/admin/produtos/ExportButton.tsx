"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";

interface ProductData {
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  active: boolean;
}

export default function ExportButton() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/export-produtos");
      const data: ProductData[] = await res.json();

      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const today = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

      // Header
      doc.setFillColor(26, 92, 42);
      doc.rect(0, 0, pageW, 52, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Farmácia Santa Clara", 32, 24);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Relatório de Produtos — ${today}`, 32, 40);

      // Summary
      doc.setTextColor(113, 128, 150);
      doc.setFontSize(8);
      const categories = [...new Set(data.map((p) => p.category))];
      doc.text(`${data.length} produtos  |  ${categories.length} categorias  |  Cidade del Este, Paraguai`, 32, 68);

      // Group by category
      const groups = new Map<string, ProductData[]>();
      for (const p of data) {
        if (!groups.has(p.category)) groups.set(p.category, []);
        groups.get(p.category)!.push(p);
      }

      let startY = 80;

      for (const [category, items] of groups) {
        autoTable(doc, {
          startY,
          head: [[
            { content: category.toUpperCase(), colSpan: 3, styles: { halign: "left" } },
            { content: `${items.length} produto${items.length !== 1 ? "s" : ""}`, colSpan: 3, styles: { halign: "right" } },
          ]],
          body: items.map((p) => [
            p.name,
            p.brand || "—",
            `R$ ${p.price.toFixed(2).replace(".", ",")}`,
            String(p.stock),
            p.active ? "Ativo" : "Inativo",
          ]),
          columns: [
            { header: "Produto",  dataKey: "name" },
            { header: "Marca",    dataKey: "brand" },
            { header: "Preço",    dataKey: "price" },
            { header: "Estoque",  dataKey: "stock" },
            { header: "Status",   dataKey: "active" },
          ],
          headStyles: {
            fillColor: [26, 92, 42],
            textColor: [255, 255, 255],
            fontSize: 8,
            fontStyle: "bold",
          },
          columnStyles: {
            0: { cellWidth: 210 },
            1: { cellWidth: 120 },
            2: { cellWidth: 80, halign: "right", textColor: [26, 92, 42], fontStyle: "bold" },
            3: { cellWidth: 55, halign: "right" },
            4: { cellWidth: 60, halign: "right" },
          },
          alternateRowStyles: { fillColor: [250, 250, 250] },
          bodyStyles: { fontSize: 8, textColor: [26, 32, 44] },
          didParseCell(hookData) {
            // Color stock red if <= 5
            if (hookData.section === "body" && hookData.column.index === 3) {
              const val = Number(hookData.cell.raw);
              if (val <= 5) hookData.cell.styles.textColor = [220, 38, 38];
            }
            // Color status
            if (hookData.section === "body" && hookData.column.index === 4) {
              hookData.cell.styles.textColor =
                hookData.cell.raw === "Ativo" ? [22, 163, 74] : [113, 128, 150];
              hookData.cell.styles.fontStyle = "bold";
            }
          },
          margin: { left: 32, right: 32 },
          tableWidth: "auto",
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        startY = (doc as any).lastAutoTable.finalY + 14;
      }

      // Page numbers
      const totalPages = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(113, 128, 150);
        doc.text(
          `Página ${i} de ${totalPages}  —  Gerado em ${new Date().toLocaleString("pt-BR")}`,
          pageW / 2,
          doc.internal.pageSize.getHeight() - 14,
          { align: "center" }
        );
      }

      doc.save(`produtos-${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 bg-white hover:bg-[#f4f6f8] border border-[#e2e8f0] text-[#1a202c] text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60"
    >
      {loading
        ? <span className="w-4 h-4 border-2 border-[#718096] border-t-transparent rounded-full animate-spin" />
        : <FileDown size={16} />
      }
      {loading ? "Gerando PDF..." : "Exportar PDF"}
    </button>
  );
}
