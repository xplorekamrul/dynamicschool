"use client";

import { createNotice } from "@/actions/admin/notice/create-notice";
import { updateNotice } from "@/actions/admin/notice/update-notice";
import { Editor } from "@/components/blocks/editor-00/editor";
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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { uploadFile } from "@/lib/file-manager/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { SerializedEditorState } from "lexical";
import { Check, Save, Trash, Upload, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const noticeSchema = z.object({
   title: z.string().min(1, "Title is required"),
   content: z.string().min(1, "Content is required"),
   category: z.enum(["GENERAL", "EXAM", "HOLIDAY", "EVENT", "URGENT"]),
   fileUrl: z.string().optional(),
   fileName: z.string().optional(),
   isPublished: z.boolean(),
   specialNotice: z.boolean(),
});

type NoticeFormValues = z.infer<typeof noticeSchema>;

type Notice = {
   id: string | bigint;
   title: string;
   content: string;
   category: string;
   fileUrl: string | null;
   fileName: string | null;
   isPublished: boolean;
   specialNotice: boolean;
};

export default function NoticeForm({
   notice,
   instituteId,
   onSuccess,
   onCancel,
}: {
   notice: Notice | null;
   instituteId: string;
   onSuccess: (notice: Notice) => void;
   onCancel: () => void;
}) {
   const [uploading, setUploading] = useState(false);
   const [filePreview, setFilePreview] = useState<{ name: string; url: string; isImage: boolean } | null>(
      notice?.fileUrl ? {
         name: notice.fileName || "File",
         url: notice.fileUrl,
         isImage: /\.(jpg|jpeg|png|gif|webp)$/i.test(notice.fileUrl)
      } : null
   );
   const [editorState, setEditorState] = useState<SerializedEditorState | undefined>(() => {
      if (!notice?.content) return undefined;
      try {
         return JSON.parse(notice.content);
      } catch {
         return undefined;
      }
   });
   const fileInputRef = useRef<HTMLInputElement>(null);

   const form = useForm<NoticeFormValues>({
      resolver: zodResolver(noticeSchema),
      defaultValues: {
         title: notice?.title || "",
         content: notice?.content || "",
         category: (notice?.category as "GENERAL" | "EXAM" | "HOLIDAY" | "EVENT" | "URGENT") || "GENERAL",
         fileUrl: notice?.fileUrl || "",
         fileName: notice?.fileName || "",
         isPublished: notice?.isPublished ?? true,
         specialNotice: notice?.specialNotice ?? false,
      },
   });

   const { execute: executeCreate, status: createStatus } = useAction(
      createNotice,
      {
         onSuccess: (res) => {
            if (res?.data?.success && res?.data?.notice) {
               toast.success("Notice created successfully");
               onSuccess(res.data.notice as Notice);
            }
         },
         onError: (err) => {
            toast.error(err?.error?.serverError || "Failed to create notice");
         },
      }
   );

   const { execute: executeUpdate, status: updateStatus } = useAction(
      updateNotice,
      {
         onSuccess: (res) => {
            if (res?.data?.success && res?.data?.notice) {
               toast.success("Notice updated successfully");
               onSuccess(res.data.notice as Notice);
            }
         },
         onError: (err) => {
            toast.error(err?.error?.serverError || "Failed to update notice");
         },
      }
   );

   const saving = createStatus === "executing" || updateStatus === "executing";

   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
         setUploading(true);
         const targetDir = `/${instituteId}/notices`;
         const ext = file.name.split(".").pop() || "pdf";
         const name = `${Date.now()}.${ext}`;

         await uploadFile({ path: targetDir, name, file });
         const filePath = `/images${targetDir}/${name}`;
         const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath);

         form.setValue("fileUrl", filePath);
         form.setValue("fileName", file.name);
         setFilePreview({ name: file.name, url: filePath, isImage });
         toast.success("File uploaded successfully");
      } catch {
         toast.error("Failed to upload file");
      } finally {
         setUploading(false);
         e.target.value = "";
      }
   };

   const onSubmit = (values: NoticeFormValues) => {
      if (notice) {
         executeUpdate({ ...values, id: String(notice.id) });
      } else {
         executeCreate(values);
      }
   };

   return (
      <>
         <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileUpload}
         />

         <Form {...form}>
            <form className="grid grid-cols-12 gap-6 h-screen" onSubmit={(e) => e.preventDefault()}>
               {/* LEFT SECTION - 8 COLUMNS */}
               <div className="col-span-9 flex flex-col overflow-hidden">
                  <div className=" overflow-y-auto pr-4 space-y-2">
                     {/* Title */}
                     <FormField
                        name="title"
                        control={form.control}
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                 <Input placeholder="Notice title" {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Category and Status */}
                     <div className="grid grid-cols-3 gap-4">
                        <FormField
                           name="category"
                           control={form.control}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Category</FormLabel>
                                 <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                       <SelectTrigger>
                                          <SelectValue />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       <SelectItem value="GENERAL">General</SelectItem>
                                       <SelectItem value="EXAM">Exam</SelectItem>
                                       <SelectItem value="HOLIDAY">Holiday</SelectItem>
                                       <SelectItem value="EVENT">Event</SelectItem>
                                       <SelectItem value="URGENT">Urgent</SelectItem>
                                    </SelectContent>
                                 </Select>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           name="isPublished"
                           control={form.control}
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Status</FormLabel>
                                 <Select
                                    value={field.value ? "published" : "draft"}
                                    onValueChange={(val) => field.onChange(val === "published")}
                                 >
                                    <FormControl>
                                       <SelectTrigger>
                                          <SelectValue />
                                       </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                       <SelectItem value="published">Published</SelectItem>
                                       <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                 </Select>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        {/* Special Notice Toggle */}
                        <FormField
                           name="specialNotice"
                           control={form.control}
                           render={({ field }) => (
                              <FormItem className="flex items-center justify-between border rounded-lg p-4 bg-amber-50 border-amber-200">
                                 <div className="flex-1">
                                    <div className="flex justify-between">
                                    <FormLabel className="text-base font-semibold text-amber-900">
                                       Mark as Special Notice
                                    </FormLabel>
                                    <FormControl>
                                       <input
                                          type="checkbox"
                                          checked={field.value}
                                          onChange={field.onChange}
                                          className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                       />
                                    </FormControl>
                                    </div>
                                    <p className="text-sm text-amber-700 mt-1">
                                       Only one notice can be marked as special. It will appear at the top of the homepage.
                                    </p>
                                 </div>

                              </FormItem>
                           )}
                        />
                     </div>


                     {/* Content Editor */}
                     <FormField
                        name="content"
                        control={form.control}
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Content</FormLabel>
                              <FormControl>
                                 <div className="border rounded-lg overflow-hidden bg-white">
                                    <Editor
                                       editorSerializedState={editorState}
                                       onSerializedChange={(value) => {
                                          setEditorState(value);
                                          field.onChange(JSON.stringify(value));
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

               {/* RIGHT SECTION - 4 COLUMNS */}
               <div className="col-span-3 flex flex-col gap-2">
                  {/* File Upload Section */}
                  <div className="border rounded-lg p-4 bg-gray-50  ">
                     <h3 className="font-semibold text-sm text-gray-700 mb-4">Attachments</h3>

                     <div className="flex flex-col gap-2">
                        {/* File Display Name */}
                        {/* <FormField
                           name="fileName"
                           control={form.control}
                           render={({ field: fileNameField }) => (
                              <FormItem>
                                 <FormLabel className="text-xs">Display Name</FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="e.g., Exam Schedule"
                                       {...fileNameField}
                                       className="text-sm"
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        /> */}

                        {/* Upload Button */}
                        <FormField
                           name="fileUrl"
                           control={form.control}
                           render={() => (
                              <FormItem>
                                 <FormLabel className="text-xs">Upload File</FormLabel>
                                 <FormControl>
                                    <Button
                                       type="button"
                                       onClick={() => fileInputRef.current?.click()}
                                       variant={filePreview ? "default" : "outline"}
                                       className={`w-full ${filePreview && !uploading
                                          ? "bg-green-600 hover:bg-green-700 text-white"
                                          : ""
                                          }`}
                                       disabled={uploading || saving}
                                    >
                                       {filePreview && !uploading ? (
                                          <Check className="h-4 w-4 mr-2" />
                                       ) : (
                                          <Upload className="h-4 w-4 mr-2" />
                                       )}
                                       {uploading ? "Uploading..." : "Choose File"}
                                    </Button>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* File Preview */}
                        {filePreview && (
                           <div className="border rounded-lg p-3 bg-white">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                 <span className="text-xs font-semibold text-gray-600">Preview</span>
                                 <Button
                                    type="button"
                                    size="icon"
                                    className="bg-red-500 hover:bg-red-600 text-white h-5 w-5"
                                    onClick={() => {
                                       form.setValue("fileUrl", "");
                                       form.setValue("fileName", "");
                                       setFilePreview(null);
                                    }}
                                    disabled={saving}
                                 >
                                    <Trash className="h-3 w-3" />
                                 </Button>
                              </div>

                              <a
                                 href={filePreview.url}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="block"
                              >
                                 {filePreview.isImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                       src={filePreview.url}
                                       alt="Preview"
                                       className="w-full h-32 rounded object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                    />
                                 ) : (
                                    <div className="w-full h-32 rounded bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                                       <div className="text-center">
                                          <span className="text-3xl">📄</span>
                                          <p className="text-xs text-gray-600 mt-2 truncate px-2">
                                             {filePreview.name}
                                          </p>
                                       </div>
                                    </div>
                                 )}
                              </a>
                           </div>
                        )}

                        {!filePreview && (
                           <div className="border-2 border-dashed rounded-lg p-4 text-center text-gray-400 flex items-center justify-center flex-1 min-h-32">
                              <div>
                                 <span className="text-2xl block mb-1">📁</span>
                                 <p className="text-xs">No file selected</p>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Buttons Section */}
                  <div className="flex gap-2 mt-50">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={saving}
                        className="flex-1"
                     >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                     </Button>
                     <Button
                        type="button"
                        disabled={saving}
                        className="flex-1"
                        onClick={async (e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           const isValid = await form.trigger();
                           if (isValid) {
                              onSubmit(form.getValues());
                           }
                        }}
                     >
                        {saving ? (
                           "Saving..."
                        ) : (
                           <>
                              <Save className="h-4 w-4 mr-2" />
                              {notice ? "Update" : "Create"}
                           </>
                        )}
                     </Button>
                  </div>
               </div>
            </form>
         </Form>
      </>
   );
}
