"use server";

import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export async function getAllPages(instituteId: string) {
   "use cache";
   cacheTag("all-pages");
   cacheLife({ revalidate: 3600 });

   const pages = await prisma.page.findMany({
      where: {
         instituteId,
         status: "ACTIVE",
         parentId: null, // Only top-level pages without parent
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
