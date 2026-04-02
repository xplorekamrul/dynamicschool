import { VideoGalleryClient } from "@/app/(user)/gallery/video-gallery/video-gallery-client";
import { getInstituteId } from "@/lib/shared/get-institute-id";
import { connection } from "next/server";
import { Suspense } from "react";
import { getGalleryVideos } from "../../../../actions/admin/gallery/UserGallery/get-gallery-videos";
import { getInstituteName } from "../../../../actions/admin/gallery/get-institute-name";

async function VideoGalleryContent() {
   // Explicitly defer to request time - must be first
   await connection();

   // Get institute ID from domain
   const instituteId = await getInstituteId();

   if (!instituteId) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <p className="text-muted-foreground">Gallery not available</p>
         </div>
      );
   }

   const [institute, videos] = await Promise.all([
      getInstituteName(instituteId),
      getGalleryVideos(instituteId),
   ]);

   if (!institute) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <p className="text-muted-foreground">Gallery not available</p>
         </div>
      );
   }

   if (videos.length === 0) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <p className="text-muted-foreground">No videos available</p>
         </div>
      );
   }

   return (
      <VideoGalleryClient videos={videos} instituteName={institute.name} />
   );
}

export default function VideoGalleryPage() {
   return (
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
         <VideoGalleryContent />
      </Suspense>
   );
}
