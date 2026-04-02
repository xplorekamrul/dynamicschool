"use server";

import importantLinks from "@/config/important-links";
import { superAdminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/** Helpers */
const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);

// helper to extract src from iframe tag
const extractIframeSrc = (v: string) => {
  if (!v) return v;
  const srcMatch = v.match(/src=["']([^"']+)["']/);
  return srcMatch ? srcMatch[1] : v;
};

const PathOrUrl = z.optional(
  z.preprocess(
    emptyToUndefined,
    z
      .string()
      .refine(
        (v) => !v || /^(https?:\/\/|ftp:\/\/|\/)/i.test(v),
        "Must be an absolute path or a full URL"
      )
  )
);

const SaveConfigInput = z.object({
  instituteId: z.string().min(1, "instituteId is required"),

  mobileNumber: z.optional(z.preprocess(emptyToUndefined, z.string())),
  email: z.optional(z.preprocess(emptyToUndefined, z.string().email("Invalid email"))),
  address: z.optional(z.preprocess(emptyToUndefined, z.string().max(150, "Max 150 chars"))),

  facebook: z.optional(z.preprocess(emptyToUndefined, z.string().url("Invalid URL"))),
  twitter: z.optional(z.preprocess(emptyToUndefined, z.string().url("Invalid URL"))),
  instagram: z.optional(z.preprocess(emptyToUndefined, z.string().url("Invalid URL"))),
  linkedin: z.optional(z.preprocess(emptyToUndefined, z.string().url("Invalid URL"))),
  youtube: z.optional(z.preprocess(emptyToUndefined, z.string().url("Invalid URL"))),

  established: z.optional(
    z.preprocess(emptyToUndefined, z.coerce.number().int().positive())
  ),
  eiin: z.optional(z.preprocess(emptyToUndefined, z.string())),
  mpo: z.optional(z.preprocess(emptyToUndefined, z.string())),

  mapSrc: z.optional(
    z.preprocess(
      (v) => {
        if (!v || v === "") return undefined;
        return extractIframeSrc(v as string);
      },
      z.string().url("Invalid map URL")
    )
  ),
  mapAddress: z.optional(z.preprocess(emptyToUndefined, z.string())),

  logo: PathOrUrl,
  favicon: PathOrUrl,
});

export type SaveConfigOutput = {
  success: true;
  message: string;
};


export const saveConfig = superAdminActionClient
  .schema(SaveConfigInput)
  .action<SaveConfigOutput>(async ({ parsedInput }) => {
    const data = parsedInput;

    const existing = await prisma.config.findFirst({
      where: { instituteId: data.instituteId },
      select: { id: true },
    });

    if (existing) {
      await prisma.config.update({ where: { id: existing.id }, data });
    } else {
      await prisma.config.create({ data });
    }

    // Delete existing important links for this institute
    await prisma.importantLinks.deleteMany({
      where: { instituteId: data.instituteId },
    });

    // Create new important links from config
    await prisma.importantLinks.createMany({
      data: importantLinks.map((link) => ({
        name: link.name,
        url: link.url,
        instituteId: data.instituteId,
      })),
    });

    revalidatePath("/sadmin/institutes");

    return { success: true, message: "Configuration saved" };
  });
