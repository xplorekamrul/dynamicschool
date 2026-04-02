"use client";

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
import { Briefcase, ExternalLink } from "lucide-react";

type Vacancy = {
   id: bigint;
   post: string;
   salaryScale?: string | null;
   details?: string | null;
   link?: string | null;
   createdAt: Date;
   updatedAt: Date;
};

interface VacancyListViewProps {
   vacancies: Vacancy[];
}

export default function VacancyListView({ vacancies }: VacancyListViewProps) {
   if (vacancies.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center py-16 px-4">
            <Briefcase className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
               No Vacancies Available
            </h3>
            <p className="text-gray-500 text-center max-w-md">
               There are currently no job vacancies. Please check back later for new opportunities.
            </p>
         </div>
      );
   }

   return (
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <Table>
               <TableHeader>
                  <TableRow className="bg-gradient-to-r from-emerald-50 to-teal-50">
                     <TableHead className="font-semibold text-gray-900">Position</TableHead>
                     <TableHead className="font-semibold text-gray-900">Salary Scale</TableHead>
                     <TableHead className="font-semibold text-gray-900">Description</TableHead>
                     <TableHead className="font-semibold text-gray-900">Posted Date</TableHead>
                     <TableHead className="text-right font-semibold text-gray-900">Action</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {vacancies.map((vacancy) => (
                     <TableRow
                        key={vacancy.id.toString()}
                        className="hover:bg-gray-50 transition-colors"
                     >
                        <TableCell className="font-semibold text-gray-900">
                           <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                              {vacancy.post}
                           </div>
                        </TableCell>
                        <TableCell className="text-gray-700">
                           {vacancy.salaryScale || "N/A"}
                        </TableCell>
                        <TableCell className="text-gray-600 max-w-xs">
                           <div className="truncate text-sm" title={vacancy.details || ""}>
                              {vacancy.details ? (
                                 <LexicalRenderer content={vacancy.details} />
                              ) : (
                                 "N/A"
                              )}
                           </div>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                           {new Date(vacancy.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                           })}
                        </TableCell>
                        <TableCell className="text-right">
                           {vacancy.link ? (
                              <Button
                                 asChild
                                 size="sm"
                                 className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                 <a
                                    href={vacancy.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1"
                                 >
                                    <ExternalLink className="h-3 w-3" />
                                    Apply
                                 </a>
                              </Button>
                           ) : (
                              <span className="text-gray-400 text-sm">N/A</span>
                           )}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}
