"use server";

import { superAdminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const Input = z.object({
  instituteId: z.string().min(1, "instituteId is required"),
  userId: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
});

type Output =
  | { success: true; userId: string; message: string }
  | { success: false; message: string };

export const saveAdmin = superAdminActionClient
  .schema(Input)
  .action<Output>(async ({ parsedInput }) => {
    const { instituteId, userId, name, email, password } = parsedInput;

    try {
      const hashed = bcrypt.hashSync(password, 10);

      let user;
      if (userId) {
        user = await prisma.user.update({
          where: { id: userId },
          data: { name, email, password: hashed, role: "ADMIN", instituteId },
        });
      } else {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          user = await prisma.user.update({
            where: { id: existing.id },
            data: { name, password: hashed, role: "ADMIN", instituteId },
          });
        } else {
          user = await prisma.user.create({
            data: { name, email, password: hashed, role: "ADMIN", instituteId },
          });
        }
      }

      revalidatePath("/sadmin/institutes");

      return {
        success: true,
        userId: user.id,
        message: userId ? "Admin updated" : "Admin saved",
      };
    } catch (err: any) {
      if (err?.code === "P2002" && err?.meta?.target?.includes("email")) {
        return {
          success: false,
          message:
            "This email is already in use. Choose a different email, or edit the existing admin.",
        };
      }
      return { success: false, message: err?.message || "Failed to save admin" };
    }
  });
