import { getBlogCategories } from "@/actions/admin/blog/blog-category";

import { connection } from "next/server";
import { Suspense } from "react";
import { getBlogPosts } from "../../../../../actions/admin/blog";
import { BlogPostContent } from "./blog-post-content";

export default async function BlogPage() {
   // const counts = await getTabCounts();
   return (
      <div className="space-y-6">
         <div>
            <h1 className="text-3xl font-bold">News & Events Management</h1>
            <p className="text-gray-600 mt-2">
               Manage News & Events posts
               {/* <Badge className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-lg border border-primary/10 text-black bg-primary/10 hover:bg-primary/40">
                  {counts.posts}
               </Badge> */}
            </p>
         </div>

         <Suspense fallback={<div>Loading News & Events posts...</div>}>
            <PostsSection />
         </Suspense>

      </div>
   );
}


async function PostsSection() {
   await connection();
   try {
      const [postsResult, categoriesResult] = await Promise.all([
         getBlogPosts({ page: 1, limit: 10 }),
         getBlogCategories(),
      ]);

      const postsData = postsResult?.data;
      const categories = categoriesResult?.data || [];

      if (!postsData) {
         throw new Error("Failed to load posts");
      }

      return (
         <BlogPostContent initialData={postsData as unknown as any} categories={categories as unknown as any} />
      );
   } catch (error) {
      console.error("Error loading blog posts:", error);
      return (
         <div className="space-y-4">

            <div className="text-red-500 p-4 bg-red-50 rounded">
               Failed to load News & Events posts. Please try again later.
            </div>
         </div>
      );
   }
}

async function getTabCounts() {
   try {
      const postsResult = await getBlogPosts({ page: 1, limit: 1000 });

      const posts = (postsResult?.data?.posts) || [];

      return {
         posts: posts.length,
         featured: 0,
         topRead: 0,
      };
   } catch (error) {
      return { posts: 0, featured: 0, topRead: 0 };
   }
}
