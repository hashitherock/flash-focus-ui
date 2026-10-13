import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PRODUCTS, taka, type Product } from "@/lib/flash-data";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — VoltMart Admin" },
      { name: "description", content: "Catalog products with Flash Sale delete protection." },
      { property: "og:title", content: "Products — VoltMart Admin" },
      { property: "og:description", content: "Manage catalog products and their Flash Sale links." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [blocked, setBlocked] = useState<Product | null>(null);
  const [items, setItems] = useState(PRODUCTS);

  const onDelete = (p: Product) => {
    if (p.hasActiveFlashSale) setBlocked(p);
    else setItems((l) => l.filter((x) => x.id !== p.id));
  };

  return (
    <div className="max-w-[1240px] px-5 py-6 sm:px-8">
      <h1 className="animate-rise text-2xl font-extrabold tracking-tight sm:text-[28px]">🏷️ Products</h1>
      <p className="mt-1 text-[14px] text-ink-soft">Try deleting iPhone 15 — it's in an active Flash Sale.</p>
      <section className="glass-panel mt-6 animate-rise overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-glass-line text-[11px] tracking-wider text-ink-soft/60 uppercase">
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-3 py-3 font-semibold">Price</th>
                <th className="px-3 py-3 font-semibold">Stock</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-line">
              {items.map((p) => (
                <tr key={p.id} className="transition hover:bg-secondary">
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] font-bold">{p.image} {p.name}</p>
                    <p className="font-mono text-[11px] text-ink-soft/70">
                      {p.sku}
                      {p.hasActiveFlashSale && <span className="ml-2 font-sans font-semibold text-status-active">⚡ In active sale</span>}
                    </p>
                  </td>
                  <td className="px-3 py-3.5 font-mono text-[12.5px]">{taka(p.price)}</td>
                  <td className="px-3 py-3.5 font-mono text-[12.5px]">{p.stock}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => onDelete(p)} className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-status-cancelled transition hover:bg-status-cancelled/10">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {blocked && (
        <div className="fixed inset-0 z-[70] grid place-items-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-md" onClick={() => setBlocked(null)} />
          <div className="glass-panel relative w-full max-w-sm animate-pop rounded-3xl bg-popover p-6 shadow-2xl shadow-ink/20">
            <div className="grid size-11 place-items-center rounded-2xl bg-status-cancelled/12 text-xl">🛡️</div>
            <h2 className="mt-4 text-[20px] font-extrabold tracking-tight">Product Cannot Be Deleted</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              <span className="font-semibold text-ink">{blocked.name}</span> is currently associated with an active Flash Sale.
            </p>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setBlocked(null)} className="rounded-xl bg-ink px-4 py-2.5 text-[13px] font-semibold text-primary-foreground transition hover:scale-[1.02]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
