"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
   pageId: z.string().min(1),
});

export const getPageContent = adminActionClient
   .schema(schema)
   .action(async ({ parsedInput, ctx }) => {
      const { pageId } = parsedInput;
      const userId = ctx.session.user.id;

      // Verify user has access
      const user = await prisma.user.findUnique({
         where: { id: userId },
         select: { instituteId: true },
      });

      if (!user?.instituteId) {
         throw new Error("Institute not found");
      }

      const page = await prisma.page.findFirst({
         where: {
            id: pageId,
            instituteId: user.instituteId,
         },
         include: {
            content: {
               orderBy: { createdAt: "desc" },
               take: 1,
            },
         },
      });

      if (!page) {
         throw new Error("Page not found or access denied");
      }

      return { page, content: page.content[0] || null };
   });
