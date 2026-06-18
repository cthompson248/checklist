"use client";

import { useState } from "react";
import { MinusCircle, Plus } from "lucide-react";

import { ClickToEditField } from "@/components/sprint-board/click-to-edit-field";
import { IssueLabelsField } from "@/components/sprint-board/issue-labels-field";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
  availableLabels: string[];
  onAvailableLabelsChange: (labels: string[]) => void;
};

export function IssueDetailSheet({
  issue,
  open,
  onOpenChange,
  onUpdate,
  availableLabels,
  onAvailableLabelsChange,
}: IssueDetailSheetProps) {
  const [newChecklistItem, setNewChecklistItem] = useState("");

  if (!issue) return null;

  const activeIssue = issue;
  const status = getStatusOption(activeIssue.status);
  const priority = getPriorityOption(activeIssue.priority);
  const assignee = getAssignee(activeIssue.assigneeId);
  const completedCount = activeIssue.checklist.filter((item) => item.done).length;
  const checklistProgress =
    activeIssue.checklist.length === 0
      ? 0
      : Math.round((completedCount / activeIssue.checklist.length) * 100);

  function patchIssue(partial: Partial<Issue>) {
    onUpdate({ ...activeIssue, ...partial });
  }

  function toggleChecklistItem(id: string, done: boolean) {
    patchIssue({
      checklist: activeIssue.checklist.map((item) =>
        item.id === id ? { ...item, done } : item,
      ),
    });
  }

  function updateChecklistLabel(id: string, label: string) {
    patchIssue({
      checklist: activeIssue.checklist.map((item) =>
        item.id === id ? { ...item, label } : item,
      ),
    });
  }

  function removeChecklistItem(id: string) {
    patchIssue({
      checklist: activeIssue.checklist.filter((item) => item.id !== id),
    });
  }

  function addChecklistItem() {
    const label = newChecklistItem.trim();
    if (!label) return;

    patchIssue({
      checklist: [
        ...activeIssue.checklist,
        { id: crypto.randomUUID(), label, done: false },
      ],
    });
    setNewChecklistItem("");
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-[520px]"
      >
        <SheetTitle className="sr-only">{activeIssue.title}</SheetTitle>
        <SheetDescription className="sr-only">
          Edit issue details, metadata, and checklist items.
        </SheetDescription>

        <div className="flex flex-col">
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

          <div className="space-y-4 px-6 py-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
                Checklist
              </p>
              <span className="text-xs text-muted-foreground">
                {completedCount} / {activeIssue.checklist.length}
              </span>
            </div>

            <Progress value={checklistProgress} className="h-1" />

            <ul className="space-y-1">
              {activeIssue.checklist.map((item) => (
                <li
                  key={item.id}
                  className="group flex items-start gap-2 rounded-md px-1 py-1.5 hover:bg-muted/60"
                >
                  <Checkbox
                    checked={item.done}
                    onCheckedChange={(checked) =>
                      toggleChecklistItem(item.id, checked === true)
                    }
                    className="mt-0.5"
                    aria-label={`Mark ${item.label} as ${item.done ? "incomplete" : "complete"}`}
                  />
                  <Input
                    value={item.label}
                    onChange={(event) =>
                      updateChecklistLabel(item.id, event.target.value)
                    }
                    className={cn(
                      "h-auto flex-1 border-transparent px-1 py-0.5 text-sm shadow-none focus-visible:border-input",
                      item.done && "text-muted-foreground line-through",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(item.id)}
                    className="mt-0.5 rounded-sm p-0.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
                    aria-label={`Remove ${item.label}`}
                  >
                    <MinusCircle className="size-4" />
                  </button>
                </li>
              ))}

              <li className="flex items-start gap-2 rounded-md px-1 py-1.5">
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground"
                >
                  <Plus className="size-4" />
                </span>
                <Input
                  value={newChecklistItem}
                  onChange={(event) => setNewChecklistItem(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addChecklistItem();
                    }
                  }}
                  placeholder="Add"
                  className="h-auto flex-1 border-transparent px-1 py-0.5 text-sm shadow-none placeholder:text-muted-foreground/70 focus-visible:border-input"
                  aria-label="New checklist item"
                />
              </li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
