"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createGalleryImage } from "@/actions/admin/gallery/create-gallery-image";
import { updateGalleryImage } from "@/actions/admin/gallery/update-gallery-image";
import FileManager from "@/components/file-manager/file-manager";
import { getImageUrl } from "@/lib/shared/image-utils";

const imageFormSchema = z.object({
   title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
   ImgSrc: z.string().min(1, "Image is required"),
   ImgAlt: z.string().optional(),
});

type ImageFormValues = z.infer<typeof imageFormSchema>;

type GalleryImage = {
   id: number;
   title: string;
   ImgSrc: string;
   ImgAlt: string | null;
   index: number;
};

export default function ImageForm({
   image,
   open,
   onOpenChange,
   onSuccess,
}: {
   image: GalleryImage | null;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSuccess: () => void;
}) {
   const [fileManagerOpen, setFileManagerOpen] = useState(false);
   const [selectedFiles, setSelectedFiles] = useState<Array<{ name: string; path: string }>>([]);
   const [imagePreview, setImagePreview] = useState<string | null>(null);

   const form = useForm<ImageFormValues>({
      resolver: zodResolver(imageFormSchema),
      defaultValues: {
         title: "",
         ImgSrc: "",
         ImgAlt: "",
      },
   });

   // Reset form when dialog opens/closes or image changes
   useEffect(() => {
      if (open) {
         if (image) {
            // Edit mode
            form.reset({
               title: image.title,
               ImgSrc: image.ImgSrc,
               ImgAlt: image.ImgAlt || "",
            });
            setImagePreview(getImageUrl(image.ImgSrc) || image.ImgSrc);
         } else {
            // Create mode - clear everything
            form.reset({
               title: "",
               ImgSrc: "",
               ImgAlt: "",
            });
            setImagePreview(null);
            setSelectedFiles([]);
         }
      }
   }, [open, image, form]);

   const { executeAsync: executeCreate, isPending: isCreating } = useAction(createGalleryImage, {
      onSuccess: () => {
         toast.success("Image added successfully");
         form.reset();
         setImagePreview(null);
         setSelectedFiles([]);
         onOpenChange(false);
         onSuccess();
      },
      onError: ({ error }) => {
         toast.error(error.serverError || "Failed to add image");
      },
   });

   const { executeAsync: executeUpdate, isPending: isUpdating } = useAction(updateGalleryImage, {
      onSuccess: () => {
         toast.success("Image updated successfully");
         onOpenChange(false);
         onSuccess();
      },
      onError: ({ error }) => {
         toast.error(error.serverError || "Failed to update image");
      },
   });

   const isLoading = isCreating || isUpdating;

   const handleFileSelect = () => {
      if (selectedFiles.length > 0) {
         const file = selectedFiles[0];
         form.setValue("ImgSrc", file.path);
         setImagePreview(getImageUrl(file.path) || file.path);
         setFileManagerOpen(false);
         setSelectedFiles([]);

         // Auto-fill alt text with image name if empty
         if (!form.getValues("ImgAlt")) {
            form.setValue("ImgAlt", file.name.replace(/\.[^/.]+$/, ""));
         }
      }
   };

   const onSubmit = async (values: ImageFormValues) => {
      if (image) {
         await executeUpdate({
            id: image.id,
            ...values,
         });
      } else {
         await executeCreate(values);
      }
   };

   return (
      <>
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
               <DialogHeader>
                  <DialogTitle>{image ? "Edit Image" : "Add New Image"}</DialogTitle>
               </DialogHeader>

               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                     {/* Title Field */}
                     <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Enter image title"
                                    maxLength={100}
                                    {...field}
                                 />
                              </FormControl>
                              <div className="text-xs text-muted-foreground text-right">
                                 {field.value?.length || 0}/100
                              </div>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Image Selection */}
                     <FormField
                        control={form.control}
                        name="ImgSrc"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Image</FormLabel>
                              <div className="space-y-4">
                                 {imagePreview && (
                                    <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                                       <Image
                                          src={imagePreview}
                                          alt="Preview"
                                          fill
                                          className="object-cover"
                                       />
                                       <button
                                          type="button"
                                          onClick={() => {
                                             setImagePreview(null);
                                             form.setValue("ImgSrc", "");
                                          }}
                                          className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full hover:bg-destructive/90"
                                       >
                                          <X className="w-4 h-4" />
                                       </button>
                                    </div>
                                 )}
                                 <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setFileManagerOpen(true)}
                                    className="w-full"
                                 >
                                    {imagePreview ? "Change Image" : "Select Image"}
                                 </Button>
                              </div>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Alt Text Field */}
                     <FormField
                        control={form.control}
                        name="ImgAlt"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Alt Text (Optional)</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="Auto-filled with image name"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Action Buttons */}
                     <div className="flex gap-2 justify-end pt-4 border-t">
                        <Button
                           type="button"
                           variant="outline"
                           onClick={() => onOpenChange(false)}
                           disabled={isLoading}
                        >
                           Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                           {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                           {image ? "Update" : "Create"}
                        </Button>
                     </div>
                  </form>
               </Form>
            </DialogContent>
         </Dialog>

         {/* File Manager */}
         <FileManager
            open={fileManagerOpen}
            setOpen={setFileManagerOpen}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            onSelectCallBack={handleFileSelect}
            multiple={false}
         />
      </>
   );
}
