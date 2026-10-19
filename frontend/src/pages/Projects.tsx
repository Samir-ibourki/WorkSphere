import { Link } from "react-router-dom";
import { AppShell, AvatarStack, NewButton, ProgressBar, StatusBadge } from "@/components/ws";
import { ArrowUpRight, Search, FolderKanban } from "lucide-react";
import { useState } from "react";
import { useGetProjects } from "@/hooks/useProjects";
import { CreateProjectModal } from "@/components/CreateProjectModal";

export function Projects() {
  const { data: projects, isLoading } = useGetProjects();
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const projectList: any[] = projects || [];

  const filtered = projectList.filter((p) => {
    const matchesFilter = filter === "all" || p.status?.toLowerCase() === filter.toLowerCase();
    const matchesQuery =
      p.name?.toLowerCase().includes(query.toLowerCase()) ||
      p.description?.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <AppShell
      crumbs={["Projects"]}
      action={<NewButton label="New Project" onClick={() => setIsCreateOpen(true)} />}
    >
      {/* header + serch and status filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and track your ongoing projects and initiatives.
          </p>
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
            {["all", "active", "completed", "archived"].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`rounded px-2.5 py-1 capitalize font-medium transition cursor-pointer ${
                  filter === st
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* loading state */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 rounded-xl border border-border bg-card/60 p-5 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* empty state */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center bg-card/50">
          <FolderKanban className="size-10 text-muted-foreground/60 mb-3" />
          <p className="text-base font-medium text-foreground">No projects found</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {query || filter !== "all"
              ? "Try adjusting your search or filter criteria to find what you're looking for."
              : "Get started by creating your first project using the button above."}
          </p>
        </div>
      ) : (
        /* projects grid */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const projectTasks: any[] = p.tasks || [];
            const totalTasks = projectTasks.length;
            const doneTasks = projectTasks.filter((t: any) => t.status === "DONE").length;
            const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

            return (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="size-3 rounded-xs shrink-0 bg-primary" />
                      <span className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                        {p.name}
                      </span>
                    </div>
                    <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {p.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
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
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </AppShell>
  );
}

export default Projects;
