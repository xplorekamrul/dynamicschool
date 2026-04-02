"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { superAdminActionClient } from "@/lib/next-safe-action";

const Input = z.object({
  userId: z.string().min(1, "userId is required"),
});

type Output =
  | { success: true; message: string }
  | { success: false; message: string };

export const deleteAdmin = superAdminActionClient
  .schema(Input)
  .action<Output>(async ({ parsedInput }) => {
    const { userId } = parsedInput;
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      if (!user) return { success: false, message: "User not found" };
      if (user.role !== "ADMIN") {
        return { success: false, message: "Only ADMIN users can be deleted here" };
      }

      await prisma.user.delete({ where: { id: userId } });
      return { success: true, message: "Admin deleted" };
    } catch (e: any) {
      return { success: false, message: e?.message ?? "Failed to delete admin" };
    }
  });
