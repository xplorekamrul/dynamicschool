"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { getInstituteIdOrThrow } from "@/lib/shared/get-institute-id";
import { z } from "zod";

const createBlogCategorySchema = z.object({
   name: z.string().min(1, "Category name is required").max(30),
});

const updateBlogCategorySchema = z.object({
   id: z.string(),
   name: z.string().min(1, "Category name is required").max(30),
});

export const createBlogCategory = adminActionClient
   .schema(createBlogCategorySchema)
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();

      const category = await prisma.blogCategory.create({
         data: {
            name: parsedInput.name,
            instituteId,
         },
      });

      return { success: true, category };
   });

export const updateBlogCategory = adminActionClient
   .schema(updateBlogCategorySchema)
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();
      const { id, ...data } = parsedInput;

      const category = await prisma.blogCategory.update({
         where: { id: BigInt(id) },
         data,
      });

      return { success: true, category };
   });

export const deleteBlogCategory = adminActionClient
   .schema(z.object({ id: z.string() }))
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();

      await prisma.blogCategory.delete({
         where: { id: BigInt(parsedInput.id) },
      });

      return { success: true };
   });

export const getBlogCategories = adminActionClient.action(async () => {
   const instituteId = await getInstituteIdOrThrow();

   const categories = await prisma.blogCategory.findMany({
      where: { instituteId },
      orderBy: { name: "asc" },
   });

   return categories;
});
