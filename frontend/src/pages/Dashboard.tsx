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
import { useAuthStore } from "@/store/useAuthStore";
import { useGetDashboardStats } from "@/hooks/useDashboard";
import { useGetOrganizationUsers } from "@/hooks/useOrganization";

export function Dashboard() {
  const nav = useNavigate();

  const user = useAuthStore((state) => state.user);
  const workspaceLogo = useAuthStore((state) => state.workspaceLogo);

  const { data: dashboardData, isLoading: isDashboardLoading } = useGetDashboardStats();

  const { data: members, isLoading: isMembersLoading } = useGetOrganizationUsers();

  const isLoading = isDashboardLoading || isMembersLoading;

  const statsData = dashboardData?.stats;
  const totalTasks = statsData?.totalTasks || 0;
  const completedTasks = statsData?.completedTasks || 0;
  
  const completionRate = totalTasks > 0
    ? `${Math.round((completedTasks / totalTasks) * 100)}%`
    : "0%";

  const stats = {
    totalProjects: statsData?.totalProjects ?? 0,
    inProgressTasks: statsData?.inProgressTasks ?? 0,
    completionRate,
    teamMembers: members?.length ?? 0,
  };

  const recentProjects: any[] = dashboardData?.recentProjects || [];
  const recentTasks: any[] = dashboardData?.recentTasks || [];

  // calc les Trends of week
  const trendsData = dashboardData?.trends;
  const projectsThisWeek = trendsData?.projectsThisWeek ?? 0;
  const tasksThisWeek = trendsData?.tasksThisWeek ?? 0;
  const completedThisWeek = trendsData?.completedThisWeek ?? 0;
  const membersThisWeek = trendsData?.membersThisWeek ?? 0;

  // calc d les pourcentages of trend
  const projectsTrendPct = stats.totalProjects > 0
    ? Math.round((projectsThisWeek / stats.totalProjects) * 100)
    : 0;

  const completedTrendPct = totalTasks > 0
    ? Math.round((completedThisWeek / totalTasks) * 100)
    : 0;

  const kpis = [
    {
      label: "Total Projects",
      value: isLoading ? "..." : stats.totalProjects,
      trend: `+${projectsTrendPct}%`,
      trendLabel: "this week",
      icon: FolderKanban,
    },
    {
      label: "Tasks In Progress",
      value: isLoading ? "..." : stats.inProgressTasks,
      trend: `+${tasksThisWeek}`,
      trendLabel: "new this week",
      icon: Loader,
    },
    {
      label: "Completion Rate",
      value: isLoading ? "..." : stats.completionRate,
      trend: `+${completedTrendPct}%`,
      trendLabel: "this week",
      icon: CheckCircle2,
    },
    {
      label: "Team Members",
      value: isLoading ? "..." : stats.teamMembers,
      trend: `+${membersThisWeek}`,
      trendLabel: "this week",
      icon: Users,
    },
  ];

  return (
    <AppShell
      crumbs={["Dashboard"]}
      action={<NewButton onClick={() => nav("/projects")} />}
    >
      {/* Greeting Header */}
      <div className="mb-8 flex items-center gap-3.5">
        {workspaceLogo && (
          <img
            src={workspaceLogo}
            alt="Workspace Logo"
            className="size-12 rounded-xl object-cover shadow-sm border border-border shrink-0"
          />
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Good evening, {user?.name || "Ava"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's what's happening across your workspace.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
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
              <span className="text-muted-foreground font-normal">{k.trendLabel}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid: Recent Projects + Activity Feed */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Left column: Recent Projects */}
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

          {recentProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center bg-card/50">
              <FolderKanban className="size-8 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium text-foreground">No recent projects yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">Projects you create will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {recentProjects.map((p) => {
                const projectTasks: any[] = p.tasks || [];
                const totalTasks = projectTasks.length;
                const doneTasks = projectTasks.filter((t: any) => t.status === "DONE").length;
                const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : (p.progress ?? 0);

                return (
                  <Link
                    key={p.id}
                    to={`/projects/${p.id}`}
                    className="group rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2.5 rounded-full shrink-0 bg-primary"
                        />
                        <span className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                          {p.name}
                        </span>
                      </div>
                      <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <StatusBadge s={p.status?.toLowerCase() || "active"} />
                      <span className="font-mono">{pct}%</span>
                    </div>

                    <div className="mt-2">
                      <ProgressBar pct={pct} />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <AvatarStack ids={p.members || []} size={22} />
                      <span className="text-xs text-muted-foreground font-medium">
                        {doneTasks}/{totalTasks} tasks
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Right column: Activity */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Activity</h2>

          {recentTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center bg-card/50">
              <CheckCircle2 className="size-8 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium text-foreground">No recent activity</p>
              <p className="text-xs text-muted-foreground mt-0.5">Tasks and updates will show up here.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-2 shadow-card divide-y divide-border/40">
              {recentTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex gap-3 rounded-lg p-2.5 transition hover:bg-accent/50"
                >
                  <Avatar m={t.assignedTo} size={26} />
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="leading-snug text-card-foreground">
                      <span className="font-medium text-foreground">{t.assignedTo?.name || "Member"}</span>{" "}
                      <span className="text-muted-foreground">worked on</span>{" "}
                      <span className="font-medium text-foreground">{t.title}</span>
                    </p>
                    <span className="mt-1 inline-block rounded border border-border bg-secondary/60 px-1.5 py-px font-mono text-[10px] text-muted-foreground">
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

export default Dashboard;
