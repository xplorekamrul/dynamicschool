import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import VideoClient from "./video-client";

async function GalleryVideosContent() {
   const session = await auth();

   if (!session?.user) {
      redirect("/admin/login");
   }

   const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { instituteId: true },
   });

   if (!user?.instituteId) {
      redirect("/admin/login");
   }

   const videos = await prisma.galleryVideo.findMany({
      where: { instituteId: user.instituteId },
      orderBy: { index: "asc" },
   });

   const formattedVideos = videos.map((vid) => ({
      ...vid,
      id: Number(vid.id),
   }));

   return <VideoClient initialVideos={formattedVideos} />;
}

export default function GalleryVideosPage() {
   return (
      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
         <GalleryVideosContent />
      </Suspense>
   );
}
