"use client";

import { useState } from "react";

import { IssueDetailSheet } from "@/components/sprint-board/issue-detail-sheet";
import { KanbanBoard } from "@/components/sprint-board/kanban-board";
import { INITIAL_ISSUES, collectAvailableLabels, type Issue } from "@/lib/sprint-data";

export function SprintBoardPrototype() {
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  const [availableLabels, setAvailableLabels] = useState(() =>
    collectAvailableLabels(INITIAL_ISSUES),
  );
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>("139");
  const [sheetOpen, setSheetOpen] = useState(true);

  const selectedIssue =
    issues.find((issue) => issue.id === selectedIssueId) ?? null;

  function handleSelectIssue(issueId: string) {
    setSelectedIssueId(issueId);
    setSheetOpen(true);
  }

  function handleUpdateIssue(updatedIssue: Issue) {
    setIssues((current) =>
      current.map((issue) =>
        issue.id === updatedIssue.id ? updatedIssue : issue,
      ),
    );
  }

  function handleDeleteIssue(issueId: string) {
    setIssues((current) => current.filter((issue) => issue.id !== issueId));
    setSheetOpen(false);
    setSelectedIssueId(null);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <KanbanBoard
        issues={issues}
        selectedIssueId={selectedIssueId}
        onSelectIssue={handleSelectIssue}
      />
      <IssueDetailSheet
        key={selectedIssueId ?? "empty"}
        issue={selectedIssue}
        open={sheetOpen && selectedIssue !== null}
        onOpenChange={setSheetOpen}
        onUpdate={handleUpdateIssue}
        onDelete={handleDeleteIssue}
        availableLabels={availableLabels}
        onAvailableLabelsChange={setAvailableLabels}
      />
    </div>
  );
}
