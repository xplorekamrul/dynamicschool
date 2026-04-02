"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { getInstituteIdOrThrow } from "@/lib/shared/get-institute-id";
import { z } from "zod";

const createHeroSectionSchema = z.object({
   title: z.string().min(1, "Title is required").max(200),
   description: z.string().optional(),
   buttonUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
   buttonName: z.string().max(20).optional().or(z.literal("")),
   images: z.array(
      z.object({
         src: z.string().min(1, "Image source is required"),
         alt: z.string().min(1, "Alt text is required"),
      })
   ).min(1, "At least one image is required"),
});

export const createHeroSection = adminActionClient
   .schema(createHeroSectionSchema)
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();

      const heroSection = await prisma.heroSection.create({
         data: {
            ...parsedInput,
            images: parsedInput.images,
            instituteId,
         },
      });

      return { success: true, heroSection };
   });
