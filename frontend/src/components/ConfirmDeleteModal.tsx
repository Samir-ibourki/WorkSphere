import { AlertTriangle, Loader2, X } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemTitle?: string;
  isLoading?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Task",
  description = "Are you sure you want to delete this task? This action cannot be undone.",
  itemTitle,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-xs transition-opacity"
        onClick={() => !isLoading && onClose()}
      />

      {/* Alert Dialog Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-destructive/20 bg-card p-6 shadow-2xl transition-all sm:my-8 animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          disabled={isLoading}
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition cursor-pointer disabled:opacity-50"
        >
          <X className="size-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive border border-destructive/20">
            <AlertTriangle className="size-5" />
          </div>

          <div className="flex-1 pr-4">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>

            {itemTitle && (
              <div className="mt-3 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs font-medium text-foreground truncate">
                "{itemTitle}"
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-border">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="rounded-lg border border-border bg-secondary/60 px-4 py-2 text-xs font-semibold text-secondary-foreground hover:bg-secondary hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 rounded-lg bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isLoading && <Loader2 className="size-3.5 animate-spin" />}
            <span>{isLoading ? "Deleting..." : "Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
