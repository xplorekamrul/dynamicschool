"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

const deleteGalleryVideoSchema = z.object({
   id: z.number(),
});

export const deleteGalleryVideo = adminActionClient
   .schema(deleteGalleryVideoSchema)
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

      await prisma.galleryVideo.delete({
         where: { id: parsedInput.id },
      });

      revalidatePath("/admin/gallery/videos");
      updateTag("gallery-videos");

      return {
         success: true,
         message: "Video deleted successfully",
      };
   });
