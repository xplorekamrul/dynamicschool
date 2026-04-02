"use client";

import { updateContent } from "@/actions/admin/update-content";
import EditContentModal from "@/components/dialogs/edit-content-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, FileText, Search, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Content = {
   id: string;
   title: string;
   subtitle: string | null;
   body: string | null;
   img_src: string | null;
   img_alt: string | null;
   createdAt: Date;
   updatedAt: Date;
   page: {
      id: string;
      title: string;
      slug: string;
      status: "ACTIVE" | "INACTIVE";
   };
};

interface ContentsClientProps {
   initialContents: Content[];
}

export default function ContentsClient({ initialContents }: ContentsClientProps) {
   const router = useRouter();
   const [searchQuery, setSearchQuery] = useState("");
   const [editModalOpen, setEditModalOpen] = useState(false);
   const [selectedContent, setSelectedContent] = useState<Content | null>(null);

   const { execute: executeUpdateContent, isExecuting: isUpdatingContent } = useAction(updateContent, {
      onSuccess: () => {
         toast.success("Content updated successfully");
         setEditModalOpen(false);
         setSelectedContent(null);
         router.refresh();
      },
      onError: ({ error }) => {
         toast.error(error.serverError || "Failed to update content");
      },
   });

   const filteredContents = initialContents.filter((content) =>
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.page.title.toLowerCase().includes(searchQuery.toLowerCase())
   );

   const handleEditContent = (content: Content) => {
      setSelectedContent(content);
      setEditModalOpen(true);
   };

   const handleSaveContent = (data: {
      contentId: string;
      title: string;
      subtitle?: string;
      body?: string;
      img_src?: string;
      img_alt?: string;
   }) => {
      executeUpdateContent(data);
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
               <p className="text-gray-500 mt-1">View and edit all page contents</p>
            </div>
         </div>

         {/* <div className="bg-white rounded-lg border p-4 shadow-sm">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
               </div>
               <div>
                  <p className="text-sm text-gray-600">Total Contents</p>
                  <p className="text-2xl font-bold text-gray-900">{initialContents.length}</p>
               </div>
            </div>
         </div> */}

         <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-4 border-b bg-gray-50">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                     type="text"
                     placeholder="Search contents..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10 bg-white"
                  />
                  {searchQuery && (
                     <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                     >
                        <X className="h-4 w-4" />
                     </button>
                  )}
               </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
               {filteredContents.length === 0 ? (
                  <div className="text-center py-12">
                     <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                     <p className="text-gray-500">
                        {searchQuery ? "No contents found matching your search" : "No contents available"}
                     </p>
                  </div>
               ) : (
                  <div className="divide-y">
                     {filteredContents.map((content) => (
                        <ContentItem key={content.id} content={content} onEdit={() => handleEditContent(content)} />
                     ))}
                  </div>
               )}
            </div>
         </div>

         <EditContentModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            content={selectedContent}
            onSave={handleSaveContent}
            isSaving={isUpdatingContent}
         />
      </div>
   );
}

function ContentItem({ content, onEdit }: { content: Content; onEdit: () => void }) {
   return (
      <div className="p-4 hover:bg-gray-50 transition-colors">
         <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{content.title}</h3>
                  <Badge
                     variant={content.page.status === "ACTIVE" ? "default" : "secondary"}
                     className={
                        content.page.status === "ACTIVE"
                           ? "bg-green-100 text-green-800 text-xs"
                           : "bg-gray-100 text-gray-800 text-xs"
                     }
                  >
                     {content.page.status}
                  </Badge>
               </div>
               <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                     <FileText className="h-3 w-3" />
                     {content.page.title}
                  </span>
                  {content.img_src && (
                     <span className="flex items-center gap-1 text-blue-600">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Image
                     </span>
                  )}
               </div>
            </div>
            <Button size="sm" variant="outline" onClick={onEdit}>
               <Edit className="h-4 w-4 mr-2" />
               Edit
            </Button>
         </div>
      </div>
   );
}
