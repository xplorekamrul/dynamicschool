"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";

export const loadAllContents = adminActionClient.action(async ({ ctx }) => {
   const session = ctx.session;
   const userId = session.user.id;

   const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { instituteId: true },
   });

   if (!user?.instituteId) {
      throw new Error("Institute not found for this admin");
   }

   const contents = await prisma.content.findMany({
      where: {
         page: {
            instituteId: user.instituteId,
         },
      },
      include: {
         page: {
            select: {
               id: true,
               title: true,
               slug: true,
               status: true,
            },
         },
      },
      orderBy: { updatedAt: "desc" },
   });

   return contents;
});
