import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";

export default function Loading() {
   return (
      <div className="space-y-6">
         {/* Header Skeleton */}
         <div className="flex items-center justify-between">
            <div className="space-y-2">
               <div className="h-9 w-64 bg-gray-200 rounded animate-pulse" />
               <div className="h-5 w-96 bg-gray-200 rounded animate-pulse" />
            </div>
         </div>

         {/* Table Skeleton */}
         <div className="bg-white rounded-lg border shadow-sm">
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className="w-12">#</TableHead>
                     <TableHead>Title</TableHead>
                     <TableHead>Slug</TableHead>
                     <TableHead>Type</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {[...Array(5)].map((_, index) => (
                     <TableRow key={index}>
                        <TableCell>
                           <div className="h-5 w-6 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                           <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                           <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                        </TableCell>
                        <TableCell>
                           <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell>
                           <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                        </TableCell>
                        <TableCell className="text-right">
                           <div className="flex items-center justify-end gap-2">
                              <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                              <div className="h-6 w-11 bg-gray-200 rounded-full animate-pulse" />
                           </div>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>

         {/* Info Box Skeleton */}
         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="h-6 w-32 bg-blue-200 rounded animate-pulse mb-3" />
            <div className="space-y-2">
               {[...Array(6)].map((_, index) => (
                  <div key={index} className="h-4 w-full bg-blue-200 rounded animate-pulse" />
               ))}
            </div>
         </div>
      </div>
   );
}
