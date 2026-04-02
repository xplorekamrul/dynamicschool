"use client";

import { createTeacher } from "@/actions/admin/teachers/create-teacher";
import { updateTeacher } from "@/actions/admin/teachers/update-teacher";
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
import { uploadFile } from "@/lib/file-manager/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Save, Upload, X, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

const teacherSchema = z.object({
   name: z.string().min(1, "Name is required"),
   image: z.string().optional(),
   designation: z.string().min(1, "Designation is required"),
   classes: z.string().optional(),
   mobile: z.string().min(1, "Mobile number is required"),
   status: z.enum(["ACTIVE", "RETIRED"]),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

type Teacher = {
   id: string;
   name: string;
   image: string | null;
   designation: string;
   classes: string | null;
   mobile: string;
   status: "ACTIVE" | "RETIRED";
};

export default function TeacherForm({
   teacher,
   instituteId,
   onSuccess,
   onCancel,
}: {
   teacher: Teacher | null;
   instituteId: string;
   onSuccess: (teacher: Teacher) => void;
   onCancel: () => void;
}) {
   const [uploading, setUploading] = useState(false);
   const [imagePreview, setImagePreview] = useState<string | null>(
      teacher?.image || null
   );
   const fileInputRef = useRef<HTMLInputElement>(null);

   const form = useForm<TeacherFormValues>({
      resolver: zodResolver(teacherSchema),
      defaultValues: {
         name: teacher?.name || "",
         image: teacher?.image || "",
         designation: teacher?.designation || "",
         classes: teacher?.classes || "",
         mobile: teacher?.mobile || "",
         status: teacher?.status || "ACTIVE",
      },
   });

   const status = form.watch("status");

   const { execute: executeCreate, status: createStatus } = useAction(
      createTeacher,
      {
         onSuccess: (res) => {
            if (res?.data?.success && res?.data?.teacher) {
               toast.success("Teacher created successfully");
               onSuccess(res.data.teacher as Teacher);
            }
         },
         onError: (err) => {
            toast.error(err?.error?.serverError || "Failed to create teacher");
         },
      }
   );

   const { execute: executeUpdate, status: updateStatus } = useAction(
      updateTeacher,
      {
         onSuccess: (res) => {
            if (res?.data?.success && res?.data?.teacher) {
               toast.success("Teacher updated successfully");
               onSuccess(res.data.teacher as Teacher);
            }
         },
         onError: (err) => {
            toast.error(err?.error?.serverError || "Failed to update teacher");
         },
      }
   );

   const saving = createStatus === "executing" || updateStatus === "executing";

   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
         setUploading(true);
         const targetDir = `/${instituteId}/teachers`;
         const ext = file.name.split(".").pop() || "jpg";
         const name = `${Date.now()}.${ext}`;

         await uploadFile({ path: targetDir, name, file });
         const imagePath = `/images${targetDir}/${name}`;

         form.setValue("image", imagePath);
         setImagePreview(imagePath);
         toast.success("Image uploaded successfully");
      } catch {
         toast.error("Failed to upload image");
      } finally {
         setUploading(false);
         e.target.value = "";
      }
   };

   const onSubmit = (values: TeacherFormValues) => {
      if (teacher) {
         executeUpdate({ ...values, id: teacher.id });
      } else {
         executeCreate(values);
      }
   };

   return (
      <>
         <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
         />

         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-6"
            >
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Row 1: Name + Status */}
                  <FormField
                     name="name"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Name</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Teacher name"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     name="status"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem className="w-full">
                           <FormLabel>Status</FormLabel>
                           <Select
                              onValueChange={field.onChange}
                              value={field.value}
                           >
                              <FormControl>
                                 <SelectTrigger className="h-10 w-full">
                                    <SelectValue placeholder="Select status" />
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent className="w-full">
                                 <SelectItem value="ACTIVE">Active</SelectItem>
                                 <SelectItem value="RETIRED">Retired</SelectItem>
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Row 2: Designation + Classes */}
                  <FormField
                     name="designation"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Designation</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="e.g., Assistant Teacher"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {status === "ACTIVE" ? (
                     <FormField
                        name="classes"
                        control={form.control}
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Classes Taught</FormLabel>
                              <FormControl>
                                 <Input
                                    placeholder="e.g., 9th, 10th"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  ) : (
                     <div className="md:block hidden" />
                  )}

                  {/* Row 3: Mobile + Image Upload */}
                  <FormField
                     name="mobile"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Mobile Number</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="+8801XXXXXXXXX"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     name="image"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Photo</FormLabel>
                           <FormControl>
                              <div className="flex items-center gap-4">
                                 <Button
                                    type="button"
                                    onClick={() =>
                                       fileInputRef.current?.click()
                                    }
                                    variant={imagePreview ? "default" : "outline"}
                                    className={
                                       imagePreview && !uploading
                                          ? "bg-green-600 hover:bg-green-700 text-white"
                                          : ""
                                    }
                                    disabled={uploading || saving}
                                 >
                                    {imagePreview && !uploading ? (
                                       <Check className="h-4 w-4 mr-2" />
                                    ) : (
                                       <Upload className="h-4 w-4 mr-2" />
                                    )}
                                    {uploading ? "Uploading..." : "Upload Photo"}
                                 </Button>

                                 {imagePreview && (
                                    <div className="relative inline-block group">
                                       <a
                                          href={imagePreview}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                       >
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                             src={imagePreview}
                                             alt="Preview"
                                             className="h-16 w-16 rounded-md object-cover border cursor-pointer"
                                          />
                                       </a>
                                       <Button
                                          type="button"
                                          size="icon"
                                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={() => {
                                             form.setValue("image", "");
                                             field.onChange("");
                                             setImagePreview(null);
                                          }}
                                          disabled={saving}
                                       >
                                          <Trash className="h-4 w-4" />
                                       </Button>
                                    </div>
                                 )}

                                 <input type="hidden" {...field} />
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>

               <div className="flex justify-end gap-2 pt-4">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={onCancel}
                     disabled={saving}
                  >
                     <X className="h-4 w-4 mr-2" />
                     Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                     {saving ? (
                        "Saving..."
                     ) : (
                        <>
                           <Save className="h-4 w-4 mr-2" />
                           {teacher ? "Update" : "Create"}
                        </>
                     )}
                  </Button>
               </div>
            </form>
         </Form>
      </>
   );
}
