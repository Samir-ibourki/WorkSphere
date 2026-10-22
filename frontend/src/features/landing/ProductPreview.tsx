import React, { useState } from 'react';
import {
  FolderKanban,
  LayoutDashboard,
  CheckCircle2,
  Calendar,
  Circle,
  CircleDashed,
  Plus,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { PriorityBadge, ProgressBar, StatusBadge } from '@/components/ws';
import { SAMPLE_PROJECTS, SAMPLE_TASKS, type TaskStatus } from './landingData';

const COLUMNS: { key: TaskStatus; label: string; icon: typeof Circle; cls: string }[] = [
  { key: 'TODO', label: 'To Do', icon: Circle, cls: 'text-muted-foreground' },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: CircleDashed, cls: 'text-amber-500' },
  { key: 'DONE', label: 'Done', icon: CheckCircle2, cls: 'text-emerald-500' },
];

export const ProductPreview: React.FC = () => {
  const [mobileColumn, setMobileColumn] = useState<TaskStatus>('IN_PROGRESS');

  return (
    <div
      id="product"
      className="relative mx-auto w-full max-w-6xl rounded-2xl border border-border/90 bg-card shadow-2xl overflow-hidden select-none"
      aria-label="WorkSphere Workspace Preview"
    >
      {/* Top Window Chrome */}
      <div className="flex items-center justify-between px-4 py-3 bg-secondary/50 border-b border-border/80 select-none">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-rose-500/80" />
          <span className="size-2.5 rounded-full bg-amber-500/80" />
          <span className="size-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs font-mono text-muted-foreground hidden sm:inline">
            worksphere.app/projects/core-platform-mvp
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Live Workspace
          </span>
        </div>
      </div>

      {/* Main Workspace Interface: Static Image-like Mockup matching AppShell + ProjectDetail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px] select-none pointer-events-none">
        {/* Real App Sidebar (Desktop) */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col justify-between bg-sidebar border-r border-sidebar-border p-3.5">
          <div className="space-y-5">
            {/* Workspace Switcher */}
            <div className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-card border border-border shadow-xs">
              <div className="flex items-center gap-2.5 truncate">
                <div className="size-7 rounded-lg bg-gradient-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-xs">
                  W
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-foreground truncate">Acme Studio</p>
                  <p className="text-[10px] text-muted-foreground font-mono">acme-studio.ws</p>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="space-y-1">
              <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Platform
              </p>
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-muted-foreground">
                <LayoutDashboard className="size-4" />
                <span>Dashboard</span>
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border/60 shadow-xs">
                <FolderKanban className="size-4 text-primary" />
                <span>Projects</span>
              </div>
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-muted-foreground">
                <Settings className="size-4" />
                <span>Settings</span>
              </div>
            </div>

            {/* Workspace Projects List */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Active Projects
                </p>
                <span className="text-[10px] font-mono text-muted-foreground">3</span>
              </div>
              {SAMPLE_PROJECTS.map((project, idx) => (
                <div
                  key={project.id}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs ${
                    idx === 0
                      ? 'bg-card text-foreground font-semibold shadow-xs border border-border'
                      : 'text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="size-2 rounded-full shrink-0 bg-primary" />
                    <span className="truncate">{project.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {project.completedCount}/{project.taskCount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User Profile Mini Bar */}
          <div className="p-2 rounded-xl bg-card border border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-6 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center">
                ER
              </span>
              <div className="text-left">
                <p className="text-xs font-medium text-foreground leading-none">Elena R.</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Admin</p>
              </div>
            </div>
            <StatusBadge s="active" />
          </div>
        </aside>

        {/* Main Kanban Board View: Exactly matching ProjectDetail.tsx */}
        <div className="lg:col-span-9 flex flex-col bg-background">
          {/* Breadcrumbs & Project Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-border bg-card/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <span>Projects</span>
                <ChevronRight className="size-3" />
                <span className="text-foreground font-medium">Core Platform MVP</span>
              </div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-bold text-foreground">
                  Core Platform MVP
                </h2>
                <StatusBadge s="active" />
              </div>
            </div>

            {/* Progress bar + Team Stack */}
            <div className="flex items-center gap-4">
              <div className="w-36">
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span className="font-mono font-semibold text-foreground">67%</span>
                </div>
                <ProgressBar pct={67} />
              </div>

              <div className="flex -space-x-1.5">
                {['ER', 'MV', 'ST'].map((initials, i) => (
                  <span
                    key={initials}
                    className={`size-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-card ${
                      i === 0 ? 'bg-violet-600' : i === 1 ? 'bg-emerald-600' : 'bg-blue-600'
                    }`}
                  >
                    {initials}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Column Switcher */}
          <div className="flex sm:hidden border-b border-border bg-secondary/30 p-1.5 gap-1 pointer-events-auto">
            {COLUMNS.map((col) => {
              const count = SAMPLE_TASKS.filter((t) => t.status === col.key).length;
              const active = mobileColumn === col.key;
              return (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => setMobileColumn(col.key)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 ${
                    active
                      ? 'bg-card text-foreground shadow-xs border border-border'
                      : 'text-muted-foreground'
                  }`}
                >
                  <col.icon className={`size-3.5 ${col.cls}`} />
                  <span>{col.label}</span>
                  <span className="text-[10px] font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Kanban Columns Grid: Matching ProjectDetail.tsx */}
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5 flex-1 bg-secondary/15">
            {COLUMNS.map((col) => {
              const columnTasks = SAMPLE_TASKS.filter((t) => t.status === col.key);
              const isVisibleOnMobile = mobileColumn === col.key;

              return (
                <div
                  key={col.key}
                  className={`flex flex-col rounded-xl border border-border/80 bg-secondary/30 p-2.5 ${
                    isVisibleOnMobile ? 'flex' : 'hidden sm:flex'
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center gap-2 px-1.5 py-1.5 text-xs font-semibold text-foreground mb-2">
                    <col.icon className={`size-3.5 shrink-0 ${col.cls}`} />
                    <span>{col.label}</span>
                    <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground">
                      {columnTasks.length}
                    </span>
                    <div className="ml-auto rounded-md p-1 text-muted-foreground">
                      <Plus className="size-3.5" />
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2.5">
                    {columnTasks.map((task) => {
                      const isHighlighted = task.id === 'task-3';
                      const isDone = task.status === 'DONE';

                      return (
                        <div
                          key={task.id}
                          className={`rounded-xl border bg-card p-3 shadow-card select-none cursor-default ${
                            isHighlighted
                              ? 'border-primary ring-2 ring-primary/20 shadow-md'
                              : 'border-border'
                          }`}
                        >
                          <p
                            className={`text-xs font-semibold leading-snug ${
                              isDone ? 'text-muted-foreground line-through' : 'text-foreground'
                            }`}
                          >
                            {task.title}
                          </p>

                          {task.description && (
                            <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <PriorityBadge p={task.priority} />
                              <span className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/50 px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">
                                <Calendar className="size-2.5" />
                                Oct 21
                              </span>
                            </div>
                            <span
                              title={`Assigned to ${task.assignee.name}`}
                              className="size-5 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center ring-1 ring-border"
                            >
                              {task.assignee.initials}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar matching app status */}
          <div className="px-4 py-2 bg-card border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>All 6 tasks synced with PostgreSQL multi-tenant backend</span>
            </span>
            <span className="font-mono text-[11px]">67% Sprint Velocity</span>
          </div>
        </div>
      </div>
    </div>
  );
};
