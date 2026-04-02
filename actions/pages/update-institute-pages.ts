"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { superAdminActionClient } from "../../lib/next-safe-action";

const schema = z.object({
  instituteId: z.string().min(1, "instituteId is required"),
  pageIds: z.array(z.string()).default([]),
});

export const updateInstitutePagesStatus = superAdminActionClient
  .schema(schema)
  .action(async ({ parsedInput }) => {
    const { instituteId, pageIds } = parsedInput;

    await prisma.$transaction(async (tx) => {
      if (pageIds.length > 0) {
        await tx.page.updateMany({
          where: { instituteId, id: { in: pageIds } },
          data: { status: "ACTIVE" },
        });
        await tx.page.updateMany({
          where: { instituteId, id: { notIn: pageIds } },
          data: { status: "INACTIVE" },
        });
      } else {
        await tx.page.updateMany({ where: { instituteId }, data: { status: "INACTIVE" } });
      }
    });

    revalidatePath("/sadmin/page-status");
    revalidatePath(`/sadmin/page-status/${instituteId}`);

    return { ok: true, message: "Page statuses updated successfully." } as const;
  });
