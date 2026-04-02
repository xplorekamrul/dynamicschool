"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

const updateGalleryVideoSchema = z.object({
   id: z.number(),
   title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
   videoSrc: z.string().min(1, "Video URL is required").url("Invalid video URL"),
});

export const updateGalleryVideo = adminActionClient
   .schema(updateGalleryVideoSchema)
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

      const video = await prisma.galleryVideo.update({
         where: { id: parsedInput.id },
         data: {
            title: parsedInput.title,
            videoSrc: parsedInput.videoSrc,
         },
      });

      revalidatePath("/admin/gallery/videos");
      updateTag("gallery-videos");

      return {
         success: true,
         message: "Video updated successfully",
         video,
      };
   });
