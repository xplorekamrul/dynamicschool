// actions/Institute/get-institute-detail.ts
"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const Input = z.object({
  instituteId: z.string().min(1),
});

export async function getInstituteDetail(input: z.infer<typeof Input>) {
  const { instituteId } = Input.parse(input);

  const [institute, config, pages] = await Promise.all([
    prisma.institute.findUnique({
      where: { id: instituteId },
      select: {
        id: true,
        name: true,
        domain: true,
      },
    }),
    prisma.config.findFirst({
      where: { instituteId },
      select: {
        mobileNumber: true,
        email: true,
        address: true,
        facebook: true,
        twitter: true,
        instagram: true,
        linkedin: true,
        youtube: true,
        established: true,
        eiin: true,
        mpo: true,
        mapSrc: true,
        mapAddress: true,
        logo: true,
        favicon: true,
      },
    }),
    prisma.page.findMany({
      where: { instituteId },
      select: { slug: true, title: true, status: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return {
    institute: institute ?? null,
    config: config ?? null,
    pages: pages ?? [],
  };
}
