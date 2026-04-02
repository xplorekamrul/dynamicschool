"use client";

import { Edit2, GripVertical, Loader2, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
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

import { deleteGalleryImage } from "@/actions/admin/gallery/delete-gallery-image";
import { getImageUrl } from "@/lib/shared/image-utils";

type GalleryImage = {
   id: number;
   title: string;
   ImgSrc: string;
   ImgAlt: string | null;
   index: number;
};

export default function ImageTable({
   images,
   viewMode,
   onEdit,
   onReorder,
}: {
   images: GalleryImage[];
   viewMode: "list" | "grid";
   onEdit: (image: GalleryImage) => void;
   onReorder: (images: GalleryImage[]) => void;
}) {
   const [deleteId, setDeleteId] = useState<number | null>(null);
   const [draggedItem, setDraggedItem] = useState<GalleryImage | null>(null);

   const { executeAsync: executeDelete, isPending: isDeleting } = useAction(deleteGalleryImage, {
      onSuccess: () => {
         toast.success("Image deleted successfully");
         setDeleteId(null);
      },
      onError: ({ error }) => {
         toast.error(error.serverError || "Failed to delete image");
      },
   });

   const handleDragStart = (image: GalleryImage) => {
      setDraggedItem(image);
   };

   const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
   };

   const handleDrop = (targetImage: GalleryImage) => {
      if (!draggedItem || draggedItem.id === targetImage.id) return;

      const newImages = [...images];
      const draggedIndex = newImages.findIndex((img) => img.id === draggedItem.id);
      const targetIndex = newImages.findIndex((img) => img.id === targetImage.id);

      [newImages[draggedIndex], newImages[targetIndex]] = [newImages[targetIndex], newImages[draggedIndex]];

      const updatedImages = newImages.map((img, idx) => ({
         ...img,
         index: idx,
      }));

      onReorder(updatedImages);
      setDraggedItem(null);
   };

   return (
      <>
         {viewMode === "list" ? (
            <div className="space-y-2">
               {images.map((image) => (
                  <div
                     key={image.id}
                     draggable
                     onDragStart={() => handleDragStart(image)}
                     onDragOver={handleDragOver}
                     onDrop={() => handleDrop(image)}
                     className="flex items-center gap-4 p-1 bg-primary/10 rounded-lg hover:bg-primary/15 transition-colors cursor-move group"
                  >
                     <GripVertical className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />

                     <div className="relative w-28 aspect-video bg-background rounded overflow-hidden flex-shrink-0 cursor-pointer" onDoubleClick={() => window.open(getImageUrl(image.ImgSrc) || image.ImgSrc, "_blank")}>
                        <Image
                           src={getImageUrl(image.ImgSrc) || image.ImgSrc}
                           alt={image.ImgAlt || image.title}
                           fill
                           className="object-cover"
                        />
                     </div>

                     <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{image.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{image.ImgAlt}</p>
                     </div>

                     <div className="flex gap-2 flex-shrink-0">
                        <Button
                           size="sm"
                           variant="ghost"
                           onClick={() => onEdit(image)}
                        >
                           <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                           size="sm"
                           variant="ghost"
                           onClick={() => setDeleteId(image.id)}
                        >
                           <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
               {images.map((image) => (
                  <div
                     key={image.id}
                     draggable
                     onDragStart={() => handleDragStart(image)}
                     onDragOver={handleDragOver}
                     onDrop={() => handleDrop(image)}
                     className="relative group cursor-move"
                  >
                     <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden cursor-move" onDoubleClick={() => window.open(getImageUrl(image.ImgSrc) || image.ImgSrc, "_blank")}>
                        <Image
                           src={getImageUrl(image.ImgSrc) || image.ImgSrc}
                           alt={image.ImgAlt || image.title}
                           fill
                           className="object-cover"
                        />
                     </div>

                     <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                           size="sm"
                           variant="secondary"
                           className="h-8 w-8 p-0"
                           onClick={() => onEdit(image)}
                        >
                           <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                           size="sm"
                           variant="destructive"
                           className="h-8 w-8 p-0"
                           onClick={() => setDeleteId(image.id)}
                        >
                           <Trash2 className="w-4 h-4" />
                        </Button>
                     </div>

                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-primary/60 py-1 px-2 rounded-b-lg">
                        <p className="text-white text-xs font-medium truncate">{image.title}</p>
                     </div>
                  </div>
               ))}
            </div>
         )}

         <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Delete Image</AlertDialogTitle>
                  <AlertDialogDescription>
                     Are you sure you want to delete this image? This action cannot be undone.
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
