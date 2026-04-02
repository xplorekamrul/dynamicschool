"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { superAdminActionClient } from "@/lib/next-safe-action";

const Input = z.object({
  userId: z.string().min(1, "userId is required"),
  name: z.string().min(2, "Name is required").max(120, "Name too long"),
  email: z.string().email("Invalid email"),
});

type Output =
  | { success: true; message: string }
  | { success: false; message: string };

export const updateAdminProfile = superAdminActionClient
  .schema(Input)
  .action<Output>(async ({ parsedInput }) => {
    const { userId, name, email } = parsedInput;

    try {
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
        data: { name, email },
      });

      return { success: true, message: "Profile updated successfully" };
    } catch (e: any) {
      if (e?.code === "P2002") {
        return { success: false, message: "Email already in use" };
      }
      return { success: false, message: e?.message ?? "Failed to update profile" };
    }
  });
