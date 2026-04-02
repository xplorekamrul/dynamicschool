"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Dialog,
   DialogContent,
   DialogDescription,
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

import {
   createImportantLink,
   deleteImportantLink,
   updateImportantLink
} from "@/actions/admin/important-links";

const CreateFormSchema = z.object({
   name: z.string().min(1, "Name is required"),
   url: z.string().url("Invalid URL"),
});

const EditFormSchema = z.object({
   id: z.number(),
   name: z.string().min(1, "Name is required"),
   url: z.string().url("Invalid URL"),
});

type CreateFormValues = z.infer<typeof CreateFormSchema>;
type EditFormValues = z.infer<typeof EditFormSchema>;

interface ImportantLink {
   id: number;
   name: string;
   url: string;
   createdAt: Date;
   updatedAt: Date;
}

export default function ImportantLinksClient({
   initialLinks,
}: {
   initialLinks: ImportantLink[];
}) {
   const [links, setLinks] = useState<ImportantLink[]>(initialLinks);
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const [editingId, setEditingId] = useState<number | null>(null);
   const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
   const [deletingId, setDeletingId] = useState<number | null>(null);

   const createForm = useForm<CreateFormValues>({
      resolver: zodResolver(CreateFormSchema),
      defaultValues: {
         name: "",
         url: "",
      },
   });

   const editForm = useForm<EditFormValues>({
      resolver: zodResolver(EditFormSchema),
      defaultValues: {
         id: 0,
         name: "",
         url: "",
      },
   });

   const { execute: executeCreate, status: createStatus } = useAction(
      createImportantLink,
      {
         onSuccess: (result) => {
            toast.success("Link created successfully");
            // Add the new link to the list instead of reloading
            if (result?.data) {
               const newLink = result.data.data;
               setLinks([...links, {
                  id: Number(newLink.id),
                  name: newLink.name,
                  url: newLink.url,
                  createdAt: new Date(newLink.createdAt),
                  updatedAt: new Date(newLink.updatedAt),
               }]);
            }
            setIsDialogOpen(false);
            createForm.reset();
         },
         onError: (err) => {
            toast.error(err?.error?.serverError || "Failed to create link");
         },
      }
   );

   const { execute: executeUpdate, status: updateStatus } = useAction(
      updateImportantLink,
      {
         onSuccess: (result) => {
            toast.success("Link updated successfully");
            const updatedName = editForm.getValues("name");
            const updatedUrl = editForm.getValues("url");
            setLinks(links.map(l => l.id === editingId ? { ...l, name: updatedName, url: updatedUrl } : l));
            setIsDialogOpen(false);
            setEditingId(null);
            editForm.reset();
         },
         onError: (err) => {
            toast.error(err?.error?.serverError || "Failed to update link");
         },
      }
   );

   const { execute: executeDelete } = useAction(
      deleteImportantLink,
      {
         onSuccess: (result) => {
            toast.success("Link deleted successfully");
            setLinks(links.filter((l) => l.id !== deletingId));
            setDeleteConfirm(null);
            setDeletingId(null);
         },
         onError: (err) => {
            toast.error(err?.error?.serverError || "Failed to delete link");
            setDeletingId(null);
         },
      }
   );

   const onCreateSubmit = (values: CreateFormValues) => {
      executeCreate({
         name: values.name,
         url: values.url,
      });
   };

   const onEditSubmit = (values: EditFormValues) => {
      executeUpdate({
         id: BigInt(values.id),
         name: values.name,
         url: values.url,
      });
   };

   const handleDelete = (id: number) => {
      setDeletingId(id);
      executeDelete({ id: BigInt(id) });
   };

   const handleEdit = (link: ImportantLink) => {
      editForm.reset({
         id: link.id,
         name: link.name,
         url: link.url,
      });
      setEditingId(link.id);
      setIsDialogOpen(true);
   };

   const handleAddNew = () => {
      createForm.reset({
         name: "",
         url: "",
      });
      setEditingId(null);
      setIsDialogOpen(true);
   };

   const isSaving = createStatus === "executing" || updateStatus === "executing";

   return (
      <>
         <div className="space-y-6">
            <div className="flex justify-end">
               <Button onClick={handleAddNew} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Link
               </Button>
            </div>

            {links.length > 0 ? (
               <Card>
                  <CardHeader>
                     <CardTitle>Important Links ({links.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="overflow-x-auto">
                        <table className="w-full">
                           <thead>
                              <tr className="border-b">
                                 <th className="text-left py-3 px-4 font-semibold">Name</th>
                                 <th className="text-left py-3 px-4 font-semibold">URL</th>
                                 <th className="text-right py-3 px-4 font-semibold">
                                    Actions
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                              {links.map((link) => (
                                 <tr
                                    key={link.id}
                                    className="border-b hover:bg-gray-50 transition-colors"
                                 >
                                    <td className="py-3 px-4">{link.name}</td>
                                    <td className="py-3 px-4">
                                       <a
                                          href={link.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline truncate block max-w-xs"
                                       >
                                          {link.url}
                                       </a>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                       <div className="flex justify-end gap-2">
                                          <Button
                                             variant="ghost"
                                             size="sm"
                                             onClick={() => handleEdit(link)}
                                             className="gap-1"
                                          >
                                             <Edit2 className="h-4 w-4" />
                                             Edit
                                          </Button>
                                          <Button
                                             variant="ghost"
                                             size="sm"
                                             onClick={() => setDeleteConfirm(link.id)}
                                             disabled={deletingId === link.id}
                                             className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                          >
                                             {deletingId === link.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                             ) : (
                                                <Trash2 className="h-4 w-4" />
                                             )}
                                             Delete
                                          </Button>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </CardContent>
               </Card>
            ) : (
               <Card>
                  <CardContent className="py-12">
                     <div className="text-center text-muted-foreground">
                        No important links added yet
                     </div>
                  </CardContent>
               </Card>
            )}
         </div>

         {/* Add/Edit Dialog */}
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-md">
               <DialogHeader>
                  <DialogTitle>
                     {editingId ? "Edit Link" : "Create New Link"}
                  </DialogTitle>
                  <DialogDescription>
                     {editingId
                        ? "Update the link details"
                        : "Add a new important link"}
                  </DialogDescription>
               </DialogHeader>

               {editingId ? (
                  // Edit Mode - Single Link Form
                  <Form {...editForm}>
                     <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                        <FormField
                           control={editForm.control}
                           name="name"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>
                                    Name <span className="text-red-500">*</span>
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="e.g., বাংলাদেশ পোর্টাল"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={editForm.control}
                           name="url"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>
                                    URL <span className="text-red-500">*</span>
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="https://example.com"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                           <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                 setIsDialogOpen(false);
                                 setEditingId(null);
                                 editForm.reset();
                              }}
                              disabled={isSaving}
                           >
                              Cancel
                           </Button>
                           <Button type="submit" disabled={isSaving} className="gap-2">
                              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                              Update Link
                           </Button>
                        </div>
                     </form>
                  </Form>
               ) : (
                  // Create Mode - Single Link Form
                  <Form {...createForm}>
                     <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                        <FormField
                           control={createForm.control}
                           name="name"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>
                                    Name <span className="text-red-500">*</span>
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="e.g., বাংলাদেশ পোর্টাল"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <FormField
                           control={createForm.control}
                           name="url"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>
                                    URL <span className="text-red-500">*</span>
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       placeholder="https://example.com"
                                       {...field}
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                           <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                 setIsDialogOpen(false);
                                 createForm.reset();
                              }}
                              disabled={isSaving}
                           >
                              Cancel
                           </Button>
                           <Button type="submit" disabled={isSaving} className="gap-2">
                              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                              Create Link
                           </Button>
                        </div>
                     </form>
                  </Form>
               )}
            </DialogContent>
         </Dialog>

         {/* Delete Confirmation Dialog */}
         <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
            <AlertDialogContent>
               <AlertDialogTitle>Delete Link</AlertDialogTitle>
               <AlertDialogDescription>
                  Are you sure you want to delete this link? This action cannot be undone.
               </AlertDialogDescription>
               <div className="flex justify-end gap-2">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                     className="bg-red-600 hover:bg-red-700"
                  >
                     Delete
                  </AlertDialogAction>
               </div>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}
