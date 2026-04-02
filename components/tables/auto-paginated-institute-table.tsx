"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { toast } from "sonner";

import { deleteInstitute } from "@/actions/Institute/delete-institute";
import AdminsDialog from "@/components/dialogs/admin-management/admins-dialog";
import { InsertInstituteDialog } from "@/components/dialogs/insert-institute-dialog";
import PageStatusDialog from "@/components/forms/institute/page-status-dailog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ListChecks, MoreHorizontal, PencilLine, Trash2, Users } from "lucide-react";
import StatusCell from "./StatusCell";

type Role = "SUPER_ADMIN" | "ADMIN" | string;

export type InstituteRow = {
  id: string;
  name: string;
  domain: string | null;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  suspendedAt?: string | Date | null;
  users?: Array<{ id: string; name: string | null; email: string; role: Role }>;
};

type Props = {
  institutes: InstituteRow[];
  maxHeight?: number;
  approxRowHeight?: number;
};

type CSSVars = CSSProperties & { ["--tbl-max-h"]?: string };

function DeleteInstituteMenuItem({ id }: { id: string }) {
  const [pending, start] = React.useTransition();
  const router = useRouter();

  const handleDelete = () => {
    const ok = window.confirm(
      "This will permanently delete this institute and ALL related data (users, pages, configs). Are you sure?"
    );
    if (!ok) return;
    start(async () => {
      try {
        await deleteInstitute({ id });
        toast.success("Institute and related data deleted");
        router.refresh();
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to delete";
        toast.error(msg);
      }
    });
  };

  return (
    <DropdownMenuItem
      onSelect={(e) => {
        e.preventDefault();
        if (!pending) handleDelete();
      }}
      disabled={pending}
      className="flex items-center gap-2 text-red-600 focus:bg-red-50 "
    >
      <Trash2 className="h-4 w-4" />
      {pending ? "Deleting..." : "Delete institute"}
    </DropdownMenuItem>
  );
}

function RowActions({
  institute,
  owner,
}: {
  institute: InstituteRow;
  owner?: { id: string; name: string | null; email: string; role: Role };
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pageDlgOpen, setPageDlgOpen] = useState(false);
  const editBtnRef = useRef<HTMLButtonElement | null>(null);
  const [adminsDlgOpen, setAdminsDlgOpen] = useState(false);

  return (
    <>
      <PageStatusDialog
        open={pageDlgOpen}
        onOpenChange={setPageDlgOpen}
        instituteId={institute.id}
        instituteName={institute.name}
      />

      <AdminsDialog
        open={adminsDlgOpen}
        onOpenChange={setAdminsDlgOpen}
        instituteId={institute.id}
        instituteName={institute.name}
      />

      <InsertInstituteDialog
        edit={{
          instituteId: institute.id,
          name: institute.name,
          domainPostfix: institute.domain ?? "",
          admin: owner ? { userId: owner.id, email: owner.email, name: owner.name ?? "" } : undefined,
        }}
        trigger={<button ref={editBtnRef} type="button" aria-hidden className="hidden" tabIndex={-1} />}
      />

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" aria-label={`More actions for ${institute.name}`}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" side="bottom" className="w-56">
          <DropdownMenuLabel className="truncate">{institute.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              editBtnRef.current?.click();
            }}
            className="flex items-center gap-2"
          >
            <PencilLine className="h-4 w-4" />
            Edit institute
          </DropdownMenuItem>

          <DeleteInstituteMenuItem id={institute.id} />

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              setAdminsDlgOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Admins
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              setPageDlgOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <ListChecks className="h-4 w-4" />
            Page status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default function AutoPaginatedInstituteTable({
  institutes,
  maxHeight = 520,
  approxRowHeight = 64,
}: Props) {
  const [rows, setRows] = useState<InstituteRow[]>(institutes);

  useEffect(() => {
    setRows(institutes);
  }, [institutes]);

  useEffect(() => {
    function handleStatusUpdated(e: Event) {
      const detail = (e as CustomEvent<{
        instituteId: string;
        status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
        suspendedAt: string | null | Date | null;
      }>).detail;

      setRows((prev) =>
        prev.map((r) =>
          r.id === detail.instituteId
            ? {
              ...r,
              status: detail.status,
              suspendedAt:
                detail.suspendedAt instanceof Date
                  ? detail.suspendedAt.toISOString()
                  : detail.suspendedAt ?? null,
            }
            : r
        )
      );
    }

    window.addEventListener("institute:status-updated", handleStatusUpdated);
    return () => window.removeEventListener("institute:status-updated", handleStatusUpdated);
  }, []);

  const rowsPerPage = Math.max(1, Math.floor(maxHeight / approxRowHeight));
  const needsPagination = rows.length > rowsPerPage;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => (needsPagination ? Math.ceil(rows.length / rowsPerPage) : 1),
    [rows.length, needsPagination, rowsPerPage]
  );

  const pageData = useMemo(() => {
    if (!needsPagination) return rows;
    const start = (currentPage - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, needsPagination, currentPage, rowsPerPage]);

  const go = (p: number) => needsPagination && setCurrentPage(Math.min(Math.max(1, p), totalPages));

  const COLS = ["72px", "18%", "16%", "22%", "16%", "12%", "10%", "120px"];
  // SR, Name, Domain, Contact Email, Contact Person, Contact Role, Status, Action

  const scrollStyle: CSSVars = { ["--tbl-max-h"]: `${maxHeight}px` };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="max-h-[--tbl-max-h] overflow-y-auto" style={scrollStyle}>
          <Table className="table-fixed">
            <colgroup>
              {COLS.map((w, i) => (
                <col key={i} style={{ width: w }} />
              ))}
            </colgroup>
            <TableHeader className="sticky top-0 z-10 bg-muted/50 backdrop-blur ">
              <TableRow className="border-b border-border">
                <TableHead className="px-4 py-3 text-left font-semibold">SR</TableHead>
                <TableHead className="px-4 py-3 text-left font-semibold">Name</TableHead>
                <TableHead className="px-4 py-3 text-left font-semibold">Domain</TableHead>
                <TableHead className="px-4 py-3 text-left font-semibold">Contact Person Email</TableHead>
                <TableHead className="px-4 py-3 text-left font-semibold">Contact Person</TableHead>
                <TableHead className="px-4 py-3 text-center font-semibold"> Person Role</TableHead>
                <TableHead className="px-4 py-3 text-center font-semibold">Status</TableHead>
                <TableHead className="px-4 py-3 text-center font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageData.map((institute, index) => {
                const owner = institute.users?.[0];
                const sr = needsPagination ? (currentPage - 1) * rowsPerPage + (index + 1) : index + 1;
                return (
                  <TableRow
                    key={institute.id ?? index}
                    className={`border-b border-border/50 transition-colors duration-200 ${index % 2 === 0 ? "bg-background hover:bg-muted/30" : "bg-muted/20 hover:bg-muted/40"
                      }`}
                    style={{ height: approxRowHeight }}
                  >
                    <TableCell className="px-4 py-3 text-left font-medium text-muted-foreground">
                      {sr}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-left font-medium text-foreground truncate max-w-full">
                      <span title={institute.name} className="block truncate">
                        {institute.name}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-left text-muted-foreground truncate max-w-full">
                      <span title={institute.domain || ""} className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary truncate">
                        {institute.domain}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-left text-muted-foreground truncate max-w-full">
                      <span title={owner?.email ?? "-"} className="block truncate">
                        {owner?.email ?? "-"}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-left font-medium text-foreground truncate max-w-full">
                      <span title={owner?.name ?? "-"} className="block truncate">
                        {owner?.name ?? "-"}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-3 text-center">
                      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground ">
                        {owner?.role?.replace("_", " ") ?? "-"}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <StatusCell
                        instituteId={institute.id}
                        instituteName={institute.name}
                        status={institute.status ?? "ACTIVE"}
                        suspendedAt={institute.suspendedAt ?? null}
                      />
                    </TableCell>

                    <TableCell className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <RowActions institute={institute} owner={owner} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {needsPagination && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    go(currentPage - 1);
                  }}
                  aria-disabled={currentPage <= 1}
                  className={`transition-colors duration-200 ${currentPage <= 1 ? "pointer-events-none opacity-50" : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        go(pageNumber);
                      }}
                      aria-current={pageNumber === currentPage ? "page" : undefined}
                      className={`transition-colors duration-200 hover:text-white ${pageNumber === currentPage
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              {totalPages > 5 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    go(currentPage + 1);
                  }}
                  aria-disabled={currentPage >= totalPages}
                  className={`transition-colors duration-200 ${currentPage >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
