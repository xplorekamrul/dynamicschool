"use server";

import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export async function getChildPages(instituteId: string, parentSlug: string) {
   "use cache";
   cacheTag("child-pages");
   cacheLife({ revalidate: 3600 });

   const parentPage = await prisma.page.findFirst({
      where: {
         instituteId,
         slug: parentSlug,
         status: "ACTIVE",
      },
      select: {
         id: true,
      },
   });

   if (!parentPage) {
      return [];
   }

   const childPages = await prisma.page.findMany({
      where: {
         instituteId,
         parentId: parentPage.id,
         status: "ACTIVE",
      },
      select: {
         id: true,
         title: true,
         slug: true,
      },
      orderBy: {
         createdAt: "asc",
      },
   });

   return childPages;
}
