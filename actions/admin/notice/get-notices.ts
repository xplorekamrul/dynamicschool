"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { getInstituteIdOrThrow } from "@/lib/shared/get-institute-id";
import { z } from "zod";

const getNoticesSchema = z.object({
   category: z.string().optional(),
   page: z.number().default(1),
   limit: z.number().default(10),
});

export const getNotices = adminActionClient
   .schema(getNoticesSchema)
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();

      const skip = (parsedInput.page - 1) * parsedInput.limit;

      const where: any = { instituteId };
      if (parsedInput.category && parsedInput.category !== "ALL") {
         where.category = parsedInput.category;
      }

      const [notices, total] = await Promise.all([
         prisma.notice.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: parsedInput.limit,
         }),
         prisma.notice.count({ where }),
      ]);

      return {
         success: true,
         notices,
         total,
         pages: Math.ceil(total / parsedInput.limit),
      };
   });
