import { Link } from "@tanstack/react-router";
import { Activity, ChartNoAxesCombined, Database, History, Settings } from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { to: "/overview" as const, label: "Visão geral", icon: Activity },
  { to: "/history" as const, label: "Histórico", icon: History },
  { to: "/analysis" as const, label: "Análise", icon: ChartNoAxesCombined },
  { to: "/data" as const, label: "Dados", icon: Database },
];

export function AppShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-48 border-r border-border bg-background lg:flex lg:flex-col">
        <div className="border-b border-border px-7 py-7">
          <p className="font-display text-[15px] font-semibold tracking-[0.18em]">NEXUS</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Data Intelligence</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-8" aria-label="Navegação principal">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="group flex h-10 items-center gap-3 border-l border-transparent px-4 text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground" activeProps={{ className: "border-primary text-foreground bg-secondary" }}>
              <Icon aria-hidden="true" className="size-4 stroke-[1.4]" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <div className="flex h-10 items-center gap-3 px-4 text-xs text-muted-foreground"><Settings className="size-4 stroke-[1.4]" />Configurações</div>
        </div>
      </aside>

      <div className="lg:pl-48">
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-border bg-background/95 px-5 backdrop-blur-sm md:px-10 lg:px-12">
          <div className="flex items-center gap-5">
            <span className="font-display text-xs font-semibold tracking-[0.16em] lg:hidden">NEXUS</span>
            <h1 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{title}</h1>
          </div>
          <div className="flex items-center gap-5 text-[10px] uppercase tracking-[0.12em]">
            <span className="flex items-center gap-2 text-live"><span className="live-dot size-1.5 rounded-full bg-live" />Ao vivo</span>
            <span className="hidden text-muted-foreground sm:inline">Última atualização</span>
            <span className="font-mono text-xs text-foreground">13:42:31</span>
          </div>
        </header>
        <main>{children}</main>
        <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-border bg-background lg:hidden" aria-label="Navegação móvel">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="flex min-w-16 flex-col items-center gap-1.5 text-[9px] uppercase tracking-[0.08em] text-muted-foreground" activeProps={{ className: "text-foreground" }}>
              <Icon className="size-4 stroke-[1.5]" />{label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
