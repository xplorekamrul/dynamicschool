"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

const CreateVacancyInput = z.object({
   post: z.string().min(1, "Post is required").max(100),
   salaryScale: z.optional(z.preprocess(emptyToUndefined, z.string().max(100))),
   details: z.optional(z.preprocess(emptyToUndefined, z.string())),
   link: z.optional(z.preprocess(emptyToUndefined, z.string().max(191))),
});

export const createVacancy = adminActionClient
   .schema(CreateVacancyInput)
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

      const vacancy = await prisma.vacancy.create({
         data: {
            ...parsedInput,
            instituteId: user.instituteId,
         },
      });

      revalidatePath("/admin/vacancies");

      return {
         success: true,
         message: "Vacancy created successfully",
         vacancy,
      };
   });
