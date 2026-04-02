"use client";

import { deleteBlogCategory, getBlogCategories } from "@/actions/admin/blog/blog-category";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Edit, Loader2, Plus, RefreshCw, RotateCcw, Search, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { BlogCategoryDialog } from "./blog-category-dialog";

interface BlogCategoryContentProps {
   categories: Array<{ id: bigint; name: string; createdAt: Date }>;
}

export function BlogCategoryContent({
   categories: initialCategories,
}: BlogCategoryContentProps) {
   const [dialogOpen, setDialogOpen] = useState(false);
   const [selectedCategory, setSelectedCategory] = useState<{
      id: bigint;
      name: string;
   } | null>(null);
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
   const [categoryToDelete, setCategoryToDelete] = useState<bigint | null>(null);
   const [categories, setCategories] = useState(initialCategories);
   const [isPending, startTransition] = useTransition();
   const [searchQuery, setSearchQuery] = useState('');
   const [isSearching, setIsSearching] = useState(false);
   const [isSearchOpen, setIsSearchOpen] = useState(false);

   const { executeAsync: handleDelete, isExecuting: isDeleting } =
      useAction(deleteBlogCategory);

   const handleRefresh = () => {
      startTransition(async () => {
         try {
            const result = await getBlogCategories();
            const updatedCategories = result?.data || [];
            setCategories(updatedCategories as any);
         } catch (error) {
            toast.error("Failed to refresh categories");
         }
      });
   };

   const handleSearch = () => {
      if (!searchQuery) {
         toast.info('Please enter search criteria');
         return;
      }
      setIsSearching(true);
      // Client-side filtering
      const filtered = initialCategories.filter(cat =>
         cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setCategories(filtered);
   };

   const handleReset = () => {
      setSearchQuery('');
      setIsSearching(false);
      setCategories(initialCategories);
   };

   const handleEdit = (category: { id: bigint; name: string }) => {
      setSelectedCategory(category);
      setDialogOpen(true);
   };

   const handleDeleteClick = (id: bigint) => {
      setCategoryToDelete(id);
      setDeleteDialogOpen(true);
   };

   const confirmDelete = async () => {
      if (!categoryToDelete) return;

      try {
         const result = await handleDelete({ id: categoryToDelete.toString() });
         if (result?.data?.success) {
            toast.success("Category deleted successfully");
            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
            handleRefresh();
         }
      } catch (error) {
         toast.error("Failed to delete category");
      }
   };

   const handleDialogOpenChange = (open: boolean) => {
      setDialogOpen(open);
      if (!open) {
         setSelectedCategory(null);
         handleRefresh();
      }
   };

   return (
      <>
         <Card className="space-y-4 py-2 px-6">
            <div className="flex justify-between items-center">
               <h2 className="text-lg font-semibold">News & Events Categories</h2>
               <div className="flex gap-2">
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setIsSearchOpen(!isSearchOpen)}
                     className="gap-2"
                  >
                     {isSearchOpen ? <ArrowUpNarrowWide /> : <ArrowDownWideNarrow />}
                  </Button>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={handleRefresh}
                     disabled={isPending}
                     className="gap-2"
                  >
                     <RefreshCw className="h-4 w-4" />
                     Refresh
                  </Button>
                  <Button
                     onClick={() => {
                        setSelectedCategory(null);
                        setDialogOpen(true);
                     }}
                     className="gap-2"
                  >
                     <Plus className="h-4 w-4" />
                     Add Category
                  </Button>
               </div>
            </div>

            {/* Search Section - Collapsible */}
            {isSearchOpen && (
               <div className=" p-4 bg-gray-50 rounded-lg border">
                  <div className="flex gap-4">
                     {/* Search Input */}
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Search Category</label>
                        <Input
                           placeholder="Search category name..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="h-9"
                        />
                     </div>
                     <div className="flex gap-2 justify-end mt-6">
                        <Button
                           onClick={handleSearch}
                           disabled={isPending}
                           className="gap-2"
                        >
                           {isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                           ) : (
                              <Search className="h-4 w-4" />
                           )}
                           Search
                        </Button>
                        <Button
                           onClick={handleReset}
                           disabled={isPending}
                           variant="outline"
                           className="gap-2"
                        >
                           {isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                           ) : (
                              <RotateCcw className="h-4 w-4" />
                           )}
                           Reset
                        </Button>
                     </div>
                  </div>

                  {/* Buttons */}
               </div>
            )}

            {categories.length === 0 ? (
               <div className="text-center py-12">
                  <p className="text-gray-500">No categories found</p>
               </div>
            ) : (
               <div className="grid grid-cols-5 gap-4">
                  {categories.map((category) => (
                     <Card
                        key={category.id.toString()}
                        className="p-3 hover:shadow-md transition-shadow"
                     >
                        <div className="flex items-center justify-between gap-2">
                           <h3 className="font-medium text-sm line-clamp-1">
                              {category.name}
                           </h3>
                           <div className="flex gap-1 flex-shrink-0">
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() =>
                                    handleEdit({
                                       id: category.id,
                                       name: category.name,
                                    })
                                 }
                                 className="h-7 w-7 p-0"
                              >
                                 <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => handleDeleteClick(category.id)}
                                 disabled={isDeleting}
                                 className="h-7 w-7 p-0"
                              >
                                 <Trash2 className="h-3.5 w-3.5 text-red-500" />
                              </Button>
                           </div>
                        </div>
                     </Card>
                  ))}
               </div>
            )}
         </Card>

         <BlogCategoryDialog
            open={dialogOpen}
            onOpenChange={handleDialogOpenChange}
            category={selectedCategory}
         />

         <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Delete Category</AlertDialogTitle>
                  <AlertDialogDescription>
                     Are you sure you want to delete this category? This action cannot
                     be undone.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <div className="flex justify-end gap-2">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={confirmDelete}
                     disabled={isDeleting}
                     className="bg-red-600 hover:bg-red-700"
                  >
                     {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
               </div>
            </AlertDialogContent>
         </AlertDialog>
      </>
   );
}
