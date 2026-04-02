import { Skeleton } from "@/components/ui/skeleton";

export default function VacancyListSkeleton() {
   return (
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead>
                  <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
                     <th className="px-6 py-3 text-left">
                        <Skeleton className="h-4 w-24" />
                     </th>
                     <th className="px-6 py-3 text-left">
                        <Skeleton className="h-4 w-20" />
                     </th>
                     <th className="px-6 py-3 text-left">
                        <Skeleton className="h-4 w-24" />
                     </th>
                     <th className="px-6 py-3 text-left">
                        <Skeleton className="h-4 w-20" />
                     </th>
                     <th className="px-6 py-3 text-right">
                        <Skeleton className="h-4 w-16 ml-auto" />
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {[...Array(5)].map((_, i) => (
                     <tr key={i} className="border-b hover:bg-gray-50">
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
                           <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Skeleton className="h-8 w-20 ml-auto" />
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}
