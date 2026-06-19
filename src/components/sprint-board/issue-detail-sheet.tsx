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

const sheetXPadding = "pl-[30px] pr-5";

const propertySelectTriggerClass =
  "h-auto w-full justify-start gap-3 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:border-transparent focus-visible:ring-0";

function PropertyRow({
  label,
  children,
  showLabel = true,
}: {
  label?: string;
  children: React.ReactNode;
  showLabel?: boolean;
}) {
  return (
    <div className="flex h-11 items-center border-b border-border">
      {showLabel ? (
        <span className="w-[100px] shrink-0 text-sm text-muted-foreground">
          {label}
        </span>
      ) : null}
      <div className={cn("min-w-0 flex-1", !showLabel && "flex items-center")}>
        {children}
      </div>
    </div>
  );
}

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
        className="flex w-full flex-col gap-0 overflow-hidden bg-background p-0 sm:max-w-[520px]"
      >
        <SheetTitle className="sr-only">{activeIssue.title}</SheetTitle>
        <SheetDescription className="sr-only">
          Edit issue details, metadata, and checklist items.
        </SheetDescription>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{activeIssue.key}</span>
              <Badge
                variant="outline"
                className={cn(
                  "h-[22px] rounded-lg px-2.5 text-xs font-medium",
                  status.headerBadge,
                )}
              >
                {status.label}
              </Badge>
            </div>
          </div>

          <div className="border-t border-border" />

          <div className={cn(sheetXPadding, "space-y-6 pt-6")}>
            <ClickToEditField
              value={activeIssue.title}
              onCommit={(title) => patchIssue({ title })}
              placeholder="Add a title..."
              ariaLabel="Issue title"
              viewClassName="text-2xl font-medium leading-normal tracking-normal"
              editClassName="text-2xl font-medium leading-normal"
              className="-ml-1.5"
            />

            <div className="border-t border-border">
              <PropertyRow label="Status">
                <Select
                  value={activeIssue.status}
                  onValueChange={(value) =>
                    patchIssue({ status: value as Issue["status"] })
                  }
                >
                  <SelectTrigger
                    className={cn(
                      propertySelectTriggerClass,
                      "w-fit [&_svg]:text-muted-foreground",
                    )}
                  >
                    <SelectValue>
                      <span className="flex items-center gap-1.5">
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
              </PropertyRow>

              <PropertyRow label="Assignee">
                <Select
                  value={activeIssue.assigneeId}
                  onValueChange={(value) => patchIssue({ assigneeId: value })}
                >
                  <SelectTrigger
                    className={cn(
                      propertySelectTriggerClass,
                      "[&_svg]:text-muted-foreground",
                    )}
                  >
                    <SelectValue>
                      <span className="flex items-center gap-2">
                        <Avatar className="size-8">
                          <AvatarFallback
                            className={cn("text-xs font-medium", assignee.color)}
                          >
                            {assignee.initials}
                          </AvatarFallback>
                        </Avatar>
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
              </PropertyRow>

              <PropertyRow label="Priority">
                <Select
                  value={activeIssue.priority}
                  onValueChange={(value) =>
                    patchIssue({ priority: value as Issue["priority"] })
                  }
                >
                  <SelectTrigger
                    className={cn(
                      propertySelectTriggerClass,
                      "w-fit [&_svg]:text-muted-foreground",
                    )}
                  >
                    <SelectValue>
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-[26px] gap-1.5 rounded-full px-3 text-sm font-medium",
                          priority.pill,
                        )}
                      >
                        <span className={cn("size-2 rounded-full", priority.dot)} />
                        {priority.label}
                      </Badge>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="start">
                    {PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <Badge
                          variant="outline"
                          className={cn("border px-2 font-normal", option.pill)}
                        >
                          {option.label}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </PropertyRow>

              <PropertyRow showLabel={false}>
                <IssueLabelsField
                  labels={activeIssue.labels}
                  availableLabels={availableLabels}
                  onLabelsChange={(labels) => patchIssue({ labels })}
                  onAvailableLabelsChange={onAvailableLabelsChange}
                />
              </PropertyRow>
            </div>
          </div>

          <div className={cn(sheetXPadding, "pt-6")}>
            <p className="-ml-1.5 mb-3 text-sm font-medium text-muted-foreground">
              Description
            </p>
            <ClickToEditField
              value={activeIssue.description}
              onCommit={(description) => patchIssue({ description })}
              multiline
              placeholder="Add a description..."
              ariaLabel="Issue description"
              viewClassName="text-sm leading-5"
              className="-ml-1.5"
            />
          </div>

          <div className={cn("border-t border-border", sheetXPadding, "py-6")}>
            <IssueChecklist
              items={activeIssue.checklist}
              onItemsChange={(checklist) => patchIssue({ checklist })}
            />
          </div>
        </div>

        <div
          className={cn(
            "flex shrink-0 justify-center border-t border-border py-2.5",
            sheetXPadding,
          )}
        >
          <Button
            type="button"
            variant="ghost"
            onClick={() => onDelete(activeIssue.id)}
            className="h-9 px-4 text-sm font-medium text-foreground hover:bg-destructive hover:text-white"
          >
            Delete
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
