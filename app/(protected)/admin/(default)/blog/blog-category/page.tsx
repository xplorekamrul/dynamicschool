import { getBlogCategories } from "@/actions/admin/blog/blog-category";
import { connection } from "next/server";
import { Suspense } from "react";
import { BlogCategoryContent } from "../blog-category-content";

export default async function BlogCategoryPage() {
   return (
      <div className="space-y-6">
         <div>
            <h1 className="text-3xl font-bold">News & Events Categories</h1>
            <p className="text-gray-600 mt-2">
               Manage News & Events categories
            </p>
         </div>

         <div className="bg-white rounded-lg shadow">
            <Suspense fallback={<div className="p-6">Loading categories...</div>}>
               <CategoriesSection />
            </Suspense>
         </div>
      </div>
   );
}

async function CategoriesSection() {
   await connection();
   try {
      const result = await getBlogCategories();
      const categories = result?.data || [];
      return <BlogCategoryContent categories={categories as any} />;
   } catch (error) {
      console.error("Error loading categories:", error);
      return (
         <div className="space-y-4 p-6">
            <div className="text-red-500 p-4 bg-red-50 rounded">
               Failed to load categories. Please try again later.
            </div>
         </div>
      );
   }
}
