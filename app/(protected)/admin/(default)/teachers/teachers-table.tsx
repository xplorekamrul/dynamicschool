"use client";

import { deleteTeacher } from "@/actions/admin/teachers/delete-teacher";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

type Teacher = {
   id: string;
   name: string;
   image: string | null;
   designation: string;
   classes: string | null;
   mobile: string;
   status: "ACTIVE" | "RETIRED";
};

export default function TeachersTable({
   teachers,
   onEdit,
   onDelete,
}: {
   teachers: Teacher[];
   onEdit: (teacher: Teacher) => void;
   onDelete: (id: string) => void;
}) {
   const { execute: executeDelete } = useAction(deleteTeacher, {
      onSuccess: (res) => {
         if (res?.data?.success) {
            toast.success("Teacher deleted successfully");
         }
      },
      onError: (err) => {
         toast.error(err?.error?.serverError || "Failed to delete teacher");
      },
   });

   const handleDelete = (id: string) => {
      if (confirm("Are you sure you want to delete this teacher?")) {
         executeDelete({ id });
         onDelete(id);
      }
   };

   if (teachers.length === 0) {
      return (
         <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
               No teachers found. Click &quot;Add Teacher&quot; to create one.
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
                        <th className="px-4 py-3 text-left text-xs font-semibold">Designation</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold">Classes</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold">Mobile</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y">
                     {teachers.map((teacher) => (
                        <tr key={teacher.id} className="hover:bg-muted/50">
                           <td className="px-4 py-3">
                              {teacher.image ? (
                                 // eslint-disable-next-line @next/next/no-img-element
                                 <img
                                    src={teacher.image}
                                    alt={teacher.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                 />
                              ) : (
                                 <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs">
                                    {teacher.name.charAt(0)}
                                 </div>
                              )}
                           </td>
                           <td className="px-4 py-3 text-sm font-medium">{teacher.name}</td>
                           <td className="px-4 py-3 text-sm">{teacher.designation}</td>
                           <td className="px-4 py-3 text-sm">{teacher.classes || "N/P"}</td>
                           <td className="px-4 py-3 text-sm">{teacher.mobile}</td>
                           <td className="px-4 py-3">
                              <span
                                 className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${teacher.status === "ACTIVE"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                    }`}
                              >
                                 {teacher.status}
                              </span>
                           </td>
                           <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-2">
                                 <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onEdit(teacher)}
                                 >
                                    <Edit className="h-4 w-4" />
                                 </Button>
                                 <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDelete(teacher.id)}
                                 >
                                    <Trash2 className="h-4 w-4 text-red-600" />
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
