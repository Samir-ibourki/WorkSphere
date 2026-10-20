import { Link, useLocation } from "react-router-dom";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Search,
  Plus,
  ChevronsUpDown,
  PanelLeft,
  Command,
  Bell,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Member, type Priority, type ProjectStatus } from "@/lib/store";
import { useAuthStore } from "@/store/useAuthStore";
import { useGetOrganization, useGetOrganizationUsers } from "@/hooks/useOrganization";
import { useGetProjects } from "@/hooks/useProjects";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="grid size-7 place-items-center rounded-lg bg-gradient-primary shadow-glow">
        <div className="size-3 rounded-full border-2 border-primary-foreground" />
      </div>
      <span className="font-semibold tracking-tight text-foreground">WorkSphere</span>
    </div>
  );
}

export function Avatar({
  m,
  size = 24,
  ring,
}: {
  m?: Member | undefined;
  size?: number;
  ring?: boolean;
}) {
  if (!m) return null;
  const initials = m.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      title={m.name}
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-medium text-white shadow-sm",
        ring && "ring-2 ring-background"
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `linear-gradient(135deg, oklch(0.6 0.15 ${m.hue ?? 260}), oklch(0.5 0.15 ${(m.hue ?? 260) + 40}))`,
      }}
    >
      {initials}
    </div>
  );
}

export function AvatarStack({ ids = [], size = 24 }: { ids?: string[]; size?: number }) {
  const { data: members } = useGetOrganizationUsers();
  const membersList: any[] = members || [];
  return (
    <div className="flex -space-x-1.5">
      {ids.map((id) => (
        <Avatar key={id} m={membersList.find((x: any) => x.id === id)} size={size} ring />
      ))}
    </div>
  );
}

const prio: Record<Priority, string> = {
  low: "bg-muted-foreground",
  medium: "bg-warning",
  high: "bg-danger",
};

export function PriorityBadge({ p }: { p: Priority }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border bg-secondary/60 px-1.5 py-0.5 text-[11px] font-medium capitalize text-secondary-foreground">
      <span className={cn("size-1.5 rounded-full", prio[p])} />
      {p}
    </span>
  );
}

const stat: Record<ProjectStatus, string> = {
  active: "text-success bg-success/10 border-success/20",
  planning: "text-info bg-info/10 border-info/20",
  completed: "text-muted-foreground bg-muted border-border",
};

export function StatusBadge({ s }: { s: ProjectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
        stat[s]
      )}
    >
      {s}
    </span>
  );
}

export function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className="h-full rounded-full bg-gradient-primary transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({
  crumbs,
  children,
  action,
}: {
  crumbs: string[];
  children: ReactNode;
  action?: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const workspaceLogo = useAuthStore((s) => s.workspaceLogo);
  const { data: organization } = useGetOrganization();
  const { data: projectsData } = useGetProjects();

  const orgName = organization?.name || (user?.name ? `${user.name}'s Org` : "Acme Inc.");
  const sidebarProjects: any[] = projectsData || [];

  // Theme state: defaults to false (clean white mode), persists via localStorage
  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains("dark");
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("worksphere-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("worksphere-theme", "light");
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 md:flex",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <div className="flex h-14 items-center px-4">
          <Logo className={cn(collapsed && "[&>span]:hidden")} />
        </div>
        {!collapsed && (
          <button className="mx-3 mb-3 flex items-center gap-2 rounded-lg border border-border bg-sidebar-accent px-2.5 py-2 text-left text-sm transition hover:border-primary/40 hover:shadow-sm">
            {workspaceLogo ? (
              <img
                src={workspaceLogo}
                alt="Logo"
                className="size-5 rounded object-cover shadow-xs shrink-0"
              />
            ) : (
              <div className="grid size-5 place-items-center rounded bg-gradient-primary text-[10px] font-bold text-primary-foreground shrink-0">
                {orgName[0]}
              </div>
            )}
            <span className="flex-1 truncate font-medium text-sidebar-accent-foreground">
              {orgName}
            </span>
            <ChevronsUpDown className="size-3.5 text-muted-foreground" />
          </button>
        )}
        <nav className="flex flex-col gap-0.5 px-2">
          {nav.map((n) => {
            const active = path.startsWith(n.to) || (n.to === "/dashboard" && path === "/");
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-all duration-150",
                  active
                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-xs"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                )}
                <n.icon className={cn("size-4", active && "text-primary")} />
                {!collapsed && n.label}
              </Link>
            );
          })}
        </nav>
        {!collapsed && (
          <div className="mt-6 px-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Projects
            </p>
            <div className="flex flex-col gap-0.5">
              {sidebarProjects.length === 0 ? (
                <p className="px-1 py-1 text-xs text-muted-foreground/70">No projects yet</p>
              ) : (
                sidebarProjects.slice(0, 5).map((p: any) => (
                  <Link
                    key={p.id}
                    to={`/projects/${p.id}`}
                    className="flex items-center gap-2 rounded-md py-1.5 px-1 text-sm text-sidebar-foreground/75 transition-colors hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/40"
                  >
                    <span
                      className="size-2 rounded-sm shrink-0 bg-primary"
                    />
                    <span className="truncate">{p.name}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
        <div className="mt-auto flex items-center gap-2.5 border-t border-sidebar-border p-3 bg-sidebar/50">
          <Avatar m={{ name: user?.name || "User", hue: 277 } as any} size={28} />
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-none">{user?.name || "User"}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{user?.email || ""}</p>
              </div>
              <button
                onClick={logout}
                title="Log out"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
              >
                <LogOut className="size-4" />
              </button>
            </>
          )}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border px-4 md:px-6">
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="hidden rounded-md p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground md:block"
            title="Toggle sidebar"
          >
            <PanelLeft className="size-4" />
          </button>
          <Link to="/dashboard" className="md:hidden">
            <Logo className="[&>span]:hidden" />
          </Link>
          <div className="flex items-center gap-1.5 text-sm">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-muted-foreground/50">/</span>}
                <span
                  className={
                    i === crumbs.length - 1
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {c}
                </span>
              </span>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="hidden items-center gap-2 rounded-md border border-border bg-secondary/50 px-2.5 py-1.5 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground sm:flex">
              <Search className="size-3.5" />
              Search…
              <kbd className="ml-6 flex items-center gap-0.5 rounded border border-border bg-background px-1 font-mono text-[10px]">
                <Command className="size-2.5" />K
              </kbd>
            </button>
            {/* Theme Switcher Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="rounded-md p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground border border-border/40 cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-violet-600" />}
            </button>
            <button className="rounded-md p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground">
              <Bell className="size-4" />
            </button>
            {action}
          </div>
        </header>
        <nav className="flex gap-1 border-b border-border px-4 py-2 md:hidden bg-card">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm",
                path.startsWith(n.to)
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              <n.icon className="size-3.5" />
              {n.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 animate-rise p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function NewButton({
  onClick,
  label = "New",
}: {
  onClick?: () => void;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md bg-gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow transition hover:brightness-110 active:scale-[0.98]"
    >
      <Plus className="size-3.5" />
      {label}
    </button>
  );
}

export const inputCls =
  "w-full rounded-md border border-input bg-secondary/40 px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-4 focus:ring-primary/15";
