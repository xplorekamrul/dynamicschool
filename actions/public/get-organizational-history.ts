"use server";

import { prisma } from "@/lib/prisma";

export async function getSeoContent(
   instituteId: string,
   pageSlug: string
) {
   try {
      const page = await prisma.page.findFirst({
         where: {
            instituteId,
            slug: pageSlug,
         },
         include: {
            SeoContent: true,
         },
      });

      if (!page || !page.SeoContent || page.SeoContent.length === 0) {
         return null;
      }

      return page.SeoContent[0];
   } catch (error) {
      console.error("Error fetching SEO content:", error);
      return null;
   }
}
