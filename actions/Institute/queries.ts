// src/actions/Institute/queries.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unstable_cache, unstable_noStore } from "next/cache";
import z from "zod";

const schema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(5000).default(5),
});

// helper that creates a UNIQUE cache entry per (page,pageSize)
function cachedList(page: number, pageSize: number) {
  return unstable_cache(
    async () => {
      const total = await prisma.institute.count();
      const institutes = await prisma.institute.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          users: {
            where: { role: "ADMIN" },
            select: { id: true, name: true, email: true, role: true },
            take: 1,
          },
        },
      });
      return { total, institutes };
    },
    ["institutes", `p:${page}`, `ps:${pageSize}`],
    { tags: ["institutes"] }
  )();
}

export async function getInstitutes(input: { page: number; pageSize: number }) {
  unstable_noStore();

  const { page, pageSize } = schema.parse(input);

  const session = await auth();
  const role = session?.user?.role;

  if (!session?.user) {
    return { success: false as const, reason: "UNAUTHENTICATED" as const };
  }
  if (role !== "SUPER_ADMIN") {
    return { success: false as const, reason: "OWNER_ONLY" as const };
  }

  const { total, institutes } = await cachedList(page, pageSize);

  return {
    success: true as const,
    institutes,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
