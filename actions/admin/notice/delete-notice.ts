"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { getInstituteIdOrThrow } from "@/lib/shared/get-institute-id";
import { z } from "zod";

const deleteNoticeSchema = z.object({
   id: z.string(),
});

export const deleteNotice = adminActionClient
   .schema(deleteNoticeSchema)
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();

      await prisma.notice.delete({
         where: { id: BigInt(parsedInput.id) },
      });

      return { success: true };
   });
