"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const getPageSeoContentSchema = z.object({
   pageId: z.string(),
});

export const getPageSeoContent = adminActionClient
   .schema(getPageSeoContentSchema)
   .action(async ({ parsedInput, ctx }) => {
      const { pageId } = parsedInput;

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

      const seoContent = await prisma.seoContent.findFirst({
         where: { pageId },
         orderBy: { createdAt: "desc" },
      });

      return { seoContent };
   });
