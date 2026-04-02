"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import {
  Shield,
  UserX,
  PauseCircle,
  PlayCircle,
  Trash2,
  MoreHorizontal,
  Loader2,
  KeyRound,
  Pencil,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { loadAdmins, type AdminRow } from "@/actions/Institute/admins/load-admins";
import { setAdminStatus } from "@/actions/Institute/admins/set-admin-status";
import { deleteAdmin } from "@/actions/Institute/admins/delete-admin";
import EditAdminPasswordDialog from "./EditAdminPasswordDialog";
import EditAdminProfileDialog from "./EditAdminProfileDialog";
import AdminCreationForm from "./adminCreationFrom";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  instituteId: string;
  instituteName: string;
};

type WorkingAction = null | "activate" | "inactivate" | "suspend" | "delete";

export default function AdminsDialog({ open, onOpenChange, instituteId, instituteName }: Props) {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [working, setWorking] = useState<{ id: string | null; action: WorkingAction }>({
    id: null,
    action: null,
  });

  // local UI state for edit dialogs
  const [selectedAdmin, setSelectedAdmin] = useState<AdminRow | null>(null);
  const [openEditPassword, setOpenEditPassword] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);

  const { execute: execLoad } = useAction(loadAdmins, {
    onSuccess: (res) => {
      if (res?.data?.success) {
        setAdmins(res.data.admins);
      } else {
        toast.error("Failed to load admins");
      }
      setLoading(false);
    },
    onError: (err) => {
      toast.error(err?.error?.serverError ?? "Failed to load admins");
      setLoading(false);
    },
  });

  const { execute: execSetStatus, status: statusSetting } = useAction(setAdminStatus, {
    onSuccess: (res) => {
      if (res?.data?.success) {
        toast.success(res.data.message);
        refresh();
      } else {
        toast.error(res?.data?.message ?? "Failed to update status");
      }
      setWorking({ id: null, action: null });
    },
    onError: (err) => {
      toast.error(err?.error?.serverError ?? "Failed to update status");
      setWorking({ id: null, action: null });
    },
  });

  const { execute: execDelete, status: statusDeleting } = useAction(deleteAdmin, {
    onSuccess: (res) => {
      if (res?.data?.success) {
        toast.success(res.data.message);
        refresh();
      } else {
        toast.error(res?.data?.message ?? "Failed to delete admin");
      }
      setWorking({ id: null, action: null });
    },
    onError: (err) => {
      toast.error(err?.error?.serverError ?? "Failed to delete admin");
      setWorking({ id: null, action: null });
    },
  });

  const busyGlobal = statusSetting === "executing" || statusDeleting === "executing";

  const refresh = React.useCallback(() => {
    setLoading(true);
    execLoad({ instituteId });
  }, [execLoad, instituteId]);

  useEffect(() => {
    if (open) {
      setAdmins([]);
      refresh();
    }
  }, [open, refresh]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[80%] rounded-md">
        <DialogHeader>
          <DialogTitle>Admins — {instituteName}</DialogTitle>
        </DialogHeader>

        {/* Create Admin */}
        <div className="rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="font-medium">Create a new Admin</span>
          </div>

          <AdminCreationForm
            mode="create"
            instituteId={instituteId}
            onSaved={() => {
              refresh();
            }}
          />
        </div>

        {/* List Admins */}
        <div className="mt-6 rounded-lg border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Admin List</span>
            </div>
            <Button size="sm" variant="outline" onClick={refresh} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SL</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Loading */}
                {loading && admins.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center">
                      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </span>
                    </TableCell>
                  </TableRow>
                )}

                {/* Empty */}
                {!loading && admins.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No admins found.
                    </TableCell>
                  </TableRow>
                )}

                {/* Data */}
                {!loading &&
                  admins.map((a, i) => (
                    <TableRow key={a.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell className="font-medium">{a.name ?? "-"}</TableCell>
                      <TableCell>{a.email}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
                          {a.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(a.createdAt).toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <RowMenu
                          admin={a}
                          busyGlobal={busyGlobal}
                          working={working}
                          onActivate={() => {
                            setWorking({ id: a.id, action: "activate" });
                            execSetStatus({ userId: a.id, status: "ACTIVE" });
                          }}
                          onInactivate={() => {
                            setWorking({ id: a.id, action: "inactivate" });
                            execSetStatus({ userId: a.id, status: "INACTIVE" });
                          }}
                          onSuspend={() => {
                            setWorking({ id: a.id, action: "suspend" });
                            execSetStatus({ userId: a.id, status: "SUSPENDED" });
                          }}
                          onDelete={() => {
                            if (confirm("Delete this admin permanently?")) {
                              setWorking({ id: a.id, action: "delete" });
                              execDelete({ userId: a.id });
                            }
                          }}
                          onEditPassword={() => {
                            setSelectedAdmin(a);
                            setOpenEditPassword(true);
                          }}
                          onEditProfile={() => {
                            setSelectedAdmin(a);
                            setOpenEditProfile(true);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>

      {selectedAdmin && (
        <>
          <EditAdminPasswordDialog
            open={openEditPassword}
            onOpenChange={(v) => setOpenEditPassword(v)}
            userId={selectedAdmin.id}
            adminEmail={selectedAdmin.email}
            onSaved={() => refresh()}
          />
          <EditAdminProfileDialog
            open={openEditProfile}
            onOpenChange={(v) => setOpenEditProfile(v)}
            userId={selectedAdmin.id}
            defaultName={selectedAdmin.name}
            defaultEmail={selectedAdmin.email}
            onSaved={() => refresh()}
          />
        </>
      )}
    </Dialog>
  );
}

function RowMenu({
  admin,
  busyGlobal,
  working,
  onSuspend,
  onActivate,
  onInactivate,
  onDelete,
  onEditPassword,
  onEditProfile,
}: {
  admin: AdminRow;
  busyGlobal: boolean;
  working: { id: string | null; action: WorkingAction };
  onSuspend: () => void;
  onActivate: () => void;
  onInactivate: () => void;
  onDelete: () => void;
  onEditPassword: () => void;
  onEditProfile: () => void;
}) {
  const isWorking = working.id === admin.id;
  const wAction = isWorking ? working.action : null;

  const triggerClass =
    wAction === "activate"
      ? "border-green-600 text-green-700"
      : wAction === "inactivate"
      ? "border-amber-600 text-amber-700"
      : wAction === "suspend"
      ? "border-orange-600 text-orange-700"
      : wAction === "delete"
      ? "border-red-600 text-red-700"
      : "";

  const items = useMemo(
    () => [
      {
        key: "activate",
        label: "Activate",
        icon: <PlayCircle className="h-4 w-4" />,
        onSelect: onActivate,
        show: admin.status !== "ACTIVE",
        className:
          "text-green-700 focus:bg-green-50 data-[highlighted]:bg-green-50 data-[highlighted]:text-green-800",
        loading: isWorking && wAction === "activate",
      },
      {
        key: "inactivate",
        label: "Inactivate",
        icon: <PauseCircle className="h-4 w-4" />,
        onSelect: onInactivate,
        show: admin.status !== "INACTIVE",
        className:
          "text-amber-700 focus:bg-amber-50 data-[highlighted]:bg-amber-50 data-[highlighted]:text-amber-800",
        loading: isWorking && wAction === "inactivate",
      },
      {
        key: "suspend",
        label: "Suspend",
        icon: <UserX className="h-4 w-4" />,
        onSelect: onSuspend,
        show: admin.status !== "SUSPENDED",
        className:
          "text-orange-700 focus:bg-orange-50 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-800",
        loading: isWorking && wAction === "suspend",
      },
      {
        key: "edit-profile",
        label: "Edit Info",
        icon: <Pencil className="h-4 w-4" />,
        onSelect: onEditProfile,
        show: true,
        className:
          "text-primary focus:bg-primary/20 data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary/80",
        loading: false,
      },
      {
        key: "edit-password",
        label: "Edit Password",
        icon: <KeyRound className="h-4 w-4" />,
        onSelect: onEditPassword,
        show: true,
        className:
          "text-red-500 focus:bg-red-50 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-800",
        loading: false,
      },
    ],
    [admin.status, isWorking, wAction, onActivate, onInactivate, onSuspend, onEditPassword, onEditProfile]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          disabled={busyGlobal}
          className={isWorking ? `gap-2 ${triggerClass}` : undefined}
        >
          {isWorking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {wAction === "activate"
                ? "Activating..."
                : wAction === "inactivate"
                ? "Inactivating..."
                : wAction === "suspend"
                ? "Suspending..."
                : wAction === "delete"
                ? "Deleting..."
                : "Working..."}
            </>
          ) : (
            <>
              <MoreHorizontal className="h-4 w-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="bottom">
        {items
          .filter((x) => x.show)
          .map((x) => (
            <DropdownMenuItem
              key={x.key}
              onSelect={(e) => {
                e.preventDefault();
                if (!busyGlobal) x.onSelect();
              }}
              className={`flex items-center gap-2 ${x.className}`}
              disabled={busyGlobal || x.loading}
            >
              {x.loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                x.icon
              )}
              {x.loading ? `${x.label}...` : x.label}
            </DropdownMenuItem>
          ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            if (!busyGlobal) onDelete();
          }}
          disabled={busyGlobal || (isWorking && wAction === "delete")}
          className="flex items-center gap-2 text-red-700 focus:bg-red-50 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-800"
        >
          {isWorking && wAction === "delete" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          {isWorking && wAction === "delete" ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
