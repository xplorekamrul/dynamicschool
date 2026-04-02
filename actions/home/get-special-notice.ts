"use server";

import { prisma } from "@/lib/prisma";

export async function getSpecialNotice(instituteId: string) {
   try {
      const notice = await prisma.notice.findFirst({
         where: {
            instituteId,
            specialNotice: true,
            isPublished: true,
         },
         orderBy: {
            createdAt: "desc",
         },
      });

      return notice || null;
   } catch (error) {
      console.error("Error fetching special notice:", error);
      return null;
   }
}
