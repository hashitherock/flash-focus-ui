import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { PRODUCTS, taka, type Campaign, type CampaignLine } from "@/lib/flash-data";
import { useFlash } from "@/lib/flash-store";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Flash Sale — VoltMart Admin" },
      {
        name: "description",
        content:
          "Three-step wizard to select products, configure flash pricing and allocation, then review and publish a campaign.",
      },
      { property: "og:title", content: "Create Flash Sale — VoltMart Admin" },
      {
        property: "og:description",
        content: "Select products, set flash pricing and quantities, review conflicts and publish.",
      },
    ],
  }),
  component: CreateFlashSale,
});

type Config = { flashPrice: number; quantity: number; perCustomerLimit: number };

const STEPS = ["Select Products", "Configure Flash Sale", "Review & Publish"];

function CreateFlashSale() {
  const navigate = useNavigate();
  const { addCampaign } = useFlash();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(["p3"]);
  const [config, setConfig] = useState<Record<string, Config>>({
    p3: { flashPrice: 3499, quantity: 100, perCustomerLimit: 2 },
  });
  const [name, setName] = useState("Summer Mega Flash Sale");
  const [day, setDay] = useState("2026-09-11");
  const [start, setStart] = useState("20:00");
  const [end, setEnd] = useState("22:00");
  const [created, setCreated] = useState<Campaign | null>(null);

  const products = useMemo(
    () =>
      PRODUCTS.filter((p) =>
        `${p.name} ${p.sku} ${p.category}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const lines: CampaignLine[] = selected.map((id) => {
    const p = PRODUCTS.find((x) => x.id === id)!;
    const c = config[id] ?? {
      flashPrice: Math.round(p.price * 0.85),
      quantity: Math.min(50, p.stock),
      perCustomerLimit: 2,
    };
    return {
      productId: p.id,
      name: p.name,
      sku: p.sku,
      image: p.image,
      originalPrice: p.price,
      flashPrice: c.flashPrice,
      productStock: p.stock,
      quantity: c.quantity,
      perCustomerLimit: c.perCustomerLimit,
      sold: 0,
    };
  });

  const overlaps = (id: string) => {
    const p = PRODUCTS.find((x) => x.id === id)!;
    if (!p.existingWindow) return false;
    return start < "22:00" && end > "20:00";
  };

  const priceError = (l: CampaignLine) => l.flashPrice >= l.originalPrice;
  const qtyError = (l: CampaignLine) => l.quantity > l.productStock;
  const hasConflict = selected.some((id) => overlaps(id));
  const invalid = lines.some((l) => priceError(l) || qtyError(l)) || hasConflict;

  const setCfg = (id: string, patch: Partial<Config>) =>
    setConfig((c) => {
      const p = PRODUCTS.find((x) => x.id === id)!;
      const base = c[id] ?? {
        flashPrice: Math.round(p.price * 0.85),
        quantity: Math.min(50, p.stock),
        perCustomerLimit: 2,
      };
      return { ...c, [id]: { ...base, ...patch } };
    });

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const go = (next: number) => {
    setDirection(next > step ? "next" : "back");
    setStep(next);
  };

  const publish = () => {
    const fmt = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      const hh = ((h ?? 0) % 12 || 12).toString();
      return `${hh}:${String(m ?? 0).padStart(2, "0")} ${(h ?? 0) >= 12 ? "PM" : "AM"}`;
    };
    const pretty = new Date(`${day}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const campaign: Campaign = {
      id: `fs-${Math.floor(Math.random() * 9000 + 1000)}`,
      code: `FS-${Math.floor(Math.random() * 9000 + 1000)}`,
      name,
      status: "scheduled",
      startDay: pretty,
      startTime: fmt(start),
      endDay: pretty,
      endTime: fmt(end),
      countdown: "04h 12m",
      revenue: 0,
      lines,
    };
    addCampaign(campaign);
    setCreated(campaign);
  };

  const totalQty = lines.reduce((s, l) => s + l.quantity, 0);

  return (
    <div className="max-w-[1240px] px-5 py-6 sm:px-8">
      <Link to="/" className="text-[12px] font-semibold text-ink-soft transition hover:text-ink">
        ← Flash Sales
      </Link>

      <header className="mt-3 animate-rise">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight sm:text-[28px]">
          <span className="text-volt">⚡</span> Create Flash Sale
        </h1>
        <p className="mt-1 text-[14px] text-ink-soft">
          Pick products, set flash pricing and allocation, then review and publish.
        </p>
      </header>

      {/* STEP INDICATOR */}
      <div className="glass-panel mt-6 flex animate-rise items-center gap-3 rounded-2xl p-3 sm:gap-4">
        {STEPS.map((label, i) => (
          <div key={label} className="flex min-w-0 flex-1 items-center gap-3">
            <button
              onClick={() => i < step && go(i)}
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-xl font-mono text-[12px] font-bold transition",
                i === step
                  ? "bg-ink text-primary-foreground shadow-lg shadow-ink/20"
                  : i < step
                    ? "bg-status-active/15 text-status-active"
                    : "border border-glass-line bg-secondary text-ink-soft",
              )}
            >
              {i < step ? "✓" : `0${i + 1}`}
            </button>
            <div className="min-w-0">
              <p
                className={cn(
                  "truncate text-[12.5px] font-semibold",
                  i === step ? "text-ink" : "text-ink-soft",
                )}
              >
                {label}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className="hidden h-0.5 flex-1 overflow-hidden rounded-full bg-ink/10 sm:block">
                <div
                  className="h-full rounded-full bg-volt transition-all duration-500"
                  style={{ width: i < step ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        key={step}
        className={cn("mt-4", direction === "next" ? "animate-slide-left" : "animate-slide-right")}
      >
        {/* STEP 1 */}
        {step === 0 && (
          <section className="glass-panel rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[13px] font-bold">Select products</p>
                <p className="mt-0.5 text-[12px] text-ink-soft">
                  {selected.length} selected from the catalog.
                </p>
              </div>
              <div className="flex min-w-[200px] items-center gap-2 rounded-xl border border-glass-line bg-secondary px-3 py-2">
                <span className="text-ink-soft/60">🔍</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products or SKU"
                  className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-ink-soft/50"
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => {
                const on = selected.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggle(p.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-3.5 text-left transition hover:-translate-y-0.5",
                      on
                        ? "border-brand/40 bg-brand/8 shadow-md shadow-brand/10"
                        : "border-glass-line bg-secondary hover:bg-accent",
                    )}
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-glass-line bg-background text-xl">
                      {p.image}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-bold">{p.name}</span>
                      <span className="mt-0.5 block font-mono text-[11px] text-ink-soft/70">{p.sku}</span>
                      <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px]">
                        <span className="text-ink-soft">
                          Price <span className="font-mono font-semibold text-ink">{taka(p.price)}</span>
                        </span>
                        <span className="text-ink-soft">
                          Stock <span className="font-mono font-semibold text-ink">{p.stock}</span>
                        </span>
                      </span>
                    </span>
                    <span
                      className={cn(
                        "mt-1 grid size-5 shrink-0 place-items-center rounded-md border text-[11px] transition",
                        on
                          ? "border-brand bg-brand text-brand-foreground"
                          : "border-ink/20 bg-background",
                      )}
                    >
                      {on ? "✓" : ""}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                disabled={selected.length === 0}
                onClick={() => go(1)}
                className="rounded-xl bg-ink px-4 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-lg shadow-ink/20 transition hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
              >
                Continue →
              </button>
            </div>
          </section>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <section className="space-y-4">
            <div className="glass-panel rounded-2xl p-5">
              <p className="text-[13px] font-bold">Campaign schedule</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="block">
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                    Campaign name
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-glass-line bg-secondary px-3 py-2 text-[13px] outline-none focus:border-brand/50"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                    Date
                  </span>
                  <input
                    type="date"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-glass-line bg-secondary px-3 py-2 text-[13px] outline-none focus:border-brand/50"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                    Starts
                  </span>
                  <input
                    type="time"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-glass-line bg-secondary px-3 py-2 text-[13px] outline-none focus:border-brand/50"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                    Ends
                  </span>
                  <input
                    type="time"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-glass-line bg-secondary px-3 py-2 text-[13px] outline-none focus:border-brand/50"
                  />
                </label>
              </div>
            </div>

            {lines.map((l) => {
              const pErr = priceError(l);
              const qErr = qtyError(l);
              const conflict = overlaps(l.productId);
              const existing = PRODUCTS.find((p) => p.id === l.productId)!.existingWindow;
              const discount = Math.max(
                0,
                Math.round(((l.originalPrice - l.flashPrice) / l.originalPrice) * 100),
              );
              const normalStock = Math.max(0, l.productStock - l.quantity);
              return (
                <div key={l.productId} className="glass-panel rounded-2xl p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-glass-line bg-secondary text-xl">
                      {l.image}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-bold">{l.name}</p>
                      <p className="font-mono text-[11px] text-ink-soft/70">{l.sku}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-5">
                    <div>
                      <span className="text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                        Original price
                      </span>
                      <p className="mt-1.5 rounded-xl border border-glass-line bg-muted px-3 py-2 font-mono text-[13px] text-ink-soft">
                        {taka(l.originalPrice)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                        Flash sale price
                      </span>
                      <input
                        type="number"
                        value={l.flashPrice}
                        onChange={(e) => setCfg(l.productId, { flashPrice: Number(e.target.value) })}
                        className={cn(
                          "mt-1.5 w-full rounded-xl border bg-secondary px-3 py-2 font-mono text-[13px] outline-none",
                          pErr
                            ? "animate-shake border-status-cancelled/60 bg-status-cancelled/8"
                            : "border-glass-line focus:border-brand/50",
                        )}
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                        Product stock
                      </span>
                      <p className="mt-1.5 rounded-xl border border-glass-line bg-muted px-3 py-2 font-mono text-[13px] text-ink-soft">
                        {l.productStock}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                        Flash sale quantity
                      </span>
                      <input
                        type="number"
                        value={l.quantity}
                        onChange={(e) => setCfg(l.productId, { quantity: Number(e.target.value) })}
                        className={cn(
                          "mt-1.5 w-full rounded-xl border bg-secondary px-3 py-2 font-mono text-[13px] outline-none",
                          qErr
                            ? "animate-shake border-status-cancelled/60 bg-status-cancelled/8"
                            : "border-glass-line focus:border-brand/50",
                        )}
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                        Per customer limit
                      </span>
                      <input
                        type="number"
                        value={l.perCustomerLimit}
                        onChange={(e) =>
                          setCfg(l.productId, { perCustomerLimit: Number(e.target.value) })
                        }
                        className="mt-1.5 w-full rounded-xl border border-glass-line bg-secondary px-3 py-2 font-mono text-[13px] outline-none focus:border-brand/50"
                      />
                    </div>
                  </div>

                  {(pErr || qErr) && (
                    <div className="mt-3 space-y-1.5">
                      {pErr && (
                        <p className="animate-rise text-[12px] font-semibold text-status-cancelled">
                          ⚠ Flash Sale price must be lower than the Original Price.
                        </p>
                      )}
                      {qErr && (
                        <p className="animate-rise text-[12px] font-semibold text-status-cancelled">
                          ⚠ Flash Sale quantity cannot exceed available product stock.
                        </p>
                      )}
                    </div>
                  )}

                  {/* PRICE SNAPSHOT + STOCK ALLOCATION */}
                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-2xl border border-glass-line bg-secondary p-4">
                      <p className="text-[12px] font-bold">Price snapshot</p>
                      <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-2">
                        <div>
                          <p className="text-[11px] text-ink-soft">Original price</p>
                          <p className="font-mono text-[14px] text-ink-soft line-through">
                            {taka(l.originalPrice)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-ink-soft">Flash sale price</p>
                          <p className="font-mono text-[16px] font-extrabold">{taka(l.flashPrice)}</p>
                        </div>
                        <span className="rounded-full border border-status-active/25 bg-status-active/12 px-2.5 py-1 text-[12px] font-bold text-status-active">
                          {discount}% OFF
                        </span>
                      </div>
                      <p className="mt-3 text-[11px] leading-snug text-ink-soft/80">
                        Original Price is captured when the Flash Sale is created.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-glass-line bg-secondary p-4">
                      <p className="text-[12px] font-bold">Stock allocation</p>
                      <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-ink/10">
                        <div
                          className="h-full bg-brand transition-all duration-500"
                          style={{ width: `${(Math.min(l.quantity, l.productStock) / Math.max(l.productStock, 1)) * 100}%` }}
                        />
                        <div className="h-full flex-1 bg-ink/15" />
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[11.5px] sm:grid-cols-4">
                        <div>
                          <p className="text-ink-soft">Product stock</p>
                          <p className="font-mono font-semibold">{l.productStock}</p>
                        </div>
                        <div>
                          <p className="text-ink-soft">Flash allocation</p>
                          <p className="font-mono font-semibold text-brand">{l.quantity}</p>
                        </div>
                        <div>
                          <p className="text-ink-soft">Normal stock</p>
                          <p className="font-mono font-semibold">{normalStock}</p>
                        </div>
                        <div>
                          <p className="text-ink-soft">Per customer</p>
                          <p className="font-mono font-semibold">{l.perCustomerLimit}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] leading-snug text-ink-soft/80">
                        Flash Sale quantity is held separately from the product's normal selling stock.
                      </p>
                    </div>
                  </div>

                  {/* TIME CONFLICT TIMELINE */}
                  {existing && (
                    <div
                      className={cn(
                        "mt-4 rounded-2xl border p-4",
                        conflict
                          ? "border-status-cancelled/30 bg-status-cancelled/8"
                          : "border-status-active/25 bg-status-active/8",
                      )}
                    >
                      <p
                        className={cn(
                          "text-[12.5px] font-bold",
                          conflict ? "text-status-cancelled" : "text-status-active",
                        )}
                      >
                        {conflict ? "⚠️ Scheduling conflict" : "✓ Available"}
                      </p>
                      <p className="mt-1 text-[12px] text-ink-soft">
                        {conflict
                          ? "This product already has an overlapping Flash Sale."
                          : "No overlapping Flash Sale for this product in the selected window."}
                      </p>

                      <div className="mt-3 space-y-2.5">
                        <div>
                          <p className="text-[11px] font-medium text-ink-soft">
                            Existing · {existing.day} {existing.start} – {existing.end}
                          </p>
                          <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/10">
                            <div className="ml-[20%] h-full w-[40%] rounded-full bg-ink/40" />
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-medium text-ink-soft">
                            Your campaign · {start} – {end}
                          </p>
                          <div className="relative mt-1 h-2 overflow-hidden rounded-full bg-ink/10">
                            <div
                              className={cn(
                                "ml-[35%] h-full w-[40%] rounded-full",
                                conflict ? "bg-status-cancelled" : "bg-status-active",
                              )}
                            />
                            {conflict && (
                              <div className="absolute top-0 left-[35%] h-full w-[25%] bg-status-cancelled/40" />
                            )}
                          </div>
                        </div>
                      </div>
                      <p
                        className={cn(
                          "mt-3 text-[11px] font-bold tracking-wide",
                          conflict ? "text-status-cancelled" : "text-status-active",
                        )}
                      >
                        {conflict ? "❌ Conflict — not allowed" : "✓ Window is clear"}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="flex flex-wrap justify-between gap-2">
              <button
                onClick={() => go(0)}
                className="rounded-xl border border-glass-line bg-secondary px-4 py-2.5 text-[13px] font-semibold text-ink-soft transition hover:text-ink"
              >
                ← Back
              </button>
              <button
                disabled={invalid}
                onClick={() => go(2)}
                className="rounded-xl bg-ink px-4 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-lg shadow-ink/20 transition hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
              >
                Review campaign →
              </button>
            </div>
          </section>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <section className="space-y-4">
            <div className="glass-panel rounded-2xl p-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                    Campaign
                  </p>
                  <p className="mt-1 text-[15px] font-extrabold">{name}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                    Schedule
                  </p>
                  <p className="mt-1 font-mono text-[13px]">
                    {day} · {start} → {end}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                    Products
                  </p>
                  <p className="mt-1 font-mono text-[15px] font-extrabold">{lines.length}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-ink-soft uppercase">
                    Total flash quantity
                  </p>
                  <p className="mt-1 font-mono text-[15px] font-extrabold">{totalQty}</p>
                </div>
              </div>
            </div>

            <div className="glass-panel overflow-hidden rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left">
                  <thead>
                    <tr className="border-b border-glass-line text-[11px] tracking-wider text-ink-soft/60 uppercase">
                      <th className="px-5 py-3 font-semibold">Product</th>
                      <th className="px-3 py-3 font-semibold">Original price</th>
                      <th className="px-3 py-3 font-semibold">Flash price</th>
                      <th className="px-3 py-3 font-semibold">Quantity</th>
                      <th className="px-5 py-3 font-semibold">Customer limit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-glass-line">
                    {lines.map((l) => (
                      <tr key={l.productId} className="transition hover:bg-secondary">
                        <td className="px-5 py-3.5 text-[13px] font-semibold">
                          {l.image} {l.name}
                        </td>
                        <td className="px-3 py-3.5 font-mono text-[12.5px] text-ink-soft line-through">
                          {taka(l.originalPrice)}
                        </td>
                        <td className="px-3 py-3.5 font-mono text-[12.5px] font-semibold">
                          {taka(l.flashPrice)}
                        </td>
                        <td className="px-3 py-3.5 font-mono text-[12.5px]">{l.quantity}</td>
                        <td className="px-5 py-3.5 font-mono text-[12.5px]">{l.perCustomerLimit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-2">
              <button
                onClick={() => go(1)}
                className="rounded-xl border border-glass-line bg-secondary px-4 py-2.5 text-[13px] font-semibold text-ink-soft transition hover:text-ink"
              >
                ← Back
              </button>
              <button
                onClick={publish}
                className="rounded-xl bg-ink px-4 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-lg shadow-ink/20 transition hover:scale-[1.02] active:scale-[.99]"
              >
                <span className="text-volt">⚡</span> Create Flash Sale
              </button>
            </div>
          </section>
        )}
      </div>

      {/* SUCCESS */}
      {created && (
        <div className="fixed inset-0 z-[75] grid place-items-center p-4">
          <div className="absolute inset-0 bg-ink/45 backdrop-blur-md" />
          <div className="glass-panel relative w-full max-w-md animate-pop overflow-hidden rounded-3xl bg-popover p-7 text-center shadow-2xl shadow-ink/20">
            <div className="pointer-events-none absolute inset-x-0 top-10 flex justify-center">
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "absolute size-1.5 rounded-full",
                    i % 3 === 0 ? "bg-volt" : i % 3 === 1 ? "bg-brand" : "bg-status-active",
                  )}
                  style={{
                    animation: `confetti ${1.1 + (i % 5) * 0.12}s ease-out ${i * 0.04}s forwards`,
                    ["--cx" as string]: `${(i - 7) * 16}px`,
                    ["--cy" as string]: `${-70 - (i % 4) * 26}px`,
                  }}
                />
              ))}
            </div>
            <div className="mx-auto grid size-14 animate-check-pop place-items-center rounded-2xl bg-status-active text-2xl text-primary-foreground">
              ✓
            </div>
            <h2 className="mt-4 text-[22px] font-extrabold tracking-tight">
              <span className="text-volt">⚡</span> Flash Sale Created!
            </h2>
            <p className="mt-1.5 text-[13px] text-ink-soft">Campaign successfully created.</p>

            <div className="mt-5 rounded-2xl border border-glass-line bg-secondary p-4 text-left">
              <p className="text-[14px] font-bold">{created.name}</p>
              <p className="mt-1 font-mono text-[12px] text-ink-soft">
                {created.startDay} · {created.startTime} → {created.endTime}
              </p>
              <p className="mt-2 text-[12px] text-ink-soft">
                {created.lines.length} products · {totalQty} flash units · scheduled
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => navigate({ to: "/" })}
                className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-ink-soft transition hover:bg-accent hover:text-ink"
              >
                Back to Flash Sales
              </button>
              <button
                onClick={() => navigate({ to: "/campaign/$id", params: { id: created.id } })}
                className="rounded-xl bg-ink px-4 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-lg shadow-ink/20 transition hover:scale-[1.02]"
              >
                View Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
