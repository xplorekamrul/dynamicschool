"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateTag } from "next/cache";
import { z } from "zod";

const reorderGalleryImagesSchema = z.object({
   items: z.array(
      z.object({
         id: z.number(),
         index: z.number(),
      })
   ),
});

export const reorderGalleryImages = adminActionClient
   .schema(reorderGalleryImagesSchema)
   .action(async ({ parsedInput, ctx }) => {
      const session = ctx.session;
      const userId = session.user.id;

      const user = await prisma.user.findUnique({
         where: { id: userId },
         select: { instituteId: true },
      });

      if (!user?.instituteId) {
         throw new Error("Institute not found");
      }

      // Update all items in a transaction
      await Promise.all(
         parsedInput.items.map((item) =>
            prisma.galleryImage.update({
               where: { id: item.id },
               data: { index: item.index },
            })
         )
      );

      revalidatePath("/admin/gallery/images");
      updateTag("gallery-images");

      return {
         success: true,
         message: "Images reordered successfully",
      };
   });
