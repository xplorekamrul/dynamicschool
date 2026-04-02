"use client";

import { createHeroSection, updateHeroSection } from "@/actions/admin/hero-section";
import FileManager from "@/components/file-manager/file-manager";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getImageUrl } from "@/lib/shared/image-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import NextImage from "next/image";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const HeroSectionSchema = z.object({
   title: z.string().min(1, "Title is required").max(200),
   description: z.string().optional(),
   buttonUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
   buttonName: z.string().max(20).optional().or(z.literal("")),
   images: z.array(
      z.object({
         src: z.string().min(1, "Image source is required"),
         alt: z.string().min(1, "Alt text is required"),
      })
   ).min(1, "At least one image is required"),
});

type HeroSectionFormData = z.infer<typeof HeroSectionSchema>;

interface HeroSectionFormProps {
   heroSection?: {
      id: bigint;
      title: string;
      description: string | null;
      buttonUrl: string | null;
      buttonName: string | null;
      images: any;
   } | null;
   onSuccess?: () => void;
}

export function HeroSectionForm({
   heroSection,
   onSuccess,
}: HeroSectionFormProps) {
   const form = useForm<HeroSectionFormData>({
      resolver: zodResolver(HeroSectionSchema),
      defaultValues: {
         title: heroSection?.title || "",
         description: heroSection?.description || "",
         buttonUrl: heroSection?.buttonUrl || "",
         buttonName: heroSection?.buttonName || "",
         images: heroSection?.images || [{ src: "", alt: "" }],
      },
   });

   const { fields, append, remove } = useFieldArray({
      control: form.control,
      name: "images",
   });

   const [fileManagerOpen, setFileManagerOpen] = useState(false);
   const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
   const [selectedFiles, setSelectedFiles] = useState<
      Array<{ name: string; path: string }>
   >([]);

   const { execute: executeCreate, status: createStatus } = useAction(
      createHeroSection,
      {
         onSuccess: (res) => {
            if ((res?.data as any)?.success) {
               toast.success("Hero section created successfully");
               onSuccess?.();
            }
         },
         onError: (err) => {
            toast.error((err?.error?.serverError as string) || "Failed to create hero section");
         },
      }
   );

   const { execute: executeUpdate, status: updateStatus } = useAction(
      updateHeroSection,
      {
         onSuccess: (res) => {
            if ((res?.data as any)?.success) {
               toast.success("Hero section updated successfully");
               onSuccess?.();
            }
         },
         onError: (err) => {
            toast.error((err?.error?.serverError as string) || "Failed to update hero section");
         },
      }
   );

   const isExecuting = createStatus === "executing" || updateStatus === "executing";

   const onSubmit = async (data: HeroSectionFormData) => {
      try {
         if (heroSection) {
            await executeUpdate({
               id: heroSection.id.toString(),
               ...data,
            });
         } else {
            await executeCreate(data);
         }
      } catch (error) {
         console.error("Form submission error:", error);
         toast.error("Something went wrong");
      }
   };

   const handleFileSelect = () => {
      if (selectedFiles.length > 0 && selectedImageIndex !== null) {
         const file = selectedFiles[0];
         form.setValue(`images.${selectedImageIndex}.src`, file.path);
         form.setValue(`images.${selectedImageIndex}.alt`, file.name);
         setFileManagerOpen(false);
         setSelectedFiles([]);
         setSelectedImageIndex(null);
      }
   };

   return (
      <>
         <FileManager
            open={fileManagerOpen}
            setOpen={setFileManagerOpen}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            onSelectCallBack={handleFileSelect}
            multiple={false}
         />

         <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg border">
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Title */}
                  <FormField
                     control={form.control}
                     name="title"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>
                              Title <span className="text-red-500">*</span>
                           </FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Hero section title"
                                 {...field}
                                 disabled={isExecuting}
                                 maxLength={200}
                              />
                           </FormControl>
                           <div className="text-xs text-gray-500">
                              {field.value?.length || 0}/200
                           </div>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Description */}
                  <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Description</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Optional description"
                                 {...field}
                                 disabled={isExecuting}
                                 rows={3}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* URL */}
                  <FormField
                     control={form.control}
                     name="buttonUrl"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Button URL</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="https://example.com"
                                 {...field}
                                 disabled={isExecuting}
                                 type="url"
                              />
                           </FormControl>
                           <p className="text-xs text-gray-500">Optional: Add a URL for the hero section button</p>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Button Name */}
                  <FormField
                     control={form.control}
                     name="buttonName"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Button Name</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="e.g., Learn More, Enroll Now"
                                 {...field}
                                 disabled={isExecuting}
                                 maxLength={20}
                              />
                           </FormControl>
                           <div className="text-xs text-gray-500">
                              {field.value?.length || 0}/20
                           </div>
                           <p className="text-xs text-gray-500">Optional: Button label text</p>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Images Section */}
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <FormLabel className="text-base font-semibold">
                           Carousel Images <span className="text-red-500">*</span>
                        </FormLabel>
                        <Button
                           type="button"
                           variant="outline"
                           size="sm"
                           onClick={() => append({ src: "", alt: "" })}
                           disabled={isExecuting}
                        >
                           <Plus className="h-4 w-4 mr-2" />
                           Add Image
                        </Button>
                     </div>

                     {/* 4 Column Grid Layout */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {fields.map((field, index) => {
                           const imageSrc = form.watch(`images.${index}.src`);
                           const imageAlt = form.watch(`images.${index}.alt`);
                           const hasImage = !!imageSrc;

                           return (
                              <div
                                 key={field.id}
                                 className="space-y-2"
                              >
                                 {/* Image Container - 16:9 Ratio */}
                                 <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors group">
                                    {/* Aspect Ratio Container (16:9) */}
                                    <div className="relative w-full pt-[56.25%]">
                                       {hasImage ? (
                                          <>
                                             <NextImage
                                                src={getImageUrl(imageSrc) || ""}
                                                alt={imageAlt || "Preview"}
                                                fill
                                                className="absolute inset-0 object-cover"
                                             />
                                             {/* Delete Button on Hover */}
                                             {fields.length > 1 && (
                                                <button
                                                   type="button"
                                                   onClick={() => remove(index)}
                                                   disabled={isExecuting}
                                                   className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                >
                                                   <Trash2 className="h-4 w-4" />
                                                </button>
                                             )}
                                          </>
                                       ) : (
                                          <button
                                             type="button"
                                             onClick={() => {
                                                setSelectedImageIndex(index);
                                                setFileManagerOpen(true);
                                             }}
                                             disabled={isExecuting}
                                             className="absolute inset-0 flex flex-col items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                                          >
                                             <Upload className="h-8 w-8 text-gray-400" />
                                             <span className="text-sm text-gray-500 font-medium">Upload</span>
                                          </button>
                                       )}
                                    </div>
                                 </div>

                                 {/* Alt Text Field - Only Show When Image Selected */}
                                 {hasImage && (
                                    <FormField
                                       control={form.control}
                                       name={`images.${index}.alt`}
                                       render={({ field }) => (
                                          <FormItem>
                                             <FormControl>
                                                <Input
                                                   placeholder="Alt text"
                                                   {...field}
                                                   disabled={isExecuting}
                                                   maxLength={100}
                                                   className="text-sm"
                                                />
                                             </FormControl>
                                             <div className="text-xs text-gray-500">
                                                {field.value?.length || 0}/100
                                             </div>
                                          </FormItem>
                                       )}
                                    />
                                 )}
                              </div>
                           );
                        })}
                     </div>

                     {form.formState.errors.images && (
                        <p className="text-sm text-red-500">
                           {form.formState.errors.images.message}
                        </p>
                     )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 justify-end pt-6 border-t">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={isExecuting}
                     >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                     </Button>
                     <Button
                        type="submit"
                        disabled={isExecuting}
                     >
                        {isExecuting ? "Saving..." : heroSection ? "Update" : "Create"}
                     </Button>
                  </div>
               </form>
            </Form>
         </div>
      </>
   );
}
