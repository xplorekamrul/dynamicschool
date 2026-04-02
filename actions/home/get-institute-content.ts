"use server";

import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export async function getInstituteContent(instituteId: string, pageIdentifier: string) {
   "use cache";
   cacheTag("institute-content");
   cacheLife({ revalidate: 3600 });

   // Try to find by slug first, then by title
   const page = await prisma.page.findFirst({
      where: {
         instituteId,
         OR: [
            { slug: pageIdentifier },
            { title: pageIdentifier }
         ],
         status: "ACTIVE",
      },
      select: {
         id: true,
         title: true,
         slug: true,
         content: {
            select: {
               title: true,
               body: true,
               subtitle: true,
               img_src: true,
               img_alt: true,
            },
            take: 1,
         },
      },
   });

   return page;
}
