"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schemas
const LinkSchema = z.object({
   name: z.string().min(1, "Name is required").max(255),
   url: z.string().url("Invalid URL"),
});

const CreateSingleLinkInput = z.object({
   name: z.string().min(1, "Name is required").max(255),
   url: z.string().url("Invalid URL"),
});

const UpdateLinkInput = z.object({
   id: z.bigint(),
   name: z.string().min(1, "Name is required").max(255),
   url: z.string().url("Invalid URL"),
});

const DeleteLinkInput = z.object({
   id: z.bigint(),
});

// Get all important links for an institute
export async function getImportantLinks(instituteId: string) {
   const links = await prisma.importantLinks.findMany({
      where: { instituteId },
      orderBy: { createdAt: "desc" },
   });
   return links;
}

// Create a single important link
export const createImportantLink = adminActionClient
   .schema(CreateSingleLinkInput)
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

      const createdLink = await prisma.importantLinks.create({
         data: {
            name: parsedInput.name,
            url: parsedInput.url,
            instituteId: user.instituteId,
         },
      });

      revalidatePath("/admin/important-links");

      return {
         success: true,
         message: "Link created successfully",
         data: createdLink,
      };
   });

// Update a single important link
export const updateImportantLink = adminActionClient
   .schema(UpdateLinkInput)
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

      // Verify the link belongs to the user's institute
      const link = await prisma.importantLinks.findUnique({
         where: { id: parsedInput.id },
      });

      if (!link || link.instituteId !== user.instituteId) {
         throw new Error("Link not found or unauthorized");
      }

      const updated = await prisma.importantLinks.update({
         where: { id: parsedInput.id },
         data: {
            name: parsedInput.name,
            url: parsedInput.url,
         },
      });

      revalidatePath("/admin/important-links");

      return {
         success: true,
         message: "Link updated successfully",
         data: updated,
      };
   });

// Delete an important link
export const deleteImportantLink = adminActionClient
   .schema(DeleteLinkInput)
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

      // Verify the link belongs to the user's institute
      const link = await prisma.importantLinks.findUnique({
         where: { id: parsedInput.id },
      });

      if (!link || link.instituteId !== user.instituteId) {
         throw new Error("Link not found or unauthorized");
      }

      await prisma.importantLinks.delete({
         where: { id: parsedInput.id },
      });

      revalidatePath("/admin/important-links");

      return {
         success: true,
         message: "Link deleted successfully",
      };
   });
