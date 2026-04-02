"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const DeleteVacancyInput = z.object({
   id: z.string().min(1, "Vacancy ID is required"),
});

export const deleteVacancy = adminActionClient
   .schema(DeleteVacancyInput)
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

      // Verify vacancy belongs to this institute
      const vacancyId = BigInt(parsedInput.id);
      const vacancy = await prisma.vacancy.findFirst({
         where: {
            id: vacancyId,
            instituteId: user.instituteId,
         },
      });

      if (!vacancy) {
         throw new Error("Vacancy not found");
      }

      await prisma.vacancy.delete({
         where: { id: vacancyId },
      });

      revalidatePath("/admin/vacancies");

      return {
         success: true,
         message: "Vacancy deleted successfully",
      };
   });
