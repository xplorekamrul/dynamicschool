"use server";

import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export async function getGalleryVideos(instituteId: string) {
   "use cache";
   cacheTag("gallery-videos");
   cacheLife({ revalidate: 3600 });

   const videos = await prisma.galleryVideo.findMany({
      where: { instituteId },
      orderBy: { index: "asc" },
      select: {
         id: true,
         title: true,
         videoSrc: true,
         index: true,
      },
   });

   return videos;
}
