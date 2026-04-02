"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

const createGalleryVideoSchema = z.object({
   title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
   videoSrc: z.string().min(1, "Video URL is required").url("Invalid video URL"),
});

export const createGalleryVideo = adminActionClient
   .schema(createGalleryVideoSchema)
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

      // Get the highest index for this institute
      const lastVideo = await prisma.galleryVideo.findFirst({
         where: { instituteId: user.instituteId },
         orderBy: { index: "desc" },
         select: { index: true },
      });

      const nextIndex = (lastVideo?.index ?? -1) + 1;

      const video = await prisma.galleryVideo.create({
         data: {
            ...parsedInput,
            index: nextIndex,
            instituteId: user.instituteId,
         },
      });

      revalidatePath("/admin/gallery/videos");
      updateTag("gallery-videos");

      return {
         success: true,
         message: "Video added successfully",
         video,
      };
   });
