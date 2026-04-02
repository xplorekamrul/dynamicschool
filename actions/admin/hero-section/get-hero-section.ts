"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { getInstituteIdOrThrow } from "@/lib/shared/get-institute-id";

export const getHeroSection = adminActionClient.action(async () => {
   const instituteId = await getInstituteIdOrThrow();

   const heroSection = await prisma.heroSection.findFirst({
      where: { instituteId },
      orderBy: { createdAt: "desc" },
   });

   return { success: true, heroSection };
});
