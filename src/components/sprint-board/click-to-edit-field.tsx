"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type ClickToEditFieldProps = {
  value: string;
  onCommit: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
  viewClassName?: string;
  editClassName?: string;
  className?: string;
  ariaLabel: string;
};

const sharedFieldClass =
  "w-full rounded-lg border border-transparent bg-transparent px-1 py-1 outline-none transition-[background-color,border-color,box-shadow] field-sizing-content resize-none overflow-hidden";

export function ClickToEditField({
  value,
  onCommit,
  multiline = false,
  placeholder = "Click to edit",
  viewClassName,
  editClassName,
  className,
  ariaLabel,
}: ClickToEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const fieldRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setDraft(value);
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (!isEditing || !fieldRef.current) return;

    fieldRef.current.focus();
    const length = fieldRef.current.value.length;
    fieldRef.current.setSelectionRange(length, length);
  }, [isEditing]);

  function startEditing() {
    if (isEditing) return;
    setDraft(value);
    setIsEditing(true);
  }

  function commit() {
    if (!isEditing) return;

    const nextValue = multiline ? draft : draft.trim();

    if (multiline) {
      if (nextValue !== value) onCommit(nextValue);
    } else if (nextValue && nextValue !== value) {
      onCommit(nextValue);
    }

    setIsEditing(false);
  }

  function cancel() {
    setDraft(value);
    setIsEditing(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      cancel();
      return;
    }

    if (!multiline && event.key === "Enter") {
      event.preventDefault();
      commit();
      return;
    }

    if (multiline && event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      commit();
    }
  }

  return (
    <textarea
      ref={fieldRef}
      readOnly={!isEditing}
      rows={1}
      value={isEditing ? draft : value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onClick={startEditing}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      className={cn(
        sharedFieldClass,
        multiline
          ? "min-h-[90px] text-sm leading-5 md:text-sm"
          : "min-h-0 text-xl font-semibold leading-tight tracking-tight md:text-xl",
        isEditing
          ? cn(
              multiline && "rounded-[10px] border-foreground/30",
              editClassName,
            )
          : "cursor-text hover:bg-muted/40",
        !value && !isEditing && "text-muted-foreground",
        viewClassName,
        className,
      )}
    />
  );
}
