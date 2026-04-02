"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { getInstituteIdOrThrow } from "@/lib/shared/get-institute-id";
import { generateUniqueSlug } from "@/lib/slug-generator";
import { z } from "zod";

const createNoticeSchema = z.object({
   title: z.string().min(1, "Title is required"),
   content: z.string().min(1, "Content is required"),
   category: z.enum(["GENERAL", "EXAM", "HOLIDAY", "EVENT", "URGENT"]).default("GENERAL"),
   fileUrl: z.string().optional(),
   fileName: z.string().optional(),
   isPublished: z.boolean().default(true),
   specialNotice: z.boolean().default(false),
});

export const createNotice = adminActionClient
   .schema(createNoticeSchema)
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();
      const slug = await generateUniqueSlug(parsedInput.title);

      const notice = await prisma.notice.create({
         data: {
            ...parsedInput,
            slug,
            instituteId,
         },
      });

      return { success: true, notice };
   });
