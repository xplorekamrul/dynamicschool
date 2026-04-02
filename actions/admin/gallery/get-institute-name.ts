"use server";

import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export async function getInstituteName(instituteId: string) {
   "use cache";
   cacheTag("institute-name");
   cacheLife({ revalidate: 86400 });

   const institute = await prisma.institute.findUnique({
      where: { id: instituteId },
      select: { name: true },
   });

   return institute;
}
