"use client";

import { cn } from "@/lib/utils";
import { CalendarClock } from "lucide-react";
import * as React from "react";
import InstituteStatusDialog from "../dialogs/institute-status-dialog";

type Status = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type StatusCellProps = {
  instituteId: string;
  instituteName: string;
  status?: Status;
  suspendedAt?: string | Date | null;
};

function badgeClass(s: Status | undefined) {
  const base =
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs border font-medium transition-colors";
  switch (s) {
    case "ACTIVE":
      return cn(base, "border-green-300 text-green-700 hover:bg-green-50");
    case "INACTIVE":
      return cn(base, "border-amber-300 text-amber-700 hover:bg-amber-50");
    case "SUSPENDED":
      return cn(base, "border-red-300 text-red-700 hover:bg-red-50");
    default:
      return cn(base, "border-muted-foreground/30 text-muted-foreground");
  }
}

export default function StatusCell({
  instituteId,
  instituteName,
  status = "ACTIVE",
  suspendedAt,
}: StatusCellProps) {
  const [open, setOpen] = React.useState(false);

  const label =
    status === "SUSPENDED"
      ? "SUSPENDED"
      : status === "INACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

  // Normalize to string for the dialog prop
  const suspendedAtString =
    suspendedAt instanceof Date
      ? suspendedAt.toISOString()
      : suspendedAt ?? null;

  return (
    <>
      <button
        type="button"
        className={`${badgeClass(status)} cursor-pointer`}
        onClick={() => setOpen(true)}
        title="Change institute status"
        aria-label={`Change status for ${instituteName}`}
      >
        {status === "SUSPENDED" && <CalendarClock className="h-3.5 w-3.5" aria-hidden />}
        {label}
      </button>

      <InstituteStatusDialog
        open={open}
        onOpenChange={setOpen}
        instituteId={instituteId}
        instituteName={instituteName}
        initialStatus={status}
        initialSuspendedAt={suspendedAtString}
      />
    </>
  );
}
