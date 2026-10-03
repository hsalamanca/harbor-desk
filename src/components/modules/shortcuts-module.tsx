"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { ShortcutItem, ShortcutsModule } from "@/lib/types";
import { SIZE_PRESETS } from "@/lib/types";

function faviconUrl(url: string): string | null {
  try {
    const host = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  } catch {
    return null;
  }
}

function colsForSize(size: ShortcutsModule["size"]): number {
  if (size === "wide") return 4;
  if (size === "comfortable") return 3;
  return 2;
}

export function ShortcutsModuleView({
  module,
  arrangeMode,
  onChangeItems,
}: {
  module: ShortcutsModule;
  arrangeMode: boolean;
  onChangeItems: (items: ShortcutItem[]) => void;
}) {
  const [editing, setEditing] = useState<ShortcutItem | null>(null);
  const [draftLabel, setDraftLabel] = useState("");
  const [draftUrl, setDraftUrl] = useState("");
  const cols = colsForSize(module.size);

  const openEdit = (item: ShortcutItem) => {
    setEditing(item);
    setDraftLabel(item.label);
    setDraftUrl(item.url);
  };

  const saveEdit = () => {
    if (!editing) return;
    const label = draftLabel.trim() || "Link";
    let url = draftUrl.trim();
    if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`;
    onChangeItems(
      module.items.map((i) =>
        i.id === editing.id ? { ...i, label, url } : i
      )
    );
    setEditing(null);
  };

  const addItem = () => {
    const item: ShortcutItem = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      label: "New site",
      url: "https://",
    };
    onChangeItems([...module.items, item]);
    openEdit(item);
  };

  return (
    <>
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          minHeight: SIZE_PRESETS.shortcuts[module.size].h - 72,
        }}
      >
        {module.items.map((item) => {
          const icon = faviconUrl(item.url);
          return (
            <div key={item.id} className="group relative">
              <a
                href={item.url || undefined}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3 text-center transition-colors hover:bg-white/50"
                onClick={(e) => {
                  if (arrangeMode || !item.url || item.url === "https://") {
                    e.preventDefault();
                  }
                }}
              >
                <span className="flex size-11 items-center justify-center overflow-hidden rounded-2xl bg-white/55 text-sm font-medium text-[var(--harbor-teal-deep)] shadow-sm shadow-black/5">
                  {icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={icon}
                      alt=""
                      width={24}
                      height={24}
                      className="size-6"
                    />
                  ) : (
                    item.label.slice(0, 1).toUpperCase()
                  )}
                </span>
                <span className="line-clamp-1 w-full text-xs text-[var(--harbor-ink)]">
                  {item.label}
                </span>
              </a>
              {arrangeMode && (
                <div className="absolute -right-1 -top-1 flex gap-0.5 opacity-100">
                  <button
                    type="button"
                    aria-label={`Edit ${item.label}`}
                    onClick={() => openEdit(item)}
                    className="flex size-6 items-center justify-center rounded-md bg-[var(--harbor-surface)] text-[var(--harbor-ink-muted)] shadow-sm hover:text-[var(--harbor-ink)]"
                  >
                    <Pencil className="size-3" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remove ${item.label}`}
                    onClick={() =>
                      onChangeItems(module.items.filter((i) => i.id !== item.id))
                    }
                    className="flex size-6 items-center justify-center rounded-md bg-[var(--harbor-surface)] text-[var(--harbor-ink-muted)] shadow-sm hover:text-red-600"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {arrangeMode && module.items.length < 8 && (
          <button
            type="button"
            onClick={addItem}
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[var(--harbor-line)] px-2 py-3 text-[var(--harbor-ink-muted)] hover:bg-[var(--harbor-wash)] hover:text-[var(--harbor-ink)]"
          >
            <Plus className="size-4" />
            <span className="text-xs">Add</span>
          </button>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="border-0 bg-[var(--harbor-surface)] sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-[var(--harbor-ink)]">
              Edit shortcut
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <Input
              value={draftLabel}
              onChange={(e) => setDraftLabel(e.target.value)}
              placeholder="Label"
              className="border-0 bg-[var(--harbor-wash)]"
            />
            <Input
              value={draftUrl}
              onChange={(e) => setDraftUrl(e.target.value)}
              placeholder="https://…"
              className="border-0 bg-[var(--harbor-wash)]"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={saveEdit}
              className="bg-[var(--harbor-teal)] text-white hover:bg-[var(--harbor-teal-deep)]"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
