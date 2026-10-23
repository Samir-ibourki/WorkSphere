import { useState, useEffect } from "react";
import { X, FolderPen, AlertCircle, Loader2 } from "lucide-react";
import { useUpdateProject } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";

interface EditProjectModalProps {
  project: any | null;
  isOpen: boolean;
  onClose: () => void;
}

type ProjectStatusType = "ACTIVE" | "COMPLETED" | "ARCHIVED";

const statusOptions: { id: ProjectStatusType; label: string; badgeCls: string }[] = [
  { id: "ACTIVE", label: "Active", badgeCls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" },
  { id: "COMPLETED", label: "Completed", badgeCls: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
  { id: "ARCHIVED", label: "Archived", badgeCls: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30" },
];

export function EditProjectModal({ project, isOpen, onClose }: EditProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatusType>("ACTIVE");
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate: updateProject, isPending } = useUpdateProject();

  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setDescription(project.description || "");
      setStatus(project.status || "ACTIVE");
      setErrorMessage("");
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Project name is required.");
      return;
    }
    if (name.trim().length < 3) {
      setErrorMessage("Project name must be at least 3 characters.");
      return;
    }

    setErrorMessage("");

    updateProject(
      {
        id: project.id,
        data: {
          name: name.trim(),
          description: description.trim() || null,
          status,
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
            "Failed to update project. Please try again.";
          setErrorMessage(msg);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
        onClick={() => !isPending && onClose()}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all sm:my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FolderPen className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Edit Project</h2>
              <p className="text-xs text-muted-foreground">
                Update project details and progress status
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in duration-200">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Project Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              disabled={isPending}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website Redesign"
              className="w-full rounded-lg border border-input bg-secondary/40 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Description</label>
            <textarea
              rows={3}
              disabled={isPending}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of the project goals..."
              className="w-full rounded-lg border border-input bg-secondary/40 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 resize-none disabled:opacity-50"
            />
          </div>

          {/* Status Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {statusOptions.map((opt) => {
                const isSelected = status === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isPending}
                    onClick={() => setStatus(opt.id)}
                    className={cn(
                      "flex items-center justify-center rounded-lg border px-3 py-2 text-xs font-medium transition cursor-pointer disabled:opacity-50",
                      isSelected
                        ? "border-primary/60 bg-primary/10 text-primary font-semibold shadow-xs"
                        : "border-border bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-border">
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="rounded-lg border border-border bg-secondary/60 px-4 py-2 text-xs font-semibold text-secondary-foreground hover:bg-secondary hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow transition hover:brightness-110 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isPending && <Loader2 className="size-3.5 animate-spin" />}
              <span>{isPending ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
