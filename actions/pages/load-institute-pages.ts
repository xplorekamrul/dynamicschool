"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { superAdminActionClient } from "@/lib/next-safe-action";

export const loadInstitutePages = superAdminActionClient
  .schema(z.object({ instituteId: z.string().min(1) }))
  .action(async ({ parsedInput }) => {
    const { instituteId } = parsedInput;

    const pages = await prisma.page.findMany({
      where: { instituteId },
      orderBy: { title: "asc" },
      select: { id: true, title: true, slug: true, status: true },
    });

    return pages; 
  });
