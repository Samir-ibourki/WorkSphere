import React, { useRef } from 'react';
import {
  FolderKanban,
  Layers,
  CheckSquare,
  Columns3,
  LayoutDashboard,
  Circle,
  CircleDashed,
  CheckCircle2,
  TrendingUp,
  Settings,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { PriorityBadge, ProgressBar, StatusBadge } from '@/components/ws';
import { SAMPLE_PROJECTS, SAMPLE_TASKS } from './landingData';

gsap.registerPlugin(ScrollTrigger);

export const FeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      gsap.from('.features-header', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      });

      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.features-bento',
          start: 'top 80%',
        },
        y: 24,
        opacity: 0,
        duration: 0.55,
        stagger: 0.1,
        ease: 'power2.out',
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-20 sm:py-24 lg:py-28 bg-card border-t border-border/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="features-header max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            CORE CAPABILITIES
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Everything your team needs to stay aligned. Nothing in the way.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Built around five essential building blocks that take projects from
            initial setup to completed tasks.
          </p>
        </div>

        {/* 5-Feature Bento Grid Matching Actual App Components */}
        <div className="features-bento mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Feature 1: Your workspace, organized */}
          <div className="feature-card lg:col-span-5 rounded-2xl bg-secondary/20 border border-border p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
                <Layers className="size-3.5" />
                <span>01 • Workspaces</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Your workspace, organized
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                A workspace provides a central home for your team's projects so
                everyone knows exactly where to find active work.
              </p>
            </div>

            {/* Visual: Workspace sidebar matching AppShell */}
            <div className="mt-6 rounded-xl bg-card border border-border p-4 shadow-card select-none pointer-events-none">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-gradient-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    W
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    Acme Studio Workspace
                  </span>
                </div>
                <StatusBadge s="active" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-secondary text-foreground">
                  <FolderKanban className="size-3.5 text-primary" />
                  <span>Projects</span>
                  <span className="ml-auto text-[10px] font-mono text-muted-foreground">3</span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground">
                  <LayoutDashboard className="size-3.5" />
                  <span>Dashboard</span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground">
                  <Settings className="size-3.5" />
                  <span>Settings</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Projects with clear direction */}
          <div className="feature-card lg:col-span-7 rounded-2xl bg-secondary/20 border border-border p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
                <FolderKanban className="size-3.5" />
                <span>02 • Projects</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Projects with clear direction
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Create dedicated projects, group related tasks together, and see
                each project's current status and completion progress at a glance.
              </p>
            </div>

            {/* Visual: Project cards matching Projects.tsx */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 select-none pointer-events-none">
              {SAMPLE_PROJECTS.map((project) => (
                <div
                  key={project.id}
                  className="rounded-xl bg-card border border-border p-4 shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="size-2.5 rounded-xs shrink-0 bg-primary" />
                      <StatusBadge s={project.status === 'In Review' ? 'planning' : 'active'} />
                    </div>
                    <h4 className="mt-3 text-xs font-bold text-foreground truncate">
                      {project.name}
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                      <span>Progress</span>
                      <span className="font-mono font-semibold text-foreground">
                        {project.progress}%
                      </span>
                    </div>
                    <ProgressBar pct={project.progress} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 3: Tasks that keep moving */}
          <div className="feature-card lg:col-span-6 rounded-2xl bg-secondary/20 border border-border p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
                <CheckSquare className="size-3.5" />
                <span>03 • Tasks & Assignments</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Tasks that keep moving
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Every task includes a clear title, description, priority level,
                workflow status, and assigned teammate so nothing falls through the
                cracks.
              </p>
            </div>

            {/* Visual: Real task cards matching ProjectDetail.tsx */}
            <div className="mt-6 space-y-2.5 select-none pointer-events-none">
              {SAMPLE_TASKS.slice(2, 5).map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl bg-card border border-border p-3.5 shadow-card flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground">
                      {task.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge p={task.priority} />
                    <span
                      title={task.assignee.name}
                      className="size-5 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center ring-1 ring-border"
                    >
                      {task.assignee.initials}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 4: A Kanban board that makes progress visible */}
          <div className="feature-card lg:col-span-6 rounded-2xl bg-secondary/20 border border-border p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
                <Columns3 className="size-3.5" />
                <span>04 • Kanban Workflow</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">
                A Kanban board that makes progress visible
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Track work across three clean stages—<strong>To Do</strong>,{' '}
                <strong>In Progress</strong>, and <strong>Done</strong>—so the
                whole team can see what is moving right now.
              </p>
            </div>

            {/* Visual: Real 3-column Kanban with Circle, CircleDashed, CheckCircle2 */}
            <div className="mt-6 grid grid-cols-3 gap-2.5 select-none pointer-events-none">
              {[
                {
                  title: 'To Do',
                  icon: Circle,
                  cls: 'text-muted-foreground',
                  tasks: ['Review landing page', 'Deploy application'],
                },
                {
                  title: 'In Progress',
                  icon: CircleDashed,
                  cls: 'text-amber-500',
                  tasks: ['Build auth API', 'Fix mobile nav'],
                },
                {
                  title: 'Done',
                  icon: CheckCircle2,
                  cls: 'text-emerald-500',
                  tasks: ['Design homepage', 'Connect PostgreSQL'],
                },
              ].map((col) => (
                <div
                  key={col.title}
                  className="rounded-xl bg-card border border-border p-2.5 shadow-card"
                >
                  <div className="flex items-center gap-1.5 mb-2 px-1">
                    <col.icon className={`size-3 ${col.cls}`} />
                    <span className="text-[11px] font-semibold text-foreground">
                      {col.title}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {col.tasks.map((t) => (
                      <div
                        key={t}
                        className="p-2 rounded-lg bg-secondary/50 border border-border/60 text-[11px] font-medium text-foreground truncate"
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature 5: A dashboard for the bigger picture */}
          <div className="feature-card lg:col-span-12 rounded-2xl bg-secondary/20 border border-border p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
                  <LayoutDashboard className="size-3.5" />
                  <span>05 • Project Dashboard</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  A dashboard for the bigger picture
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  See total projects, task counts across every status, and a clear
                  breakdown of what is queued, active, and completed across your
                  workspace.
                </p>
              </div>

              {/* KPI Cards styled EXACTLY like Dashboard.tsx */}
              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 select-none pointer-events-none">
                {[
                  { label: 'Total Projects', value: '3', trend: '+1', sub: 'this month' },
                  { label: 'Active Tasks', value: '6', trend: '100%', sub: 'assigned' },
                  { label: 'In Progress', value: '2', trend: '33%', sub: 'workload' },
                  { label: 'Completed', value: '2', trend: '+2', sub: 'this sprint' },
                ].map((k) => (
                  <div
                    key={k.label}
                    className="rounded-xl border border-border bg-card p-4 shadow-card"
                  >
                    <p className="text-xs text-muted-foreground">{k.label}</p>
                    <p className="mt-2 text-2xl font-bold text-foreground">{k.value}</p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                      <TrendingUp className="size-3" />
                      {k.trend}
                      <span className="text-muted-foreground font-normal">{k.sub}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
