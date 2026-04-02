"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";
import TeacherForm from "./teacher-form";
import TeachersTable from "./teachers-table";

type Teacher = {
   id: string;
   name: string;
   image: string | null;
   designation: string;
   classes: string | null;
   mobile: string;
   status: "ACTIVE" | "RETIRED";
};

export default function TeachersClient({
   initialTeachers,
   instituteId,
}: {
   initialTeachers: Teacher[];
   instituteId: string;
}) {
   const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

   const handleAdd = () => {
      setEditingTeacher(null);
      setIsFormOpen(true);
   };

   const handleEdit = (teacher: Teacher) => {
      setEditingTeacher(teacher);
      setIsFormOpen(true);
   };

   const handleFormClose = () => {
      setIsFormOpen(false);
      setEditingTeacher(null);
   };

   const handleSuccess = (teacher: Teacher) => {
      if (editingTeacher) {
         setTeachers(teachers.map((t) => (t.id === teacher.id ? teacher : t)));
      } else {
         setTeachers([teacher, ...teachers]);
      }
      handleFormClose();
   };

   const handleDelete = (id: string) => {
      setTeachers(teachers.filter((t) => t.id !== id));
   };

   return (
      <div className="space-y-6">
         <div className="flex justify-end">
            <Button onClick={handleAdd}>
               <Plus className="h-4 w-4 mr-2" />
               Add Teacher
            </Button>
         </div>

         {isFormOpen && (
            <Card>
               <CardContent className="pt-6">
                  <TeacherForm
                     teacher={editingTeacher}
                     instituteId={instituteId}
                     onSuccess={handleSuccess}
                     onCancel={handleFormClose}
                  />
               </CardContent>
            </Card>
         )}

         <TeachersTable
            teachers={teachers}
            onEdit={handleEdit}
            onDelete={handleDelete}
         />
      </div>
   );
}
