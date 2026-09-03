import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { StatusChangeDialog } from "./status-change-dialog";
import { StatusToast } from "./status-toast";

type NavItem = { label: string; glyph: string; to: string };

const WORKSPACE: NavItem[] = [
  { label: "Overview", glyph: "📊", to: "/overview" },
  { label: "Products", glyph: "🏷️", to: "/products" },
];

const MARKETING: NavItem[] = [
  { label: "Promotions", glyph: "📣", to: "/promotions" },
  { label: "Flash Sales", glyph: "⚡", to: "/" },
  { label: "Email", glyph: "📧", to: "/email" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" || pathname.startsWith("/campaign") || pathname === "/create" : pathname === to;

  const NavLink = ({ item }: { item: NavItem }) => (
    <Link
      to={item.to}
      onClick={() => setMobileOpen(false)}
      className={cn(
        "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition",
        isActive(item.to)
          ? "border border-glass-line bg-accent font-bold text-ink shadow-sm shadow-ink/5"
          : "font-medium text-ink-soft hover:bg-accent/70 hover:text-ink",
        collapsed && "justify-center px-0",
      )}
      title={collapsed ? item.label : undefined}
    >
      <span className="grid size-5 shrink-0 place-items-center text-base">{item.glyph}</span>
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && isActive(item.to) && (
        <span className="ml-auto size-2 shrink-0 rounded-full bg-volt" />
      )}
    </Link>
  );

  const SidebarBody = (
    <>
      <div className={cn("flex items-center gap-2.5 px-3 pt-2 pb-6", collapsed && "justify-center px-0")}>
        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink shadow-lg shadow-ink/20">
          <span className="pt-0.5 text-lg leading-none font-bold text-volt">⚡</span>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-[15px] leading-none font-extrabold tracking-tight">VoltMart</p>
            <p className="mt-1 text-[10px] font-medium tracking-[0.18em] text-ink-soft/70 uppercase">
              Admin
            </p>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] text-ink-soft/50 uppercase">
          Workspace
        </div>
      )}
      <nav className="space-y-1">
        {WORKSPACE.map((i) => (
          <NavLink key={i.to} item={i} />
        ))}
      </nav>

      {!collapsed && (
        <div className="mt-5 mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] text-ink-soft/50 uppercase">
          Marketing
        </div>
      )}
      <nav className={cn("space-y-1", collapsed && "mt-4 border-t border-glass-line pt-4")}>
        {MARKETING.map((i) => (
          <NavLink key={i.to} item={i} />
        ))}
      </nav>

      <div className="mt-auto space-y-3">
        {!collapsed && (
          <div className="glass-panel rounded-2xl p-3">
            <p className="text-[11px] font-semibold text-ink">Weekly digest</p>
            <p className="mt-1 text-[11px] leading-snug text-ink-soft/80">
              4 campaigns end this week.
            </p>
            <Link
              to="/"
              className="mt-3 block w-full rounded-lg bg-ink py-1.5 text-center text-[11px] font-semibold text-primary-foreground transition hover:bg-ink/90"
            >
              View
            </Link>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hidden w-full items-center justify-center gap-2 rounded-xl border border-glass-line bg-accent/60 py-2 text-[12px] font-semibold text-ink-soft transition hover:text-ink md:flex"
        >
          {collapsed ? "»" : "« Collapse"}
        </button>
      </div>
    </>
  );

  return (
    <div className="app-canvas flex min-h-screen w-full font-sans text-ink">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col p-4 transition-all duration-300 md:flex",
          collapsed ? "w-[84px]" : "w-60",
        )}
      >
        {SidebarBody}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="glass-panel relative flex h-full w-[264px] animate-slide-right flex-col p-4">
            {SidebarBody}
          </aside>
        </div>
      )}

      <main className="min-w-0 flex-1">
        <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-glass-line bg-background/70 px-4 py-3 backdrop-blur-xl md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="grid size-9 place-items-center rounded-xl border border-glass-line bg-accent text-ink"
          >
            ☰
          </button>
          <span className="text-[14px] font-extrabold tracking-tight">
            <span className="text-volt">⚡</span> VoltMart Admin
          </span>
        </div>
        {children}
      </main>

      <StatusChangeDialog />
      <StatusToast />
    </div>
  );
}
