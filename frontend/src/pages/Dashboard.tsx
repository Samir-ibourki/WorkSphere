import { Link, useNavigate } from "react-router-dom";
import {
  FolderKanban,
  Loader,
  CheckCircle2,
  Users,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  AppShell,
  Avatar,
  AvatarStack,
  NewButton,
  ProgressBar,
  StatusBadge,
} from "@/components/ws";
import { progressOf, useStore } from "@/lib/store";

export function Dashboard() {
  const projects = useStore((s) => s.projects);
  const tasks = useStore((s) => s.tasks);
  const members = useStore((s) => s.members);
  const activity = useStore((s) => s.activity);
  const nav = useNavigate();
  const done = tasks.filter((t) => t.status === "done").length;

  const kpis = [
    {
      label: "Total Projects",
      value: projects.length,
      trend: "+12%",
      icon: FolderKanban,
    },
    {
      label: "Tasks In Progress",
      value: tasks.filter((t) => t.status === "progress").length,
      trend: "+8%",
      icon: Loader,
    },
    {
      label: "Completion Rate",
      value: `${Math.round((done / Math.max(tasks.length, 1)) * 100)}%`,
      trend: "+4%",
      icon: CheckCircle2,
    },
    {
      label: "Team Members",
      value: members.length,
      trend: "+2",
      icon: Users,
    },
  ];

  return (
    <AppShell
      crumbs={["Acme Inc.", "Dashboard"]}
      action={<NewButton onClick={() => nav("/projects")} />}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Good evening, Ava
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here's what's happening across your workspace.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition group-hover:opacity-100" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              {k.label}
              <k.icon className="size-4" />
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              {k.value}
            </p>
            <p className="mt-2 flex items-center gap-1 text-xs text-success font-medium">
              <TrendingUp className="size-3" />
              {k.trend}
              <span className="text-muted-foreground font-normal">this week</span>
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Projects + Activity Feed */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Recent Projects</h2>
            <Link
              to="/projects"
              className="text-xs font-medium text-muted-foreground transition hover:text-foreground"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {projects.slice(0, 4).map((p) => {
              const pr = progressOf(tasks, p.id);
              return (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className="group rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-xs shrink-0"
                        style={{ background: `oklch(0.65 0.17 ${p.color})` }}
                      />
                      <span className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                        {p.name}
                      </span>
                    </div>
                    <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <StatusBadge s={p.status} />
                    <span className="font-mono">{pr.pct}%</span>
                  </div>
                  <div className="mt-2">
                    <ProgressBar pct={pr.pct} />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <AvatarStack ids={p.members} size={22} />
                    <span className="text-xs text-muted-foreground font-medium">
                      {pr.done}/{pr.total} tasks
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Activity</h2>
          <div className="rounded-xl border border-border bg-card p-2 shadow-card divide-y divide-border/40">
            {activity.map((a) => {
              const who = members.find((m) => m.id === a.who);
              return (
                <div
                  key={a.id}
                  className="flex gap-3 rounded-lg p-2.5 transition hover:bg-accent/50"
                >
                  <Avatar m={who} size={26} />
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="leading-snug text-card-foreground">
                      <span className="font-medium text-foreground">{who?.name}</span>{" "}
                      <span className="text-muted-foreground">{a.action}</span>{" "}
                      <span className="font-medium text-foreground">{a.target}</span>
                    </p>
                    <span className="mt-1 inline-block rounded border border-border bg-secondary/60 px-1.5 py-px font-mono text-[10px] text-muted-foreground">
                      {a.at}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export default Dashboard;
