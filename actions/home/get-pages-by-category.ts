"use server";

import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export async function getPagesByCategory(instituteId: string, parentTitle: string) {
   "use cache";
   cacheTag("pages-by-category");
   cacheLife({ revalidate: 3600 });

   const parentPage = await prisma.page.findFirst({
      where: {
         instituteId,
         title: parentTitle,
         status: "ACTIVE",
      },
      select: {
         id: true,
      },
   });

   if (!parentPage) {
      return [];
   }

   const pages = await prisma.page.findMany({
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

   return pages;
}
