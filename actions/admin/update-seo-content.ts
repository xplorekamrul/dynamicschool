"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSeoContentSchema = z.object({
   seoContentId: z.string(),
   title: z.string().optional(),
   description: z.string().optional(),
   keywords: z.string().optional(),
   canonical_url: z.string().optional(),
   ogTitle: z.string().optional(),
   ogImg: z.string().optional(),
});

export const updateSeoContent = adminActionClient
   .schema(updateSeoContentSchema)
   .action(async ({ parsedInput, ctx }) => {
      const { seoContentId, ...data } = parsedInput;

      // Verify the SEO content belongs to the admin's institute
      const seoContent = await prisma.seoContent.findUnique({
         where: { id: seoContentId },
         include: {
            page: {
               select: { instituteId: true },
            },
         },
      });

      if (!seoContent) {
         throw new Error("SEO Content not found");
      }

      const user = await prisma.user.findUnique({
         where: { id: ctx.session.user.id },
         select: { instituteId: true },
      });

      if (seoContent.page.instituteId !== user?.instituteId) {
         throw new Error("Unauthorized");
      }

      const updatedSeoContent = await prisma.seoContent.update({
         where: { id: seoContentId },
         data,
      });

      return { success: true, seoContent: updatedSeoContent };
   });
