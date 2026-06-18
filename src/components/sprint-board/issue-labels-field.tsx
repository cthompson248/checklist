"use client";

import { useState } from "react";
import { Check, Plus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type IssueLabelsFieldProps = {
  labels: string[];
  availableLabels: string[];
  onLabelsChange: (labels: string[]) => void;
  onAvailableLabelsChange: (labels: string[]) => void;
};

function normalizeLabel(label: string) {
  return label.trim().toLowerCase();
}

export function IssueLabelsField({
  labels,
  availableLabels,
  onLabelsChange,
  onAvailableLabelsChange,
}: IssueLabelsFieldProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const normalizedSearch = normalizeLabel(search);
  const canCreate =
    normalizedSearch.length > 0 && !availableLabels.includes(normalizedSearch);

  function addLabel(rawLabel: string) {
    const label = normalizeLabel(rawLabel);
    if (!label || labels.includes(label)) return;

    onLabelsChange([...labels, label]);

    if (!availableLabels.includes(label)) {
      onAvailableLabelsChange([...availableLabels, label].sort());
    }

    setSearch("");
  }

  function removeLabel(label: string) {
    onLabelsChange(labels.filter((current) => current !== label));
  }

  function toggleLabel(label: string) {
    if (labels.includes(label)) {
      removeLabel(label);
      return;
    }

    addLabel(label);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 self-start">
      {labels.map((label) => (
        <Badge
          key={label}
          variant="secondary"
          className="h-8 gap-1.5 px-3 text-sm"
        >
          {label}
          <button
            type="button"
            onClick={() => removeLabel(label)}
            className="inline-flex size-5 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground"
            aria-label={`Remove ${label} label`}
          >
            <X className="size-3.5" />
          </button>
        </Badge>
      ))}

      <Popover
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) setSearch("");
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-8 shrink-0"
            aria-label="Add label"
          >
            <Plus className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56 p-0">
          <Command onValueChange={setSearch}>
            <CommandInput placeholder="Search or create label..." />
            <CommandList>
              <CommandEmpty>No labels found.</CommandEmpty>
              <CommandGroup heading="Labels">
                {availableLabels.map((label) => (
                  <CommandItem
                    key={label}
                    value={label}
                    onSelect={() => toggleLabel(label)}
                  >
                    <span>{label}</span>
                    {labels.includes(label) ? (
                      <Check className="ml-auto size-4 opacity-100" />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
              {canCreate ? (
                <CommandGroup heading="Create">
                  <CommandItem
                    value={`create-${normalizedSearch}`}
                    onSelect={() => addLabel(normalizedSearch)}
                  >
                    <Plus className="size-4" />
                    Create &quot;{normalizedSearch}&quot;
                  </CommandItem>
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
