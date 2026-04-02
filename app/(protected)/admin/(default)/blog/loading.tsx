export default function BlogLoading() {
   return (
      <div className="space-y-6">
         <div>
            <div className="h-10 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mt-2 animate-pulse" />
         </div>

         <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="space-y-2">
               {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
               ))}
            </div>
         </div>
      </div>
   );
}
