"use server";

import { prisma } from "@/lib/prisma";
import { getInstituteId } from "@/lib/shared/get-institute-id";

export async function getVacancies() {
   const instituteId = await getInstituteId();

   if (!instituteId) {
      throw new Error("Institute not found");
   }

   const vacancies = await prisma.vacancy.findMany({
      where: { instituteId },
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
}
