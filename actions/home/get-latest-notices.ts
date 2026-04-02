"use server";

import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export async function getLatestNotices(instituteId: string, limit: number = 5) {
   "use cache";
   cacheTag("latest-notices");
   cacheLife({ revalidate: 1800 });

   const notices = await prisma.notice.findMany({
      where: {
         instituteId,
         isPublished: true,
      },
      select: {
         id: true,
         title: true,
         slug: true,
         createdAt: true,
      },
      orderBy: {
         createdAt: "desc",
      },
      take: limit,
   });

   return notices;
}
