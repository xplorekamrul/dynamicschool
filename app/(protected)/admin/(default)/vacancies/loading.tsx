import { Skeleton } from "@/components/ui/skeleton";

export default function VacanciesLoading() {
   return (
      <div className="space-y-6">
         <div>
            <h1 className="text-3xl font-bold text-gray-900">Vacancies Management</h1>
            <p className="text-gray-500 mt-1">
               Manage job vacancies for your institute
            </p>
         </div>

         <div className="flex items-center justify-end gap-2 mb-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
         </div>

         <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead>
                     <tr className="border-b">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 w-12">
                           #
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                           Post
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                           Salary Scale
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                           Details
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                           Link
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {[...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                           <td className="px-6 py-4">
                              <Skeleton className="h-4 w-6" />
                           </td>
                           <td className="px-6 py-4">
                              <Skeleton className="h-4 w-32" />
                           </td>
                           <td className="px-6 py-4">
                              <Skeleton className="h-4 w-24" />
                           </td>
                           <td className="px-6 py-4">
                              <Skeleton className="h-4 w-40" />
                           </td>
                           <td className="px-6 py-4">
                              <Skeleton className="h-4 w-32" />
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <Skeleton className="h-8 w-8" />
                                 <Skeleton className="h-8 w-8" />
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}
