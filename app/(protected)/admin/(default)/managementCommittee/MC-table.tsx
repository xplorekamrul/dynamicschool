"use client";

import { deleteMC } from "@/actions/admin/ManagementCommittee/delete-MC";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Loader2, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

type Staff = {
   id: string | bigint;
   name: string;
   image: string | null;
   phoneNumber: string;
   position: string;
   shortDetails: string | null;
};

export default function StaffTable({
   staff,
   onEdit,
   onDelete,
}: {
   staff: Staff[];
   onEdit: (staff: Staff) => void;
   onDelete: (id: string) => void;
}) {
   const [deletingId, setDeletingId] = useState<string | null>(null);

   const { execute: executeDelete } = useAction(deleteMC, {
      onSuccess: (res) => {
         if (res?.data?.success) {
            toast.success("Member deleted successfully");
         }
      },
      onError: (err) => {
         toast.error(err?.error?.serverError || "Failed to delete member");
      },
      onSettled: () => {
         setDeletingId(null);
      },
   });

   const handleDelete = (id: string | bigint) => {
      if (confirm("Are you sure you want to delete this member?")) {
         setDeletingId(String(id));
         executeDelete({ id: String(id) });
         onDelete(String(id));
      }
   };

   if (staff.length === 0) {
      return (
         <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
               No staff found. Click &quot;Add Staff&quot; to create one.
            </CardContent>
         </Card>
      );
   }

   return (
      <Card>
         <CardContent className="p-0">
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead className="bg-muted">
                     <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold">Photo</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold">Position</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold">Details</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y">
                     {staff.map((member) => (
                        <tr key={member.id} className="hover:bg-muted/50">
                           <td className="px-4 py-3">
                              {member.image ? (
                                 // eslint-disable-next-line @next/next/no-img-element
                                 <img
                                    src={member.image}
                                    alt={member.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                 />
                              ) : (
                                 <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs">
                                    {member.name.charAt(0)}
                                 </div>
                              )}
                           </td>
                           <td className="px-4 py-3 text-sm font-medium">{member.name}</td>
                           <td className="px-4 py-3 text-sm">{member.position}</td>
                           <td className="px-4 py-3 text-sm">{member.phoneNumber}</td>
                           <td className="px-4 py-3 text-sm text-muted-foreground truncate max-w-xs">
                              {member.shortDetails || "—"}
                           </td>
                           <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                 <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onEdit(member)}
                                    disabled={deletingId === member.id}
                                 >
                                    <Edit className="h-4 w-4" />
                                 </Button>
                                 <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDelete(member.id)}
                                    disabled={deletingId === String(member.id)}
                                 >
                                    {deletingId === String(member.id) ? (
                                       <Loader2 className="h-4 w-4 text-red-600 animate-spin" />
                                    ) : (
                                       <Trash2 className="h-4 w-4 text-red-600" />
                                    )}
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
   );
}
