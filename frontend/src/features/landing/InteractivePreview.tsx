import React, { useState, useRef } from 'react';
import {
  Filter,
  User,
  CheckCircle2,
  Calendar,
  Circle,
  CircleDashed,
  Sparkles,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { PriorityBadge } from '@/components/ws';
import {
  SAMPLE_PROJECTS,
  SAMPLE_TASKS,
  type SampleTask,
  type TaskStatus,
  type TaskPriority,
} from './landingData';

const STATUS_COLUMNS: {
  key: TaskStatus;
  label: string;
  icon: typeof Circle;
  cls: string;
}[] = [
  {
    key: 'TODO',
    label: 'To Do',
    icon: Circle,
    cls: 'text-muted-foreground',
  },
  {
    key: 'IN_PROGRESS',
    label: 'In Progress',
    icon: CircleDashed,
    cls: 'text-amber-500',
  },
  {
    key: 'DONE',
    label: 'Done',
    icon: CheckCircle2,
    cls: 'text-emerald-500',
  },
];

export const InteractivePreview: React.FC = () => {
  const [tasks, setTasks] = useState<SampleTask[]>(SAMPLE_TASKS);
  const [viewScope, setViewScope] = useState<'ALL' | 'MY'>('ALL');
  const [selectedProject, setSelectedProject] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('task-3');

  const boardContainerRef = useRef<HTMLDivElement>(null);

  const filteredTasks = tasks.filter((task) => {
    if (viewScope === 'MY' && !task.assignee.isCurrentUser) return false;
    if (selectedProject !== 'ALL' && task.projectId !== selectedProject)
      return false;
    if (statusFilter !== 'ALL' && task.status !== statusFilter) return false;
    return true;
  });

  const selectedTask: SampleTask =
    tasks.find((t) => t.id === selectedTaskId) || tasks[0];

  const updateSelectedTaskStatus = (newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === selectedTask.id ? { ...t, status: newStatus } : t))
    );
  };

  const updateSelectedTaskPriority = (newPriority: TaskPriority) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === selectedTask.id ? { ...t, priority: newPriority } : t))
    );
  };

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      gsap.fromTo(
        '.interactive-task-card',
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          stagger: 0.03,
          ease: 'power2.out',
          overwrite: true,
        }
      );
    },
    {
      scope: boardContainerRef,
      dependencies: [viewScope, selectedProject, statusFilter],
    }
  );

  return (
    <section
      id="interactive-preview"
      className="py-20 sm:py-24 lg:py-28 bg-secondary/15 border-t border-border/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3 border border-primary/20">
              <Sparkles className="size-3.5" />
              <span>LIVE KANBAN & TASK INSPECTOR DEMO</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              See your work move forward.
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Click tasks on the board to inspect their details in real-time, change status or priority,
              and test the exact same interface you get inside the application.
            </p>
          </div>

          {/* All Tasks vs My Tasks Toggle (Matching app filters) */}
          <div
            role="group"
            aria-label="Filter tasks by assignment"
            className="inline-flex p-1 rounded-xl bg-card border border-border self-start shadow-xs"
          >
            <button
              type="button"
              onClick={() => setViewScope('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewScope === 'ALL'
                  ? 'bg-secondary text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Tasks ({tasks.length})
            </button>
            <button
              type="button"
              onClick={() => setViewScope('MY')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewScope === 'MY'
                  ? 'bg-secondary text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="size-3.5 text-primary" />
              <span>My Tasks (ER)</span>
            </button>
          </div>
        </div>

        {/* Interactive Board Shell */}
        <div
          ref={boardContainerRef}
          className="mt-8 rounded-2xl bg-card border border-border shadow-xl overflow-hidden select-none"
        >
          {/* Filter Bar */}
          <div className="p-4 sm:px-6 border-b border-border bg-secondary/30 flex flex-wrap items-center justify-between gap-4">
            {/* Project Selector Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground mr-1 flex items-center gap-1">
                <Filter className="size-3.5" /> Project:
              </span>
              <button
                type="button"
                onClick={() => setSelectedProject('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedProject === 'ALL'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-card text-muted-foreground border border-border hover:bg-secondary'
                }`}
              >
                All Projects
              </button>
              {SAMPLE_PROJECTS.map((proj) => (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => setSelectedProject(proj.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedProject === proj.id
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-card text-muted-foreground border border-border hover:bg-secondary'
                  }`}
                >
                  <span className="size-2 rounded-full shrink-0 bg-primary" />
                  <span>{proj.name}</span>
                </button>
              ))}
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground mr-1">
                Status:
              </span>
              {(
                [
                  { key: 'ALL', label: 'All' },
                  { key: 'TODO', label: 'To Do' },
                  { key: 'IN_PROGRESS', label: 'In Progress' },
                  { key: 'DONE', label: 'Done' },
                ] as const
              ).map((st) => (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => setStatusFilter(st.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    statusFilter === st.key
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-card text-muted-foreground border border-border hover:bg-secondary'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Kanban Columns (Matching ProjectDetail.tsx) */}
            <div className="lg:col-span-8 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5 bg-secondary/15">
              {STATUS_COLUMNS.map((col) => {
                const colTasks = filteredTasks.filter((t) => t.status === col.key);
                const isDimmed = statusFilter !== 'ALL' && statusFilter !== col.key;

                return (
                  <div
                    key={col.key}
                    className={`rounded-xl border border-border/80 bg-secondary/30 p-2.5 transition-opacity ${
                      isDimmed ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2.5 px-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                        <col.icon className={`size-3.5 ${col.cls}`} />
                        <span>{col.label}</span>
                      </div>
                      <span className="rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground">
                        {colTasks.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 min-h-[220px]">
                      {colTasks.length === 0 ? (
                        <div className="h-28 rounded-lg border border-dashed border-border/80 flex items-center justify-center text-xs text-muted-foreground p-3 text-center">
                          No tasks in {col.label}
                        </div>
                      ) : (
                        colTasks.map((task) => {
                          const isSelected = task.id === selectedTask.id;
                          const isDone = task.status === 'DONE';

                          return (
                            <div
                              key={task.id}
                              onClick={() => setSelectedTaskId(task.id)}
                              className={`interactive-task-card rounded-xl border bg-card p-3 shadow-card select-none cursor-pointer transition-colors ${
                                isSelected
                                  ? 'border-primary ring-2 ring-primary/20 shadow-md'
                                  : 'border-border'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className={`text-xs font-semibold leading-snug ${
                                    isDone
                                      ? 'text-muted-foreground line-through'
                                      : 'text-foreground'
                                  }`}
                                >
                                  {task.title}
                                </p>
                              </div>

                              {task.description && (
                                <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground leading-relaxed">
                                  {task.description}
                                </p>
                              )}

                              <div className="mt-3 flex items-center justify-between pt-1.5 border-t border-border/40 text-[11px]">
                                <div className="flex items-center gap-1.5">
                                  <PriorityBadge p={task.priority} />
                                  <span className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary/50 px-1.5 py-0.5 text-[10px] text-muted-foreground font-mono">
                                    <Calendar className="size-2.5" />
                                    Oct 21
                                  </span>
                                </div>
                                <span className="size-5 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center ring-1 ring-border">
                                  {task.assignee.initials}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Task Inspector (Styled EXACTLY like TaskDetailModal.tsx) */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-border p-5 sm:p-6 bg-card flex flex-col justify-between">
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                      {selectedTask.code}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      Task Inspector
                    </span>
                  </div>
                  <PriorityBadge p={selectedTask.priority} />
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-foreground leading-snug">
                    {selectedTask.title}
                  </h3>
                  <div className="mt-2.5 p-3 rounded-xl bg-secondary/30 border border-border/60 text-xs text-muted-foreground leading-relaxed">
                    {selectedTask.description}
                  </div>
                </div>

                {/* Interactive Status Selector (from TaskDetailModal) */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Update Workflow Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {STATUS_COLUMNS.map((st) => {
                      const active = selectedTask.status === st.key;
                      return (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => updateSelectedTaskStatus(st.key)}
                          className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                            active
                              ? 'bg-primary/10 border-primary text-primary shadow-xs'
                              : 'bg-card border-border text-muted-foreground hover:bg-secondary'
                          }`}
                        >
                          <st.icon className={`size-3.5 ${st.cls}`} />
                          <span>{st.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Priority Selector (from TaskDetailModal) */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Priority Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Low', 'Medium', 'High'] as TaskPriority[]).map((p) => {
                      const active =
                        selectedTask.priority.toLowerCase() === p.toLowerCase();
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => updateSelectedTaskPriority(p)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                            active
                              ? 'bg-secondary border-primary/60 text-foreground font-semibold shadow-xs'
                              : 'bg-card border-border text-muted-foreground hover:bg-secondary'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Meta details list */}
                <div className="pt-3 border-t border-border/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Project</span>
                    <span className="font-medium text-foreground">{selectedTask.projectName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Assigned To</span>
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <span className="size-5 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center">
                        {selectedTask.assignee.initials}
                      </span>
                      <span>{selectedTask.assignee.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span className="font-mono text-muted-foreground">Oct 21, 2026</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>Interactive React state preview</span>
                <span className="text-emerald-500 font-medium">● Live sync</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
