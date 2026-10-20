import { useState, useEffect } from "react";
import {
  X,
  Trash2,
  Calendar,
  AlertCircle,
  Loader2,
  Circle,
  CircleDashed,
  CheckCircle2,
  User,
} from "lucide-react";
import { Avatar } from "@/components/ws";
import { useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { cn } from "@/lib/utils";

type ColumnStatus = "TODO" | "IN_PROGRESS" | "DONE";
type PriorityLevel = "LOW" | "MEDIUM" | "HIGH";

interface TaskDetailModalProps {
  task: any | null;
  isOpen: boolean;
  onClose: () => void;
  membersList?: any[];
}

const statusOptions: { id: ColumnStatus; label: string; icon: typeof Circle; cls: string }[] = [
  { id: "TODO", label: "To Do", icon: Circle, cls: "text-muted-foreground" },
  { id: "IN_PROGRESS", label: "In Progress", icon: CircleDashed, cls: "text-amber-500" },
  { id: "DONE", label: "Done", icon: CheckCircle2, cls: "text-emerald-500" },
];

const priorityOptions: { id: PriorityLevel; label: string; dotCls: string }[] = [
  { id: "LOW", label: "Low", dotCls: "bg-muted-foreground" },
  { id: "MEDIUM", label: "Medium", dotCls: "bg-amber-500" },
  { id: "HIGH", label: "High", dotCls: "bg-rose-500" },
];

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  membersList = [],
}: TaskDetailModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ColumnStatus>("TODO");
  const [priority, setPriority] = useState<PriorityLevel>("MEDIUM");
  const [assignedToId, setAssignedToId] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "TODO");
      setPriority(task.priority || "MEDIUM");
      setAssignedToId(task.assignedToId || "");
      setConfirmDelete(false);
      setErrorMessage("");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const isBusy = isUpdating || isDeleting;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage("Task title cannot be empty.");
      return;
    }
    if (title.trim().length < 3) {
      setErrorMessage("Task title must be at least 3 characters.");
      return;
    }

    setErrorMessage("");

    updateTask(
      {
        id: task.id,
        data: {
          title: title.trim(),
          description: description.trim() || null,
          status,
          priority,
          assignedToId: assignedToId || null,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            (err?.response?.data?.errors && err.response.data.errors[0]?.message) ||
            "Failed to update task. Please try again.";
          setErrorMessage(msg);
        },
      }
    );
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    deleteTask(task.id, {
      onSuccess: () => {
        onClose();
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message ||
          "Failed to delete task. Please try again.";
        setErrorMessage(msg);
      },
    });
  };

  const selectedMember = membersList.find((m) => m.id === assignedToId);

  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently created";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
        onClick={() => !isBusy && onClose()}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all sm:my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Task Details
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              • <Calendar className="size-3" /> {formattedDate}
            </span>
          </div>

          <button
            type="button"
            disabled={isBusy}
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in duration-150">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              disabled={isBusy}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design user profile settings"
              className="w-full rounded-lg border border-input bg-secondary/40 px-3.5 py-2 text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>

          {/* Description Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Description</label>
            <textarea
              rows={3}
              disabled={isBusy}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details, checklists, or notes about this task..."
              className="w-full rounded-lg border border-input bg-secondary/40 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 resize-none disabled:opacity-50"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Status</label>
              <div className="flex rounded-lg border border-border bg-secondary/30 p-1 gap-1">
                {statusOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = status === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isBusy}
                      onClick={() => setStatus(opt.id)}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 text-xs font-medium transition cursor-pointer disabled:opacity-50",
                        isSelected
                          ? "bg-card shadow-xs text-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("size-3.5", opt.cls)} />
                      <span className="truncate">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Priority</label>
              <div className="flex rounded-lg border border-border bg-secondary/30 p-1 gap-1">
                {priorityOptions.map((opt) => {
                  const isSelected = priority === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isBusy}
                      onClick={() => setPriority(opt.id)}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition cursor-pointer disabled:opacity-50",
                        isSelected
                          ? "bg-card shadow-xs text-foreground font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className={cn("size-2 rounded-full", opt.dotCls)} />
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Assignee Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Assignee</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={assignedToId}
                  disabled={isBusy}
                  onChange={(e) => setAssignedToId(e.target.value)}
                  className="w-full rounded-lg border border-input bg-secondary/40 px-3 py-2 text-xs text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:opacity-50 cursor-pointer"
                >
                  <option value="">Unassigned</option>
                  {membersList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.email})
                    </option>
                  ))}
                </select>
              </div>

              {selectedMember ? (
                <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 shrink-0">
                  <Avatar m={selectedMember} size={22} />
                  <span className="text-xs font-medium text-foreground max-w-[100px] truncate">
                    {selectedMember.name}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-lg border border-dashed border-border px-2.5 py-1.5 text-xs text-muted-foreground shrink-0">
                  <User className="size-3.5" />
                  <span>None</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 mt-6 border-t border-border flex items-center justify-between gap-2 flex-wrap">
            {/* Delete button with confirmation */}
            <button
              type="button"
              disabled={isBusy}
              onClick={handleDelete}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50",
                confirmDelete
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
                  : "border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              )}
            >
              <Trash2 className="size-3.5" />
              <span>{confirmDelete ? "Confirm Delete?" : "Delete Task"}</span>
            </button>

            {/* Cancel & Save */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                disabled={isBusy}
                onClick={onClose}
                className="rounded-lg border border-border bg-secondary/60 px-3.5 py-2 text-xs font-semibold text-secondary-foreground hover:bg-secondary hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isBusy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isUpdating && <Loader2 className="size-3.5 animate-spin" />}
                <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
