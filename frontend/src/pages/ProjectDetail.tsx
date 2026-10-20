import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Plus,
  Circle,
  CircleDashed,
  CheckCircle2,
  Trash2,
  UserPlus,
  UserCheck,
} from "lucide-react";
import {
  AppShell,
  Avatar,
  AvatarStack,
  PriorityBadge,
  ProgressBar,
  StatusBadge,
  inputCls,
} from "@/components/ws";
import { useGetProjectById } from "@/hooks/useProjects";
import { useGetTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { useGetOrganizationUsers } from "@/hooks/useOrganization";
import { TaskDetailModal } from "@/components/TaskDetailModal";
import { cn } from "@/lib/utils";

type ColumnStatus = "TODO" | "IN_PROGRESS" | "DONE";
type PriorityLevel = "LOW" | "MEDIUM" | "HIGH";

const cols: { id: ColumnStatus; label: string; icon: typeof Circle; cls: string }[] = [
  { id: "TODO", label: "To Do", icon: Circle, cls: "text-muted-foreground" },
  { id: "IN_PROGRESS", label: "In Progress", icon: CircleDashed, cls: "text-amber-500" },
  { id: "DONE", label: "Done", icon: CheckCircle2, cls: "text-emerald-500" },
];

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading: isProjectLoading } = useGetProjectById(id || "");
  const { data: tasksData, isLoading: isTasksLoading } = useGetTasks(id);
  const { data: members } = useGetOrganizationUsers();

  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const [over, setOver] = useState<ColumnStatus | null>(null);
  const [addingColumn, setAddingColumn] = useState<ColumnStatus | null>(null);
  const [activeAssignTaskId, setActiveAssignTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  if (isProjectLoading || isTasksLoading) {
    return (
      <AppShell crumbs={["Projects", "Loading..."]}>
        <div className="space-y-6">
          <div className="h-16 w-1/3 rounded-xl bg-card animate-pulse" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-xl bg-card/60 animate-pulse" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell crumbs={["Projects", "Not found"]}>
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <p className="text-base font-medium text-foreground">Project not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The project you're looking for doesn't exist or you don't have access.
          </p>
          <Link
            to="/projects"
            className="mt-4 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:brightness-110"
          >
            Back to Projects
          </Link>
        </div>
      </AppShell>
    );
  }

  const tasks: any[] = tasksData || [];
  const membersList: any[] = members || [];

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "DONE").length;
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const handleMove = (taskId: string, targetStatus: ColumnStatus) => {
    updateTask({ id: taskId, data: { status: targetStatus } });
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(taskId);
    }
  };

  return (
    <AppShell crumbs={["Projects", project.name]}>
      {/* Project Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {project.name}
            </h1>
            <StatusBadge s={project.status?.toLowerCase() || "active"} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
            {project.description || "No description provided."}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-44">
            <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
              <span className="font-medium">Progress</span>
              <span className="font-mono">{pct}%</span>
            </div>
            <ProgressBar pct={pct} />
          </div>
          <AvatarStack ids={membersList.map((m) => m.id)} size={26} />
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {cols.map((c) => {
          const list = tasks.filter((t) => t.status === c.id);

          return (
            <div
              key={c.id}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(c.id);
              }}
              onDragLeave={() => setOver(null)}
              onDrop={(e) => {
                e.preventDefault();
                const taskId = e.dataTransfer.getData("text");
                if (taskId) {
                  handleMove(taskId, c.id);
                }
                setOver(null);
              }}
              className={cn(
                "flex min-h-[65vh] flex-col rounded-xl border border-border/80 bg-secondary/20 p-2.5 transition-colors duration-150",
                over === c.id && "border-primary/60 bg-primary/5"
              )}
            >
              {/* Column Header */}
              <div className="flex items-center gap-2 px-2 py-2 text-sm font-semibold text-foreground">
                <c.icon className={cn("size-4 shrink-0", c.cls)} />
                <span>{c.label}</span>
                <span className="rounded-md bg-secondary px-1.5 py-0.5 text-xs font-mono font-medium text-muted-foreground">
                  {list.length}
                </span>
                <button
                  onClick={() => setAddingColumn(c.id)}
                  title={`Add task to ${c.label}`}
                  className="ml-auto rounded-md p-1 text-muted-foreground transition hover:bg-secondary hover:text-foreground cursor-pointer"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              {/* Tasks List Container */}
              <div className="flex flex-col gap-2.5 mt-1 flex-1">
                {list.map((t) => {
                  const assignee = t.assignedTo || membersList.find((m) => m.id === t.assignedToId);
                  const formattedDate = t.createdAt
                    ? new Date(t.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Recent";

                  return (
                    <div
                      key={t.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text", t.id)}
                      onClick={() => setSelectedTask(t)}
                      className="group cursor-pointer rounded-xl border border-border bg-card p-3.5 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            "text-sm font-medium leading-snug text-foreground",
                            t.status === "DONE" && "text-muted-foreground line-through"
                          )}
                        >
                          {t.title}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(t.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition p-0.5 cursor-pointer"
                          title="Delete task"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>

                      {t.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                          {t.description}
                        </p>
                      )}

                      <div className="mt-3 flex items-center gap-2 pt-1 border-t border-border/40">
                        <PriorityBadge p={t.priority} />
                        <span className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/50 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                          <Calendar className="size-3" />
                          {formattedDate}
                        </span>
                        <div className="relative ml-auto">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveAssignTaskId(activeAssignTaskId === t.id ? null : t.id);
                            }}
                            title={
                              assignee
                                ? `Assigned to ${assignee.name} (Click to reassign)`
                                : "Click to assign member"
                            }
                            className="flex items-center gap-1 rounded-full transition hover:ring-2 hover:ring-primary/40 cursor-pointer"
                          >
                            {assignee ? (
                              <Avatar m={assignee} size={22} />
                            ) : (
                              <span className="flex size-[22px] items-center justify-center rounded-full border border-dashed border-border bg-secondary/60 text-[11px] text-muted-foreground hover:border-primary/60 hover:text-foreground">
                                <UserPlus className="size-3" />
                              </span>
                            )}
                          </button>

                          {/* Member Assignment Popover */}
                          {activeAssignTaskId === t.id && (
                            <>
                              <div
                                className="fixed inset-0 z-30"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveAssignTaskId(null);
                                }}
                              />
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-full z-40 mt-1.5 w-48 rounded-xl border border-border bg-card p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100"
                              >
                                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                  Assign Member
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateTask({ id: t.id, data: { assignedToId: null } });
                                    setActiveAssignTaskId(null);
                                  }}
                                  className={cn(
                                    "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition cursor-pointer",
                                    !assignee && "bg-secondary/80 font-medium text-foreground"
                                  )}
                                >
                                  <span className="flex size-4 items-center justify-center rounded-full border border-dashed border-border text-[9px]">
                                    —
                                  </span>
                                  <span>Unassigned</span>
                                </button>
                                <div className="my-1 border-t border-border/50" />
                                {membersList.map((m) => (
                                  <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => {
                                      updateTask({ id: t.id, data: { assignedToId: m.id } });
                                      setActiveAssignTaskId(null);
                                    }}
                                    className={cn(
                                      "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-foreground hover:bg-secondary transition cursor-pointer",
                                      assignee?.id === m.id && "bg-primary/10 font-semibold text-primary"
                                    )}
                                  >
                                    <Avatar m={m} size={18} />
                                    <span className="truncate">{m.name}</span>
                                    {assignee?.id === m.id && (
                                      <UserCheck className="size-3.5 ml-auto text-primary" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quick move buttons on hover */}
                      <div className="mt-2.5 flex items-center gap-1.5 pt-1 border-t border-border/30 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        {cols
                          .filter((x) => x.id !== t.status)
                          .map((x) => (
                            <button
                              key={x.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMove(t.id, x.id);
                              }}
                              className="rounded-md border border-border/80 bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition cursor-pointer"
                            >
                              → {x.label}
                            </button>
                          ))}
                      </div>
                    </div>
                  );
                })}

                {/* Inline Add Task Form */}
                {addingColumn === c.id ? (
                  <AddTaskForm
                    status={c.id}
                    projectId={id!}
                    membersList={membersList}
                    onDone={() => setAddingColumn(null)}
                  />
                ) : (
                  <button
                    onClick={() => setAddingColumn(c.id)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border/70 py-2 text-xs font-medium text-muted-foreground transition hover:border-primary/50 hover:bg-card/50 hover:text-foreground cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>Add Task</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Details & Edit Modal */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        membersList={membersList}
      />
    </AppShell>
  );
}

function AddTaskForm({
  status,
  projectId,
  membersList = [],
  onDone,
}: {
  status: ColumnStatus;
  projectId: string;
  membersList?: any[];
  onDone: () => void;
}) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("MEDIUM");
  const [assignedToId, setAssignedToId] = useState<string>("");
  const { mutate: createTask, isPending } = useCreateTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isPending) return;

    createTask(
      {
        projectId,
        status,
        title: title.trim(),
        priority,
        assignedToId: assignedToId || undefined,
      },
      {
        onSuccess: () => {
          setTitle("");
          onDone();
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-primary/40 bg-card p-3 shadow-md animate-in fade-in duration-150"
    >
      <input
        autoFocus
        disabled={isPending}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && onDone()}
        placeholder="Task title..."
        className={cn(inputCls, "py-1.5 text-xs")}
      />

      <div className="mt-2.5 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          {(["LOW", "MEDIUM", "HIGH"] as const).map((p) => (
            <button
              type="button"
              key={p}
              disabled={isPending}
              onClick={() => setPriority(p)}
              className={cn(
                "rounded-md border px-2 py-0.5 text-[10px] font-medium capitalize transition cursor-pointer",
                priority === p
                  ? "border-primary/60 bg-primary/10 text-primary font-semibold"
                  : "border-border text-muted-foreground hover:bg-secondary"
              )}
            >
              {p.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Member Assignee Selector */}
        <select
          value={assignedToId}
          disabled={isPending}
          onChange={(e) => setAssignedToId(e.target.value)}
          className="h-6 rounded-md border border-border bg-secondary/60 px-1.5 text-[10px] text-muted-foreground hover:text-foreground outline-none cursor-pointer"
        >
          <option value="">Assign to...</option>
          {membersList.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            disabled={isPending}
            onClick={onDone}
            className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending || !title.trim()}
            className="rounded-md bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isPending ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ProjectDetail;
