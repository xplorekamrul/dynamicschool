"use server";

import { deleteFile } from "@/lib/file-manager/helpers";
import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteTeacherSchema = z.object({
   id: z.string(),
});

export const deleteTeacher = adminActionClient
   .schema(deleteTeacherSchema)
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

      // Get teacher to delete image
      const teacher = await prisma.teacher.findFirst({
         where: {
            id: parsedInput.id,
            instituteId: user.instituteId,
         },
      });

      if (!teacher) {
         throw new Error("Teacher not found");
      }

      // Delete teacher from database
      await prisma.teacher.delete({
         where: { id: parsedInput.id },
      });

      // Delete image from FTP if exists
      if (teacher.image) {
         try {
            // Extract path from image URL (e.g., /images/institute-id/teachers/file.jpg -> /institute-id/teachers/file.jpg)
            const imagePath = teacher.image.replace(/^\/images/, "");
            await deleteFile(imagePath);
         } catch (error) {
            console.error("Failed to delete teacher image:", error);
            // Don't throw error, teacher is already deleted from DB
         }
      }

      revalidatePath("/admin/teachers");
      revalidatePath("/administration/teachers");
      revalidatePath("/administration/retired-teachers");

      return {
         success: true,
         message: "Teacher deleted successfully",
      };
   });
