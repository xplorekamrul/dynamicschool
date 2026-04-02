"use client";

import {
   createBlogCategory,
   updateBlogCategory,
} from "@/actions/admin/blog/blog-category";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const BlogCategorySchema = z.object({
   name: z.string().min(1, "Category name is required").max(30),
});

type BlogCategoryFormData = z.infer<typeof BlogCategorySchema>;

interface BlogCategoryDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   category?: { id: bigint; name: string } | null;
}

export function BlogCategoryDialog({
   open,
   onOpenChange,
   category,
}: BlogCategoryDialogProps) {
   const form = useForm<BlogCategoryFormData>({
      resolver: zodResolver(BlogCategorySchema),
      defaultValues: {
         name: "",
      },
   });

   useEffect(() => {
      if (open) {
         form.reset({
            name: category?.name || "",
         });
      }
   }, [open, category, form]);

   const { executeAsync: handleCreate, isExecuting: isCreating } =
      useAction(createBlogCategory);
   const { executeAsync: handleUpdate, isExecuting: isUpdating } =
      useAction(updateBlogCategory);

   const isExecuting = isCreating || isUpdating;
   const name = form.watch("name");

   const onSubmit = async (data: BlogCategoryFormData) => {
      try {
         if (category) {
            const result = await handleUpdate({
               id: category.id.toString(),
               ...data,
            });
            if ((result?.data as any)?.success) {
               toast.success("Category updated successfully");
               onOpenChange(false);
               form.reset();
            } else if (result?.serverError) {
               toast.error(result.serverError as string);
            }
         } else {
            const result = await handleCreate(data);
            if ((result?.data as any)?.success) {
               toast.success("Category created successfully");
               onOpenChange(false);
               form.reset();
            } else if (result?.serverError) {
               toast.error(result.serverError as string);
            }
         }
      } catch (error) {
         toast.error("Something went wrong");
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>
                  {category ? "Edit Category" : "Create Category"}
               </DialogTitle>
            </DialogHeader>

            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>
                              Category Name <span className="text-red-500">*</span>
                           </FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 placeholder="Enter category name"
                                 disabled={isExecuting}
                              />
                           </FormControl>
                           <p className="text-xs text-gray-500 mt-1">
                              {name?.length || 0} / 30 characters
                           </p>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <div className="flex justify-end gap-2">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isExecuting}
                     >
                        Cancel
                     </Button>
                     <Button type="submit" disabled={isExecuting}>
                        {isExecuting ? "Saving..." : "Save"}
                     </Button>
                  </div>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
