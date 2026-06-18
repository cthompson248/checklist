"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  getAssignee,
  getPriorityOption,
  getStatusOption,
  STATUS_OPTIONS,
  type Issue,
} from "@/lib/sprint-data";
import { cn } from "@/lib/utils";

type KanbanBoardProps = {
  issues: Issue[];
  selectedIssueId: string | null;
  onSelectIssue: (issueId: string) => void;
};

export function KanbanBoard({
  issues,
  selectedIssueId,
  onSelectIssue,
}: KanbanBoardProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f7f7f8]">
      <header className="border-b border-border bg-background px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Sprint 24 · Checkout</p>
            <h1 className="text-lg font-semibold tracking-tight">Sprint Board</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Click a card to open the issue detail panel
          </p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 gap-4 overflow-x-auto p-6">
        {STATUS_OPTIONS.map((column) => {
          const columnIssues = issues.filter(
            (issue) => issue.status === column.value,
          );
          const points = columnIssues.reduce(
            (total, issue) => total + issue.points,
            0,
          );

          return (
            <section
              key={column.value}
              className="flex w-[280px] shrink-0 flex-col gap-3"
            >
              <div className="flex items-center gap-2 px-1">
                <span className={cn("size-2 rounded-full", column.dot)} />
                <h2 className="text-xs font-semibold tracking-[0.08em] uppercase">
                  {column.label}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {columnIssues.length}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {points} pts
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {columnIssues.map((issue) => {
                  const priority = getPriorityOption(issue.priority);
                  const assignee = getAssignee(issue.assigneeId);
                  const status = getStatusOption(issue.status);

                  return (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() => onSelectIssue(issue.id)}
                      className={cn(
                        "rounded-xl border border-border bg-background p-3 text-left shadow-xs transition hover:border-foreground/20 hover:shadow-sm",
                        "border-t-[3px]",
                        status.column,
                        selectedIssueId === issue.id &&
                          "ring-2 ring-foreground/15",
                      )}
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {issue.key}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn("border px-1.5 py-0 text-[10px]", priority.pill)}
                        >
                          {priority.label}
                        </Badge>
                      </div>

                      <p className="mb-3 text-sm leading-snug font-medium">
                        {issue.title}
                      </p>

                      <div className="mb-3 flex flex-wrap gap-1">
                        {issue.labels.map((label) => (
                          <Badge
                            key={label}
                            variant="secondary"
                            className="px-1.5 py-0 text-[10px]"
                          >
                            {label}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-muted-foreground">
                          {issue.points} pts
                        </span>
                        <Avatar size="sm" className="size-6">
                          <AvatarFallback
                            className={cn("text-[10px]", assignee.color)}
                          >
                            {assignee.initials}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
