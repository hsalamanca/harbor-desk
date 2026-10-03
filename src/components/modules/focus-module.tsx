"use client";

import { GripVertical, Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { FocusItem, FocusModule } from "@/lib/types";

export function FocusModuleView({
  module,
  arrangeMode,
  onChangeItems,
}: {
  module: FocusModule;
  arrangeMode: boolean;
  onChangeItems: (items: FocusItem[]) => void;
}) {
  const toggle = (id: string) => {
    onChangeItems(
      module.items.map((i) =>
        i.id === id ? { ...i, done: !i.done } : i
      )
    );
  };

  const updateText = (id: string, text: string) => {
    onChangeItems(
      module.items.map((i) => (i.id === id ? { ...i, text } : i))
    );
  };

  const remove = (id: string) => {
    onChangeItems(module.items.filter((i) => i.id !== id));
  };

  const add = () => {
    if (module.items.length >= 5) return;
    onChangeItems([
      ...module.items,
      {
        id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        text: "",
        done: false,
      },
    ]);
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...module.items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChangeItems(next);
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <ul className="flex flex-1 flex-col gap-1.5">
        {module.items.map((item, index) => (
          <li
            key={item.id}
            className="group flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-[var(--harbor-wash)]/60"
          >
            {arrangeMode && (
              <div className="flex flex-col text-[var(--harbor-ink-muted)]">
                <button
                  type="button"
                  aria-label="Move up"
                  className="leading-none hover:text-[var(--harbor-ink)]"
                  onClick={() => move(index, -1)}
                >
                  <GripVertical className="size-3.5" />
                </button>
              </div>
            )}
            <Checkbox
              checked={item.done}
              onCheckedChange={() => toggle(item.id)}
              className="border-[var(--harbor-line)] data-checked:border-[var(--harbor-teal)] data-checked:bg-[var(--harbor-teal)]"
            />
            <Input
              value={item.text}
              onChange={(e) => updateText(item.id, e.target.value)}
              placeholder="Task…"
              className={`h-8 flex-1 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0 ${
                item.done
                  ? "text-[var(--harbor-ink-muted)] line-through"
                  : "text-[var(--harbor-ink)]"
              }`}
            />
            {arrangeMode && (
              <button
                type="button"
                aria-label="Remove task"
                onClick={() => remove(item.id)}
                className="text-[var(--harbor-ink-muted)] opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-600"
              >
                <X className="size-3.5" />
              </button>
            )}
          </li>
        ))}
      </ul>
      {module.items.length === 0 && (
        <p className="py-4 text-sm text-[var(--harbor-ink-muted)]">
          No tasks yet. Add one to focus the day.
        </p>
      )}
      {module.items.length < 5 && (
        <button
          type="button"
          onClick={add}
          className="mt-auto flex items-center gap-1.5 self-start rounded-lg px-1 py-1 text-xs text-[var(--harbor-teal-deep)] hover:bg-[var(--harbor-wash)]"
        >
          <Plus className="size-3.5" />
          Add task
        </button>
      )}
    </div>
  );
}
