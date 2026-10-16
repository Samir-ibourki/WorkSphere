import { useSyncExternalStore } from "react";

export type Priority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "progress" | "done";
export type ProjectStatus = "active" | "planning" | "completed";
export type Role = "Owner" | "Admin" | "Member";

export interface Member { id: string; name: string; email: string; role: Role; hue: number }
export interface Task { id: string; projectId: string; title: string; description: string; priority: Priority; status: TaskStatus; due: string; assignee: string }
export interface Project { id: string; name: string; description: string; status: ProjectStatus; members: string[]; color: number }
export interface Activity { id: string; who: string; action: string; target: string; at: string }

interface State { workspace: { name: string; slug: string }; members: Member[]; projects: Project[]; tasks: Task[]; activity: Activity[] }

const m = (id: string, name: string, role: Role, hue: number): Member => ({ id, name, role, hue, email: `${(name.split(" ")[0] ?? name).toLowerCase()}@worksphere.io` });

let state: State = {
  workspace: { name: "Acme Inc.", slug: "acme" },
  members: [
    m("u1", "Ava Chen", "Owner", 277),
    m("u2", "Liam Ortiz", "Admin", 160),
    m("u3", "Noah Kim", "Member", 30),
    m("u4", "Mia Patel", "Member", 340),
    m("u5", "Ethan Brooks", "Member", 220),
  ],
  projects: [
    { id: "p1", name: "Atlas Platform", description: "Core infrastructure rewrite for multi-region deployments.", status: "active", members: ["u1", "u2", "u3"], color: 277 },
    { id: "p2", name: "Mobile Onboarding", description: "Redesign first-run experience across iOS and Android.", status: "active", members: ["u4", "u5"], color: 160 },
    { id: "p3", name: "Billing v2", description: "Usage-based pricing engine and invoicing.", status: "planning", members: ["u2", "u4"], color: 30 },
    { id: "p4", name: "Design System", description: "Unified component library and tokens.", status: "completed", members: ["u1", "u3", "u5"], color: 220 },
    { id: "p5", name: "Analytics Pipeline", description: "Real-time event ingestion and dashboards.", status: "planning", members: ["u3", "u5"], color: 340 },
  ],
  tasks: [],
  activity: [
    { id: "a1", who: "u2", action: "moved", target: "Set up edge caching → Done", at: "2m ago" },
    { id: "a2", who: "u4", action: "commented on", target: "Welcome screen copy", at: "18m ago" },
    { id: "a3", who: "u1", action: "created", target: "Billing v2", at: "1h ago" },
    { id: "a4", who: "u3", action: "assigned", target: "Token audit to Ethan", at: "3h ago" },
    { id: "a5", who: "u5", action: "completed", target: "Push notification flow", at: "Yesterday" },
  ],
};

const seed: [string, string, Priority, TaskStatus, string, string][] = [
  ["p1", "Set up edge caching", "high", "done", "Oct 10", "u2"],
  ["p1", "Migrate auth service", "high", "progress", "Oct 18", "u1"],
  ["p1", "Region failover tests", "medium", "todo", "Oct 24", "u3"],
  ["p1", "Write runbooks", "low", "todo", "Oct 30", "u2"],
  ["p1", "Observability dashboards", "medium", "progress", "Oct 20", "u3"],
  ["p2", "Welcome screen copy", "medium", "progress", "Oct 17", "u4"],
  ["p2", "Push notification flow", "high", "done", "Oct 12", "u5"],
  ["p2", "Permission prompts", "low", "todo", "Oct 26", "u5"],
  ["p3", "Pricing model spec", "high", "todo", "Nov 02", "u2"],
  ["p3", "Stripe webhook design", "medium", "todo", "Nov 06", "u4"],
  ["p4", "Token audit", "low", "done", "Sep 28", "u5"],
  ["p4", "Button variants", "medium", "done", "Sep 22", "u3"],
  ["p5", "Event schema", "medium", "progress", "Oct 22", "u3"],
];
state.tasks = seed.map(([projectId, title, priority, status, due, assignee], i) => ({
  id: `t${i}`,
  projectId,
  title,
  priority,
  status,
  due,
  assignee,
  description: "Scope, implement and ship with tests and docs.",
}));

const listeners = new Set<() => void>();
const set = (fn: (s: State) => State) => {
  state = fn(state);
  listeners.forEach((l) => l());
};
const uid = () => Math.random().toString(36).slice(2, 9);

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => sel(state),
    () => sel(state)
  );
}

export const actions = {
  addProject: (p: Omit<Project, "id" | "color">) =>
    set((s) => ({
      ...s,
      projects: [{ ...p, id: uid(), color: Math.floor(Math.random() * 360) }, ...s.projects],
    })),
  addTask: (t: Omit<Task, "id">) =>
    set((s) => ({ ...s, tasks: [...s.tasks, { ...t, id: uid() }] })),
  moveTask: (id: string, status: TaskStatus) =>
    set((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    })),
  invite: (email: string, role: Role) =>
    set((s) => ({
      ...s,
      members: [
        ...s.members,
        {
          id: uid(),
          email,
          role,
          name: email.split("@")[0] ?? email,
          hue: Math.floor(Math.random() * 360),
        },
      ],
    })),
  setRole: (id: string, role: Role) =>
    set((s) => ({
      ...s,
      members: s.members.map((x) => (x.id === id ? { ...x, role } : x)),
    })),
  updateWorkspace: (w: State["workspace"]) => set((s) => ({ ...s, workspace: w })),
};

export const progressOf = (tasks: Task[], pid: string) => {
  const t = tasks.filter((x) => x.projectId === pid);
  return {
    total: t.length,
    done: t.filter((x) => x.status === "done").length,
    pct: t.length ? Math.round((t.filter((x) => x.status === "done").length / t.length) * 100) : 0,
  };
};
