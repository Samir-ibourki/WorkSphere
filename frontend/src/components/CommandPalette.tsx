import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FolderKanban, LayoutDashboard, Settings as SettingsIcon, ArrowRight, X } from "lucide-react";
import { useGetProjects } from "../hooks/useProjects";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data: projects = [] } = useGetProjects();

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const navItems = [
    { id: "dash", title: "Dashboard", subtitle: "Go to workspace overview", path: "/dashboard", icon: LayoutDashboard },
    { id: "proj", title: "Projects", subtitle: "View all projects", path: "/projects", icon: FolderKanban },
    { id: "sett", title: "Settings", subtitle: "Manage workspace & team", path: "/settings", icon: SettingsIcon },
  ];

  const q = query.trim().toLowerCase();

  const filteredNav = navItems.filter(
    (item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
  );

  const filteredProjects = projects.filter(
    (p: any) =>
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
  );

  const allItems = [
    ...filteredNav.map((n) => ({ ...n, type: "nav" })),
    ...filteredProjects.map((p: any) => ({
      id: `project-${p.id}`,
      title: p.name,
      subtitle: p.description || "Project Board",
      path: `/projects/${p.id}`,
      icon: FolderKanban,
      type: "project",
    })),
  ];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: (typeof allItems)[0]) => {
    if (!item) return;
    navigate(item.path);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (allItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % (allItems.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        handleSelect(allItems[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh] px-4">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-all">
        <div className="flex items-center border-b border-border px-3.5">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search projects..."
            className="flex h-12 w-full bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="max-h-[330px] overflow-y-auto p-2">
          {allItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNav.length > 0 && (
                <div className="px-2 py-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Navigation
                </div>
              )}
              {allItems
                .filter((item) => item.type === "nav")
                .map((item) => {
                  const index = allItems.indexOf(item);
                  const isSelected = index === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`size-4 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className={`text-xs ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className={`size-3.5 ${isSelected ? "opacity-100" : "opacity-0"}`} />
                    </button>
                  );
                })}

              {filteredProjects.length > 0 && (
                <div className="px-2 pt-2.5 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Projects ({filteredProjects.length})
                </div>
              )}
              {allItems
                .filter((item) => item.type === "project")
                .map((item) => {
                  const index = allItems.indexOf(item);
                  const isSelected = index === selectedIndex;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition cursor-pointer ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`size-4 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className={`text-xs truncate max-w-sm ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                            {item.subtitle}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className={`size-3.5 ${isSelected ? "opacity-100" : "opacity-0"}`} />
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-3.5 py-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-border bg-card px-1 font-mono">↑</kbd>{" "}
              <kbd className="rounded border border-border bg-card px-1 font-mono">↓</kbd> navigate
            </span>
            <span>
              <kbd className="rounded border border-border bg-card px-1 font-mono">↵</kbd> select
            </span>
            <span>
              <kbd className="rounded border border-border bg-card px-1 font-mono">esc</kbd> close
            </span>
          </div>
          <span className="font-medium text-foreground">WorkSphere Quick Search</span>
        </div>
      </div>
    </div>
  );
}

