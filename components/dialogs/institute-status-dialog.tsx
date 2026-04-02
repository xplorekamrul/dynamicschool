"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, PauseCircle, PlayCircle, UserX, CalendarClock } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { setInstituteStatus } from "@/actions/Institute/set-institute-status";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  instituteId: string;
  instituteName: string;
  initialStatus?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  initialSuspendedAt?: string | null;
};

export default function InstituteStatusDialog({
  open,
  onOpenChange,
  instituteId,
  instituteName,
  initialStatus = "ACTIVE",
  initialSuspendedAt = null,
}: Props) {
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE" | "SUSPENDED">(initialStatus);
  const [suspendedAt, setSuspendedAt] = useState<Date | null>(
    initialSuspendedAt ? new Date(initialSuspendedAt) : null
  );

  useEffect(() => {
    if (open) {
      setStatus(initialStatus);
      setSuspendedAt(initialSuspendedAt ? new Date(initialSuspendedAt) : null);
    }
  }, [open, initialStatus, initialSuspendedAt]);

  const { execute, status: execStatus } = useAction(setInstituteStatus, {
    onSuccess: (res) => {
      if (res?.data?.success) {
        setStatus(res.data.status);
        setSuspendedAt(res.data.suspendedAt ? new Date(res.data.suspendedAt) : null);
        toast.success(res.data.message);

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("institute:status-updated", {
              detail: {
                instituteId,
                status: res.data.status,
                suspendedAt: res.data.suspendedAt,
              },
            })
          );
        }
        onOpenChange(false);
      } else {
        toast.error(res?.data?.message ?? "Failed to update status");
      }
    },
    onError: (err) => {
      toast.error(err?.error?.serverError ?? "Failed to update status");
    },
  });

  const busy = execStatus === "executing";

  const variants = {
    enter: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 6 },
  };

  const statusBadge = useMemo(() => {
    const base = "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs border";
    if (status === "ACTIVE") return <span className={`${base} border-green-300`}>ACTIVE</span>;
    if (status === "INACTIVE") return <span className={`${base} border-amber-300`}>INACTIVE</span>;
    return <span className={`${base} border-red-300`}>SUSPENDED</span>;
  }, [status]);

  const doSet = (next: "ACTIVE" | "INACTIVE" | "SUSPENDED") => {
    setStatus(next);
    setSuspendedAt(next === "SUSPENDED" ? new Date() : null);
    execute({ instituteId, status: next });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <span>Institute status — {instituteName}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <motion.div
            initial="enter"
            animate="show"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.18 }}
            className="rounded-lg border p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Current status</span>
                <div className="mt-1">{statusBadge}</div>
              </div>

              {status === "SUSPENDED" && suspendedAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarClock className="h-4 w-4" />
                  <span>Suspended at: {suspendedAt.toLocaleString()}</span>
                </div>
              )}
            </div>
          </motion.div>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-1 gap-2 sm:grid-cols-3"
            >
              <Button
                type="button"
                variant={status === "ACTIVE" ? "default" : "secondary"}
                className="h-11 justify-center"
                disabled={busy || status === "ACTIVE"}
                onClick={() => doSet("ACTIVE")}
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Activate
              </Button>

              <Button
                type="button"
                variant={status === "INACTIVE" ? "default" : "secondary"}
                className="h-11 justify-center"
                disabled={busy || status === "INACTIVE"}
                onClick={() => doSet("INACTIVE")}
              >
                <PauseCircle className="mr-2 h-4 w-4" />
                Inactivate
              </Button>

              <Button
                type="button"
                variant={status === "SUSPENDED" ? "default" : "destructive"}
                className="h-11 justify-center"
                disabled={busy || status === "SUSPENDED"}
                onClick={() => doSet("SUSPENDED")}
              >
                <UserX className="mr-2 h-4 w-4" />
                Suspend
              </Button>
            </motion.div>
          </AnimatePresence>

          <div className="pt-2 text-xs text-muted-foreground">
            • <b>ACTIVE</b>: fully enabled &nbsp; • <b>INACTIVE</b>: disabled (not suspended) &nbsp; •{" "}
            <b>SUSPENDED</b>: disabled with audit timestamp
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
