"use client";

import { deleteStaff, getStaffByInstitute } from "@/actions/staff";
import { Plus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import StaffModal from "./staff-modal";
import StaffTable from "./staff-table";

interface StaffMember {
   id: bigint;
   name: string;
   phoneNumber: string;
   position: string;
   image?: string;
}

export default function StaffPage() {
   const [staff, setStaff] = useState<StaffMember[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingStaff, setEditingStaff] = useState<StaffMember | undefined>(undefined);
   const [deleteLoading, setDeleteLoading] = useState<bigint | null>(null);

   const { execute: fetchStaff } = useAction(getStaffByInstitute, {
      onSuccess: (result) => {
         setStaff(result.data || []);
         setIsLoading(false);
      },
      onError: () => {
         toast.error("Failed to fetch staff");
         setIsLoading(false);
      },
   });

   const { execute: removeStaff } = useAction(deleteStaff, {
      onSuccess: () => {
         toast.success("Staff deleted successfully");
         fetchStaff();
      },
      onError: () => {
         toast.error("Failed to delete staff");
         setDeleteLoading(null);
      },
   });

   useEffect(() => {
      fetchStaff();
   }, [fetchStaff]);

   const handleEdit = (staffMember: StaffMember) => {
      setEditingStaff(staffMember);
      setIsModalOpen(true);
   };

   const handleDelete = async (id: bigint) => {
      setDeleteLoading(id);
      removeStaff({ id });
   };

   const handleModalClose = () => {
      setIsModalOpen(false);
      setEditingStaff(undefined);
   };

   const handleModalSuccess = () => {
      handleModalClose();
      fetchStaff();
   };

   return (
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-bold">Staff Management</h1>
               <p className="text-muted-foreground mt-1">
                  Manage support staff members
               </p>
            </div>
            <button
               onClick={() => setIsModalOpen(true)}
               className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition flex items-center gap-2"
            >
               <Plus size={18} />
               Add Staff
            </button>
         </div>

         {isLoading ? (
            <div className="flex justify-center items-center h-64">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
         ) : (
            <StaffTable
               staff={staff}
               onEdit={handleEdit}
               onDelete={handleDelete}
               deleteLoading={deleteLoading}
            />
         )}

         <StaffModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
            editingStaff={editingStaff}
         />
      </div>
   );
}
