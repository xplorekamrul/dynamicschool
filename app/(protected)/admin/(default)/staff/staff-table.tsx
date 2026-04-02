"use client";

import { deleteStaff } from "@/actions/staff";
import { Edit2, Loader2, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface StaffMember {
   id: bigint;
   name: string;
   phoneNumber: string;
   position: string;
   image?: string;
}

interface StaffTableProps {
   staff: StaffMember[];
   onEdit: (staff: StaffMember) => void;
   onDelete: (id: bigint) => void;
   deleteLoading: bigint | null;
}

export default function StaffTable({
   staff,
   onEdit,
   onDelete,
   deleteLoading,
}: StaffTableProps) {
   const [deletingId, setDeletingId] = useState<string | null>(null);

   const { execute: executeDelete } = useAction(deleteStaff, {
      onSuccess: () => {
         toast.success("Staff deleted successfully");
      },
      onError: (err) => {
         toast.error(err?.error?.serverError || "Failed to delete staff");
      },
      onSettled: () => {
         setDeletingId(null);
      },
   });

   const handleDelete = (id: bigint) => {
      if (confirm("Are you sure you want to delete this staff member?")) {
         setDeletingId(String(id));
         executeDelete({ id });
         onDelete(id);
      }
   };

   if (staff.length === 0) {
      return (
         <div className="bg-white rounded-lg shadow border p-8 text-center text-gray-500">
            No staff found. Click &quot;Add Staff&quot; to create one.
         </div>
      );
   }

   return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-gray-50 border-b">
                  <tr>
                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Photo</th>
                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Position</th>
                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Phone</th>
                     <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {staff.map((member) => (
                     <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                           {member.image ? (
                              <div className="relative h-10 w-10 rounded-full overflow-hidden">
                                 <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                 />
                              </div>
                           ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                 {member.name.charAt(0).toUpperCase()}
                              </div>
                           )}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{member.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{member.position}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{member.phoneNumber}</td>
                        <td className="px-4 py-3 text-right">
                           <div className="flex justify-end gap-2">
                              <button
                                 onClick={() => onEdit(member)}
                                 disabled={deleteLoading === member.id}
                                 className="p-2 hover:bg-primary/10 rounded-lg transition text-primary disabled:opacity-50"
                                 title="Edit"
                              >
                                 <Edit2 size={18} />
                              </button>
                              <button
                                 onClick={() => handleDelete(member.id)}
                                 disabled={deletingId === String(member.id)}
                                 className="p-2 hover:bg-red-100 rounded-lg transition text-red-600 disabled:opacity-50"
                                 title="Delete"
                              >
                                 {deletingId === String(member.id) ? (
                                    <Loader2 size={18} className="animate-spin" />
                                 ) : (
                                    <Trash2 size={18} />
                                 )}
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}
