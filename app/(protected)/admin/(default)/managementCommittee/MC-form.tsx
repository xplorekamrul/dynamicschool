"use client";

import { createMC } from "@/actions/admin/ManagementCommittee/create-MC";
import { updateMC } from "@/actions/admin/ManagementCommittee/update-MC";
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
import { uploadFile } from "@/lib/file-manager/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Save, Trash, Upload, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const staffSchema = z.object({
   name: z.string().min(1, "Name is required"),
   image: z.string().optional(),
   phoneNumber: z.string().min(1, "Phone number is required"),
   position: z.string().min(1, "Position is required"),
   shortDetails: z.string().optional(),
});

type StaffFormValues = z.infer<typeof staffSchema>;

type Staff = {
   id: string | bigint;
   name: string;
   image: string | null;
   phoneNumber: string;
   position: string;
   shortDetails: string | null;
};

export default function StaffForm({
   staff,
   instituteId,
   onSuccess,
   onCancel,
}: {
   staff: Staff | null;
   instituteId: string;
   onSuccess: (staff: Staff) => void;
   onCancel: () => void;
}) {
   const [uploading, setUploading] = useState(false);
   const [imagePreview, setImagePreview] = useState<string | null>(
      staff?.image || null
   );
   const fileInputRef = useRef<HTMLInputElement>(null);

   const form = useForm<StaffFormValues>({
      resolver: zodResolver(staffSchema),
      defaultValues: {
         name: staff?.name || "",
         image: staff?.image || "",
         phoneNumber: staff?.phoneNumber || "",
         position: staff?.position || "",
         shortDetails: staff?.shortDetails || "",
      },
   });

   const { execute: executeCreate, status: createStatus } = useAction(
      createMC,
      {
         onSuccess: (res) => {
            if (res?.data?.success && res?.data?.member) {
               toast.success("Member created successfully");
               onSuccess(res.data.member as Staff);
            }
         },
         onError: (err) => {
            toast.error(err?.error?.serverError || "Failed to create member");
         },
      }
   );

   const { execute: executeUpdate, status: updateStatus } = useAction(
      updateMC,
      {
         onSuccess: (res) => {
            if (res?.data?.success && res?.data?.member) {
               toast.success("Member updated successfully");
               onSuccess(res.data.member as Staff);
            }
         },
         onError: (err) => {
            toast.error(err?.error?.serverError || "Failed to update member");
         },
      }
   );

   const saving = createStatus === "executing" || updateStatus === "executing";

   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
         setUploading(true);
         const targetDir = `/${instituteId}/staff`;
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

   const onSubmit = (values: StaffFormValues) => {
      if (staff) {
         executeUpdate({ ...values, id: String(staff.id) });
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
                  {/* Row 1: Name + Position */}
                  <FormField
                     name="name"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Name</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Staff name"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     name="position"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Position</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="e.g., Principal, Vice Principal"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Row 2: Phone Number + Image Upload */}
                  <FormField
                     name="phoneNumber"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Phone Number</FormLabel>
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

                  {/* Row 3: Short Details (Full Width) */}
                  <FormField
                     name="shortDetails"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem className="md:col-span-2">
                           <FormLabel>Short Details</FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Brief description about the staff member"
                                 className="resize-none"
                                 rows={3}
                                 {...field}
                              />
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
                           {staff ? "Update" : "Create"}
                        </>
                     )}
                  </Button>
               </div>
            </form>
         </Form>
      </>
   );
}
