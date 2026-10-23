import { useState, useEffect } from "react";
import { X, FolderPlus, AlertCircle, Loader2 } from "lucide-react";
import { useCreateProject } from "@/hooks/useProjects";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  
  const { mutate: createProject, isPending } = useCreateProject();

  // form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"PLANNING" | "ACTIVE" | "COMPLETED">("PLANNING");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // status options matching design
  const statusOptions = [
    { value: "PLANNING", label: "Planning" },
    { value: "ACTIVE", label: "Active" },
    { value: "COMPLETED", label: "Completed" },
  ] as const;

  // clear errors when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
    }
  }, [isOpen]);

  // close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, isPending]);

  if (!isOpen) return null;

  // submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const backendStatus = status === "PLANNING" ? "ACTIVE" : status;

    createProject(
      {
        name: name.trim(),
        description: description.trim() || undefined,
        status: backendStatus,
      },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          setStatus("PLANNING");
          setErrorMessage(null);
          onClose(); 
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message ||
            (err?.response?.data?.errors && err.response.data.errors[0]?.message) ||
            "Failed to create project. Please check your inputs and try again.";
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
              <FolderPlus className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">Create New Project</h2>
              <p className="text-xs text-muted-foreground">
                Set up a new workspace project for your team
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
          {/* Error Banner*/}
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in duration-200">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Project Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              disabled={isPending}
              placeholder="e.g. Mobile App Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-input bg-secondary/40 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Description</label>
            <textarea
              rows={3}
              disabled={isPending}
              placeholder="Brief summary of the project goals and objectives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-input bg-secondary/40 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20 resize-none disabled:opacity-50"
            />
          </div>

          {/* Status Choice Pills */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Status</label>
            <div className="grid grid-cols-3 gap-2.5 pt-0.5">
              {statusOptions.map((opt) => {
                const isSelected = status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={isPending}
                    onClick={() => setStatus(opt.value)}
                    className={`h-10 rounded-xl px-4 text-xs font-medium transition-all duration-150 cursor-pointer disabled:opacity-50 ${
                      isSelected
                        ? "border-2 border-foreground/90 bg-secondary/80 text-foreground font-semibold shadow-xs"
                        : "border border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              disabled={isPending}
              onClick={onClose}
              className="h-9 rounded-xl px-4 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-violet-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span className="text-base leading-none font-normal">+</span>
                  <span>Create</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
