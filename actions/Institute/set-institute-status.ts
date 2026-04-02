"use server";

import { superAdminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const Input = z.object({
  instituteId: z.string().min(1, "instituteId is required"),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
});

type Output =
  | {
    success: true;
    message: string;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    suspendedAt: Date | null;
  }
  | { success: false; message: string };

export const setInstituteStatus = superAdminActionClient
  .schema(Input)
  .action<Output>(async ({ parsedInput }) => {
    const { instituteId, status } = parsedInput;
    try {
      const updated = await prisma.institute.update({
        where: { id: instituteId },
        data: {
          status,
          suspendedAt: status === "SUSPENDED" ? new Date() : null,
        },
        select: { status: true, suspendedAt: true },
      });

      // Revalidate list views
      revalidatePath("/sadmin/institutes");

      return {
        success: true,
        message: `Institute ${status.toLowerCase()} successfully`,
        status: updated.status as "ACTIVE" | "INACTIVE" | "SUSPENDED",
        suspendedAt: updated.suspendedAt,
      };
    } catch (e: any) {
      return {
        success: false,
        message: e?.message ?? "Failed to update institute status",
      };
    }
  });
