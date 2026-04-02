"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";

export const loadVacancies = adminActionClient.action(async ({ ctx }) => {
   const session = ctx.session;
   const userId = session.user.id;

   const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { instituteId: true },
   });

   if (!user?.instituteId) {
      throw new Error("Institute not found for this admin");
   }

   const vacancies = await prisma.vacancy.findMany({
      where: { instituteId: user.instituteId },
      orderBy: { createdAt: "desc" },
      select: {
         id: true,
         post: true,
         salaryScale: true,
         details: true,
         link: true,
         createdAt: true,
         updatedAt: true,
      },
   });

   return vacancies;
});
