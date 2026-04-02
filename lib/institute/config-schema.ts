// src/lib/institute/config-schema.ts
import * as z from "zod";

// small helpers
export const emptyToUndefined = (v: unknown) => (v === "" ? undefined : v);
export const isHttpOrPath = (v: string) => /^(https?:\/\/|ftp:\/\/|\/)/i.test(v);

// field preprocessors
const urlOptional = z.preprocess(emptyToUndefined, z.string().url().optional());
const emailOptional = z.preprocess(
  emptyToUndefined,
  z.string().email("Invalid email").optional()
);
const pathOrUrlOptional = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .refine((v) => !v || isHttpOrPath(v), "Must be a valid path or URL")
    .optional()
);

// helper to extract src from iframe tag
const extractIframeSrc = (v: string) => {
  if (!v) return v;
  const srcMatch = v.match(/src=["']([^"']+)["']/);
  return srcMatch ? srcMatch[1] : v;
};

// schema
export const configSchema = z.object({
  instituteId: z.string().min(1),
  mobileNumber: z.preprocess(emptyToUndefined, z.string().optional()),
  email: emailOptional,
  address: z.preprocess(emptyToUndefined, z.string().max(150, "Max 150 characters").optional()),
  facebook: urlOptional,
  twitter: urlOptional,
  instagram: urlOptional,
  linkedin: urlOptional,
  youtube: urlOptional,
  established: z.preprocess((v) => {
    if (v === "" || v === null || v === undefined) return undefined;
    const n = typeof v === "string" ? Number(v) : v;
    return Number.isFinite(n) ? n : undefined;
  }, z.number().int().positive().optional()),
  eiin: z.preprocess(emptyToUndefined, z.string().optional()),
  mpo: z.preprocess(emptyToUndefined, z.string().optional()),
  mapSrc: z.preprocess(
    (v) => {
      if (!v || v === "") return undefined;
      return extractIframeSrc(v as string);
    },
    z.string().url("Invalid map URL").optional()
  ),
  mapAddress: z.preprocess(emptyToUndefined, z.string().optional()),
  logo: pathOrUrlOptional,
  favicon: pathOrUrlOptional,
});

export type ConfigFormValues = z.infer<typeof configSchema>;
