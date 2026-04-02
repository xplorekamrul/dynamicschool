"use server";

import { superAdminActionClient } from "@/lib/next-safe-action";
import { isValidDomain, isValidPath, normalizeDomain } from "@/lib/normalize-domain";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const Input = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Institute name is required"),
  domainRaw: z.string().min(1, "Domain is required"),
});

export type SaveInstituteOutput = {
  instituteId: string;
  domain: string;
  message: string;
};

export const saveInstitute = superAdminActionClient
  .schema(Input)
  .action<SaveInstituteOutput>(async ({ parsedInput }) => {
    const { id, name, domainRaw } = parsedInput;

    const { host, path, display } = normalizeDomain(domainRaw);

    if (!host || !isValidDomain(host)) {
      throw new Error(
        "Enter a valid domain like 'example.com' or 'sub.example.co.uk'. No http/https."
      );
    }
    if (!isValidPath(path)) {
      throw new Error(
        "Path may only contain letters, numbers, dots, and hyphens (e.g., example.com)."
      );
    }

    const normalizedDomain = display;

    const inst = await prisma.institute.upsert({
      where: { id: id ?? "" },
      update: { name, domain: normalizedDomain },
      create: { name, domain: normalizedDomain },
    });

    revalidatePath("/sadmin/institutes");

    return {
      instituteId: inst.id,
      domain: inst.domain,
      message: id ? "Institute updated" : "Institute saved",
    };
  });
