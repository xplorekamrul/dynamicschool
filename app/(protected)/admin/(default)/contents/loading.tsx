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

         {/* Stats Skeleton */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, index) => (
               <div key={index} className="bg-white rounded-lg border p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse" />
                     <div className="space-y-2 flex-1">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* Tabs and Content Skeleton */}
         <div className="bg-white rounded-lg border shadow-sm">
            {/* Tabs Skeleton */}
            <div className="border-b">
               <div className="flex">
                  <div className="flex-1 px-6 py-3">
                     <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
                  </div>
                  <div className="flex-1 px-6 py-3">
                     <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
                  </div>
               </div>
            </div>

            {/* Search Skeleton */}
            <div className="p-4 border-b bg-gray-50">
               <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>

            {/* Content List Skeleton */}
            <div className="divide-y">
               {[...Array(5)].map((_, index) => (
                  <div key={index} className="p-4">
                     <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                           <div className="h-6 w-64 bg-gray-200 rounded animate-pulse" />
                           <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
                           <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
