"use client";

import { useState } from "react";
import { FolderOpen, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { FolderLink, FoldersModule, LinkFolder } from "@/lib/types";

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function FoldersModuleView({
  module,
  arrangeMode,
  onChangeFolders,
}: {
  module: FoldersModule;
  arrangeMode: boolean;
  onChangeFolders: (folders: LinkFolder[]) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(
    module.folders[0]?.id ?? null
  );
  const [editLink, setEditLink] = useState<{
    folderId: string;
    link: FolderLink;
  } | null>(null);
  const [draftLabel, setDraftLabel] = useState("");
  const [draftUrl, setDraftUrl] = useState("");

  const active =
    module.folders.find((f) => f.id === openId) ?? module.folders[0] ?? null;

  const addFolder = () => {
    const folder: LinkFolder = {
      id: uid(),
      name: "New folder",
      links: [],
    };
    onChangeFolders([...module.folders, folder]);
    setOpenId(folder.id);
  };

  const renameFolder = (id: string, name: string) => {
    onChangeFolders(
      module.folders.map((f) => (f.id === id ? { ...f, name } : f))
    );
  };

  const removeFolder = (id: string) => {
    const next = module.folders.filter((f) => f.id !== id);
    onChangeFolders(next);
    if (openId === id) setOpenId(next[0]?.id ?? null);
  };

  const saveLink = () => {
    if (!editLink) return;
    let url = draftUrl.trim();
    if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`;
    const label = draftLabel.trim() || "Link";
    onChangeFolders(
      module.folders.map((f) => {
        if (f.id !== editLink.folderId) return f;
        const exists = f.links.some((l) => l.id === editLink.link.id);
        const links = exists
          ? f.links.map((l) =>
              l.id === editLink.link.id ? { ...l, label, url } : l
            )
          : [...f.links, { ...editLink.link, label, url }];
        return { ...f, links };
      })
    );
    setEditLink(null);
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {module.folders.map((folder) => (
          <button
            key={folder.id}
            type="button"
            onClick={() => setOpenId(folder.id)}
            className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors ${
              active?.id === folder.id
                ? "bg-[var(--harbor-teal)] text-white"
                : "bg-white/45 text-[var(--harbor-ink-muted)] hover:bg-white/65"
            }`}
          >
            <FolderOpen className="size-3" />
            {arrangeMode ? (
              <input
                value={folder.name}
                onChange={(e) => renameFolder(folder.id, e.target.value)}
                className="w-20 bg-transparent outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              folder.name
            )}
          </button>
        ))}
        {arrangeMode && (
          <button
            type="button"
            onClick={addFolder}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-[var(--harbor-teal-deep)] hover:bg-white/45"
          >
            <Plus className="size-3" />
            Folder
          </button>
        )}
      </div>

      {active ? (
        <ul className="min-h-0 flex-1 space-y-1 overflow-auto">
          {active.links.map((link) => (
            <li key={link.id} className="group flex items-center gap-2">
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 truncate rounded-lg px-2 py-1.5 text-sm text-[var(--harbor-ink)] hover:bg-white/45"
                onClick={(e) => {
                  if (arrangeMode) e.preventDefault();
                }}
              >
                {link.label}
              </a>
              {arrangeMode && (
                <button
                  type="button"
                  aria-label={`Remove ${link.label}`}
                  onClick={() =>
                    onChangeFolders(
                      module.folders.map((f) =>
                        f.id === active.id
                          ? {
                              ...f,
                              links: f.links.filter((l) => l.id !== link.id),
                            }
                          : f
                      )
                    )
                  }
                  className="text-[var(--harbor-ink-muted)] opacity-0 group-hover:opacity-100 hover:text-red-600"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </li>
          ))}
          {active.links.length === 0 && (
            <p className="py-4 text-sm text-[var(--harbor-ink-muted)]">
              No links in this folder yet.
            </p>
          )}
          {arrangeMode && (
            <button
              type="button"
              onClick={() => {
                const link = { id: uid(), label: "New link", url: "https://" };
                setEditLink({ folderId: active.id, link });
                setDraftLabel(link.label);
                setDraftUrl(link.url);
              }}
              className="mt-1 flex items-center gap-1 text-xs text-[var(--harbor-teal-deep)] hover:underline"
            >
              <Plus className="size-3.5" />
              Add link
            </button>
          )}
          {arrangeMode && module.folders.length > 1 && (
            <button
              type="button"
              onClick={() => removeFolder(active.id)}
              className="mt-2 text-xs text-[var(--harbor-ink-muted)] hover:text-red-600"
            >
              Remove folder
            </button>
          )}
        </ul>
      ) : (
        <p className="py-6 text-sm text-[var(--harbor-ink-muted)]">
          Add a folder to group the sites you open together.
        </p>
      )}

      <Dialog open={!!editLink} onOpenChange={(o) => !o && setEditLink(null)}>
        <DialogContent className="border-0 bg-[var(--harbor-surface)] sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-[var(--harbor-ink)]">
              Edit link
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
              onClick={saveLink}
              className="bg-[var(--harbor-teal)] text-white hover:bg-[var(--harbor-teal-deep)]"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
