"use client";

import { Grid, List, Loader2, Plus, Save, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { reorderGalleryImages } from "@/actions/admin/gallery/reorder-gallery-images";
import ImageForm from "./image-form";
import ImageTable from "./image-table";
import { Card } from "../../../../../../components/ui/card";

type GalleryImage = {
   id: number;
   title: string;
   ImgSrc: string;
   ImgAlt: string | null;
   index: number;
};

export default function ImageClient({ initialImages }: { initialImages: GalleryImage[] }) {
   const [images, setImages] = useState<GalleryImage[]>(initialImages);
   const [viewMode, setViewMode] = useState<"list" | "grid">("list");
   const [formOpen, setFormOpen] = useState(false);
   const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
   const [hasChanges, setHasChanges] = useState(false);

   const { executeAsync: executeReorder, isPending: isReordering } = useAction(reorderGalleryImages, {
      onSuccess: () => {
         toast.success("Images reordered successfully");
         setHasChanges(false);
      },
      onError: ({ error }) => {
         toast.error(error.serverError || "Failed to reorder images");
      },
   });

   const handleEdit = (image: GalleryImage) => {
      setEditingImage(image);
      setFormOpen(true);
   };

   const handleReorder = (reorderedImages: GalleryImage[]) => {
      setImages(reorderedImages);
      setHasChanges(true);
   };

   const handleSaveOrder = async () => {
      const items = images.map((img, idx) => ({
         id: img.id,
         index: idx,
      }));
      await executeReorder({ items });
   };

   const handleCancel = () => {
      setImages(initialImages);
      setHasChanges(false);
   };

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Gallery Images</h1>
               <p className="text-muted-foreground mt-1">Manage and organize your gallery images</p>
            </div>
            <Button onClick={() => setFormOpen(true)}>
               <Plus className="w-4 h-4 mr-2" />
               Create New
            </Button>
         </div>

         {/* View Mode Tabs */}
         <Card className="p-4 p-4 h-screen overflow-auto mb-5">
         <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "grid")}>
            <TabsList className="bg-[#00996631] border-gray-200 rounded-none h-auto gap-x-5 p-0 pt-1 pr-1 rounded-t-md w-full justify-start">
               <TabsTrigger value="list" className=" bg-transparent text-black/70 data-[state=active]:text-primary data-[state=active]:bg-white rounded-t-sm flex items-center gap-x-2 font-medium data-[state=active]:shadow-none pb-2 w-20">
                  <List className="w-4 h-4" />
                  List
               </TabsTrigger>
               <TabsTrigger value="grid" className="bg-transparent text-black/70 data-[state=active]:text-primary data-[state=active]:bg-white rounded-t-sm flex items-center gap-x-2 font-medium data-[state=active]:shadow-none pb-2 w-20">
                  <Grid className="w-4 h-4" />
                  Grid
               </TabsTrigger>
               <p className="ml-auto text-black/60 ">  Double Click to open The Image.</p>
            </TabsList>

            <TabsContent value={viewMode} className="mt-6">
               {images.length === 0 ? (
                  <div className="text-center py-12">
                     <p className="text-muted-foreground">No images yet. Create one to get started.</p>
                  </div>
               ) : (
                  <ImageTable
                     images={images}
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

         {/* Image Form Dialog */}
         <ImageForm
            image={editingImage}
            open={formOpen}
            onOpenChange={(open) => {
               setFormOpen(open);
               if (!open) setEditingImage(null);
            }}
            onSuccess={() => window.location.reload()}
         />
      </div>
   );
}
