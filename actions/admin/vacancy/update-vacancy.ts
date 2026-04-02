"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

const UpdateVacancyInput = z.object({
   id: z.string().min(1, "Vacancy ID is required"),
   post: z.string().min(1, "Post is required").max(100),
   salaryScale: z.optional(z.preprocess(emptyToUndefined, z.string().max(100))),
   details: z.optional(z.preprocess(emptyToUndefined, z.string())),
   link: z.optional(z.preprocess(emptyToUndefined, z.string().max(191))),
});

export const updateVacancy = adminActionClient
   .schema(UpdateVacancyInput)
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

      const updated = await prisma.vacancy.update({
         where: { id: vacancyId },
         data: {
            post: parsedInput.post,
            salaryScale: parsedInput.salaryScale,
            details: parsedInput.details,
            link: parsedInput.link,
         },
      });

      revalidatePath("/admin/vacancies");

      return {
         success: true,
         message: "Vacancy updated successfully",
         vacancy: updated,
      };
   });
