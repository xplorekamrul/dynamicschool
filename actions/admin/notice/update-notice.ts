"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { getInstituteIdOrThrow } from "@/lib/shared/get-institute-id";
import { generateUniqueSlug } from "@/lib/slug-generator";
import { z } from "zod";

const updateNoticeSchema = z.object({
   id: z.string(),
   title: z.string().min(1, "Title is required"),
   content: z.string().min(1, "Content is required"),
   category: z.enum(["GENERAL", "EXAM", "HOLIDAY", "EVENT", "URGENT"]).default("GENERAL"),
   fileUrl: z.string().optional(),
   fileName: z.string().optional(),
   isPublished: z.boolean().default(true),
   specialNotice: z.boolean().default(false),
});

export const updateNotice = adminActionClient
   .schema(updateNoticeSchema)
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();
      const { id, title, ...data } = parsedInput;
      const noticeId = BigInt(id);

      // Generate new slug if title changed
      const slug = await generateUniqueSlug(title);

      const notice = await prisma.notice.update({
         where: { id: noticeId },
         data: {
            ...data,
            title,
            slug,
         },
      });

      return { success: true, notice };
   });
