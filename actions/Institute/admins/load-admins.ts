"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { superAdminActionClient } from "@/lib/next-safe-action";

const Input = z.object({
  instituteId: z.string().min(1, "instituteId is required"),
});

export type AdminRow = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  suspendedAt: Date | null;
  createdAt: Date;
};

type Output =
  | { success: true; admins: AdminRow[] }
  | { success: false; message: string };

export const loadAdmins = superAdminActionClient
  .schema(Input)
  .action<Output>(async ({ parsedInput }) => {
    const { instituteId } = parsedInput;
    try {
      const admins = await prisma.user.findMany({
        where: { instituteId, role: "ADMIN" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          suspendedAt: true,
          createdAt: true,
        },
      });

      return { success: true, admins };
    } catch (e: any) {
      return { success: false, message: e?.message ?? "Failed to load admins" };
    }
  });
