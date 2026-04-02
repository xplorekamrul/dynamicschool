"use client";

import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { use, useState } from "react";
import MCForm from "./MC-form";
import MCTable from "./MC-table";

type ManagementCommittee = {
   id: string | bigint;
   name: string;
   image: string | null;
   phoneNumber: string;
   position: string;
   shortDetails: string | null;
};

export default function MCPageContent({
   dataPromise,
}: {
   dataPromise: Promise<{ members: ManagementCommittee[]; instituteId: string }>;
}) {
   const { members: initialMembers, instituteId } = use(dataPromise);
   const [members, setMembers] = useState<ManagementCommittee[]>(initialMembers);
   const [isOpen, setIsOpen] = useState(false);
   const [editingMember, setEditingMember] = useState<ManagementCommittee | null>(null);

   const handleAdd = () => {
      setEditingMember(null);
      setIsOpen(true);
   };

   const handleEdit = (member: ManagementCommittee) => {
      setEditingMember(member);
      setIsOpen(true);
   };

   const handleSuccess = (newMember: ManagementCommittee) => {
      if (editingMember) {
         setMembers(members.map((m) => (String(m.id) === String(newMember.id) ? newMember : m)));
      } else {
         setMembers([...members, newMember]);
      }
      setIsOpen(false);
      setEditingMember(null);
   };

   const handleDelete = (id: string | bigint) => {
      setMembers(members.filter((m) => String(m.id) !== String(id)));
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Management Committee</h1>
               <p className="text-muted-foreground mt-1">
                  Manage management committee members
               </p>
            </div>
            <Button onClick={handleAdd}>
               <Plus className="h-4 w-4 mr-2" />
               Add Member
            </Button>
         </div>

         <div >
            <MCTable
               staff={members}
               onEdit={handleEdit}
               onDelete={handleDelete}
            />
         </div>

         {/* <div className="lg:col-span-1">
               <div className="bg-card border rounded-lg p-6 sticky top-6">
                  <h3 className="font-semibold mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Members</span>
                        <span className="text-2xl font-bold">{members.length}</span>
                     </div>
                  </div>
               </div>
            </div> */}

         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-2xl">
               <DialogHeader>
                  <DialogTitle>
                     {editingMember ? "Edit Member" : "Add New Member"}
                  </DialogTitle>
               </DialogHeader>
               <MCForm
                  staff={editingMember}
                  instituteId={instituteId}
                  onSuccess={handleSuccess}
                  onCancel={() => setIsOpen(false)}
               />
            </DialogContent>
         </Dialog>
      </div>
   );
}
