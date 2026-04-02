"use client";

import { loadAdminPages } from "@/actions/admin/load-admin-pages";
import { updatePageStatus } from "@/actions/admin/update-page-status";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Globe, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import ContentModal from "../../../../../components/dialogs/content-modal";
import SeoContentModal from "../../../../../components/dialogs/seo-content-modal";
import { Button } from "../../../../../components/ui/button";


type Page = {
   id: string;
   title: string;
   slug: string;
   status: "ACTIVE" | "INACTIVE";
   contentType: "SINGLE" | "DYNAMIC";
   createdAt: Date;
   updatedAt: Date;
   _count?: {
      content: number;
      SeoContent: number;
   };
};

type FilterType = "ALL" | "ACTIVE" | "INACTIVE";

export default function AdminPagesPage() {
   const queryClient = useQueryClient();
   const [updatingPageId, setUpdatingPageId] = useState<string | null>(null);
   const [contentModalOpen, setContentModalOpen] = useState(false);
   const [seoModalOpen, setSeoModalOpen] = useState(false);
   const [selectedPage, setSelectedPage] = useState<{ id: string; title: string } | null>(null);
   const [filter, setFilter] = useState<FilterType>("ALL");

   // Use React Query for data fetching with caching
   const { data: pages = [], isLoading, isFetching, refetch } = useQuery({
      queryKey: ["admin-pages"],
      queryFn: async () => {
         const result = await loadAdminPages();
         if (result?.data) {
            return result.data;
         }
         throw new Error("Failed to load pages");
      },
      staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Cache persists for 10 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus
   });

   const { execute: executeUpdateStatus } = useAction(updatePageStatus, {
      onSuccess: ({ data }) => {
         if (data?.success) {
            toast.success(data.message);
            // Invalidate and refetch pages after successful update
            queryClient.invalidateQueries({ queryKey: ["admin-pages"] });
         }
         setUpdatingPageId(null);
      },
      onError: ({ error, input }) => {
         toast.error(error.serverError || "Failed to update page status");
         // Revert optimistic update on error
         if (input) {
            queryClient.setQueryData<Page[]>(["admin-pages"], (old) => {
               if (!old) return old;
               const revertStatus = input.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
               return old.map((page) =>
                  page.id === input.pageId ? { ...page, status: revertStatus } : page
               );
            });
         }
         setUpdatingPageId(null);
      },
   });

   const handleStatusToggle = (pageId: string, currentStatus: "ACTIVE" | "INACTIVE") => {
      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      // Set the updating page ID
      setUpdatingPageId(pageId);

      // Optimistic update using React Query
      queryClient.setQueryData<Page[]>(["admin-pages"], (old) => {
         if (!old) return old;
         return old.map((page) =>
            page.id === pageId ? { ...page, status: newStatus } : page
         );
      });

      // Execute server action
      executeUpdateStatus({ pageId, status: newStatus });
   };

   // Filter pages based on selected filter
   const filteredPages = pages.filter((page) => {
      if (filter === "ALL") return true;
      return page.status === filter;
   });

   const activeCount = pages.filter((p) => p.status === "ACTIVE").length;
   const inactiveCount = pages.filter((p) => p.status === "INACTIVE").length;

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
         </div>
      );
   }

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold text-gray-900">Pages Management</h1>
               <p className="text-gray-500 mt-1">
                  Manage your institute pages - activate or deactivate them
               </p>
            </div>
            <button
               onClick={() => refetch()}
               disabled={isFetching}
               className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
               <Loader2 className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
               Refresh
            </button>
         </div>

         {/* Filter Buttons */}
         <div className="flex items-center gap-3 bg-white rounded-lg border p-4 shadow-sm">
            <span className="text-sm font-semibold text-gray-700">Filter:</span>
            <div className="flex gap-2">
               <button
                  onClick={() => setFilter("ALL")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "ALL"
                     ? "bg-emerald-600 text-white shadow-md"
                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                     }`}
               >
                  All ({pages.length})
               </button>
               <button
                  onClick={() => setFilter("ACTIVE")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "ACTIVE"
                     ? "bg-green-600 text-white shadow-md"
                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                     }`}
               >
                  Active ({activeCount})
               </button>
               <button
                  onClick={() => setFilter("INACTIVE")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "INACTIVE"
                     ? "bg-gray-600 text-white shadow-md"
                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                     }`}
               >
                  Inactive ({inactiveCount})
               </button>
            </div>
         </div>

         <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
               <div className="max-h-[600px] overflow-y-auto">
                  <Table>
                     <TableHeader className="sticky top-0 bg-white z-10">
                        <TableRow>
                           <TableHead className="w-12">#</TableHead>
                           <TableHead>Title</TableHead>
                           <TableHead>Slug</TableHead>
                           <TableHead>Content</TableHead>
                           <TableHead>SEO</TableHead>
                           <TableHead>Status</TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {filteredPages.length === 0 ? (
                           <TableRow>
                              <TableCell colSpan={7} className="text-center py-12">
                                 <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                 <p className="text-gray-500">
                                    {pages.length === 0 ? "No pages found" : `No ${filter.toLowerCase()} pages found`}
                                 </p>
                              </TableCell>
                           </TableRow>
                        ) : (
                           filteredPages.map((page, index) => (
                              <TableRow key={page.id}>
                                 <TableCell className="font-medium">{index + 1}</TableCell>
                                 <TableCell className="font-medium">{page.title}</TableCell>
                                 <TableCell className="text-gray-600">{page.slug}</TableCell>

                                 <TableCell>
                                    {page.contentType === "SINGLE" ? (
                                       <Button
                                          size="sm"
                                          variant={page._count?.content && page._count.content > 0 ? "default" : "outline"}
                                          className={
                                             page._count?.content && page._count.content > 0
                                                ? "bg-green-600 hover:bg-green-700 text-white"
                                                : ""
                                          }
                                          onClick={() => {
                                             setSelectedPage({ id: page.id, title: page.title });
                                             setContentModalOpen(true);
                                          }}
                                       >
                                          <FileText className="h-4 w-4 mr-2" />
                                          Content
                                       </Button>
                                    ) : (
                                       <span className="text-xs text-gray-400">Dynamic</span>
                                    )}
                                 </TableCell>

                                 <TableCell>
                                    <Button
                                       size="sm"
                                       variant="outline"
                                       onClick={() => {
                                          setSelectedPage({ id: page.id, title: page.title });
                                          setSeoModalOpen(true);
                                       }}
                                    >
                                       <Globe className="h-4 w-4 mr-2" />
                                       SEO
                                    </Button>
                                 </TableCell>

                                 <TableCell>
                                    <Badge
                                       variant={page.status === "ACTIVE" ? "default" : "secondary"}
                                       className={
                                          page.status === "ACTIVE"
                                             ? "bg-green-100 text-green-800 hover:bg-green-200"
                                             : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                       }
                                    >
                                       {page.status}
                                    </Badge>
                                 </TableCell>

                                 <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                       {/* <span className="text-sm text-gray-600">
                                          {page.status === "ACTIVE" ? "Active" : "Inactive"}
                                       </span> */}
                                       <Switch
                                          checked={page.status === "ACTIVE"}
                                          onCheckedChange={() => handleStatusToggle(page.id, page.status)}
                                          disabled={updatingPageId === page.id}
                                       />
                                    </div>
                                 </TableCell>
                              </TableRow>
                           ))
                        )}
                     </TableBody>
                  </Table>
               </div>
            </div>
         </div>


         {
            pages.length > 0 && (
               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Information:</h3>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                     <li>Active pages are visible on your website</li>
                     <li>Inactive pages are hidden from public view</li>
                     <li>Toggle the switch to change page status instantly</li>
                     <li>Total pages: {pages.length}</li>
                     <li>Active: {activeCount}</li>
                     <li>Inactive: {inactiveCount}</li>
                     {filter !== "ALL" && <li className="font-semibold">Showing: {filteredPages.length} {filter.toLowerCase()} page(s)</li>}
                  </ul>
               </div>
            )
         }

         {selectedPage && (
            <>
               <ContentModal
                  open={contentModalOpen}
                  onOpenChange={setContentModalOpen}
                  pageId={selectedPage.id}
                  pageTitle={selectedPage.title}
               />
               <SeoContentModal
                  open={seoModalOpen}
                  onOpenChange={setSeoModalOpen}
                  pageId={selectedPage.id}
                  pageTitle={selectedPage.title}
               />
            </>
         )}
      </div >
   );
}
