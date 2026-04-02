"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { superAdminActionClient } from "@/lib/next-safe-action";

const Input = z.object({
  userId: z.string().min(1, "userId is required"),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]),
});

type Output =
  | { success: true; message: string }
  | { success: false; message: string };

export const setAdminStatus = superAdminActionClient
  .schema(Input)
  .action<Output>(async ({ parsedInput }) => {
    const { userId, status } = parsedInput;

    try {
      // Ensure target is actually an ADMIN
      const target = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      if (!target) return { success: false, message: "User not found" };
      if (target.role !== "ADMIN") {
        return { success: false, message: "Only ADMIN users can be updated here" };
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          status,
          suspendedAt: status === "SUSPENDED" ? new Date() : null,
        },
      });

      return { success: true, message: `Admin ${status.toLowerCase()} successfully` };
    } catch (e: any) {
      return { success: false, message: e?.message ?? "Failed to update status" };
    }
  });
