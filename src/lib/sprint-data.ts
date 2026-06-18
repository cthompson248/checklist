export type IssueStatus = "in-progress" | "in-review" | "done";
export type IssuePriority = "urgent" | "high" | "medium" | "low";

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type Assignee = {
  id: string;
  name: string;
  initials: string;
  color: string;
};

export type Issue = {
  id: string;
  key: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assigneeId: string;
  points: number;
  labels: string[];
  checklist: ChecklistItem[];
  comments: number;
  files: number;
  branches: number;
};

export const ASSIGNEES: Assignee[] = [
  { id: "devi", name: "Devi Rao", initials: "DR", color: "bg-amber-200 text-amber-900" },
  { id: "sarah", name: "Sarah Chen", initials: "SC", color: "bg-sky-200 text-sky-900" },
  { id: "marcus", name: "Marcus Okafor", initials: "MO", color: "bg-violet-200 text-violet-900" },
  { id: "priya", name: "Priya Anand", initials: "PA", color: "bg-rose-200 text-rose-900" },
  { id: "james", name: "James Liu", initials: "JL", color: "bg-emerald-200 text-emerald-900" },
];

export const STATUS_OPTIONS: {
  value: IssueStatus;
  label: string;
  dot: string;
  pill: string;
  column: string;
}[] = [
  {
    value: "in-progress",
    label: "In Progress",
    dot: "bg-orange-500",
    pill: "border-orange-200 bg-orange-50 text-orange-800",
    column: "border-t-orange-400",
  },
  {
    value: "in-review",
    label: "In Review",
    dot: "bg-violet-500",
    pill: "border-violet-200 bg-violet-50 text-violet-800",
    column: "border-t-violet-400",
  },
  {
    value: "done",
    label: "Done",
    dot: "bg-emerald-500",
    pill: "border-emerald-200 bg-emerald-50 text-emerald-800",
    column: "border-t-emerald-400",
  },
];

export const PRIORITY_OPTIONS: {
  value: IssuePriority;
  label: string;
  pill: string;
}[] = [
  { value: "urgent", label: "Urgent", pill: "border-red-200 bg-red-50 text-red-700" },
  { value: "high", label: "High", pill: "border-orange-200 bg-orange-50 text-orange-700" },
  { value: "medium", label: "Medium", pill: "border-amber-200 bg-amber-50 text-amber-800" },
  { value: "low", label: "Low", pill: "border-emerald-200 bg-emerald-50 text-emerald-700" },
];

export const INITIAL_ISSUES: Issue[] = [
  {
    id: "128",
    key: "SPB-128",
    title: "Migrate checkout to the new design tokens",
    description:
      "Replace all hardcoded hex values in checkout components with the new OKLCH design token equivalents. Covers base styles, layout primitives, and component-level overrides. Final step is a cross-browser smoke test and sign-off against the design spec.",
    status: "done",
    priority: "medium",
    assigneeId: "devi",
    points: 5,
    labels: ["frontend"],
    checklist: [
      { id: "c1", label: "Audit all hardcoded hex values in checkout components", done: true },
      { id: "c2", label: "Map hex values to OKLCH token equivalents", done: true },
      { id: "c3", label: "Update layout primitives and shared styles", done: true },
      { id: "c4", label: "Cross-browser smoke test (Chrome, Firefox, Safari)", done: false },
      { id: "c5", label: "Review final token names against design spec", done: false },
    ],
    comments: 1,
    files: 0,
    branches: 2,
  },
  {
    id: "139",
    key: "SPB-139",
    title: "Inline card validation with field-level errors",
    status: "in-progress",
    priority: "high",
    assigneeId: "sarah",
    points: 8,
    labels: ["frontend", "payments"],
    description:
      "Add inline validation to card entry fields with clear, field-level error messages and accessible focus management.",
    checklist: [],
    comments: 2,
    files: 1,
    branches: 0,
  },
  {
    id: "141",
    key: "SPB-141",
    title: "Fix 3DS redirect loop on expired sessions",
    status: "in-progress",
    priority: "urgent",
    assigneeId: "marcus",
    points: 3,
    labels: ["payments", "bug"],
    description:
      "Investigate and fix the redirect loop that occurs when a 3DS session expires during checkout.",
    checklist: [],
    comments: 0,
    files: 0,
    branches: 1,
  },
  {
    id: "133",
    key: "SPB-133",
    title: "Add rate limiting to checkout API endpoints",
    status: "in-review",
    priority: "high",
    assigneeId: "priya",
    points: 5,
    labels: ["backend", "security"],
    description:
      "Introduce sensible rate limits on checkout endpoints to reduce abuse while preserving conversion.",
    checklist: [],
    comments: 3,
    files: 2,
    branches: 1,
  },
  {
    id: "127",
    key: "SPB-127",
    title: "Update checkout success page copy",
    status: "in-review",
    priority: "low",
    assigneeId: "james",
    points: 3,
    labels: ["frontend"],
    description: "Refresh success page messaging to match the new brand voice guidelines.",
    checklist: [],
    comments: 1,
    files: 0,
    branches: 0,
  },
  {
    id: "122",
    key: "SPB-122",
    title: "Remove legacy payment method toggle",
    status: "done",
    priority: "medium",
    assigneeId: "devi",
    points: 2,
    labels: ["frontend"],
    description: "Remove the deprecated payment method toggle and related feature flag.",
    checklist: [],
    comments: 0,
    files: 0,
    branches: 0,
  },
  {
    id: "119",
    key: "SPB-119",
    title: "Add Apple Pay merchant validation",
    status: "done",
    priority: "high",
    assigneeId: "marcus",
    points: 5,
    labels: ["payments"],
    description: "Complete Apple Pay merchant validation for production checkout.",
    checklist: [],
    comments: 2,
    files: 1,
    branches: 0,
  },
];

export function collectAvailableLabels(issues: Issue[]): string[] {
  return [...new Set(issues.flatMap((issue) => issue.labels))].sort();
}

export function getAssignee(id: string) {
  return ASSIGNEES.find((assignee) => assignee.id === id) ?? ASSIGNEES[0];
}

export function getStatusOption(status: IssueStatus) {
  return STATUS_OPTIONS.find((option) => option.value === status) ?? STATUS_OPTIONS[0];
}

export function getPriorityOption(priority: IssuePriority) {
  return PRIORITY_OPTIONS.find((option) => option.value === priority) ?? PRIORITY_OPTIONS[2];
}
