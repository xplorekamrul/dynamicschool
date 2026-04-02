"use client";

import { Edit2, GripVertical, Loader2, Play, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { deleteGalleryVideo } from "@/actions/admin/gallery/delete-gallery-video";

type GalleryVideo = {
   id: number;
   title: string;
   videoSrc: string;
   index: number;
};

export default function VideoTable({
   videos,
   viewMode,
   onEdit,
   onReorder,
}: {
   videos: GalleryVideo[];
   viewMode: "list" | "grid";
   onEdit: (video: GalleryVideo) => void;
   onReorder: (videos: GalleryVideo[]) => void;
}) {
   const [deleteId, setDeleteId] = useState<number | null>(null);
   const [draggedItem, setDraggedItem] = useState<GalleryVideo | null>(null);

   const { executeAsync: executeDelete, isPending: isDeleting } = useAction(deleteGalleryVideo, {
      onSuccess: () => {
         toast.success("Video deleted successfully");
         setDeleteId(null);
      },
      onError: ({ error }) => {
         toast.error(error.serverError || "Failed to delete video");
      },
   });

   const handleDragStart = (video: GalleryVideo) => {
      setDraggedItem(video);
   };

   const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
   };

   const handleDrop = (targetVideo: GalleryVideo) => {
      if (!draggedItem || draggedItem.id === targetVideo.id) return;

      const newVideos = [...videos];
      const draggedIndex = newVideos.findIndex((vid) => vid.id === draggedItem.id);
      const targetIndex = newVideos.findIndex((vid) => vid.id === targetVideo.id);

      [newVideos[draggedIndex], newVideos[targetIndex]] = [newVideos[targetIndex], newVideos[draggedIndex]];

      const updatedVideos = newVideos.map((vid, idx) => ({
         ...vid,
         index: idx,
      }));

      onReorder(updatedVideos);
      setDraggedItem(null);
   };

   const getYouTubeThumbnail = (url: string) => {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
   };

   return (
      <>
         {viewMode === "list" ? (
            <div className="space-y-2">
               {videos.map((video) => (
                  <div
                     key={video.id}
                     draggable
                     onDragStart={() => handleDragStart(video)}
                     onDragOver={handleDragOver}
                     onDrop={() => handleDrop(video)}
                     className="flex items-center gap-4 p-3 bg-primary/10 rounded-lg hover:bg-primary/15 transition-colors cursor-move group"
                  >
                     <GripVertical className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />

                     <div className="relative w-28 aspect-video bg-background rounded overflow-hidden flex-shrink-0 flex items-center justify-center cursor-pointer" onDoubleClick={() => window.open(video.videoSrc, "_blank")}>
                        {getYouTubeThumbnail(video.videoSrc) ? (
                           <img
                              src={getYouTubeThumbnail(video.videoSrc)!}
                              alt={video.title}
                              className="w-full h-full object-cover"
                           />
                        ) : (
                           <Play className="w-6 h-6 text-muted-foreground" />
                        )}
                     </div>

                     <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{video.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{video.videoSrc}</p>
                     </div>

                     <div className="flex gap-2 flex-shrink-0">
                        <Button
                           size="sm"
                           variant="ghost"
                           onClick={() => onEdit(video)}
                        >
                           <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                           size="sm"
                           variant="ghost"
                           onClick={() => setDeleteId(video.id)}
                        >
                           <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {videos.map((video) => (
                  <div
                     key={video.id}
                     draggable
                     onDragStart={() => handleDragStart(video)}
                     onDragOver={handleDragOver}
                     onDrop={() => handleDrop(video)}
                     className="relative group cursor-move"
                  >
                     <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden cursor-move" onDoubleClick={() => window.open(video.videoSrc, "_blank")}>
                        {getYouTubeThumbnail(video.videoSrc) ? (
                           <img
                              src={getYouTubeThumbnail(video.videoSrc)!}
                              alt={video.title}
                              className="w-full h-full object-cover"
                           />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center">
                              <Play className="w-12 h-12 text-muted-foreground" />
                           </div>
                        )}
                     </div>

                     <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                           size="sm"
                           variant="secondary"
                           className="h-8 w-8 p-0"
                           onClick={() => onEdit(video)}
                        >
                           <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                           size="sm"
                           variant="destructive"
                           className="h-8 w-8 p-0"
                           onClick={() => setDeleteId(video.id)}
                        >
                           <Trash2 className="w-4 h-4" />
                        </Button>
                     </div>

                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-primary/60 p-1 rounded-b-lg">
                        <p className="text-white text-xs font-medium truncate">{video.title}</p>
                     </div>
                  </div>
               ))}
            </div>
         )}

         <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Delete Video</AlertDialogTitle>
                  <AlertDialogDescription>
                     Are you sure you want to delete this video? This action cannot be undone.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <div className="flex gap-2 justify-end">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={() => deleteId && executeDelete({ id: deleteId })}
                     disabled={isDeleting}
                     className="bg-destructive hover:bg-destructive/90"
                  >
                     {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                     Delete
                  </AlertDialogAction>
               </div>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}
