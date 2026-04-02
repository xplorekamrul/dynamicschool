"use client";

import { createStaff, updateStaff } from "@/actions/staff";
import { uploadFile } from "@/lib/file-manager/helpers";
import { Check, Save, Trash, Upload, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface StaffModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess: () => void;
   editingStaff?: StaffMember;
}

interface StaffMember {
   id: bigint;
   name: string;
   phoneNumber: string;
   position: string;
   image?: string;
}

interface FormData {
   name: string;
   phoneNumber: string;
   position: string;
   image: string;
}

export default function StaffModal({
   isOpen,
   onClose,
   onSuccess,
   editingStaff,
}: StaffModalProps) {
   const [uploading, setUploading] = useState(false);
   const [imagePreview, setImagePreview] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
   } = useForm<FormData>({
      defaultValues: {
         name: "",
         phoneNumber: "",
         position: "",
         image: "",
      },
   });

   const { execute: create, isPending: isCreating } = useAction(createStaff, {
      onSuccess: () => {
         toast.success("Staff created successfully");
         reset();
         setImagePreview(null);
         onSuccess();
      },
      onError: () => {
         toast.error("Failed to create staff");
      },
   });

   const { execute: update, isPending: isUpdating } = useAction(updateStaff, {
      onSuccess: () => {
         toast.success("Staff updated successfully");
         reset();
         setImagePreview(null);
         onSuccess();
      },
      onError: () => {
         toast.error("Failed to update staff");
      },
   });

   useEffect(() => {
      if (editingStaff) {
         reset({
            name: editingStaff.name,
            phoneNumber: editingStaff.phoneNumber,
            position: editingStaff.position,
            image: editingStaff.image || "",
         });
         setImagePreview(editingStaff.image || null);
      } else {
         reset({
            name: "",
            phoneNumber: "",
            position: "",
            image: "",
         });
         setImagePreview(null);
      }
   }, [editingStaff, isOpen, reset]);

   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
         setUploading(true);
         const targetDir = `/staff`;
         const ext = file.name.split(".").pop() || "jpg";
         const name = `${Date.now()}.${ext}`;

         await uploadFile({ path: targetDir, name, file });
         const imagePath = `/images${targetDir}/${name}`;

         setValue("image", imagePath);
         setImagePreview(imagePath);
         toast.success("Image uploaded successfully");
      } catch {
         toast.error("Failed to upload image");
      } finally {
         setUploading(false);
         e.target.value = "";
      }
   };

   const onSubmit = (data: FormData) => {
      if (editingStaff) {
         update({
            ...data,
            id: editingStaff.id,
         });
      } else {
         create(data);
      }
   };

   if (!isOpen) return null;

   const isPending = isCreating || isUpdating;

   return (
      <>
         <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
         />

         <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4">
               <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-xl font-bold">
                     {editingStaff ? "Edit Staff" : "Add Staff"}
                  </h2>
                  <button
                     onClick={onClose}
                     className="text-gray-500 hover:text-gray-700"
                  >
                     <X size={24} />
                  </button>
               </div>

               <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Name */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Name
                        </label>
                        <input
                           {...register("name", { required: "Name is required" })}
                           type="text"
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                           placeholder="Staff name"
                        />
                        {errors.name && (
                           <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                     </div>

                     {/* Position */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Position
                        </label>
                        <input
                           {...register("position", { required: "Position is required" })}
                           type="text"
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                           placeholder="e.g., Caretaker, Security Guard"
                        />
                        {errors.position && (
                           <p className="text-red-500 text-sm mt-1">
                              {errors.position.message}
                           </p>
                        )}
                     </div>

                     {/* Phone Number */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Phone Number
                        </label>
                        <input
                           {...register("phoneNumber", {
                              required: "Phone number is required",
                           })}
                           type="tel"
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                           placeholder="+8801XXXXXXXXX"
                        />
                        {errors.phoneNumber && (
                           <p className="text-red-500 text-sm mt-1">
                              {errors.phoneNumber.message}
                           </p>
                        )}
                     </div>

                     {/* Photo Upload */}
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                           Photo
                        </label>
                        <div className="flex items-center gap-3">
                           <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${imagePreview && !uploading
                                 ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                                 : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
                                 }`}
                              disabled={uploading || isPending}
                           >
                              {imagePreview && !uploading ? (
                                 <Check size={16} />
                              ) : (
                                 <Upload size={16} />
                              )}
                              {uploading ? "Uploading..." : "Upload Photo"}
                           </button>

                           {imagePreview && (
                              <div className="relative inline-block group">
                                 <a
                                    href={imagePreview}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                 >
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden border cursor-pointer">
                                       <Image
                                          src={imagePreview}
                                          alt="Preview"
                                          fill
                                          className="object-cover"
                                       />
                                    </div>
                                 </a>
                                 <button
                                    type="button"
                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                    onClick={() => {
                                       setValue("image", "");
                                       setImagePreview(null);
                                    }}
                                    disabled={isPending}
                                 >
                                    <Trash size={14} />
                                 </button>
                              </div>
                           )}

                           <input type="hidden" {...register("image")} />
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                     <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        disabled={isPending}
                     >
                        <X size={16} className="inline mr-2" />
                        Cancel
                     </button>
                     <button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                     >
                        <Save size={16} />
                        {isPending ? "Saving..." : editingStaff ? "Update" : "Create"}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </>
   );
}
