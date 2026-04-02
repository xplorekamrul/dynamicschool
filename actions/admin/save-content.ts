"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
   pageId: z.string().min(1),
   contentId: z.string().optional(),
   title: z.string().min(1, "Title is required"),
   subtitle: z.string().optional(),
   body: z.string().optional(),
   img_src: z.string().optional(),
   img_alt: z.string().optional(),
});

export const saveContent = adminActionClient
   .schema(schema)
   .action(async ({ parsedInput, ctx }) => {
      const { pageId, contentId, title, subtitle, body, img_src, img_alt } = parsedInput;
      const userId = ctx.session.user.id;

      // Verify user has access to this page
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
      });

      if (!page) {
         throw new Error("Page not found or access denied");
      }

      let content;

      if (contentId) {
         // Update existing content
         content = await prisma.content.update({
            where: { id: contentId },
            data: { title, subtitle, body, img_src, img_alt },
         });
      } else {
         // Create new content
         content = await prisma.content.create({
            data: {
               pageId,
               title,
               subtitle,
               body,
               img_src,
               img_alt,
            },
         });
      }

      revalidatePath("/admin/pages");
      revalidatePath("/admin/contents");

      return { success: true, content };
   });
