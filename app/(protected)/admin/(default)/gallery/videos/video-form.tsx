"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
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

import { createGalleryVideo } from "@/actions/admin/gallery/create-gallery-video";
import { updateGalleryVideo } from "@/actions/admin/gallery/update-gallery-video";

const videoFormSchema = z.object({
   title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
   videoSrc: z.string().min(1, "Video URL is required").url("Invalid video URL"),
});

type VideoFormValues = z.infer<typeof videoFormSchema>;

type GalleryVideo = {
   id: number;
   title: string;
   videoSrc: string;
   index: number;
};

export default function VideoForm({
   video,
   open,
   onOpenChange,
   onSuccess,
}: {
   video: GalleryVideo | null;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSuccess: () => void;
}) {
   const form = useForm<VideoFormValues>({
      resolver: zodResolver(videoFormSchema),
      defaultValues: {
         title: "",
         videoSrc: "",
      },
   });

   // Reset form when dialog opens/closes or video changes
   useEffect(() => {
      if (open) {
         if (video) {
            // Edit mode
            form.reset({
               title: video.title,
               videoSrc: video.videoSrc,
            });
         } else {
            // Create mode - clear everything
            form.reset({
               title: "",
               videoSrc: "",
            });
         }
      }
   }, [open, video, form]);

   const { executeAsync: executeCreate, isPending: isCreating } = useAction(createGalleryVideo, {
      onSuccess: () => {
         toast.success("Video added successfully");
         form.reset();
         onOpenChange(false);
         onSuccess();
      },
      onError: ({ error }) => {
         toast.error(error.serverError || "Failed to add video");
      },
   });

   const { executeAsync: executeUpdate, isPending: isUpdating } = useAction(updateGalleryVideo, {
      onSuccess: () => {
         toast.success("Video updated successfully");
         onOpenChange(false);
         onSuccess();
      },
      onError: ({ error }) => {
         toast.error(error.serverError || "Failed to update video");
      },
   });

   const isLoading = isCreating || isUpdating;

   const onSubmit = async (values: VideoFormValues) => {
      if (video) {
         await executeUpdate({
            id: video.id,
            ...values,
         });
      } else {
         await executeCreate(values);
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-2xl">
            <DialogHeader>
               <DialogTitle>{video ? "Edit Video" : "Add New Video"}</DialogTitle>
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
                                 placeholder="Enter video title"
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

                  {/* Video URL Field */}
                  <FormField
                     control={form.control}
                     name="videoSrc"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>YouTube Video URL</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="https://www.youtube.com/watch?v=..."
                                 {...field}
                              />
                           </FormControl>
                           <p className="text-xs text-muted-foreground mt-2">
                              Paste the full YouTube video URL
                           </p>
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
                        {video ? "Update" : "Create"}
                     </Button>
                  </div>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
