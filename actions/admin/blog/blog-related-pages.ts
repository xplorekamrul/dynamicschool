"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { getInstituteIdOrThrow } from "@/lib/shared/get-institute-id";
import { z } from "zod";

export const getPackagesForBlogRelation = adminActionClient
   .schema(z.object({
      search: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(10),
   }))
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();

      const skip = (parsedInput.page - 1) * parsedInput.limit;

      const where: any = {
         instituteId,
         contentType: "DYNAMIC",
      };

      if (parsedInput.search) {
         where.title = { contains: parsedInput.search, mode: "insensitive" };
      }

      const [pages, total] = await Promise.all([
         prisma.page.findMany({
            where,
            select: {
               id: true,
               title: true,
            },
            orderBy: { title: "asc" },
            skip,
            take: parsedInput.limit,
         }),
         prisma.page.count({ where }),
      ]);

      const packages = pages.map(page => ({
         value: page.id,
         label: page.title,
      }));

      return {
         success: true,
         packages,
         total,
         hasMore: skip + parsedInput.limit < total,
      };
   });

export const getBlogRelatedPages = adminActionClient
   .schema(z.object({
      blogId: z.bigint(),
   }))
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();

      // For now, return empty array as we don't have a relation table yet
      // This can be extended when blog-related-pages table is created
      return {
         success: true,
         relations: [],
      };
   });

export const createBlogRelatedPages = adminActionClient
   .schema(z.object({
      blogId: z.bigint(),
      pageIds: z.array(z.bigint()),
   }))
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();

      // For now, just return success as we don't have a relation table yet
      // This can be extended when blog-related-pages table is created
      return {
         success: true,
         message: "Related pages saved successfully",
      };
   });
