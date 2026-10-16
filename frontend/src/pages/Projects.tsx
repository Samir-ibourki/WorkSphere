import { Link } from "react-router-dom";
import { AppShell, AvatarStack, NewButton, ProgressBar, StatusBadge } from "@/components/ws";
import { progressOf, useStore } from "@/lib/store";
import { ArrowUpRight, Search } from "lucide-react";
import { useState } from "react";

export function Projects() {
  const projects = useStore((s) => s.projects);
  const tasks = useStore((s) => s.tasks);
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = projects.filter((p) => {
    const matchesFilter = filter === "all" || p.status === filter;
    const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <AppShell crumbs={["Acme Inc.", "Projects"]} action={<NewButton label="New Project" />}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage and track your ongoing projects and initiatives.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9 w-48 rounded-md border border-border bg-card pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60"
            />
          </div>
          <div className="flex rounded-md border border-border bg-secondary/50 p-0.5 text-xs">
            {["all", "active", "planning", "completed"].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`rounded px-2.5 py-1 capitalize font-medium transition ${
                  filter === st ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const pr = progressOf(tasks, p.id);
          return (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-xs shrink-0" style={{ background: `oklch(0.65 0.17 ${p.color})` }} />
                    <span className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                      {p.name}
                    </span>
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                </div>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{p.description}</p>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
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
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}

export default Projects;
