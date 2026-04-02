"use client";

import { deleteNotice } from "@/actions/admin/notice/delete-notice";
import { getNotices } from "@/actions/admin/notice/get-notices";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Edit, Loader, Plus, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import NoticeForm from "./notice-form";

type Notice = {
   id: string | bigint;
   title: string;
   content: string;
   category: string;
   fileUrl: string | null;
   fileName: string | null;
   isPublished: boolean;
   specialNotice: boolean;
   createdAt: Date;
};

export default function NoticePageClient({
   instituteId,
}: {
   instituteId: string;
}) {
   const [notices, setNotices] = useState<Notice[]>([]);
   const [loading, setLoading] = useState(true);
   const [category, setCategory] = useState("ALL");
   const [page, setPage] = useState(1);
   const [total, setTotal] = useState(0);
   const [pages, setPages] = useState(0);
   const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [deletingId, setDeletingId] = useState<string | bigint | null>(null);

   const { execute: executeGetNotices } = useAction(getNotices, {
      onSuccess: (res) => {
         if (res?.data?.success) {
            // Sort notices: special notices first, then by date descending
            const sortedNotices = [...res.data.notices].sort((a, b) => {
               // Special notices come first
               if (a.specialNotice && !b.specialNotice) return -1;
               if (!a.specialNotice && b.specialNotice) return 1;
               // Then sort by date (newest first)
               return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            setNotices(sortedNotices);
            setTotal(res.data.total);
            setPages(res.data.pages);
         }
         setLoading(false);
      },
      onError: () => {
         toast.error("Failed to load notices");
         setLoading(false);
      },
   });

   const { execute: executeDelete } = useAction(deleteNotice, {
      onSuccess: () => {
         toast.success("Notice deleted successfully");
         setDeletingId(null);
         executeGetNotices({ category: category === "ALL" ? undefined : category, page });
      },
      onError: () => {
         toast.error("Failed to delete notice");
         setDeletingId(null);
      },
   });

   useEffect(() => {
      executeGetNotices({
         category: category === "ALL" ? undefined : category,
         page,
      });
   }, [category, page, executeGetNotices]);

   const handleDelete = (id: string | bigint) => {
      if (confirm("Are you sure you want to delete this notice?")) {
         setDeletingId(id);
         executeDelete({ id: String(id) });
      }
   };

   const handleFormSuccess = () => {
      setIsFormOpen(false);
      setSelectedNotice(null);
      setPage(1);
      executeGetNotices({ category: category === "ALL" ? undefined : category, page: 1 });
   };

   if (loading && notices.length === 0) {
      return (
         <div className="flex items-center justify-center h-96">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
               <p className="text-gray-600">Loading notices...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Notices Management</h1>
            <Button
               onClick={() => {
                  setSelectedNotice(null);
                  setIsFormOpen(true);
               }}
               className="gap-2"
            >
               <Plus className="h-4 w-4" />
               Create Notice
            </Button>
         </div>

         <div className="flex gap-4 items-center">
            <Select value={category} onValueChange={setCategory}>
               <SelectTrigger className="w-48">
                  <SelectValue />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="EXAM">Exam</SelectItem>
                  <SelectItem value="HOLIDAY">Holiday</SelectItem>
                  <SelectItem value="EVENT">Event</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
               </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">Total: {total} notices</span>
         </div>

         <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-sm table-fixed">
                  <colgroup>
                     <col style={{ width: "8%" }} />
                     <col style={{ width: "35%" }} />
                     <col style={{ width: "15%" }} />
                     <col style={{ width: "10%" }} />
                     <col style={{ width: "10%" }} />
                     <col style={{ width: "10%" }} />
                     <col style={{ width: "12%" }} />
                  </colgroup>
                  <thead className="bg-gray-100 border-b">
                     <tr>
                        <th className="px-6 py-3 text-left font-semibold">Date</th>
                        <th className="px-6 py-3 text-left font-semibold">Title</th>
                        <th className="px-6 py-3 text-left font-semibold">File</th>
                        <th className="px-6 py-3 text-left font-semibold">Category</th>
                        <th className="px-6 py-3 text-left font-semibold">Status</th>
                        <th className="px-6 py-3 text-left font-semibold">Special</th>
                        <th className="px-6 py-3 text-right font-semibold">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {notices.length === 0 ? (
                        <tr>
                           <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                              No notices found
                           </td>
                        </tr>
                     ) : (
                        notices.map((notice) => (
                           <tr key={notice.id} className="border-b hover:bg-gray-50">
                              <td className="px-6 py-4 text-gray-600">
                                 {new Date(notice.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 font-medium truncate">
                                 {notice.title}
                              </td>


                              <td className="px-6 py-4 truncate">
                                 {notice.fileUrl ? (
                                    <a
                                       href={notice.fileUrl}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors truncate"
                                    >
                                       {/\.(jpg|jpeg|png|gif|webp)$/i.test(notice.fileUrl) ? (
                                          <>
                                             {/* eslint-disable-next-line @next/next/no-img-element */}
                                             <img
                                                src={notice.fileUrl}
                                                alt="Preview"
                                                className="h-6 w-6 rounded object-cover flex-shrink-0"
                                             />
                                             <span className="truncate">{notice.fileName || "Image"}</span>
                                          </>
                                       ) : (
                                          <>
                                             <span className="text-sm flex-shrink-0">📄</span>
                                             <span className="truncate">{notice.fileName || "File"}</span>
                                          </>
                                       )}
                                    </a>
                                 ) : (
                                    <span className="text-gray-400 text-xs">No file</span>
                                 )}
                              </td>
                              <td className="px-6 py-4">
                                 <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                    {notice.category}
                                 </span>
                              </td>
                              <td className="px-6 py-4">
                                 <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${notice.isPublished
                                       ? "bg-green-100 text-green-800"
                                       : "bg-yellow-100 text-yellow-800"
                                       }`}
                                 >
                                    {notice.isPublished ? "Published" : "Draft"}
                                 </span>
                              </td>
                              <td className="px-6 py-4">
                                 {notice.specialNotice ? (
                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                       ⭐
                                    </span>
                                 ) : (
                                    <span className="text-gray-400 text-xs">-</span>
                                 )}
                              </td>

                              <td className="px-6 py-4 text-right">
                                 <div className="flex justify-end gap-2">
                                    <Button
                                       size="sm"
                                       variant="outline"
                                       onClick={() => {
                                          setSelectedNotice(notice);
                                          setIsFormOpen(true);
                                       }}
                                    >
                                       <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                       size="sm"
                                       variant="destructive"
                                       onClick={() => handleDelete(notice.id)}
                                       disabled={deletingId === notice.id}
                                    >
                                       {deletingId === notice.id ? (
                                          <Loader className="h-4 w-4 animate-spin" />
                                       ) : (
                                          <Trash2 className="h-4 w-4" />
                                       )}
                                    </Button>
                                 </div>
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>

         {pages > 1 && (
            <div className="flex justify-center gap-2">
               <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
               >
                  Previous
               </Button>
               <span className="flex items-center px-4">
                  Page {page} of {pages}
               </span>
               <Button
                  variant="outline"
                  onClick={() => setPage(Math.min(pages, page + 1))}
                  disabled={page === pages}
               >
                  Next
               </Button>
            </div>
         )}

         <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="max-w-[90%]! max-h-screen overflow-y-auto">
               <DialogHeader>
                  <DialogTitle>
                     {selectedNotice ? "Edit Notice" : "Create New Notice"}
                  </DialogTitle>
               </DialogHeader>
               <NoticeForm
                  notice={selectedNotice}
                  instituteId={instituteId}
                  onSuccess={handleFormSuccess}
                  onCancel={() => {
                     setIsFormOpen(false);
                     setSelectedNotice(null);
                  }}
               />
            </DialogContent>
         </Dialog>
      </div>
   );
}
