"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export function ChecklistPrototype() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: "1", label: "Review prototype layout", done: true },
    { id: "2", label: "Add checklist interactions", done: false },
    { id: "3", label: "Connect persistence later", done: false },
  ]);
  const [draft, setDraft] = useState("");

  const activeItems = items.filter((item) => !item.done);
  const completedItems = items.filter((item) => item.done);

  function addItem() {
    const label = draft.trim();
    if (!label) return;

    setItems((current) => [
      ...current,
      { id: crypto.randomUUID(), label, done: false },
    ]);
    setDraft("");
  }

  function toggleItem(id: string, done: boolean) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, done } : item)),
    );
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function renderItems(list: ChecklistItem[], emptyMessage: string) {
    if (list.length === 0) {
      return (
        <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      );
    }

    return (
      <ul className="space-y-2">
        {list.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-3"
          >
            <Checkbox
              checked={item.done}
              onCheckedChange={(checked) =>
                toggleItem(item.id, checked === true)
              }
              aria-label={`Mark ${item.label} as ${item.done ? "incomplete" : "complete"}`}
            />
            <span
              className={
                item.done
                  ? "flex-1 text-sm text-muted-foreground line-through"
                  : "flex-1 text-sm"
              }
            >
              {item.label}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => removeItem(item.id)}
              aria-label={`Delete ${item.label}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Checklist</h1>
          <Badge variant="secondary">{items.length} items</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Prototype shell built with shadcn/ui components.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add item</CardTitle>
          <CardDescription>
            Capture a task, then track it in Active or Completed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-item">New item</Label>
            <div className="flex gap-2">
              <Input
                id="new-item"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") addItem();
                }}
                placeholder="What needs to get done?"
              />
              <Button type="button" onClick={addItem}>
                <Plus className="size-4" />
                Add
              </Button>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">
                Active ({activeItems.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedItems.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
              {renderItems(activeItems, "Nothing active yet. Add your first item above.")}
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              {renderItems(
                completedItems,
                "Completed items will show up here.",
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
