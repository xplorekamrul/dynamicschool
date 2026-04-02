"use client";

import { Editor } from "@/components/blocks/editor-00/editor";
import FileManager from "@/components/file-manager/file-manager";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileItem } from "@/types/file-manager";
import { SerializedEditorState } from "lexical";
import { ChevronDown, ChevronUp, Image as ImageIcon, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Content = {
   id: string;
   title: string;
   subtitle: string | null;
   body: string | null;
   img_src: string | null;
   img_alt: string | null;
   page: {
      title: string;
   };
};

interface EditContentModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   content: Content | null;
   onSave: (data: {
      contentId: string;
      title: string;
      subtitle?: string;
      body?: string;
      img_src?: string;
      img_alt?: string;
   }) => void;
   isSaving: boolean;
}

interface Section {
   id: string;
   title: string;
   body: SerializedEditorState;
   isExpanded: boolean;
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

const generateId = () => `section-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

export default function EditContentModal({
   open,
   onOpenChange,
   content,
   onSave,
   isSaving,
}: EditContentModalProps) {
   const [title, setTitle] = useState("");
   const [subtitle, setSubtitle] = useState("");
   const [imgSrc, setImgSrc] = useState("");
   const [imgAlt, setImgAlt] = useState("");
   const [sections, setSections] = useState<Section[]>([]);
   const [fileManagerOpen, setFileManagerOpen] = useState(false);
   const [selectedFiles, setSelectedFiles] = useState<Array<Pick<FileItem, "name" | "path">>>([]);

   useEffect(() => {
      if (content && open) {
         setTitle(content.title);
         setSubtitle(content.subtitle || "");
         setImgSrc(content.img_src || "");
         setImgAlt(content.img_alt || "");

         if (content.body) {
            try {
               const parsed = JSON.parse(content.body);
               if (Array.isArray(parsed)) {
                  setSections(parsed.map((s: Section) => ({ ...s, isExpanded: true })));
               } else {
                  setSections([]);
               }
            } catch (error) {
               console.error("Failed to parse sections:", error);
               setSections([]);
            }
         } else {
            setSections([]);
         }
      }
   }, [content, open]);

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

   const handleFileSelect = () => {
      if (selectedFiles.length > 0) {
         const file = selectedFiles[0];
         setImgSrc(file.path);
         const altText = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
         setImgAlt(altText);
      }
      setFileManagerOpen(false);
   };

   const handleSave = () => {
      if (!content || !title.trim()) {
         return;
      }

      if (sections.length === 0) {
         return;
      }

      if (sections.some((s) => !s.title.trim())) {
         return;
      }

      onSave({
         contentId: content.id,
         title,
         subtitle: subtitle || undefined,
         body: JSON.stringify(sections),
         img_src: imgSrc || undefined,
         img_alt: imgAlt || undefined,
      });
   };

   if (!content) return null;

   return (
      <>
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[90%]! max-h-[98vh] flex flex-col p-0 rounded-md">
               <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
                  <DialogTitle>Edit Content - {content.page.title}</DialogTitle>
               </DialogHeader>

               <div className="flex-1 overflow-y-auto px-6 py-4 pb-20">
                  <div className="grid grid-cols-12 gap-6">
                     {/* Left Side - Main Content (9 cols) */}
                     <div className="col-span-9 space-y-4">
                        <div>
                           <Label htmlFor="edit-title">Title *</Label>
                           <Input
                              id="edit-title"
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              placeholder="Enter title"
                           />
                        </div>

                        <div>
                           <Label htmlFor="edit-subtitle">Subtitle</Label>
                           <Input
                              id="edit-subtitle"
                              value={subtitle}
                              onChange={(e) => setSubtitle(e.target.value)}
                              placeholder="Enter subtitle (optional)"
                           />
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

                     {/* Right Side - Image Settings (3 cols) */}
                     <div className="col-span-3 border-l pl-6">
                        <div className="sticky top-0 space-y-4">
                           <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <Label className="text-sm font-semibold text-gray-700 mb-3 block">Image Settings</Label>

                              <div className="space-y-2">
                                 <div>
                                    <Label htmlFor="edit-img-src" className="text-xs text-gray-600 mb-1.5 block">
                                       Image Path
                                    </Label>
                                    <div className="flex flex-col gap-2">
                                       <Input
                                          id="edit-img-src"
                                          value={imgSrc}
                                          onChange={(e) => setImgSrc(e.target.value)}
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
                                       <Label htmlFor="edit-img-alt" className="text-xs text-gray-600 mb-1.5 block">
                                          Alt Text
                                       </Label>
                                       <Input
                                          id="edit-img-alt"
                                          value={imgAlt}
                                          onChange={(e) => setImgAlt(e.target.value)}
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
                                             alt={imgAlt || "Preview"}
                                             className="w-full h-full object-cover"
                                             onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                                const parent = e.currentTarget.parentElement;
                                                if (parent) {
                                                   parent.innerHTML =
                                                      '<div class="flex items-center justify-center w-full h-full text-gray-400"><svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>';
                                                }
                                             }}
                                          />
                                       </div>
                                       <div className="text-xs text-gray-500 space-y-1">
                                          <p className="font-medium text-gray-700">File: {imgSrc.split("/").pop()}</p>
                                          <p>Alt: {imgAlt || "Not set"}</p>
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="fixed bottom-0 left-0 right-0 bg-muted border-t border-primary px-6 py-3 flex items-center justify-end gap-2 z-50 rounded-b-md">
                  <Button
                     type="button"
                     size="sm"
                     variant="outline"
                     onClick={() => onOpenChange(false)}
                     disabled={isSaving}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="button"
                     size="sm"
                     disabled={isSaving || !title.trim() || sections.length === 0}
                     onClick={handleSave}
                  >
                     {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                     <Save className="h-4 w-4 mr-2" />
                     Save Changes
                  </Button>
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
