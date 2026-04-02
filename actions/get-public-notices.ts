"use server";

import { actionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const getPublicNoticesSchema = z.object({
   category: z.string().optional(),
   limit: z.number().default(20),
});

export const getPublicNotices = actionClient
   .schema(getPublicNoticesSchema)
   .action(async ({ parsedInput }) => {
      const where: any = { isPublished: true };
      if (parsedInput.category && parsedInput.category !== "ALL") {
         where.category = parsedInput.category;
      }

      const [notices, categories] = await Promise.all([
         prisma.notice.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: parsedInput.limit,
            select: {
               id: true,
               slug: true,
               title: true,
               category: true,
               createdAt: true,
            },
         }),
         prisma.notice.groupBy({
            by: ["category"],
            where: { isPublished: true },
            _count: true,
         }),
      ]);

      return {
         success: true,
         notices,
         categories: categories.map((c) => ({
            name: c.category,
            count: c._count,
         })),
      };
   });
