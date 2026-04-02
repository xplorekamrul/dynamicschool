"use server";

import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export async function getGalleryImages(instituteId: string) {
   "use cache";
   cacheTag("gallery-images");
   cacheLife({ revalidate: 3600 });

   const images = await prisma.galleryImage.findMany({
      where: {
         instituteId,
         index: {
            in: [0, 1, 2],
         },
      },
      select: {
         id: true,
         title: true,
         ImgSrc: true,
         ImgAlt: true,
         index: true,
      },
      orderBy: {
         index: "asc",
      },
   });

   return images;
}
