import { STATUS } from "@/lib/flash-data";
import { useFlash } from "@/lib/flash-store";
import { StatusTransition } from "./status-badge";

/** Global confirmation modal — every status change routes through here. */
export function StatusChangeDialog() {
  const { pending, cancelStatusChange, confirmStatusChange } = useFlash();
  if (!pending) return null;

  const from = STATUS[pending.from];
  const to = STATUS[pending.to];
  const reactivating = pending.from === "cancelled" && pending.to === "active";

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-4">
      <div
        className="absolute inset-0 animate-in bg-ink/40 backdrop-blur-md fade-in"
        onClick={cancelStatusChange}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="glass-panel relative w-full max-w-md animate-pop rounded-3xl bg-popover p-6 shadow-2xl shadow-ink/20"
      >
        <p className="text-[10px] font-semibold tracking-[0.18em] text-ink-soft/70 uppercase">
          Confirm status change
        </p>
        <h2 className="mt-2 text-[22px] leading-tight font-extrabold tracking-tight">
          {reactivating ? "Reactivate Flash Sale?" : `Switch to ${to.label}?`}
        </h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
          You are about to change{" "}
          <span className="font-semibold text-ink">{pending.name}</span> from {from.label} to{" "}
          {to.label}.
        </p>

        <div className="mt-5">
          <StatusTransition from={pending.from} to={pending.to} />
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            onClick={cancelStatusChange}
            className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-ink-soft transition hover:bg-accent hover:text-ink"
          >
            Keep {from.label}
          </button>
          <button
            onClick={confirmStatusChange}
            className="rounded-xl bg-ink px-4 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-lg shadow-ink/20 transition hover:scale-[1.02] active:scale-[.99]"
          >
            {reactivating ? "Reactivate Flash Sale" : `Set ${to.label}`}
          </button>
        </div>
      </div>
    </div>
  );
}
