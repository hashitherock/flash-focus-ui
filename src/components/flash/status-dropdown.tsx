import { useState } from "react";
import { cn } from "@/lib/utils";
import { STATUS, STATUS_ORDER, type Status } from "@/lib/flash-data";
import { StatusBadge } from "./status-badge";

type Props = {
  current: Status;
  onSelect: (next: Status) => void;
  label?: string;
  align?: "left" | "right";
};

/** Premium custom status dropdown. Selecting never applies instantly — the parent confirms first. */
export function StatusDropdown({ current, onSelect, label = "Change Status", align = "right" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-2.5 py-1.5 text-[12px] font-semibold text-brand-foreground transition hover:bg-brand/90 active:scale-[.98]"
      >
        {label}
        <span className={cn("text-[10px] transition-transform", open && "rotate-180")}>▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div
            className={cn(
              "glass-panel absolute z-40 mt-2 w-[268px] animate-pop rounded-2xl p-1.5 shadow-xl shadow-ink/10",
              align === "right" ? "right-0" : "left-0",
            )}
          >
            <p className="px-2.5 py-2 text-[10px] font-semibold tracking-[0.16em] text-ink-soft/60 uppercase">
              Set campaign status
            </p>
            {STATUS_ORDER.map((s) => {
              const meta = STATUS[s];
              const isCurrent = s === current;
              return (
                <button
                  key={s}
                  disabled={isCurrent}
                  onClick={() => {
                    setOpen(false);
                    onSelect(s);
                  }}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition",
                    isCurrent ? "opacity-50" : "hover:bg-accent",
                  )}
                >
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", meta.dotClass)} />
                  <span className="min-w-0">
                    <span className={cn("block text-[13px] font-semibold", meta.textClass)}>
                      {meta.glyph} {meta.label}
                      {isCurrent && (
                        <span className="ml-1.5 text-[10px] font-medium text-ink-soft">current</span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-ink-soft">
                      {meta.description}
                    </span>
                  </span>
                </button>
              );
            })}
            <div className="mt-1 flex items-center gap-2 border-t border-glass-line px-2.5 py-2">
              <span className="text-[11px] text-ink-soft">Current:</span>
              <StatusBadge status={current} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
