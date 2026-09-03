import { cn } from "@/lib/utils";
import { STATUS, type Status } from "@/lib/flash-data";

type Props = {
  status: Status;
  size?: "sm" | "md";
  className?: string;
};

export function StatusBadge({ status, size = "sm", className }: Props) {
  const meta = STATUS[status];
  return (
    <span
      key={status}
      className={cn(
        "inline-flex animate-badge-in items-center gap-1.5 rounded-full border font-semibold transition-colors",
        meta.chipClass,
        size === "sm" ? "px-2.5 py-1 text-[12px]" : "px-3 py-1.5 text-[13px]",
        status === "soldout" && "uppercase tracking-wide",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          meta.dotClass,
          status === "active" && "animate-pulse-dot",
        )}
      />
      {status === "soldout" ? "🔥 Sold Out" : meta.label}
    </span>
  );
}

export function StatusTransition({ from, to }: { from: Status; to: Status }) {
  return (
    <div className="glass-panel flex items-center justify-between gap-3 rounded-2xl p-4">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-ink-soft/70 uppercase">
          Previous status
        </p>
        <div className="mt-1.5 opacity-70">
          <StatusBadge status={from} />
        </div>
      </div>
      <span className="text-lg text-ink-soft/50">↓</span>
      <div className="min-w-0 text-right">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-ink-soft/70 uppercase">
          New status
        </p>
        <div className="mt-1.5">
          <StatusBadge status={to} size="md" />
        </div>
      </div>
    </div>
  );
}
