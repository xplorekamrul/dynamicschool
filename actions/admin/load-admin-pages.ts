"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";

export const loadAdminPages = adminActionClient.action(async ({ ctx }) => {
   const session = ctx.session;
   const userId = session.user.id;

   // Get user with institute
   const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { instituteId: true },
   });

   if (!user?.instituteId) {
      throw new Error("Institute not found for this admin");
   }

   // Direct query for faster response - only fetch counts, not full content
   const pages = await prisma.page.findMany({
      where: { instituteId: user.instituteId },
      orderBy: { title: "asc" },
      select: {
         id: true,
         title: true,
         slug: true,
         status: true,
         contentType: true,
         createdAt: true,
         updatedAt: true,
         _count: {
            select: {
               content: true,
               SeoContent: true,
            },
         },
      },
   });

   return pages;
});
