"use client";

import * as React from "react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { loadInstitutePages } from "@/actions/pages/load-institute-pages";
import { updateInstitutePagesStatus } from "@/actions/pages/update-institute-pages";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  instituteId: string;
  instituteName: string;
};

type PageUI = { id: string; title: string; slug: string; status: string };

export default function PageStatusDialog({
  open,
  onOpenChange,
  instituteId,
  instituteName,
}: Props) {
  const [pages, setPages] = useState<PageUI[]>([]);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [originalSelected, setOriginalSelected] = useState<string[]>([]);

  // LOAD
  const {
    execute: loadPages,
    status: loadStatus,
  } = useAction(loadInstitutePages, {
    onSuccess: (res) => {
      const data = res?.data ?? [];
      const list: PageUI[] = data.map((p) => ({
        ...p,
        status: String(p.status),
      }));
      setPages(list);
      const actives = list.filter((p) => p.status === "ACTIVE").map((p) => p.id);
      setSelectedPages(actives);
      setOriginalSelected(actives);
    },
    onError: (err) => {
      toast.error(err?.error?.serverError ?? "Failed to load pages");
    },
  });

  // SAVE 
  const {
    execute: savePages,
    status: saveStatus,
  } = useAction(updateInstitutePagesStatus, {
    onSuccess: (res) => {
      const data = res?.data;
      if (data?.ok) {
        toast.success(data.message);
        onOpenChange(false);
      } else {
        toast.error(data?.message ?? "Failed to update page statuses");
      }
    },
    onError: (err) => {
      toast.error(err?.error?.serverError ?? "Failed to update page statuses");
    },
  });

  useEffect(() => {
    if (open) loadPages({ instituteId });
  }, [open, instituteId, loadPages]);

  const loading = loadStatus === "executing";
  const saving = saveStatus === "executing";

  const toggle = useCallback(
    (id: string) =>
      setSelectedPages((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      ),
    []
  );

  const hasChanges = useMemo(() => {
    if (selectedPages.length !== originalSelected.length) return true;
    const a = [...selectedPages].sort().join(",");
    const b = [...originalSelected].sort().join(",");
    return a !== b;
  }, [selectedPages, originalSelected]);

  const onCancel = useCallback(() => {
    setSelectedPages(originalSelected);
    onOpenChange(false);
  }, [originalSelected, onOpenChange]);

  const onSave = useCallback(() => {
    savePages({ instituteId, pageIds: selectedPages });
  }, [savePages, instituteId, selectedPages]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[50%]">
        <DialogHeader>
          <DialogTitle>Manage Pages — {instituteName}</DialogTitle>
          <DialogDescription>
            Check pages to set as <span className="font-semibold">ACTIVE</span>.
            Unchecked pages will be set to{" "}
            <span className="font-semibold">INACTIVE</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <p className="text-muted-foreground">Loading pages…</p>
          ) : pages.length ? (
            <ul className="grid gap-2">
              {pages.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-3 rounded-md border p-3"
                >
                  <input
                    id={`pg-${instituteId}-${p.id}`}
                    type="checkbox"
                    checked={selectedPages.includes(p.id)}
                    onChange={() => toggle(p.id)}
                    className="size-4 cursor-pointer"
                  />
                  <label
                    htmlFor={`pg-${instituteId}-${p.id}`}
                    className="cursor-pointer flex-1"
                  >
                    <span className="font-medium">{p.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      /{p.slug}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              No pages found for this institute.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={saving || !hasChanges}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
