"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateContentSchema = z.object({
   contentId: z.string(),
   title: z.string().min(1, "Title is required"),
   subtitle: z.string().optional(),
   body: z.string().optional(),
   img_src: z.string().optional(),
   img_alt: z.string().optional(),
});

export const updateContent = adminActionClient
   .schema(updateContentSchema)
   .action(async ({ parsedInput, ctx }) => {
      const { contentId, ...data } = parsedInput;

      // Verify the content belongs to the admin's institute
      const content = await prisma.content.findUnique({
         where: { id: contentId },
         include: {
            page: {
               select: { instituteId: true },
            },
         },
      });

      if (!content) {
         throw new Error("Content not found");
      }

      const user = await prisma.user.findUnique({
         where: { id: ctx.session.user.id },
         select: { instituteId: true },
      });

      if (content.page.instituteId !== user?.instituteId) {
         throw new Error("Unauthorized");
      }

      const updatedContent = await prisma.content.update({
         where: { id: contentId },
         data,
      });

      return { success: true, content: updatedContent };
   });
