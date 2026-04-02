"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

const createGalleryImageSchema = z.object({
   title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
   ImgSrc: z.string().min(1, "Image is required"),
   ImgAlt: z.string().optional(),
});

export const createGalleryImage = adminActionClient
   .schema(createGalleryImageSchema)
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
      const lastImage = await prisma.galleryImage.findFirst({
         where: { instituteId: user.instituteId },
         orderBy: { index: "desc" },
         select: { index: true },
      });

      const nextIndex = (lastImage?.index ?? -1) + 1;

      const image = await prisma.galleryImage.create({
         data: {
            ...parsedInput,
            index: nextIndex,
            instituteId: user.instituteId,
         },
      });

      revalidatePath("/admin/gallery/images");
      updateTag("gallery-images");

      return {
         success: true,
         message: "Image added successfully",
         image,
      };
   });
