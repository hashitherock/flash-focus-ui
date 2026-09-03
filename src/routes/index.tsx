import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { STATUS, STATUS_ORDER, totals, type Status } from "@/lib/flash-data";
import { useFlash } from "@/lib/flash-store";
import { useCountUp } from "@/lib/use-count-up";
import { StatusBadge } from "@/components/flash/status-badge";
import { StatusDropdown } from "@/components/flash/status-dropdown";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flash Sales — VoltMart Admin" },
      {
        name: "description",
        content:
          "Create, manage and monitor limited-time Flash Sale campaigns from the VoltMart operations dashboard.",
      },
      { property: "og:title", content: "Flash Sales — VoltMart Admin" },
      {
        property: "og:description",
        content: "Premium Flash Sales management console for e-commerce operations teams.",
      },
    ],
  }),
  component: FlashSalesDashboard,
});

const KPIS: { label: string; value: number; hint: string; status: Status }[] = [
  { label: "Active", value: 12, hint: "▲ 3 vs last week", status: "active" },
  { label: "Scheduled", value: 8, hint: "Next in 02h 18m", status: "scheduled" },
  { label: "Expired", value: 24, hint: "Avg 1.4 days live", status: "expired" },
  { label: "Sold Out", value: 6, hint: "🔥 100% velocity", status: "soldout" },
];

function KpiCard({ kpi, index }: { kpi: (typeof KPIS)[number]; index: number }) {
  const meta = STATUS[kpi.status];
  const n = useCountUp(kpi.value, 900, index * 90);
  return (
    <div
      className="glass-panel animate-rise rounded-2xl p-4 shadow-sm shadow-ink/5 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-ink/10"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-ink-soft">{kpi.label}</span>
        <span
          className={cn("size-2 rounded-full", meta.dotClass, kpi.status === "active" && "animate-pulse-dot")}
        />
      </div>
      <p className="mt-2 font-mono text-3xl font-extrabold tracking-tight">{n}</p>
      <p className={cn("mt-1 text-[11px] font-semibold", meta.textClass)}>{kpi.hint}</p>
    </div>
  );
}

function FlashSalesDashboard() {
  const { campaigns, requestStatusChange, changedId } = useFlash();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");
  const [product, setProduct] = useState("all");
  const [sort, setSort] = useState<"newest" | "sold">("newest");
  const [statusOpen, setStatusOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  const productOptions = useMemo(
    () => Array.from(new Set(campaigns.flatMap((c) => c.lines.map((l) => l.name)))).sort(),
    [campaigns],
  );

  const rows = useMemo(() => {
    let list = campaigns.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (product !== "all" && !c.lines.some((l) => l.name === product)) return false;
      if (query && !`${c.name} ${c.code}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    if (sort === "sold") list = [...list].sort((a, b) => totals(b).sold - totals(a).sold);
    return list;
  }, [campaigns, status, product, query, sort]);

  const reset = () => {
    setQuery("");
    setStatus("all");
    setProduct("all");
    setSort("newest");
  };

  const chip =
    "rounded-xl border border-glass-line bg-secondary px-3 py-2 text-[13px] font-medium text-ink-soft transition hover:text-ink";

  return (
    <div className="max-w-[1240px] px-5 py-6 sm:px-8">
      <header className="grid animate-rise grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight sm:text-[28px]">
            <span className="text-volt">⚡</span> Flash Sales
          </h1>
          <p className="mt-1 text-[14px] text-ink-soft">
            Create, manage and monitor limited-time product campaigns.
          </p>
        </div>
        <Link
          to="/create"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-lg shadow-ink/20 transition hover:scale-[1.02] active:scale-[.99]"
        >
          <span className="text-base leading-none text-volt">+</span>
          <span className="hidden sm:inline">Create Flash Sale</span>
          <span className="sm:hidden">Create</span>
        </Link>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPIS.map((k, i) => (
          <KpiCard key={k.label} kpi={k} index={i} />
        ))}
      </section>

      <section
        className="glass-panel mt-6 flex animate-rise flex-wrap items-center gap-2 rounded-2xl p-3"
        style={{ animationDelay: "260ms" }}
      >
        <div className="flex min-w-[200px] flex-1 items-center gap-2 rounded-xl border border-glass-line bg-secondary px-3 py-2">
          <span className="text-ink-soft/60">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search flash sale"
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-ink-soft/50"
          />
        </div>

        <div className="relative">
          <button className={chip} onClick={() => setStatusOpen((o) => !o)}>
            Status · {status === "all" ? "All" : STATUS[status].label} ▾
          </button>
          {statusOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setStatusOpen(false)} />
              <div className="glass-panel absolute left-0 z-40 mt-2 w-52 animate-pop rounded-2xl p-1.5 shadow-xl shadow-ink/10">
                {(["all", ...STATUS_ORDER] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatus(s as Status | "all");
                      setStatusOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium transition hover:bg-accent"
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        s === "all" ? "bg-brand" : STATUS[s as Status].dotClass,
                      )}
                    />
                    {s === "all" ? "All" : STATUS[s as Status].label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button className={chip}>10 Sep – 12 Sep ▾</button>

        <div className="relative">
          <button className={chip} onClick={() => setProductOpen((o) => !o)}>
            {product === "all" ? "Products" : product} ▾
          </button>
          {productOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setProductOpen(false)} />
              <div className="glass-panel absolute left-0 z-40 mt-2 max-h-64 w-60 animate-pop overflow-y-auto rounded-2xl p-1.5 shadow-xl shadow-ink/10">
                {["all", ...productOptions].map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setProduct(p);
                      setProductOpen(false);
                    }}
                    className="block w-full truncate rounded-xl px-2.5 py-2 text-left text-[13px] font-medium transition hover:bg-accent"
                  >
                    {p === "all" ? "All products" : p}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button className={chip} onClick={() => setSort((s) => (s === "newest" ? "sold" : "newest"))}>
          Sort · {sort === "newest" ? "Newest" : "Most sold"} ▾
        </button>
        <button
          onClick={reset}
          className="rounded-xl px-3 py-2 text-[13px] font-medium text-brand transition hover:bg-brand/10"
        >
          Reset filters
        </button>
      </section>

      <section
        className="glass-panel mt-4 animate-rise overflow-hidden rounded-2xl shadow-sm shadow-ink/5"
        style={{ animationDelay: "320ms" }}
      >
        <div className="flex items-center justify-between border-b border-glass-line px-5 py-3.5">
          <p className="text-[13px] font-bold">All campaigns</p>
          <span className="text-[12px] font-medium text-ink-soft">
            {rows.length} of {campaigns.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-glass-line text-[11px] tracking-wider text-ink-soft/60 uppercase">
                <th className="px-5 py-3 font-semibold">Campaign</th>
                <th className="px-3 py-3 font-semibold">Products</th>
                <th className="px-3 py-3 font-semibold">Start</th>
                <th className="px-3 py-3 font-semibold">End</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Sold</th>
                <th className="px-3 py-3 font-semibold">Remaining</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-line">
              {rows.map((c) => {
                const t = totals(c);
                const meta = STATUS[c.status];
                const muted = c.status === "cancelled" || c.status === "expired";
                return (
                  <tr
                    key={c.id}
                    className={cn(
                      "transition hover:bg-secondary",
                      muted && "opacity-75 hover:opacity-100",
                      changedId === c.id && "animate-row-glow",
                    )}
                  >
                    <td className="px-5 py-4">
                      <p className={cn("text-[13.5px] font-bold", muted && "text-ink-soft")}>{c.name}</p>
                      <p className="mt-0.5 font-mono text-[11px] text-ink-soft/70">{c.code}</p>
                    </td>
                    <td className="px-3 py-4 text-[13px] text-ink-soft">{c.lines.length} Products</td>
                    <td className="px-3 py-4">
                      <p className="text-[12px] font-medium">{c.startDay}</p>
                      <p className="text-[11px] text-ink-soft/60">{c.startTime}</p>
                    </td>
                    <td className="px-3 py-4">
                      <p className="text-[12px] font-medium">{c.endDay}</p>
                      <p className="text-[11px] text-ink-soft/60">{c.endTime}</p>
                    </td>
                    <td className="px-3 py-4">
                      <StatusBadge status={c.status} />
                      {c.status === "scheduled" && (
                        <p className="mt-1.5 px-0.5 font-mono text-[11px] font-medium text-status-scheduled">
                          Starts in {c.countdown ?? "04h 05m"}
                        </p>
                      )}
                      {c.status === "expired" && (
                        <p className="mt-1.5 px-0.5 text-[11px] font-medium text-ink-soft/60">
                          Campaign Ended
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-4">
                      <div className="w-24">
                        <p className="font-mono text-[12px] font-semibold">
                          {t.sold} / {t.quantity}
                        </p>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink/10">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-700",
                              meta.barClass,
                              c.status === "active" && "shimmer-bar",
                            )}
                            style={{ width: `${t.pct}%` }}
                          />
                        </div>
                        {c.status === "soldout" && (
                          <p className="mt-1 text-[10px] font-bold tracking-[0.15em] text-status-soldout">
                            SOLD OUT
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 font-mono text-[13px] text-ink-soft">{t.remaining}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <Link
                          to="/campaign/$id"
                          params={{ id: c.id }}
                          className="rounded-lg border border-glass-line bg-secondary px-2.5 py-1.5 text-[12px] font-medium text-ink-soft transition hover:text-ink"
                        >
                          View
                        </Link>
                        <Link
                          to="/campaign/$id"
                          params={{ id: c.id }}
                          className="rounded-lg border border-glass-line bg-secondary px-2.5 py-1.5 text-[12px] font-medium text-ink-soft transition hover:text-ink"
                        >
                          Edit
                        </Link>
                        {c.status === "cancelled" ? (
                          <button
                            onClick={() => requestStatusChange(c, "active")}
                            className="rounded-lg bg-ink px-3 py-1.5 text-[12px] font-semibold text-primary-foreground transition hover:scale-[1.02] active:scale-[.99]"
                          >
                            Reactivate
                          </button>
                        ) : (
                          <StatusDropdown
                            current={c.status}
                            onSelect={(next) => requestStatusChange(c, next)}
                          />
                        )}
                        {c.status !== "cancelled" && (
                          <button
                            onClick={() => requestStatusChange(c, "cancelled")}
                            className="rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-status-cancelled transition hover:bg-status-cancelled/10"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[13px] text-ink-soft">
                    No campaigns match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-4 font-mono text-[11px] text-ink-soft/50">
        VoltMart Admin · Flash Sales module · UI prototype · mock data only
      </p>
    </div>
  );
}
