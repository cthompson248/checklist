"use client";

import { ClickToEditField } from "@/components/sprint-board/click-to-edit-field";
import { IssueChecklist } from "@/components/sprint-board/issue-checklist";
import { IssueLabelsField } from "@/components/sprint-board/issue-labels-field";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ASSIGNEES,
  getAssignee,
  getPriorityOption,
  getStatusOption,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  type Issue,
} from "@/lib/sprint-data";
import { cn } from "@/lib/utils";

type IssueDetailSheetProps = {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (issue: Issue) => void;
  onDelete: (issueId: string) => void;
  availableLabels: string[];
  onAvailableLabelsChange: (labels: string[]) => void;
};

export function IssueDetailSheet({
  issue,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
  availableLabels,
  onAvailableLabelsChange,
}: IssueDetailSheetProps) {
  if (!issue) return null;

  const activeIssue = issue;
  const status = getStatusOption(activeIssue.status);
  const priority = getPriorityOption(activeIssue.priority);
  const assignee = getAssignee(activeIssue.assigneeId);

  function patchIssue(partial: Partial<Issue>) {
    onUpdate({ ...activeIssue, ...partial });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-[520px]"
      >
        <SheetTitle className="sr-only">{activeIssue.title}</SheetTitle>
        <SheetDescription className="sr-only">
          Edit issue details, metadata, and checklist items.
        </SheetDescription>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="space-y-4 px-6 pt-6 pb-5">
            <Badge variant="outline" className="font-mono text-[11px]">
              {activeIssue.key}
            </Badge>

            <ClickToEditField
              value={activeIssue.title}
              onCommit={(title) => patchIssue({ title })}
              placeholder="Add a title..."
              ariaLabel="Issue title"
            />

            <div className="grid grid-cols-[88px_1fr] items-center gap-x-4 gap-y-3 text-sm">
              <span className="text-muted-foreground">Status</span>
              <Select
                value={activeIssue.status}
                onValueChange={(value) =>
                  patchIssue({ status: value as Issue["status"] })
                }
              >
                <SelectTrigger
                  size="sm"
                  className={cn("h-8 w-fit border", status.pill)}
                >
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      <span className={cn("size-2 rounded-full", status.dot)} />
                      {status.label}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className="flex items-center gap-2">
                        <span className={cn("size-2 rounded-full", option.dot)} />
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="text-muted-foreground">Assignee</span>
              <Select
                value={activeIssue.assigneeId}
                onValueChange={(value) => patchIssue({ assigneeId: value })}
              >
                <SelectTrigger size="sm" className="h-8 w-fit">
                  <SelectValue>
                    <span className="flex items-center gap-1.5">
                      <span
                        aria-hidden
                        className={cn(
                          "inline-flex size-4 shrink-0 items-center justify-center rounded-full text-[8px] font-medium leading-none",
                          assignee.color,
                        )}
                      >
                        {assignee.initials}
                      </span>
                      {assignee.name}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  {ASSIGNEES.map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      <span className="flex items-center gap-2">
                        <Avatar size="sm" className="size-5">
                          <AvatarFallback
                            className={cn("text-[10px]", person.color)}
                          >
                            {person.initials}
                          </AvatarFallback>
                        </Avatar>
                        {person.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="text-muted-foreground">Priority</span>
              <Select
                value={activeIssue.priority}
                onValueChange={(value) =>
                  patchIssue({ priority: value as Issue["priority"] })
                }
              >
                <SelectTrigger
                  size="sm"
                  className={cn("h-8 w-fit border", priority.pill)}
                >
                  <SelectValue>{priority.label}</SelectValue>
                </SelectTrigger>
                <SelectContent align="start">
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="text-muted-foreground">Points</span>
              <span className="font-medium">{activeIssue.points}</span>

              <span className="self-start pt-0.5 text-muted-foreground">Labels</span>
              <IssueLabelsField
                labels={activeIssue.labels}
                availableLabels={availableLabels}
                onLabelsChange={(labels) => patchIssue({ labels })}
                onAvailableLabelsChange={onAvailableLabelsChange}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3 px-6 py-5">
            <p className="text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
              Description
            </p>
            <ClickToEditField
              value={activeIssue.description}
              onCommit={(description) => patchIssue({ description })}
              multiline
              placeholder="Add a description..."
              ariaLabel="Issue description"
            />
          </div>

          <Separator />

          <div className="px-6 py-5">
            <IssueChecklist
              items={activeIssue.checklist}
              onItemsChange={(checklist) => patchIssue({ checklist })}
            />
          </div>
        </div>

        <div className="flex shrink-0 justify-center border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onDelete(activeIssue.id)}
            className="text-muted-foreground hover:bg-destructive hover:text-white"
          >
            Delete
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
