"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const Input = z.object({ id: z.string() });

export async function deleteInstitute(input: z.infer<typeof Input>) {
  const { id } = Input.parse(input);

  await prisma.$transaction([
    // delete page children first
    prisma.seoContent.deleteMany({ where: { page: { instituteId: id } } }),
    prisma.content.deleteMany({ where: { page: { instituteId: id } } }),
    prisma.page.deleteMany({ where: { instituteId: id } }),

    // other top-level children
    prisma.user.deleteMany({ where: { instituteId: id } }),
    prisma.config.deleteMany({ where: { instituteId: id } }),

    // finally the institute
    prisma.institute.delete({ where: { id } }),
  ]);

  revalidatePath("/sadmin/institutes");

  return { success: true as const };
}
