import { STATUS } from "@/lib/flash-data";
import { useFlash } from "@/lib/flash-store";
import { cn } from "@/lib/utils";

/** Elegant animated status notification, slides in top-right and self-dismisses. */
export function StatusToast() {
  const { toast, dismissToast } = useFlash();
  if (!toast) return null;

  const from = STATUS[toast.from];
  const to = STATUS[toast.to];

  return (
    <div
      key={toast.id}
      className="fixed top-5 right-4 z-[80] w-[min(20rem,calc(100vw-2rem))] animate-slide-left"
    >
      <div className="glass-panel flex gap-3 rounded-2xl p-3.5 shadow-xl shadow-ink/10">
        <div className="grid size-9 shrink-0 animate-check-pop place-items-center rounded-xl bg-status-active text-primary-foreground">
          ✓
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold">Status Updated</p>
          <p className="mt-0.5 truncate text-[12px] leading-snug text-ink-soft">
            {toast.name} · <span className={cn("font-medium", from.textClass)}>{from.label}</span> →{" "}
            <span className={cn("font-medium", to.textClass)}>{to.label}</span>
          </p>
        </div>
        <button
          onClick={dismissToast}
          aria-label="Dismiss notification"
          className="self-start text-sm text-ink-soft/50 transition hover:text-ink"
        >
          ✕
        </button>
      </div>
      <div className="mt-1 h-0.5 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-volt"
          style={{ animation: "toast-progress 4.2s linear forwards" }}
        />
      </div>
      <style>{`@keyframes toast-progress { from { width: 100% } to { width: 0% } }`}</style>
    </div>
  );
}
