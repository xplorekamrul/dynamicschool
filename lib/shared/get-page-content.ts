import { prisma } from "@/lib/prisma";

export interface PageContent {
   title: string;
   body: string | null;
   subtitle?: string | null;
   img_src?: string | null;
   img_alt?: string | null;
}

/**
 * Fetch page content by slug and institute ID
 * Uses use cache directive for prerendering
 */
export async function getPageContent(
   slug: string,
   instituteId: string
): Promise<PageContent | null> {
   "use cache";

   try {
      const page = await prisma.page.findFirst({
         where: {
            slug,
            instituteId,
            status: "ACTIVE",
         },
         select: {
            id: true,
         },
      });

      if (!page) {
         console.warn(`[getPageContent] Page not found - slug: ${slug}, instituteId: ${instituteId}`);
         return null;
      }

      const content = await prisma.content.findFirst({
         where: {
            pageId: page.id,
         },
         select: {
            title: true,
            body: true,
            subtitle: true,
            img_src: true,
            img_alt: true,
         },
      });

      if (!content) {
         console.warn(`[getPageContent] Content not found for page - slug: ${slug}, pageId: ${page.id}`);
      }

      return content;
   } catch (error) {
      console.error(`Error fetching page content for slug: ${slug}`, error);
      return null;
   }
}
