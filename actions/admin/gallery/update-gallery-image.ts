"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

const updateGalleryImageSchema = z.object({
   id: z.number(),
   title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
   ImgSrc: z.string().min(1, "Image is required"),
   ImgAlt: z.string().optional(),
});

export const updateGalleryImage = adminActionClient
   .schema(updateGalleryImageSchema)
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

      const image = await prisma.galleryImage.update({
         where: { id: parsedInput.id },
         data: {
            title: parsedInput.title,
            ImgSrc: parsedInput.ImgSrc,
            ImgAlt: parsedInput.ImgAlt,
         },
      });

      revalidatePath("/admin/gallery/images");
      updateTag("gallery-images");

      return {
         success: true,
         message: "Image updated successfully",
         image,
      };
   });
