"use client";

import FileManager from "@/components/file-manager/file-manager";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileItem } from "@/types/file-manager";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getPageSeoContent } from "../../actions/admin/get-page-seo-content";
import { saveSeoContent } from "../../actions/admin/save-seo-content";

const seoContentSchema = z.object({
   title: z.string().optional(),
   description: z.string().optional(),
   keywords: z.string().optional(),
   canonical_url: z.string().optional(),
   ogTitle: z.string().optional(),
   ogImg: z.string().optional(),
   schema: z.string().optional(),
});

type SeoContentFormData = z.infer<typeof seoContentSchema>;

interface SeoContentModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   pageId: string;
   pageTitle: string;
}

export default function SeoContentModal({ open, onOpenChange, pageId, pageTitle }: SeoContentModalProps) {
   const [seoContentId, setSeoContentId] = useState<string | null>(null);
   const [fileManagerOpen, setFileManagerOpen] = useState(false);
   const [selectedFiles, setSelectedFiles] = useState<Array<Pick<FileItem, "name" | "path">>>([]);

   const {
      register,
      handleSubmit,
      reset,
      setValue,
      watch,
   } = useForm<SeoContentFormData>({
      resolver: zodResolver(seoContentSchema),
   });

   const ogImg = watch("ogImg");

   const { execute: executeLoad, isExecuting: isLoading } = useAction(getPageSeoContent, {
      onSuccess: ({ data }: {
         data?: {
            seoContent?: {
               id: string;
               title: string | null;
               description: string | null;
               keywords: string | null;
               canonical_url: string | null;
               ogTitle: string | null;
               ogImg: string | null;
               schema: unknown;
            } | null
         }
      }) => {
         if (data?.seoContent) {
            setSeoContentId(data.seoContent.id);
            setValue("title", data.seoContent.title || "");
            setValue("description", data.seoContent.description || "");
            setValue("keywords", data.seoContent.keywords || "");
            setValue("canonical_url", data.seoContent.canonical_url || "");
            setValue("ogTitle", data.seoContent.ogTitle || "");
            setValue("ogImg", data.seoContent.ogImg || "");
            setValue("schema", data.seoContent.schema ? JSON.stringify(data.seoContent.schema, null, 2) : "");
         }
      },
   });

   const { execute: executeSave, isExecuting: isSaving } = useAction(saveSeoContent, {
      onSuccess: ({ data }: { data?: { success?: boolean; seoContent?: { id: string } } }) => {
         if (data?.success) {
            toast.success(seoContentId ? "SEO content updated successfully" : "SEO content created successfully");
            setSeoContentId(data.seoContent?.id || null);
            executeLoad({ pageId });
         }
      },
      onError: ({ error }: { error: { serverError?: string } }) => {
         toast.error(error.serverError || "Failed to save SEO content");
      },
   });

   useEffect(() => {
      if (open) {
         executeLoad({ pageId });
      } else {
         reset();
         setSeoContentId(null);
      }
   }, [open, pageId, executeLoad, reset]);

   const onSubmit = (data: SeoContentFormData) => {
      let parsedSchema = null;
      if (data.schema) {
         try {
            parsedSchema = JSON.parse(data.schema);
         } catch {
            toast.error("Invalid JSON in schema field");
            return;
         }
      }

      executeSave({
         pageId,
         seoContentId: seoContentId || undefined,
         title: data.title || undefined,
         description: data.description || undefined,
         keywords: data.keywords || undefined,
         canonical_url: data.canonical_url || undefined,
         ogTitle: data.ogTitle || undefined,
         ogImg: data.ogImg || undefined,
         schema: parsedSchema,
      });
   };

   const handleFileSelect = () => {
      if (selectedFiles.length > 0) {
         const file = selectedFiles[0];
         setValue("ogImg", file.path);
      }
      setFileManagerOpen(false);
   };

   return (
      <>
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl! max-h-[90vh] flex flex-col p-0">
               <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
                  <DialogTitle>SEO Content for: {pageTitle}</DialogTitle>
               </DialogHeader>

               <div className="flex-1 overflow-y-auto px-6 py-4">
                  {isLoading ? (
                     <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                     </div>
                  ) : (
                     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                           <Label htmlFor="seo-title">Meta Title</Label>
                           <Input
                              id="seo-title"
                              {...register("title")}
                              placeholder="Enter meta title"
                           />
                        </div>

                        <div>
                           <Label htmlFor="seo-description">Meta Description</Label>
                           <Textarea
                              id="seo-description"
                              {...register("description")}
                              placeholder="Enter meta description"
                              rows={3}
                           />
                        </div>

                        <div>
                           <Label htmlFor="seo-keywords">Keywords</Label>
                           <Input
                              id="seo-keywords"
                              {...register("keywords")}
                              placeholder="keyword1, keyword2, keyword3"
                           />
                        </div>

                        <div>
                           <Label htmlFor="seo-canonical">Canonical URL</Label>
                           <Input
                              id="seo-canonical"
                              {...register("canonical_url")}
                              placeholder="https://example.com/page"
                           />
                        </div>

                        <div className="border-t pt-4 mt-4">
                           <h3 className="text-sm font-semibold text-gray-700 mb-3">Open Graph (Social Media)</h3>

                           <div className="space-y-4">
                              <div>
                                 <Label htmlFor="seo-og-title">OG Title</Label>
                                 <Input
                                    id="seo-og-title"
                                    {...register("ogTitle")}
                                    placeholder="Title for social media sharing"
                                 />
                              </div>

                              <div>
                                 <Label htmlFor="seo-og-img">OG Image</Label>
                                 <div className="flex gap-2">
                                    <Input
                                       id="seo-og-img"
                                       {...register("ogImg")}
                                       placeholder="Select an image"
                                       readOnly
                                       className="flex-1"
                                    />
                                    <Button
                                       type="button"
                                       variant="outline"
                                       onClick={() => setFileManagerOpen(true)}
                                    >
                                       <ImageIcon className="h-4 w-4 mr-2" />
                                       Browse
                                    </Button>
                                 </div>
                                 {ogImg && (
                                    <div className="mt-2 flex items-center gap-2">
                                       <div className="w-12 h-12 rounded border bg-gray-100 overflow-hidden">
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                             src={`/images/${ogImg}`}
                                             alt="OG Preview"
                                             className="w-full h-full object-cover"
                                             onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                             }}
                                          />
                                       </div>
                                       <span className="text-xs text-gray-500">{ogImg.split("/").pop()}</span>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="border-t pt-4 mt-4">
                           <h3 className="text-sm font-semibold text-gray-700 mb-3">Schema.org JSON-LD</h3>
                           <div>
                              <Label htmlFor="seo-schema">Schema JSON</Label>
                              <Textarea
                                 id="seo-schema"
                                 {...register("schema")}
                                 placeholder='{"@context": "https://schema.org", "@type": "WebPage"}'
                                 rows={6}
                                 className="font-mono text-xs"
                              />
                              <p className="text-xs text-gray-500 mt-1">Enter valid JSON for structured data</p>
                           </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                           <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                              Cancel
                           </Button>
                           <Button type="submit" disabled={isSaving}>
                              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                              {seoContentId ? "Update" : "Save"}
                           </Button>
                        </div>
                     </form>
                  )}
               </div>
            </DialogContent>
         </Dialog>

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
