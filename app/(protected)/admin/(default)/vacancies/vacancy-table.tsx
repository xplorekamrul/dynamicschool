"use client";

import { deleteVacancy } from "@/actions/admin/vacancy/delete-vacancy";
import { loadVacancies } from "@/actions/admin/vacancy/load-vacancies";
import { LexicalRenderer } from "@/components/shared/lexical-renderer";
import { Button } from "@/components/ui/button";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import VacancyFormModal from "./vacancy-form-modal";

type Vacancy = {
   id: bigint;
   post: string;
   salaryScale?: string | null;
   details?: string | null;
   link?: string | null;
   createdAt: Date;
   updatedAt: Date;
};

export default function VacancyTable() {
   const queryClient = useQueryClient();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);

   // Load vacancies
   const { data: vacancies = [], isLoading, refetch } = useQuery({
      queryKey: ["admin-vacancies"],
      queryFn: async () => {
         const result = await loadVacancies();
         if (result?.data) {
            return result.data;
         }
         throw new Error("Failed to load vacancies");
      },
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
   });

   // Delete vacancy
   const { execute: executeDelete, isExecuting: isDeleting } = useAction(
      deleteVacancy,
      {
         onSuccess: ({ data }) => {
            if (data?.success) {
               toast.success(data.message);
               queryClient.invalidateQueries({ queryKey: ["admin-vacancies"] });
            }
         },
         onError: ({ error }) => {
            toast.error(error.serverError || "Failed to delete vacancy");
         },
      }
   );

   const handleEdit = (vacancy: Vacancy) => {
      setSelectedVacancy(vacancy);
      setIsModalOpen(true);
   };

   const handleDelete = (id: bigint) => {
      if (confirm("Are you sure you want to delete this vacancy?")) {
         executeDelete({ id: id.toString() });
      }
   };

   const handleNewVacancy = () => {
      setSelectedVacancy(null);
      setIsModalOpen(true);
   };

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
         </div>
      );
   }

   return (
      <>
         <div className="flex items-center justify-end gap-2 mb-6">
            <Button
               variant="outline"
               onClick={() => refetch()}
            >
               <Loader2 className="h-4 w-4 mr-2" />
               Refresh
            </Button>
            <Button onClick={handleNewVacancy}>
               <Plus className="h-4 w-4 mr-2" />
               New Vacancy
            </Button>
         </div>

         <div className="bg-white rounded-lg border shadow-sm overflow-hidden ">
            <div className="overflow-x-auto">
               <div className="max-h-[600px] overflow-y-auto">
                  <Table>
                     <TableHeader className="sticky top-0 bg-white z-10">
                        <TableRow>
                           <TableHead className="w-12">#</TableHead>
                           <TableHead>Post</TableHead>
                           <TableHead>Salary Scale</TableHead>
                           <TableHead>Details</TableHead>
                           <TableHead>Link</TableHead>
                           <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {vacancies.length === 0 ? (
                           <TableRow>
                              <TableCell colSpan={6} className="text-center py-12">
                                 <p className="text-gray-500">No vacancies found</p>
                              </TableCell>
                           </TableRow>
                        ) : (
                           vacancies.map((vacancy, index) => (
                              <TableRow key={vacancy.id.toString()}>
                                 <TableCell className="font-medium">{index + 1}</TableCell>
                                 <TableCell className="font-medium">{vacancy.post}</TableCell>
                                 <TableCell className="text-gray-600">
                                    {vacancy.salaryScale || "N/A"}
                                 </TableCell>
                                 <TableCell className="text-gray-600 max-w-xs">
                                    {vacancy.details ? (
                                       <div className="text-sm line-clamp-2">
                                          <LexicalRenderer content={vacancy.details} />
                                       </div>
                                    ) : (
                                       "N/A"
                                    )}
                                 </TableCell>
                                 <TableCell>
                                    {vacancy.link ? (
                                       <a
                                          href={vacancy.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-emerald-600 hover:underline text-sm truncate max-w-xs block"
                                       >
                                          {vacancy.link}
                                       </a>
                                    ) : (
                                       <span className="text-gray-400">N/A</span>
                                    )}
                                 </TableCell>
                                 <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                       <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleEdit(vacancy)}
                                       >
                                          <Edit className="h-4 w-4" />
                                       </Button>
                                       <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => handleDelete(vacancy.id)}
                                          disabled={isDeleting}
                                       >
                                          <Trash2 className="h-4 w-4" />
                                       </Button>
                                    </div>
                                 </TableCell>
                              </TableRow>
                           ))
                        )}
                     </TableBody>
                  </Table>
               </div>
            </div>
         </div>

         <VacancyFormModal
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
            vacancy={selectedVacancy}
         />
      </>
   );
}
