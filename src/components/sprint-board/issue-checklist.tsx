"use client";

import { useEffect, useRef, useState } from "react";
import { MinusCircle, Plus } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import type { ChecklistItem } from "@/lib/sprint-data";
import { cn } from "@/lib/utils";

const addRowClassName =
  "flex w-full items-center justify-start gap-2 px-0 py-1";

const addRowInputClassName =
  "m-0 min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-sm leading-5 text-foreground shadow-none outline-none placeholder:text-muted-foreground focus:ring-0 rounded-none [caret-color:currentColor]";

type IssueChecklistProps = {
  items: ChecklistItem[];
  onItemsChange: (items: ChecklistItem[]) => void;
};

export function IssueChecklist({ items, onItemsChange }: IssueChecklistProps) {
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const addInputRef = useRef<HTMLInputElement>(null);

  const completedCount = items.filter((item) => item.done).length;
  const checklistProgress =
    items.length === 0
      ? 0
      : Math.round((completedCount / items.length) * 100);
  const hasItems = items.length > 0;

  useEffect(() => {
    if (isAddingChecklist) {
      addInputRef.current?.focus();
    }
  }, [isAddingChecklist]);

  useEffect(() => {
    if (!hasItems) {
      setIsAddingChecklist(false);
      setNewChecklistItem("");
    }
  }, [hasItems]);

  function addChecklistItem() {
    const label = newChecklistItem.trim();
    if (!label) return;

    onItemsChange([
      ...items,
      { id: crypto.randomUUID(), label, done: false },
    ]);
    setNewChecklistItem("");
    setIsAddingChecklist(false);
  }

  function toggleChecklistItem(id: string, done: boolean) {
    onItemsChange(
      items.map((item) => (item.id === id ? { ...item, done } : item)),
    );
  }

  function updateChecklistLabel(id: string, label: string) {
    onItemsChange(
      items.map((item) => (item.id === id ? { ...item, label } : item)),
    );
  }

  function removeChecklistItem(id: string) {
    onItemsChange(items.filter((item) => item.id !== id));
  }

  function handleAddKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      addChecklistItem();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setNewChecklistItem("");
      setIsAddingChecklist(false);
    }
  }

  function handleAddBlur() {
    if (newChecklistItem.trim()) {
      addChecklistItem();
      return;
    }

    setIsAddingChecklist(false);
  }

  function renderAddRow({
    placeholder,
    showIdleLabel,
  }: {
    placeholder: string;
    showIdleLabel: string;
  }) {
    if (!isAddingChecklist && !newChecklistItem) {
      return (
        <button
          type="button"
          onClick={() => setIsAddingChecklist(true)}
          className="flex w-full items-center justify-start gap-2 rounded-[10px] px-0 py-1 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Plus className="size-5 shrink-0" aria-hidden />
          {showIdleLabel}
        </button>
      );
    }

    return (
      <div className={addRowClassName}>
        <Plus className="size-5 shrink-0 text-muted-foreground" aria-hidden />
        <input
          ref={addInputRef}
          type="text"
          value={newChecklistItem}
          onChange={(event) => setNewChecklistItem(event.target.value)}
          onKeyDown={handleAddKeyDown}
          onBlur={handleAddBlur}
          placeholder={placeholder}
          className={addRowInputClassName}
          aria-label="New checklist item"
        />
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="-mt-1">
        {renderAddRow({
          placeholder: "Add checklist",
          showIdleLabel: "Add checklist",
        })}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <div className="flex items-baseline gap-2 text-sm font-medium text-muted-foreground">
          <span className="flex-1">Checklist</span>
          <span className="shrink-0 whitespace-nowrap">
            {completedCount} / {items.length}
          </span>
        </div>

        <Progress value={checklistProgress} className="h-2" />
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="group -ml-3 -mr-2 flex h-10 items-center justify-start gap-3 rounded-[10px] pl-3 pr-2 hover:bg-border/60"
          >
            <Checkbox
              checked={item.done}
              onCheckedChange={(checked) =>
                toggleChecklistItem(item.id, checked === true)
              }
              className="size-4 shrink-0"
              aria-label={`Mark ${item.label} as ${item.done ? "incomplete" : "complete"}`}
            />
            <Input
              value={item.label}
              onChange={(event) =>
                updateChecklistLabel(item.id, event.target.value)
              }
              className={cn(
                "h-auto flex-1 border-transparent px-0 py-0 text-sm shadow-none focus-visible:border-input focus-visible:px-2",
                item.done && "text-muted-foreground line-through",
              )}
            />
            <button
              type="button"
              onClick={() => removeChecklistItem(item.id)}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
              aria-label={`Remove ${item.label}`}
            >
              <MinusCircle className="size-4" />
            </button>
          </li>
        ))}

        <li>
          {renderAddRow({
            placeholder: "Add",
            showIdleLabel: "Add to list",
          })}
        </li>
      </ul>
    </div>
  );
}
