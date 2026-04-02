"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { getInstituteIdOrThrow } from "@/lib/shared/get-institute-id";
import { generateSlug } from "@/lib/shared/slug-utils";
import { z } from "zod";

const createBlogPostSchema = z.object({
   categoryId: z.bigint(),
   title: z.string().min(1, "Title is required").max(100),
   content: z.string().min(1, "Content is required"),
   ImgSrc: z.string().min(1, "Image is required"),
   ImgAlt: z.string().max(50).optional().or(z.literal("")),
   isPublished: z.boolean().default(false),
});

const updateBlogPostSchema = z.object({
   id: z.bigint(),
   categoryId: z.bigint(),
   title: z.string().min(1, "Title is required").max(100),
   content: z.string().min(1, "Content is required"),
   ImgSrc: z.string().min(1, "Image is required"),
   ImgAlt: z.string().max(50).optional().or(z.literal("")),
   isPublished: z.boolean().default(false),
});

const updateDisplayOrderSchema = z.object({
   id: z.bigint(),
   displayOrder: z.bigint(),
});

export const createBlogPost = adminActionClient
   .schema(createBlogPostSchema)
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();
      const slug = generateSlug(parsedInput.title);

      const post = await prisma.blogPost.create({
         data: {
            ...parsedInput,
            slug,
            instituteId,
         },
         include: {
            category: true,
         },
      });

      return { success: true, post };
   });

export const updateBlogPost = adminActionClient
   .schema(updateBlogPostSchema)
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();
      const { id, ...data } = parsedInput;
      const slug = generateSlug(data.title);

      const post = await prisma.blogPost.update({
         where: { id },
         data: {
            ...data,
            slug,
         },
         include: {
            category: true,
         },
      });

      return { success: true, post };
   });

export const updateBlogPostDisplayOrder = adminActionClient
   .schema(updateDisplayOrderSchema)
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();

      const post = await prisma.blogPost.update({
         where: { id: parsedInput.id },
         data: { displayOrder: parsedInput.displayOrder },
         include: { category: true },
      });

      return { success: true, post };
   });

export const deleteBlogPost = adminActionClient
   .schema(z.object({ id: z.bigint() }))
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();

      await prisma.blogPost.delete({
         where: { id: parsedInput.id },
      });

      return { success: true };
   });

export const getBlogPosts = adminActionClient
   .schema(z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
   }))
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();

      const skip = (parsedInput.page - 1) * parsedInput.limit;

      const [posts, total] = await Promise.all([
         prisma.blogPost.findMany({
            where: { instituteId },
            include: {
               category: true,
            },
            orderBy: { displayOrder: "asc" },
            skip,
            take: parsedInput.limit,
         }),
         prisma.blogPost.count({ where: { instituteId } }),
      ]);

      return {
         success: true,
         posts,
         total,
         page: parsedInput.page,
         pageSize: parsedInput.limit,
         totalPages: Math.ceil(total / parsedInput.limit),
      };
   });

export const searchBlogPosts = adminActionClient
   .schema(z.object({
      categoryId: z.string().optional(),
      title: z.string().optional(),
      isPublished: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      page: z.number().default(1),
      limit: z.number().default(10),
   }))
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();

      const skip = (parsedInput.page - 1) * parsedInput.limit;

      const where: any = { instituteId };

      if (parsedInput.categoryId) {
         where.categoryId = BigInt(parsedInput.categoryId);
      }

      if (parsedInput.title) {
         where.title = { contains: parsedInput.title, mode: "insensitive" };
      }

      if (parsedInput.isPublished !== undefined && parsedInput.isPublished !== "") {
         where.isPublished = parsedInput.isPublished === "true";
      }

      if (parsedInput.startDate) {
         where.createdAt = { gte: new Date(parsedInput.startDate) };
      }

      if (parsedInput.endDate) {
         const endDate = new Date(parsedInput.endDate);
         endDate.setHours(23, 59, 59, 999);
         if (where.createdAt) {
            where.createdAt.lte = endDate;
         } else {
            where.createdAt = { lte: endDate };
         }
      }

      const [posts, total] = await Promise.all([
         prisma.blogPost.findMany({
            where,
            include: {
               category: true,
            },
            orderBy: { displayOrder: "asc" },
            skip,
            take: parsedInput.limit,
         }),
         prisma.blogPost.count({ where }),
      ]);

      return {
         success: true,
         posts,
         total,
         page: parsedInput.page,
         pageSize: parsedInput.limit,
         totalPages: Math.ceil(total / parsedInput.limit),
      };
   });

export const getBlogPostsWithSpecials = adminActionClient
   .schema(z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
   }))
   .action(async ({ parsedInput }) => {
      const instituteId = await getInstituteIdOrThrow();

      const skip = (parsedInput.page - 1) * parsedInput.limit;

      const [posts, total] = await Promise.all([
         prisma.blogPost.findMany({
            where: { instituteId },
            include: {
               category: true,
            },
            orderBy: { displayOrder: "asc" },
            skip,
            take: parsedInput.limit,
         }),
         prisma.blogPost.count({ where: { instituteId } }),
      ]);

      // Add empty specials array for compatibility
      const postsWithSpecials = posts.map((post: any) => ({
         ...post,
         specials: [],
      }));

      return {
         success: true,
         posts: postsWithSpecials,
         total,
         page: parsedInput.page,
         pageSize: parsedInput.limit,
         totalPages: Math.ceil(total / parsedInput.limit),
      };
   });
