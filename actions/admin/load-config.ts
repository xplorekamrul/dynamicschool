"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";

export const loadConfig = adminActionClient.action(async ({ ctx }) => {
   const session = ctx.session;
   const userId = session.user.id;

   const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { instituteId: true },
   });

   if (!user?.instituteId) {
      throw new Error("Institute not found");
   }

   const config = await prisma.config.findFirst({
      where: { instituteId: user.instituteId },
   });

   return {
      success: true,
      config: config || null,
      instituteId: user.instituteId,
   };
});
