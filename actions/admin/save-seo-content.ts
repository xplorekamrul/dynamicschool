"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const saveSeoContentSchema = z.object({
   pageId: z.string(),
   seoContentId: z.string().optional(),
   title: z.string().optional(),
   description: z.string().optional(),
   keywords: z.string().optional(),
   canonical_url: z.string().optional(),
   ogTitle: z.string().optional(),
   ogImg: z.string().optional(),
   schema: z.any().optional(),
});

export const saveSeoContent = adminActionClient
   .schema(saveSeoContentSchema)
   .action(async ({ parsedInput, ctx }) => {
      const { pageId, seoContentId, ...data } = parsedInput;

      // Verify the page belongs to the admin's institute
      const page = await prisma.page.findUnique({
         where: { id: pageId },
         select: { instituteId: true },
      });

      if (!page) {
         throw new Error("Page not found");
      }

      const user = await prisma.user.findUnique({
         where: { id: ctx.session.user.id },
         select: { instituteId: true },
      });

      if (page.instituteId !== user?.instituteId) {
         throw new Error("Unauthorized");
      }

      let seoContent;

      if (seoContentId) {
         // Update existing SEO content
         seoContent = await prisma.seoContent.update({
            where: { id: seoContentId },
            data,
         });
      } else {
         // Create new SEO content
         seoContent = await prisma.seoContent.create({
            data: {
               pageId,
               ...data,
            },
         });
      }

      return { success: true, seoContent };
   });
