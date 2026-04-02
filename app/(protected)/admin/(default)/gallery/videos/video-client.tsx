"use client";

import { Grid, List, Loader2, Plus, Save, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { reorderGalleryVideos } from "@/actions/admin/gallery/reorder-gallery-videos";
import VideoForm from "./video-form";
import VideoTable from "./video-table";
import { Card } from "../../../../../../components/ui/card";

type GalleryVideo = {
   id: number;
   title: string;
   videoSrc: string;
   index: number;
};

export default function VideoClient({ initialVideos }: { initialVideos: GalleryVideo[] }) {
   const [videos, setVideos] = useState<GalleryVideo[]>(initialVideos);
   const [viewMode, setViewMode] = useState<"list" | "grid">("list");
   const [formOpen, setFormOpen] = useState(false);
   const [editingVideo, setEditingVideo] = useState<GalleryVideo | null>(null);
   const [hasChanges, setHasChanges] = useState(false);

   const { executeAsync: executeReorder, isPending: isReordering } = useAction(reorderGalleryVideos, {
      onSuccess: () => {
         toast.success("Videos reordered successfully");
         setHasChanges(false);
      },
      onError: ({ error }) => {
         toast.error(error.serverError || "Failed to reorder videos");
      },
   });

   const handleEdit = (video: GalleryVideo) => {
      setEditingVideo(video);
      setFormOpen(true);
   };

   const handleReorder = (reorderedVideos: GalleryVideo[]) => {
      setVideos(reorderedVideos);
      setHasChanges(true);
   };

   const handleSaveOrder = async () => {
      const items = videos.map((vid, idx) => ({
         id: vid.id,
         index: idx,
      }));
      await executeReorder({ items });
   };

   const handleCancel = () => {
      setVideos(initialVideos);
      setHasChanges(false);
   };

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Gallery Videos</h1>
               <p className="text-muted-foreground mt-1">Manage and organize your gallery videos</p>
            </div>
            <Button onClick={() => setFormOpen(true)}>
               <Plus className="w-4 h-4 mr-2" />
               Create New
            </Button>
         </div>

         {/* View Mode Tabs */}
         <Card className="p-4 h-screen overflow-auto mb-5">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "grid")}>
               <TabsList className="bg-[#00996631] border-gray-200 rounded-none h-auto gap-x-5 p-0 pt-1 pr-1 rounded-t-md w-full justify-start">
                  <TabsTrigger value="list" className="bg-transparent text-black/70 data-[state=active]:text-primary data-[state=active]:bg-white rounded-t-sm flex items-center gap-x-2 font-medium data-[state=active]:shadow-none pb-2 w-20">
                     <List className="w-4 h-4" />
                     List
                  </TabsTrigger>
                  <TabsTrigger value="grid" className="bg-transparent text-black/70 data-[state=active]:text-primary data-[state=active]:bg-white rounded-t-sm flex items-center gap-x-2 font-medium data-[state=active]:shadow-none pb-2 w-20">
                     <Grid className="w-4 h-4" />
                     Grid
                  </TabsTrigger>
                  <p className="ml-auto text-black/60 ">  Double Click to open The Video.</p>

               </TabsList>

               <TabsContent value={viewMode} className="mt-6">
                  {videos.length === 0 ? (
                     <div className="text-center py-12">
                        <p className="text-muted-foreground">No videos yet. Create one to get started.</p>
                     </div>
                  ) : (
                     <VideoTable
                        videos={videos}
                        viewMode={viewMode}
                        onEdit={handleEdit}
                        onReorder={handleReorder}
                     />
                  )}
               </TabsContent>
            </Tabs>
         </Card>
         {/* Save/Cancel Buttons - Only show when changes */}
         {hasChanges && (
            <div className="fixed bottom-0 left-0 right-0 bg-muted border-t p-4 flex justify-end gap-2 z-40">
               <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isReordering}
               >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
               </Button>
               <Button onClick={handleSaveOrder} disabled={isReordering}>
                  {isReordering && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  Save Order
               </Button>
            </div>
         )}

         {/* Video Form Dialog */}
         <VideoForm
            video={editingVideo}
            open={formOpen}
            onOpenChange={(open) => {
               setFormOpen(open);
               if (!open) setEditingVideo(null);
            }}
            onSuccess={() => window.location.reload()}
         />
      </div>
   );
}
