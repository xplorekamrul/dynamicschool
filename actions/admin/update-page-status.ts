"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
   pageId: z.string().min(1, "Page ID is required"),
   status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const updatePageStatus = adminActionClient
   .schema(schema)
   .action(async ({ parsedInput, ctx }) => {
      const { pageId, status } = parsedInput;
      const userId = ctx.session.user.id;

      // Get user's institute
      const user = await prisma.user.findUnique({
         where: { id: userId },
         select: { instituteId: true },
      });

      if (!user?.instituteId) {
         throw new Error("Institute not found for this admin");
      }

      // Verify page belongs to admin's institute
      const page = await prisma.page.findFirst({
         where: {
            id: pageId,
            instituteId: user.instituteId,
         },
      });

      if (!page) {
         throw new Error("Page not found or access denied");
      }

      // Update page status
      await prisma.page.update({
         where: { id: pageId },
         data: { status },
      });

      // Revalidate the specific page on the public site
      revalidatePath(`/${page.slug}`, "page");

      return { success: true, message: "Page status updated successfully" };
   });
