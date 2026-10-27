import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Plus,
  Circle,
  CircleDashed,
  CheckCircle2,
  Trash2,
  UserPlus,
  UserCheck,
  MoreHorizontal,
  Pencil,
  Search,
  X,
  RotateCcw,
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
import { useAuthStore } from "@/store/useAuthStore";
import { useGetProjectById, useDeleteProject } from "@/hooks/useProjects";
import { useGetTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { useProjectSocket } from "@/hooks/useProjectSocket";
import { useGetOrganizationUsers } from "@/hooks/useOrganization";
import { TaskDetailModal } from "@/components/TaskDetailModal";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { EditProjectModal } from "@/components/EditProjectModal";
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
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);

  // Real-Time WebSocket sync for this project
  useProjectSocket(id);

  const { data: project, isLoading: isProjectLoading } = useGetProjectById(id || "");
  const { data: tasksData, isLoading: isTasksLoading } = useGetTasks(id);
  const { data: members } = useGetOrganizationUsers();

  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  const { mutate: deleteProject, isPending: isDeletingProject } = useDeleteProject();

  const [over, setOver] = useState<ColumnStatus | null>(null);
  const [addingColumn, setAddingColumn] = useState<ColumnStatus | null>(null);
  const [activeAssignTaskId, setActiveAssignTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<any | null>(null);

  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("ALL");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");

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

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      t.title?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q);

    const matchesAssignee =
      selectedAssignee === "ALL" ||
      (selectedAssignee === "UNASSIGNED" && !t.assignedToId) ||
      t.assignedToId === selectedAssignee;

    const matchesPriority =
      selectedPriority === "ALL" ||
      t.priority?.toUpperCase() === selectedPriority.toUpperCase();

    return matchesSearch && matchesAssignee && matchesPriority;
  });

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedAssignee !== "ALL" ||
    selectedPriority !== "ALL";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedAssignee("ALL");
    setSelectedPriority("ALL");
  };

  const handleMove = (taskId: string, targetStatus: ColumnStatus) => {
    updateTask({ id: taskId, data: { status: targetStatus } });
  };

  const handleConfirmDelete = () => {
    if (!taskToDelete) return;
    deleteTask(taskToDelete.id, {
      onSuccess: () => setTaskToDelete(null),
    });
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

            {/* Project Actions Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
                title="Project actions"
                className="flex size-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground transition cursor-pointer"
              >
                <MoreHorizontal className="size-4" />
              </button>

              {isProjectMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsProjectMenuOpen(false)}
                  />
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute left-0 top-full z-40 mt-1.5 w-40 rounded-xl border border-border bg-card p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsProjectMenuOpen(false);
                        setIsEditProjectOpen(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-foreground hover:bg-secondary transition cursor-pointer"
                    >
                      <Pencil className="size-3.5 text-muted-foreground" />
                      <span>Edit Project</span>
                    </button>
                    <div className="my-1 border-t border-border/50" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsProjectMenuOpen(false);
                        setIsDeleteProjectOpen(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete Project</span>
                    </button>
                  </div>
                </>
              )}
            </div>
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

      {/* Board Controls: Search & Filters Toolbar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-card p-2.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[170px] max-w-xs">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full rounded-lg border border-input bg-secondary/40 pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary/60 focus:ring-1 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Quick "My Tasks" Toggle */}
          {currentUser && (
            <button
              type="button"
              onClick={() =>
                setSelectedAssignee(selectedAssignee === currentUser.id ? "ALL" : currentUser.id)
              }
              className={cn(
                "h-8 rounded-lg border px-2.5 text-xs font-medium transition cursor-pointer flex items-center gap-1.5 shrink-0",
                selectedAssignee === currentUser.id
                  ? "border-primary/60 bg-primary/10 text-primary font-semibold"
                  : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <span>My Tasks</span>
            </button>
          )}

          {/* Assignee Filter Dropdown */}
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="h-8 rounded-lg border border-border bg-secondary/40 px-2.5 text-xs text-foreground outline-none transition focus:border-primary/60 cursor-pointer shrink-0"
          >
            <option value="ALL">All Assignees</option>
            <option value="UNASSIGNED">Unassigned</option>
            {membersList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Priority Filter Pills */}
          <div className="hidden sm:flex rounded-lg border border-border bg-secondary/30 p-0.5 text-xs">
            {["ALL", "LOW", "MEDIUM", "HIGH"].map((pr) => (
              <button
                key={pr}
                type="button"
                onClick={() => setSelectedPriority(pr)}
                className={cn(
                  "rounded-md px-2 py-1 text-[11px] font-medium capitalize transition cursor-pointer",
                  selectedPriority === pr
                    ? "bg-card text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {pr.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Stats & Reset */}
        <div className="flex items-center gap-2 ml-auto text-xs text-muted-foreground">
          <span className="font-mono text-[11px]">
            {filteredTasks.length} of {totalTasks} tasks
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/10 transition cursor-pointer"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {cols.map((c) => {
          const list = filteredTasks.filter((t) => t.status === c.id);

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
                            setTaskToDelete(t);
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

                {/* Empty filtered state */}
                {list.length === 0 && isFiltered && (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-6 px-3 text-center bg-card/20 my-1">
                    <p className="text-xs text-muted-foreground font-medium">No matching tasks</p>
                  </div>
                )}

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

      {/* Delete Task Confirmation Alert Modal */}
      <ConfirmDeleteModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        itemTitle={taskToDelete?.title}
        isLoading={isDeleting}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        project={project}
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
      />

      {/* Delete Project Confirmation Alert Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteProjectOpen}
        onClose={() => setIsDeleteProjectOpen(false)}
        onConfirm={() => {
          deleteProject(project.id, {
            onSuccess: () => {
              setIsDeleteProjectOpen(false);
              navigate("/projects");
            },
          });
        }}
        title="Delete Project"
        description="Are you sure you want to delete this project? All associated tasks will be permanently removed. This action cannot be undone."
        itemTitle={project.name}
        isLoading={isDeletingProject}
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
