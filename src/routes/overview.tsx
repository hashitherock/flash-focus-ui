import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/overview")({
  head: () => ({
    meta: [
      { title: "Overview — VoltMart Admin" },
      { name: "description", content: "Overview section of the VoltMart admin prototype." },
      { property: "og:title", content: "Overview — VoltMart Admin" },
      { property: "og:description", content: "Overview section of the VoltMart admin prototype." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="max-w-[1240px] px-5 py-6 sm:px-8">
      <h1 className="animate-rise text-2xl font-extrabold tracking-tight sm:text-[28px]">📊 Overview</h1>
      <div className="glass-panel mt-6 animate-rise rounded-2xl p-8 text-center">
        <p className="text-[14px] text-ink-soft">This section is outside the Flash Sales prototype.</p>
        <Link to="/" className="mt-4 inline-block rounded-xl bg-ink px-4 py-2.5 text-[13px] font-semibold text-primary-foreground">⚡ Go to Flash Sales</Link>
      </div>
    </div>
  );
}
