import { createFileRoute, Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { STATUS, taka, totals } from "@/lib/flash-data";
import { useFlash } from "@/lib/flash-store";
import { useCountUp } from "@/lib/use-count-up";
import { StatusBadge } from "@/components/flash/status-badge";
import { StatusDropdown } from "@/components/flash/status-dropdown";

export const Route = createFileRoute("/campaign/$id")({
  head: () => ({
    meta: [
      { title: "Campaign Details — VoltMart Flash Sales" },
      {
        name: "description",
        content:
          "Monitor a single Flash Sale campaign: allocation, sold units, revenue and per-product performance.",
      },
      { property: "og:title", content: "Campaign Details — VoltMart Flash Sales" },
      {
        property: "og:description",
        content: "Live performance dashboard for a limited-time Flash Sale campaign.",
      },
    ],
  }),
  component: CampaignDetails,
});

function Metric({ label, value, prefix, index }: { label: string; value: number; prefix?: string; index: number }) {
  const n = useCountUp(value, 900, index * 80);
  return (
    <div
      className="glass-panel animate-rise rounded-2xl p-4 shadow-sm shadow-ink/5 transition hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <p className="text-[12px] font-medium text-ink-soft">{label}</p>
      <p className="mt-2 font-mono text-2xl font-extrabold tracking-tight">
        {prefix}
        {n.toLocaleString("en-US")}
      </p>
    </div>
  );
}

function CampaignDetails() {
  const { id } = Route.useParams();
  const { campaigns, requestStatusChange, changedId } = useFlash();
  const campaign = campaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="px-5 py-16 text-center sm:px-8">
        <h1 className="text-xl font-extrabold">Campaign not found</h1>
        <Link to="/" className="mt-4 inline-block text-[13px] font-semibold text-brand">
          ← Back to Flash Sales
        </Link>
      </div>
    );
  }

  const t = totals(campaign);
  const meta = STATUS[campaign.status];

  return (
    <div className="max-w-[1240px] px-5 py-6 sm:px-8">
      <Link to="/" className="text-[12px] font-semibold text-ink-soft transition hover:text-ink">
        ← Flash Sales
      </Link>

      <header className="mt-3 grid animate-rise grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-ink-soft/70">{campaign.code}</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-[28px]">{campaign.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <StatusBadge status={campaign.status} size="md" className={cn(changedId === campaign.id && "animate-check-pop")} />
            <span className="text-[12.5px] text-ink-soft">
              {campaign.startDay} · {campaign.startTime} → {campaign.endTime}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
          <button className="rounded-xl border border-glass-line bg-secondary px-3 py-2 text-[12.5px] font-medium text-ink-soft transition hover:text-ink">
            Edit
          </button>
          {campaign.status === "cancelled" ? (
            <button
              onClick={() => requestStatusChange(campaign, "active")}
              className="rounded-xl bg-ink px-3.5 py-2 text-[12.5px] font-semibold text-primary-foreground transition hover:scale-[1.02] active:scale-[.99]"
            >
              Reactivate
            </button>
          ) : (
            <>
              <StatusDropdown current={campaign.status} onSelect={(next) => requestStatusChange(campaign, next)} />
              <button
                onClick={() => requestStatusChange(campaign, "cancelled")}
                className="rounded-xl px-3 py-2 text-[12.5px] font-medium text-status-cancelled transition hover:bg-status-cancelled/10"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </header>

      {campaign.status === "cancelled" && (
        <div className="glass-panel mt-5 animate-rise rounded-2xl border-status-cancelled/25 bg-status-cancelled/8 p-4">
          <p className="text-[13px] font-bold text-status-cancelled">🔴 This campaign is cancelled</p>
          <p className="mt-1 text-[12.5px] text-ink-soft">
            It is hidden from the storefront. Reactivate it to put it back in the live queue.
          </p>
        </div>
      )}

      <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Metric label="Products" value={campaign.lines.length} index={0} />
        <Metric label="Flash Sale Quantity" value={t.quantity} index={1} />
        <Metric label="Sold" value={t.sold} index={2} />
        <Metric label="Remaining" value={t.remaining} index={3} />
        <Metric label="Revenue" value={campaign.revenue} prefix="৳" index={4} />
      </section>

      <section className="glass-panel mt-4 animate-rise rounded-2xl p-5" style={{ animationDelay: "280ms" }}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[13px] font-bold">Sales progress</p>
            <p className="mt-0.5 font-mono text-[12px] text-ink-soft">
              {t.sold} / {t.quantity} sold
            </p>
          </div>
          <p className="font-mono text-3xl font-extrabold tracking-tight">{t.pct}%</p>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-ink/10">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              meta.barClass,
              campaign.status === "active" && "shimmer-bar",
            )}
            style={{ width: `${t.pct}%` }}
          />
        </div>
        {campaign.status === "soldout" && (
          <p className="mt-2 text-[11px] font-bold tracking-[0.18em] text-status-soldout">
            SOLD OUT — full allocation cleared
          </p>
        )}
        {campaign.status === "scheduled" && (
          <p className="mt-2 font-mono text-[12px] font-medium text-status-scheduled">
            Starts in {campaign.countdown ?? "02h 18m"}
          </p>
        )}
      </section>

      <section
        className="glass-panel mt-4 animate-rise overflow-hidden rounded-2xl"
        style={{ animationDelay: "340ms" }}
      >
        <div className="border-b border-glass-line px-5 py-3.5">
          <p className="text-[13px] font-bold">Product performance</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-glass-line text-[11px] tracking-wider text-ink-soft/60 uppercase">
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-3 py-3 font-semibold">Original</th>
                <th className="px-3 py-3 font-semibold">Flash Price</th>
                <th className="px-3 py-3 font-semibold">Qty</th>
                <th className="px-3 py-3 font-semibold">Sold</th>
                <th className="px-3 py-3 font-semibold">Remaining</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-line">
              {campaign.lines.map((l) => {
                const remaining = l.quantity - l.sold;
                const lineStatus = remaining === 0 ? "soldout" : campaign.status;
                return (
                  <tr key={l.productId} className="transition hover:bg-secondary">
                    <td className="px-5 py-4">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-glass-line bg-secondary text-lg">
                          {l.image}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-bold">{l.name}</p>
                          <p className="font-mono text-[11px] text-ink-soft/70">{l.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 font-mono text-[12.5px] text-ink-soft line-through">
                      {taka(l.originalPrice)}
                    </td>
                    <td className="px-3 py-4 font-mono text-[12.5px] font-semibold">{taka(l.flashPrice)}</td>
                    <td className="px-3 py-4 font-mono text-[12.5px]">{l.quantity}</td>
                    <td className="px-3 py-4 font-mono text-[12.5px]">{l.sold}</td>
                    <td className="px-3 py-4 font-mono text-[12.5px]">{remaining}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={lineStatus} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
