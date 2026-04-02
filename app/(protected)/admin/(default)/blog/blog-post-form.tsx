"use client";

import { createBlogPost, updateBlogPost } from "@/actions/admin/blog";
import { getBlogCategories } from "@/actions/admin/blog/blog-category";
import { Editor } from "@/components/blocks/editor-00/editor";
import FileManager from "@/components/file-manager/file-manager";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { getImageUrl } from "@/lib/shared/image-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SerializedEditorState } from "lexical";
import { Plus, Upload, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { BlogCategoryDialog } from "./blog-category-dialog";

const BlogPostSchema = z.object({
   categoryId: z.string().min(1, "Category is required"),
   title: z.string().min(1, "Title is required").max(100),
   slug: z.string().min(1, "Slug is required").max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
   content: z.string().min(1, "Content is required"),
   ImgSrc: z.string().min(1, "Image is required"),
   ImgAlt: z.string().max(50).optional().or(z.literal("")),
   isPublished: z.boolean().optional(),
});

type BlogPostFormData = z.infer<typeof BlogPostSchema>;

// Improved slug generation function
const generateSlug = (title: string): string => {
   return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

interface BlogPostFormProps {
   categories: Array<{ id: bigint; name: string }>;
   post?: {
      id: bigint;
      categoryId: bigint;
      title: string;
      slug: string;
      content: string;
      ImgSrc: string;
      ImgAlt: string | null;
      isPublished: boolean;
   } | null;
   onSuccess?: () => void;
}

export function BlogPostForm({
   categories,
   post,
   onSuccess,
}: BlogPostFormProps) {
   const form = useForm<BlogPostFormData>({
      resolver: zodResolver(BlogPostSchema),
      defaultValues: {
         categoryId: post?.categoryId.toString() || "",
         title: post?.title || "",
         slug: post?.slug || "",
         content: post?.content || "",
         ImgSrc: post?.ImgSrc || "",
         ImgAlt: post?.ImgAlt || "",
         isPublished: post?.isPublished || false,
      },
   });

   const [fileManagerOpen, setFileManagerOpen] = useState(false);
   const [selectedImageField, setSelectedImageField] = useState<
      "ImgSrc" | null
   >(null);
   const [selectedFiles, setSelectedFiles] = useState<
      Array<{ name: string; path: string }>
   >([]);
   const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
   const [categoryList, setCategoryList] = useState(categories);
   const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

   // Parse editor content - handle both JSON and plain text
   const parseEditorContent = (content: string | undefined): SerializedEditorState | undefined => {
      if (!content) return undefined;
      try {
         const parsed = JSON.parse(content);
         // Check if it's valid Lexical JSON (has root property)
         if (parsed?.root) {
            return parsed;
         }
      } catch {
         // If parsing fails, it's plain text - convert to Lexical format
      }
      // Return undefined for plain text - will use default empty editor
      return undefined;
   };

   const [editorContent, setEditorContent] = useState<SerializedEditorState | undefined>(
      parseEditorContent(post?.content)
   );

   const { executeAsync: handleCreate, isExecuting: isCreating } =
      useAction(createBlogPost);
   const { executeAsync: handleUpdate, isExecuting: isUpdating } =
      useAction(updateBlogPost);

   const isExecuting = isCreating || isUpdating;

   // Load related pages when editing
   useEffect(() => {
      if (post?.id) {
         // No related pages functionality needed
      }
   }, [post?.id]);

   // Auto-generate slug from title - only if not manually edited
   const titleValue = form.watch("title");
   useEffect(() => {
      if (titleValue && !slugManuallyEdited && !post) {
         // Only auto-generate for new posts if slug hasn't been manually edited
         const newSlug = generateSlug(titleValue);
         form.setValue("slug", newSlug, { shouldValidate: false });
      }
   }, [titleValue, slugManuallyEdited, post, form]);

   const handleCategoryDialogOpenChange = async (open: boolean) => {
      setCategoryDialogOpen(open);
      if (!open) {
         // Refresh categories when dialog closes
         try {
            const result = await getBlogCategories();
            const updatedCategories = result?.data || [];
            setCategoryList(updatedCategories as any);
         } catch (error) {
            console.error("Failed to refresh categories:", error);
         }
      }
   };

   const onSubmit = async (data: BlogPostFormData) => {
      try {
         const submitData = {
            categoryId: BigInt(data.categoryId),
            title: data.title,
            content: JSON.stringify(editorContent),
            ImgSrc: data.ImgSrc,
            ImgAlt: data.ImgAlt || "",
            isPublished: data.isPublished,
         };

         let blogPostId: bigint | null = null;

         if (post) {
            const result = await handleUpdate({
               id: post.id,
               ...submitData,
            });
            if ((result?.data as any)?.success) {
               blogPostId = post.id;
               toast.success("News & Events post updated successfully");
            } else if (result?.serverError) {
               toast.error(result.serverError as string);
               return;
            } else if (result?.validationErrors) {
               toast.error("Validation error: " + JSON.stringify(result.validationErrors));
               return;
            }
         } else {
            const result = await handleCreate(submitData);
            if ((result?.data as any)?.success) {
               blogPostId = (result.data as any).post.id;
               toast.success("News & Events post created successfully");
               form.reset();
               setEditorContent(undefined);
            } else if (result?.serverError) {
               toast.error(result.serverError as string);
               return;
            } else if (result?.validationErrors) {
               toast.error("Validation error: " + JSON.stringify(result.validationErrors));
               return;
            }
         }

         onSuccess?.();
      } catch (error) {
         console.error("Form submission error:", error);
         toast.error("Something went wrong");
      }
   };

   const handleFileSelect = () => {
      if (selectedFiles.length > 0 && selectedImageField) {
         const file = selectedFiles[0];
         form.setValue(selectedImageField, file.path);
         form.setValue("ImgAlt", file.name);
         setFileManagerOpen(false);
         setSelectedFiles([]);
         setSelectedImageField(null);
      }
   };

   const removeImage = () => {
      form.setValue("ImgSrc", "");
      form.setValue("ImgAlt", "");
   };

   const imgSrc = form.watch("ImgSrc");
   const imgAlt = form.watch("ImgAlt");
   const title = form.watch("title");

   return (
      <>
         <Card className="w-full max-w-[98%] mx-auto p-6">
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-12 gap-6">
                     {/* Left Column - 8 cols */}
                     <div className="col-span-7 space-y-6">
                        {/* Row 1: Category, Status */}
                        <div className="grid grid-cols-2 gap-4 items-end">
                           <FormField
                              control={form.control}
                              name="categoryId"
                              render={({ field }) => (
                                 <FormItem>
                                    <div className="flex items-center gap-x-2">
                                       <FormLabel className="whitespace-nowrap">
                                          Category <span className="text-red-500">*</span>
                                       </FormLabel>

                                    </div>
                                    <div className="flex items-center gap-x-2">

                                       <Select
                                          value={field.value}
                                          onValueChange={field.onChange}
                                          disabled={isExecuting}
                                       >
                                          <FormControl>
                                             <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                             </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                             {categoryList.map((cat) => (
                                                <SelectItem
                                                   key={cat.id.toString()}
                                                   value={cat.id.toString()}
                                                >
                                                   {cat.name}
                                                </SelectItem>
                                             ))}
                                          </SelectContent>
                                       </Select>

                                       <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setCategoryDialogOpen(true)}
                                          className="gap-1  p-2 bg-primary hover:bg-primary/70 text-white hover:text-white"
                                       >
                                          <Plus className="h-3 w-3" />
                                       </Button>
                                    </div>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           <FormField
                              control={form.control}
                              name="isPublished"
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                       value={field.value ? "published" : "draft"}
                                       onValueChange={(value) =>
                                          field.onChange(value === "published")
                                       }
                                       disabled={isExecuting}
                                    >
                                       <FormControl>
                                          <SelectTrigger>
                                             <SelectValue placeholder="Draft" />
                                          </SelectTrigger>
                                       </FormControl>
                                       <SelectContent>
                                          <SelectItem value="draft">Draft</SelectItem>
                                          <SelectItem value="published">Published</SelectItem>
                                       </SelectContent>
                                    </Select>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>

                        {/* Row 2: Title */}
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
                                       {...field}
                                       placeholder="Enter News & Events  title"
                                       disabled={isExecuting}
                                    />
                                 </FormControl>
                                 <p className="text-xs text-gray-500 mt-1">
                                    {title?.length || 0} / 100 characters
                                 </p>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* Row 3: Slug */}
                        <FormField
                           control={form.control}
                           name="slug"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>
                                    Slug <span className="text-red-500">*</span>
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       {...field}
                                       placeholder="Auto-generated from title"
                                       disabled={isExecuting}
                                       className="lowercase"
                                       onChange={(e) => {
                                          field.onChange(e);
                                          setSlugManuallyEdited(true);
                                       }}
                                    />
                                 </FormControl>
                                 <p className="text-xs text-gray-500 mt-1">
                                    Auto-generated from title • Editable • Max 100 characters
                                 </p>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />



                     </div>

                     {/* Right Column - 4 cols */}
                     <div className="col-span-5 space-y-6">
                        {/* Image */}
                        <div className="space-y-2">
                           <FormLabel>
                              Image <span className="text-red-500">*</span>
                           </FormLabel>
                           {imgSrc && (
                              (() => {
                                 const imageUrl = getImageUrl(imgSrc);
                                 if (!imageUrl) return null;
                                 return (
                                    <div className="grid grid-cols-6 gap-2 ">
                                       <div className="relative w-full h-28 border rounded-lg overflow-hidden col-span-3">
                                          <NextImage
                                             src={imageUrl}
                                             alt={(imgAlt || "Preview")}
                                             fill
                                             className="object-cover"
                                          />
                                          <Button
                                             type="button"
                                             variant="destructive"
                                             size="sm"
                                             className="absolute top-1 right-1"
                                             onClick={() => removeImage()}
                                          >
                                             <X className="h-3 w-3" />
                                          </Button>
                                       </div>
                                       <div className="col-span-3">
                                          <FormField
                                             control={form.control}
                                             name="ImgAlt"
                                             render={({ field }) => (
                                                <FormItem>
                                                   <FormLabel className="text-xs">Alt Text</FormLabel>
                                                   <FormControl>
                                                      <Input
                                                         {...field}
                                                         placeholder="Image alt text"
                                                         disabled={isExecuting}
                                                      />
                                                   </FormControl>
                                                   <p className="text-xs text-gray-500 mt-1">
                                                      {imgAlt?.length || 0} / 50 characters
                                                   </p>
                                                   <FormMessage />
                                                </FormItem>
                                             )}
                                          />
                                       </div>
                                    </div>
                                 );
                              })()
                           )}
                           {!imgSrc && (
                              <Button
                                 type="button"
                                 variant="outline"
                                 className="w-full gap-2"
                                 onClick={() => {
                                    setSelectedImageField("ImgSrc");
                                    setFileManagerOpen(true);
                                 }}
                                 disabled={isExecuting}
                              >
                                 <Upload className="h-4 w-4" />
                                 Upload Image
                              </Button>
                           )}
                        </div>
                     </div>

                     {/* Row 3: Content */}
                     <div className="col-span-12">
                        <FormField
                           control={form.control}
                           name="content"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>
                                    Content <span className="text-red-500">*</span>
                                 </FormLabel>
                                 <FormControl>
                                    <div className="min-h-[300px]">
                                       <Editor
                                          editorSerializedState={editorContent}
                                          onSerializedChange={(state: SerializedEditorState) => {
                                             setEditorContent(state);
                                             field.onChange(JSON.stringify(state));
                                          }}
                                       />
                                    </div>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end gap-2 pt-4 border-t">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => onSuccess?.()}
                        disabled={isExecuting}
                     >
                        Cancel
                     </Button>
                     <Button type="submit" disabled={isExecuting}>
                        {isExecuting ? "Saving..." : "Save Post"}
                     </Button>
                  </div>
               </form>
            </Form>
         </Card>

         <FileManager
            open={fileManagerOpen}
            setOpen={setFileManagerOpen}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            onSelectCallBack={handleFileSelect}
            multiple={false}
         />

         <BlogCategoryDialog
            open={categoryDialogOpen}
            onOpenChange={handleCategoryDialogOpenChange}
            category={null}
         />
      </>
   );
}
