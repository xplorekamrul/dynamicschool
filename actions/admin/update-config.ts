"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

const UpdateConfigInput = z.object({
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

export const updateConfig = adminActionClient
   .schema(UpdateConfigInput)
   .action(async ({ parsedInput, ctx }) => {
      const session = ctx.session;
      const userId = session.user.id;

      const user = await prisma.user.findUnique({
         where: { id: userId },
         select: { instituteId: true },
      });

      if (!user?.instituteId) {
         throw new Error("Institute not found");
      }

      const existing = await prisma.config.findFirst({
         where: { instituteId: user.instituteId },
         select: { id: true },
      });

      if (existing) {
         await prisma.config.update({
            where: { id: existing.id },
            data: parsedInput,
         });
      } else {
         await prisma.config.create({
            data: {
               ...parsedInput,
               instituteId: user.instituteId,
            },
         });
      }

      revalidatePath("/admin/config");

      return {
         success: true,
         message: "Configuration updated successfully",
      };
   });
