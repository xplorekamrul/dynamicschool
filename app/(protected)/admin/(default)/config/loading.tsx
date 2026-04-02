import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConfigLoading() {
   return (
      <section className="space-y-6">
         <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-24" />
         </div>

         <div className="space-y-6">
            <Card>
               <CardContent className="pt-6 space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <div className="space-y-3">
                     <Skeleton className="h-12 w-full" />
                     <Skeleton className="h-12 w-full" />
                     <Skeleton className="h-24 w-full" />
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="pt-6 space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-3">
                     <Skeleton className="h-12 w-full" />
                     <Skeleton className="h-12 w-full" />
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="pt-6 space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <div className="space-y-3">
                     <Skeleton className="h-12 w-full" />
                     <Skeleton className="h-12 w-full" />
                     <Skeleton className="h-12 w-full" />
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardContent className="pt-6 space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <div className="space-y-3">
                     <Skeleton className="h-12 w-full" />
                     <Skeleton className="h-12 w-full" />
                     <Skeleton className="h-12 w-full" />
                  </div>
               </CardContent>
            </Card>
         </div>
      </section>
   );
}
