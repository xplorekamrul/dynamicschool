"use server";

import { prisma } from "@/lib/prisma";

export async function getLatestBlogPosts(instituteId: string, limit: number = 3) {
   try {
      const posts = await prisma.blogPost.findMany({
         where: {
            instituteId,
            isPublished: true,
         },
         include: {
            category: true,
         },
         orderBy: {
            displayOrder: "asc",
         },
         take: limit,
      });

      return posts;
   } catch (error) {
      console.error("Error fetching blog posts:", error);
      return [];
   }
}
