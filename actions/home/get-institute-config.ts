"use server";

import { prisma } from "@/lib/prisma";
import { cacheLife, cacheTag } from "next/cache";

export async function getInstituteConfig(instituteId: string) {
   "use cache";
   cacheTag("institute-config");
   cacheLife({ revalidate: 3600 });

   const config = await prisma.config.findFirst({
      where: { instituteId },
      select: {
         mobileNumber: true,
         email: true,
         address: true,
         logo: true,
         facebook: true,
         twitter: true,
         instagram: true,
         linkedin: true,
         youtube: true,
         mapSrc: true,
      },
   });

   return config;
}
