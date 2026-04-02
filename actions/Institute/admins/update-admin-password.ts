"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { superAdminActionClient } from "@/lib/next-safe-action";
import bcrypt from "bcryptjs";

const Input = z.object({
  userId: z.string().min(1, "userId is required"),
  newPassword: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(72, "Password must be at most 72 characters"),
});

type Output =
  | { success: true; message: string }
  | { success: false; message: string };

export const updateAdminPassword = superAdminActionClient
  .schema(Input)
  .action<Output>(async ({ parsedInput }) => {
    const { userId, newPassword } = parsedInput;

    try {
      const target = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      if (!target) return { success: false, message: "User not found" };
      if (target.role !== "ADMIN") {
        return { success: false, message: "Only ADMIN users can be updated here" };
      }

      const hashed = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
      });

      return { success: true, message: "Password updated successfully" };
    } catch (e: any) {
      return { success: false, message: e?.message ?? "Failed to update password" };
    }
  });
