"use server";

import { prisma } from "@/lib/prisma";
import { getInstituteId } from "@/lib/shared/get-institute-id";
import { unstable_noStore } from "next/cache";

export async function getHeroSection() {
   try {
      // Disable caching for this function since it depends on institute ID from headers
      unstable_noStore();

      const instituteId = await getInstituteId();
      if (!instituteId) return null;

      const heroSection = await prisma.heroSection.findFirst({
         where: {
            instituteId,
            isActive: true,
         },
      });

      return heroSection || null;
   } catch (error) {
      // During prerendering, this will fail gracefully
      // Return null to allow the page to render without hero section data
      if (error instanceof Error && error.message.includes("prerendering")) {
         return null;
      }
      console.error("Error fetching hero section:", error);
      return null;
   }
}
