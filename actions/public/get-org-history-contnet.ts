import { prisma } from "@/lib/prisma";
import { lexicalToHtml } from "../../lib/shared/lexical-parser";

export interface ContentItem {
   id: string;
   title: string;
   body: string | null;
   bodyHtml: string;
   subtitle: string | null;
   img_src: string | null;
   img_alt: string | null;
}

export async function getOrganizationalHistoryContent(
   slug: string,
   instituteId: string
) {
   "use cache";

   try {
      // First, find the page
      const page = await prisma.page.findFirst({
         where: {
            slug,
            instituteId,
            status: "ACTIVE",
         },
         select: {
            id: true,
            title: true,
         },
      });

      // console.log("Page Query Result:", {
      //    slug,
      //    instituteId,
      //    pageFound: !!page,
      //    pageTitle: page?.title,
      // });

      if (!page) {
         console.warn(`Page not found for slug: ${slug}`);
         return null;
      }

      // Then fetch all content for this page
      const content = await prisma.content.findMany({
         where: {
            pageId: page.id,
         },
         select: {
            id: true,
            title: true,
            body: true,
            subtitle: true,
            img_src: true,
            img_alt: true,
         },
         orderBy: {
            createdAt: "asc",
         },
      });

      // console.log("Content Query Result:", {
      //    pageId: page.id,
      //    contentCount: content.length,
      // });

      if (content.length === 0) {
         console.warn(`No content found for page: ${slug}`);
         return null;
      }

      return {
         pageTitle: page.title,
         contents: content.map((item) => ({
            ...item,
            bodyHtml: lexicalToHtml(item.body),
         })) as ContentItem[],
      };
   } catch (error) {
      console.error(
         `Error fetching organizational history for slug: ${slug}`,
         error
      );
      return null;
   }
}
