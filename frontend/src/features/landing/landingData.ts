export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface SampleTask {
  id: string;
  code: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  projectId: string;
  projectName: string;
  assignee: {
    name: string;
    initials: string;
    color: string;
    isCurrentUser?: boolean;
  };
}

export interface SampleProject {
  id: string;
  name: string;
  status: 'Active' | 'In Review' | 'Planning';
  progress: number;
  taskCount: number;
  completedCount: number;
  accentColor: string;
}

export const SAMPLE_PROJECTS: SampleProject[] = [
  {
    id: 'proj-core',
    name: 'Core Platform MVP',
    status: 'Active',
    progress: 64,
    taskCount: 11,
    completedCount: 7,
    accentColor: '#2563EB',
  },
  {
    id: 'proj-web',
    name: 'Marketing Website',
    status: 'In Review',
    progress: 83,
    taskCount: 6,
    completedCount: 5,
    accentColor: '#10B981',
  },
  {
    id: 'proj-api',
    name: 'Workspace API v1',
    status: 'Active',
    progress: 50,
    taskCount: 8,
    completedCount: 4,
    accentColor: '#6366F1',
  },
];

export const SAMPLE_TASKS: SampleTask[] = [
  {
    id: 'task-1',
    code: 'WS-101',
    title: 'Design homepage',
    description:
      'Establish editorial typography hierarchy, warm neutral surface palette, and hero workspace preview.',
    priority: 'High',
    status: 'DONE',
    projectId: 'proj-web',
    projectName: 'Marketing Website',
    assignee: {
      name: 'Elena Rostova',
      initials: 'ER',
      color: 'bg-blue-600 text-white',
      isCurrentUser: true,
    },
  },
  {
    id: 'task-2',
    code: 'WS-102',
    title: 'Connect PostgreSQL',
    description:
      'Configure Prisma schema and connection pooling for workspaces, projects, and task models.',
    priority: 'High',
    status: 'DONE',
    projectId: 'proj-api',
    projectName: 'Workspace API v1',
    assignee: {
      name: 'Marcus Vance',
      initials: 'MV',
      color: 'bg-emerald-600 text-white',
      isCurrentUser: false,
    },
  },
  {
    id: 'task-3',
    code: 'WS-103',
    title: 'Build authentication API',
    description:
      'Implement session-based login, registration endpoints, and protected workspace middleware.',
    priority: 'High',
    status: 'IN_PROGRESS',
    projectId: 'proj-core',
    projectName: 'Core Platform MVP',
    assignee: {
      name: 'Elena Rostova',
      initials: 'ER',
      color: 'bg-blue-600 text-white',
      isCurrentUser: true,
    },
  },
  {
    id: 'task-4',
    code: 'WS-104',
    title: 'Fix mobile navigation',
    description:
      'Ensure focus trapping, escape-key dismissal, and clean drawer transitions on small viewports.',
    priority: 'Medium',
    status: 'IN_PROGRESS',
    projectId: 'proj-web',
    projectName: 'Marketing Website',
    assignee: {
      name: 'Sora Takahashi',
      initials: 'ST',
      color: 'bg-indigo-600 text-white',
      isCurrentUser: false,
    },
  },
  {
    id: 'task-5',
    code: 'WS-105',
    title: 'Review landing page',
    description:
      'Verify copy clarity, responsive breakpoints, reduced-motion accessibility, and interactive Kanban filters.',
    priority: 'Medium',
    status: 'TODO',
    projectId: 'proj-web',
    projectName: 'Marketing Website',
    assignee: {
      name: 'Elena Rostova',
      initials: 'ER',
      color: 'bg-blue-600 text-white',
      isCurrentUser: true,
    },
  },
  {
    id: 'task-6',
    code: 'WS-106',
    title: 'Deploy application',
    description:
      'Run production build verification and configure environment variables for staging deployment.',
    priority: 'Low',
    status: 'TODO',
    projectId: 'proj-core',
    projectName: 'Core Platform MVP',
    assignee: {
      name: 'Marcus Vance',
      initials: 'MV',
      color: 'bg-emerald-600 text-white',
      isCurrentUser: false,
    },
  },
];

export const VALUE_STRIP_ITEMS = [
  {
    id: 'workspace',
    title: 'One organized workspace',
    description: 'Keep every team project and task structured under a single roof.',
  },
  {
    id: 'ownership',
    title: 'Clear project ownership',
    description: 'Assign tasks to specific teammates so responsibilities are never ambiguous.',
  },
  {
    id: 'tracking',
    title: 'Visual task tracking',
    description: 'Move work across To Do, In Progress, and Done with clear priority labels.',
  },
  {
    id: 'progress',
    title: 'Progress at a glance',
    description: 'Monitor task totals and completion counts without digging through threads.',
  },
];

export const PROBLEM_SOLUTION_ITEMS = [
  {
    number: '01',
    problemTitle: 'Work scattered across different tools',
    problemDetail:
      'Tasks live in chat threads, personal notes, and disconnected spreadsheets, forcing teams to hunt for context.',
    solutionTitle: 'A single workspace for every project',
    solutionDetail:
      'WorkSphere groups your projects and tasks into one dedicated workspace so the whole team looks at the same source of truth.',
    beforeTags: ['Docs', 'Chat threads', 'Personal notes', 'Spreadsheets'],
    afterLabel: 'Studio North Workspace → 3 Active Projects',
  },
  {
    number: '02',
    problemTitle: 'Unclear task ownership and priorities',
    problemDetail:
      'When everything looks equally urgent and no owner is listed, critical deliverables stall or get duplicated.',
    solutionTitle: 'Explicit assignees and priority levels',
    solutionDetail:
      'Every task card displays its assigned owner, current status, and Low, Medium, or High priority right on the board.',
    beforeTags: ['Who owns this?', 'Is this urgent?', 'No status'],
    afterLabel: 'WS-103 • High Priority • Assigned to ER',
  },
  {
    number: '03',
    problemTitle: 'Difficulty understanding project progress',
    problemDetail:
      'Status meetings get spent asking what is done and what is blocked instead of actually moving work forward.',
    solutionTitle: 'Instant visibility via Kanban and dashboard totals',
    solutionDetail:
      'See exactly how many tasks are To Do, In Progress, or Done across every project at a glance.',
    beforeTags: ['Status meetings', 'Manual check-ins', 'Guesswork'],
    afterLabel: '64% Complete • 4 Done / 2 In Progress',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Create your workspace',
    description:
      "Set up a dedicated place for your team's work in seconds and invite your collaborators.",
    meta: 'Workspace: Studio North',
  },
  {
    step: '02',
    title: 'Organize your projects',
    description:
      'Create focused projects, break deliverables into manageable tasks, and assign clear owners and priorities.',
    meta: '3 Projects • 6 Assigned Tasks',
  },
  {
    step: '03',
    title: 'Track progress',
    description:
      'Update task statuses across your Kanban board and check the project dashboard to see what needs attention.',
    meta: 'To Do → In Progress → Done',
  },
];
