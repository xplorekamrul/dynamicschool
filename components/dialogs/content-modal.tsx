"use client";

import { getPageContent } from "@/actions/admin/get-page-content";
import { saveContent } from "@/actions/admin/save-content";
import { Editor } from "@/components/blocks/editor-00/editor";
import FileManager from "@/components/file-manager/file-manager";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileItem } from "@/types/file-manager";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { SerializedEditorState } from "lexical";
import { ChevronDown, ChevronUp, Edit, Image as ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface LexicalNode {
   type?: string;
   tag?: string | number;
   text?: string;
   format?: number;
   listType?: string;
   children?: LexicalNode[];
}

const contentSchema = z.object({
   title: z.string().min(1, "Title is required"),
   subtitle: z.string().optional(),
   img_src: z.string().optional(),
   img_alt: z.string().optional(),
});

type ContentFormData = z.infer<typeof contentSchema>;

interface ContentModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   pageId: string;
   pageTitle: string;
}

const initialEditorValue = {
   root: {
      children: [
         {
            children: [],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
         },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
   },
} as unknown as SerializedEditorState;

interface Section {
   id: string;
   title: string;
   body: SerializedEditorState;
   isExpanded: boolean;
}

const generateId = () => `section-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

export default function ContentModal({ open, onOpenChange, pageId, pageTitle }: ContentModalProps) {
   const queryClient = useQueryClient();
   const [sections, setSections] = useState<Section[]>([]);
   const [contentId, setContentId] = useState<string | null>(null);
   const [isEditing, setIsEditing] = useState(false);
   const [hasContent, setHasContent] = useState(false);
   const [fileManagerOpen, setFileManagerOpen] = useState(false);
   const [selectedFiles, setSelectedFiles] = useState<Array<Pick<FileItem, "name" | "path">>>([]);

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      setValue,
      watch,
   } = useForm<ContentFormData>({
      resolver: zodResolver(contentSchema),
   });

   const imgSrc = watch("img_src");

   const { execute: executeLoad, isExecuting: isLoading } = useAction(getPageContent, {
      onSuccess: ({ data }) => {
         if (data?.content) {
            setContentId(data.content.id);
            setHasContent(true);
            setValue("title", data.content.title);
            setValue("subtitle", data.content.subtitle || "");
            setValue("img_src", data.content.img_src || "");
            setValue("img_alt", data.content.img_alt || "");

            if (data.content.body) {
               try {
                  const parsedSections = JSON.parse(data.content.body);
                  setSections(
                     Array.isArray(parsedSections)
                        ? parsedSections.map((s: Section) => ({ ...s, isExpanded: true }))
                        : []
                  );
               } catch {
                  setSections([]);
               }
            }
         } else {
            setHasContent(false);
            setIsEditing(true);
         }
      },
   });

   const { execute: executeSave, isExecuting: isSaving } = useAction(saveContent, {
      onSuccess: ({ data }) => {
         if (data?.success) {
            toast.success(contentId ? "Content updated successfully" : "Content created successfully");
            setContentId(data.content.id);
            setHasContent(true);
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ["admin-pages"] });
            executeLoad({ pageId });
         }
      },
      onError: ({ error }) => {
         toast.error(error.serverError || "Failed to save content");
      },
   });

   useEffect(() => {
      if (open) {
         executeLoad({ pageId });
         setIsEditing(false);
      } else {
         reset();
         setSections([]);
         setContentId(null);
         setHasContent(false);
         setIsEditing(false);
      }
   }, [open, pageId, executeLoad, reset]);

   const addSection = () => {
      const newSection: Section = {
         id: generateId(),
         title: "",
         body: initialEditorValue,
         isExpanded: true,
      };
      setSections([...sections, newSection]);
   };

   const updateSection = (id: string, updates: Partial<Section>) => {
      setSections(sections.map((s) => (s.id === id ? { ...s, ...updates } : s)));
   };

   const deleteSection = (id: string) => {
      setSections(sections.filter((s) => s.id !== id));
   };

   const toggleSectionExpand = (id: string) => {
      setSections(
         sections.map((s) =>
            s.id === id ? { ...s, isExpanded: !s.isExpanded } : { ...s, isExpanded: false }
         )
      );
   };

   const onSubmit = (data: ContentFormData) => {
      if (sections.length === 0) {
         toast.error("Add at least one section");
         return;
      }

      if (sections.some((s) => !s.title.trim())) {
         toast.error("All sections must have a title");
         return;
      }

      const body = JSON.stringify(sections);
      executeSave({
         pageId,
         contentId: contentId || undefined,
         title: data.title,
         subtitle: data.subtitle || undefined,
         body,
         img_src: data.img_src || undefined,
         img_alt: data.img_alt || undefined,
      });
   };

   const handleFileSelect = () => {
      if (selectedFiles.length > 0) {
         const file = selectedFiles[0];
         setValue("img_src", file.path);
         const altText = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
         setValue("img_alt", altText);
      }
      setFileManagerOpen(false);
   };

   return (
      <>
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[90%]! max-h-[90vh] flex flex-col p-0 rounded-md">
               <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
                  <div className="flex items-center justify-between pr-8">
                     <DialogTitle>Content for: {pageTitle}</DialogTitle>
                     {hasContent && !isEditing && (
                        <Button
                           size="sm"
                           variant="outline"
                           onClick={() => setIsEditing(true)}
                        >
                           <Edit className="h-4 w-4 mr-2" />
                           Edit
                        </Button>
                     )}
                  </div>
               </DialogHeader>

               <div className="flex-1 overflow-y-auto px-6 py-4 pb-20 rounded-md">
                  {isLoading ? (
                     <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                     </div>
                  ) : hasContent && !isEditing ? (
                     <div className="flex gap-6">
                        {/* Left Side - Content */}
                        <div className="flex-1 space-y-4">
                           <div className="bg-white rounded-lg border p-4">
                              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</Label>
                              <p className="text-lg font-semibold text-gray-900 mt-2">{watch("title")}</p>
                           </div>

                           {watch("subtitle") && (
                              <div className="bg-white rounded-lg border p-4">
                                 <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Subtitle</Label>
                                 <p className="text-gray-900 mt-2">{watch("subtitle")}</p>
                              </div>
                           )}

                           <div className="bg-white rounded-lg border p-4">
                              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Body Content</Label>
                              <div className="space-y-4">
                                 {sections.map((section) => (
                                    <div key={section.id} className="border-l-4 border-emerald-500 pl-4">
                                       <h3 className="font-semibold text-gray-900 mb-2">{section.title}</h3>
                                       <div
                                          className="prose prose-sm max-w-none text-gray-700"
                                          dangerouslySetInnerHTML={{
                                             __html: (() => {
                                                try {
                                                   const content = section.body.root.children
                                                      .map((node: LexicalNode) => {
                                                         if (node.type === 'paragraph') {
                                                            const html = node.children?.map((child: LexicalNode) => {
                                                               let text = child.text || '';
                                                               if (!text) return '';
                                                               if (child.format && child.format & 1) text = `<strong>${text}</strong>`;
                                                               if (child.format && child.format & 2) text = `<em>${text}</em>`;
                                                               if (child.format && child.format & 4) text = `<u>${text}</u>`;
                                                               if (child.format && child.format & 8) text = `<s>${text}</s>`;
                                                               return text;
                                                            }).join('') || '';
                                                            return html ? `<p>${html}</p>` : '';
                                                         }
                                                         if (node.type === 'heading') {
                                                            const level = node.tag || 'h2';
                                                            const text = node.children?.map((child: LexicalNode) => child.text || '').join('') || '';
                                                            return text ? `<${level}>${text}</${level}>` : '';
                                                         }
                                                         if (node.type === 'list') {
                                                            const tag = node.listType === 'number' ? 'ol' : 'ul';
                                                            const items = node.children?.map((item: LexicalNode) => {
                                                               const text = item.children?.map((child: LexicalNode) => child.text || '').join('') || '';
                                                               return `<li>${text}</li>`;
                                                            }).join('') || '';
                                                            return `<${tag}>${items}</${tag}>`;
                                                         }
                                                         return '';
                                                      })
                                                      .join('');
                                                   return content || '<p class="text-gray-400 italic">No content</p>';
                                                } catch {
                                                   return '<p class="text-gray-400 italic">No content</p>';
                                                }
                                             })()
                                          }}
                                       />
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* Right Side - Image */}
                        {imgSrc && (
                           <div className="flex-shrink-0">
                              <div className="bg-white rounded-lg border p-4">
                                 <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">Image</Label>
                                 <a
                                    href={`/images/${imgSrc}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-20 h-20 border rounded-lg overflow-hidden bg-gray-100 hover:ring-2 hover:ring-emerald-500 transition-all cursor-pointer"
                                    title="Click to open in new tab"
                                 >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                       src={`/images/${imgSrc}`}
                                       alt={watch("img_alt") || "Content image"}
                                       className="w-full h-full object-cover"
                                       onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                          const parent = e.currentTarget.parentElement;
                                          if (parent) {
                                             parent.innerHTML = '<div class="flex items-center justify-center w-full h-full text-gray-400"><svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>';
                                          }
                                       }}
                                    />
                                 </a>
                              </div>
                           </div>
                        )}
                     </div>
                  ) : (
                     <div className="flex flex-col h-full">
                        {/* Main Content Grid */}
                        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                           {/* Left Side - Main Content (9 cols) */}
                           <div className="col-span-9 flex flex-col min-h-0">
                              <div className="flex-1 overflow-y-auto pr-4 space-y-4">
                                 <div>
                                    <Label htmlFor="title">Title *</Label>
                                    <Input id="title" {...register("title")} placeholder="Enter title" />
                                    {errors.title && (
                                       <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                                    )}
                                 </div>

                                 <div>
                                    <Label htmlFor="subtitle">Subtitle</Label>
                                    <Input id="subtitle" {...register("subtitle")} placeholder="Enter subtitle (optional)" />
                                 </div>

                                 <div>
                                    <Label className="text-sm font-semibold mb-3 block">Body Content - Sections</Label>
                                    <div className="space-y-4 mb-4">
                                       {sections.map((section, index) => (
                                          <div key={section.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                             {/* Section Header */}
                                             <div className="flex items-center justify-between p-4 bg-gray-50 border-b hover:bg-gray-100 transition-colors">
                                                <div className="flex items-center gap-3 flex-1">
                                                   <button
                                                      onClick={() => toggleSectionExpand(section.id)}
                                                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                   >
                                                      {section.isExpanded ? (
                                                         <ChevronUp className="h-5 w-5 text-gray-600" />
                                                      ) : (
                                                         <ChevronDown className="h-5 w-5 text-gray-600" />
                                                      )}
                                                   </button>
                                                   <span className="text-sm font-medium text-gray-500">Section {index + 1}</span>
                                                </div>
                                                <button
                                                   onClick={() => deleteSection(section.id)}
                                                   className="p-1 hover:bg-red-100 rounded transition-colors"
                                                   title="Delete section"
                                                >
                                                   <Trash2 className="h-5 w-5 text-red-600" />
                                                </button>
                                             </div>

                                             {/* Section Content */}
                                             {section.isExpanded && (
                                                <div className="p-4 space-y-4">
                                                   <div>
                                                      <Label htmlFor={`title-${section.id}`} className="text-sm font-semibold">
                                                         Section Title *
                                                      </Label>
                                                      <Input
                                                         id={`title-${section.id}`}
                                                         value={section.title}
                                                         onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                                         placeholder="Enter section title"
                                                         className="mt-1"
                                                      />
                                                   </div>

                                                   <div>
                                                      <Label className="text-sm font-semibold mb-2 block">Section Content</Label>
                                                      <div className="border rounded-lg">
                                                         <Editor
                                                            editorSerializedState={section.body}
                                                            onSerializedChange={(newState) =>
                                                               updateSection(section.id, { body: newState })
                                                            }
                                                         />
                                                      </div>
                                                   </div>
                                                </div>
                                             )}
                                          </div>
                                       ))}
                                    </div>

                                    {/* Add Section Button */}
                                    <button
                                       onClick={addSection}
                                       className="w-full py-3 border-2 border-dashed border-emerald-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 text-emerald-600 font-medium"
                                    >
                                       <Plus className="h-5 w-5" />
                                       Add New Section
                                    </button>
                                 </div>
                              </div>


                           </div>

                           {/* Right Side - Image Settings (3 cols) */}
                           <div className="col-span-3 border-l pl-6">
                              <div className="sticky top-0 space-y-4">
                                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <Label className="text-sm font-semibold text-gray-700 mb-3 block">Image Settings</Label>

                                    <div className="space-y-2">
                                       <div>
                                          <Label htmlFor="img_src" className="text-xs text-gray-600 mb-1.5 block">Image Path</Label>
                                          <div className="flex flex-col gap-2">
                                             <Input
                                                id="img_src"
                                                {...register("img_src")}
                                                placeholder="Select an image"
                                                readOnly
                                                className="bg-white text-sm"
                                             />
                                             <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setFileManagerOpen(true)}
                                                className="w-full"
                                             >
                                                <ImageIcon className="h-4 w-4 mr-2" />
                                                Browse Images
                                             </Button>
                                          </div>
                                       </div>

                                       {imgSrc && (
                                          <div>
                                             <Label htmlFor="img_alt" className="text-xs text-gray-600 mb-1.5 block">Alt Text</Label>
                                             <Input
                                                id="img_alt"
                                                {...register("img_alt")}
                                                placeholder="Describe the image"
                                                className="bg-white text-sm"
                                             />
                                          </div>
                                       )}
                                    </div>

                                    {imgSrc && (
                                       <div className="mt-2 pt-2 border-t border-gray-200">
                                          <Label className="text-xs text-gray-600 mb-2 block">Preview</Label>
                                          <div className="space-y-3">
                                             <div className="w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-300 bg-white shadow-sm">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                   src={`/images/${imgSrc}`}
                                                   alt={watch("img_alt") || "Preview"}
                                                   className="w-full h-full object-cover"
                                                   onError={(e) => {
                                                      e.currentTarget.style.display = 'none';
                                                      const parent = e.currentTarget.parentElement;
                                                      if (parent) {
                                                         parent.innerHTML = '<div class="flex items-center justify-center w-full h-full text-gray-400"><svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>';
                                                      }
                                                   }}
                                                />
                                             </div>
                                             <div className="text-xs text-gray-500 space-y-1 flex gap-2">
                                                <p className="font-medium text-gray-700">File: {imgSrc.split('/').pop()}</p>
                                                <p>Alt: {watch("img_alt") || "Not set"}</p>
                                             </div>
                                          </div>
                                       </div>
                                    )}

                                    {/* right Side Footer - Action Buttons */}
                                    <div className="fixed bottom-0 left-0 right-0 bg-muted border-t border-primary px-6 py-3 flex items-center justify-end gap-2 z-50 rounded-b-md">
                                       {hasContent && (
                                          <Button
                                             type="button"
                                             size="sm"
                                             variant="outline"
                                             onClick={() => setIsEditing(false)}
                                          >
                                             Cancel
                                          </Button>
                                       )}
                                       <Button
                                          type="button"
                                          size="sm"
                                          disabled={isSaving}
                                          onClick={handleSubmit(onSubmit)}
                                       >
                                          {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                          {contentId ? "Update" : "Save"}
                                       </Button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
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
