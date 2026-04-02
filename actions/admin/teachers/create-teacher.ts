"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createTeacherSchema = z.object({
   name: z.string().min(1, "Name is required"),
   image: z.string().optional(),
   designation: z.string().min(1, "Designation is required"),
   classes: z.string().optional(),
   mobile: z.string().min(1, "Mobile number is required"),
   status: z.enum(["ACTIVE", "RETIRED"]).default("ACTIVE"),
});

export const createTeacher = adminActionClient
   .schema(createTeacherSchema)
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

      const teacher = await prisma.teacher.create({
         data: {
            ...parsedInput,
            instituteId: user.instituteId,
         },
      });

      revalidatePath("/admin/teachers");
      revalidatePath("/administration/teachers");
      revalidatePath("/administration/retired-teachers");

      return {
         success: true,
         message: "Teacher created successfully",
         teacher,
      };
   });
