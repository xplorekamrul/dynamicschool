"use client";

import { createVacancy } from "@/actions/admin/vacancy/create-vacancy";
import { updateVacancy } from "@/actions/admin/vacancy/update-vacancy";
import { Editor } from "@/components/blocks/editor-00/editor";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { SerializedEditorState } from "lexical";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Vacancy = {
   id: bigint;
   post: string;
   salaryScale?: string | null;
   details?: string | null;
   link?: string | null;
   createdAt: Date;
   updatedAt: Date;
};

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

const vacancySchema = z.object({
   post: z.string().min(1, "Post is required").max(100),
   salaryScale: z.string().optional(),
   details: z.string().optional(),
   link: z.string().optional(),
});

type VacancyFormData = z.infer<typeof vacancySchema>;

interface VacancyFormModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   vacancy?: Vacancy | null;
}

export default function VacancyFormModal({
   open,
   onOpenChange,
   vacancy,
}: VacancyFormModalProps) {
   const queryClient = useQueryClient();
   const isEditing = !!vacancy;
   const [editorState, setEditorState] = useState<SerializedEditorState>(initialEditorValue);

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm<VacancyFormData>({
      resolver: zodResolver(vacancySchema),
   });

   // Create vacancy
   const { execute: executeCreate, isExecuting: isCreating } = useAction(
      createVacancy,
      {
         onSuccess: ({ data }) => {
            if (data?.success) {
               toast.success(data.message);
               reset();
               onOpenChange(false);
               queryClient.invalidateQueries({ queryKey: ["admin-vacancies"] });
            }
         },
         onError: ({ error }) => {
            toast.error(error.serverError || "Failed to create vacancy");
         },
      }
   );

   // Update vacancy
   const { execute: executeUpdate, isExecuting: isUpdating } = useAction(
      updateVacancy,
      {
         onSuccess: ({ data }) => {
            if (data?.success) {
               toast.success(data.message);
               reset();
               onOpenChange(false);
               queryClient.invalidateQueries({ queryKey: ["admin-vacancies"] });
            }
         },
         onError: ({ error }) => {
            toast.error(error.serverError || "Failed to update vacancy");
         },
      }
   );

   useEffect(() => {
      if (open) {
         if (vacancy) {
            // For edit mode, set form values but allow user to clear them
            reset({
               post: vacancy.post,
               salaryScale: vacancy.salaryScale || "",
               details: vacancy.details || "",
               link: vacancy.link || "",
            });
            if (vacancy.details) {
               try {
                  setEditorState(JSON.parse(vacancy.details));
               } catch {
                  setEditorState(initialEditorValue);
               }
            } else {
               setEditorState(initialEditorValue);
            }
         } else {
            // For create mode, clear all fields
            reset({
               post: "",
               salaryScale: "",
               details: "",
               link: "",
            });
            setEditorState(initialEditorValue);
         }
      }
   }, [open, vacancy, reset]);

   const onSubmit = (data: VacancyFormData) => {
      // Convert empty strings to undefined for optional fields
      const salaryScaleToSend = data.salaryScale?.trim() ? data.salaryScale : undefined;
      const linkToSend = data.link?.trim() ? data.link : undefined;

      // Handle details - check if editor has actual text content
      const hasContent = editorState.root &&
         Array.isArray(editorState.root.children) &&
         editorState.root.children.some((child) =>
            child &&
            'children' in child &&
            Array.isArray(child.children) &&
            child.children.some((textNode) => 'text' in textNode && textNode.text && textNode.text.toString().trim())
         );

      const detailsToSend = hasContent ? JSON.stringify(editorState) : undefined;

      if (isEditing && vacancy) {
         executeUpdate({
            id: vacancy.id.toString(),
            post: data.post,
            salaryScale: salaryScaleToSend,
            details: detailsToSend,
            link: linkToSend,
         });
      } else {
         executeCreate({
            post: data.post,
            salaryScale: salaryScaleToSend,
            details: detailsToSend,
            link: linkToSend,
         });
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-5xl! h-screen max-h-screen flex flex-col p-0">
            <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
               <DialogTitle>
                  {isEditing ? "Edit Vacancy" : "Create New Vacancy"}
               </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-4">
               <div className="space-y-4 pb-20">
                  <div>
                     <Label htmlFor="post">Post *</Label>
                     <Input
                        id="post"
                        {...register("post")}
                        placeholder="e.g., Senior Teacher"
                        className="mt-1"
                     />
                     {errors.post && (
                        <p className="text-sm text-red-600 mt-1">
                           {errors.post.message}
                        </p>
                     )}
                  </div>

                  <div>
                     <Label htmlFor="salaryScale">Salary Scale (Optional)</Label>
                     <Input
                        id="salaryScale"
                        {...register("salaryScale")}
                        placeholder="e.g., 30,000 - 50,000"
                        className="mt-1"
                     />
                  </div>

                  <div>
                     <Label htmlFor="link">Application Link (Optional)</Label>
                     <Input
                        id="link"
                        {...register("link")}
                        placeholder="https://example.com/apply"
                        className="mt-1"
                     />
                  </div>

                  <div>
                     <Label htmlFor="details">Details (Optional)</Label>
                     <div className="mt-1 border rounded-lg overflow-hidden bg-white">
                        <Editor
                           editorSerializedState={editorState}
                           onSerializedChange={setEditorState}
                        />
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex-shrink-0 flex gap-2 justify-end px-6 py-4 border-t bg-gray-50">
               <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
               >
                  Cancel
               </Button>
               <Button
                  type="button"
                  disabled={isCreating || isUpdating}
                  onClick={handleSubmit(onSubmit)}
               >
                  {(isCreating || isUpdating) && (
                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {isEditing ? "Update" : "Create"}
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   );
}
