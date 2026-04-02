export default function VideoGalleryLoading() {
   return (
      <div className="min-h-screen bg-background">
         <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
               <div className="h-10 w-48 bg-muted rounded-lg animate-pulse" />
               <div className="h-4 w-96 bg-muted rounded-lg animate-pulse mt-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                     <div className="aspect-video bg-muted rounded-lg animate-pulse" />
                     <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
