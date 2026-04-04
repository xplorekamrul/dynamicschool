"use server";

import { prisma } from "@/lib/prisma";
import { getImageUrl } from "@/lib/shared/image-utils";

export async function getSeoContent(instituteId: string, pageSlug: string) {
   try {
      // Handle homepage slug conversion - homepage might be stored as "/home" or "home"
      let slugToSearch = pageSlug;
      if (pageSlug === "/" || pageSlug === "") {
         slugToSearch = "home";
      }

      const page = await prisma.page.findFirst({
         where: {
            instituteId,
            slug: slugToSearch,
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

/**
 * Get SEO content with favicon from Config table
 * Combines SeoContent and Config data for complete metadata
 */
export async function getSeoContentWithFavicon(instituteId: string, pageSlug: string) {
   try {
      // Fetch SEO content and config in parallel
      const [seoContent, config] = await Promise.all([
         getSeoContent(instituteId, pageSlug),
         prisma.config.findFirst({
            where: { instituteId },
            select: {
               favicon: true,
               logo: true,
            },
         }),
      ]);

      // Convert favicon and logo paths to proper URLs
      const faviconUrl = getImageUrl(config?.favicon) || "/logo.png";
      const logoUrl = getImageUrl(config?.logo);

      return {
         seoContent,
         favicon: faviconUrl,
         logo: logoUrl,
      };
   } catch (error) {
      console.error("Error fetching SEO content with favicon:", error);
      return {
         seoContent: null,
         favicon: "/logo.png",
         logo: null,
      };
   }
}
