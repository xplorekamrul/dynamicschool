"use server";

import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export async function getFeaturedPages(instituteId: string, pageSlugs: string[]) {
   "use cache";
   cacheTag("featured-pages");
   cacheLife({ revalidate: 3600 });

   const pages = await prisma.page.findMany({
      where: {
         instituteId,
         slug: {
            in: pageSlugs,
         },
         status: "ACTIVE",
      },
      select: {
         id: true,
         title: true,
         slug: true,
         content: {
            select: {
               title: true,
               img_src: true,
               img_alt: true,
            },
            take: 1,
         },
      },
   });

   return pages;
}