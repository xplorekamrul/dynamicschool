"use client";


import { CustomSelect } from "@/components/shared/custom-select";
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
import { DatePicker } from "@/components/ui/date-picker";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { getImageUrl } from "@/lib/shared/image-utils";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, ChevronLeft, ChevronRight, Edit, GripVertical, Loader2, Plus, RefreshCw, RotateCcw, Search, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteBlogPost, getBlogPosts, searchBlogPosts, updateBlogPostDisplayOrder } from "../../../../../actions/admin/blog";
import { BlogPostForm } from "./blog-post-form";

interface BlogPostContentProps {
   initialData: {
      posts: Array<{
         id: bigint;
         categoryId: bigint;
         title: string;
         slug: string;
         content: string;
         ImgSrc: string;
         ImgAlt: string | null;
         isPublished: boolean;
         displayOrder: bigint | null;
         createdAt: Date;
         category: { id: bigint; name: string };
      }>;
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
   };
   categories: Array<{ id: bigint; name: string }>;
}

export function BlogPostContent({
   initialData,
   categories,
}: BlogPostContentProps) {
   const router = useRouter();
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [selectedPost, setSelectedPost] = useState<
      (typeof initialData.posts)[0] | null
   >(null);
   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
   const [postToDelete, setPostToDelete] = useState<bigint | null>(null);
   const [data, setData] = useState(initialData);
   const [isPending, startTransition] = useTransition();
   const [textPreviewOpen, setTextPreviewOpen] = useState(false);
   const [previewText, setPreviewText] = useState<{ title: string; content: string } | null>(null);
   const [searchCategoryId, setSearchCategoryId] = useState('');
   const [searchTitle, setSearchTitle] = useState('');
   const [searchStatus, setSearchStatus] = useState('');
   const [searchStartDate, setSearchStartDate] = useState('');
   const [searchEndDate, setSearchEndDate] = useState('');
   const [isSearching, setIsSearching] = useState(false);
   const [isSearchOpen, setIsSearchOpen] = useState(false);
   const [draggedItem, setDraggedItem] = useState<bigint | null>(null);
   const [dragOverItem, setDragOverItem] = useState<bigint | null>(null);
   const [isReordering, setIsReordering] = useState(false);

   const { executeAsync: handleDelete, isExecuting: isDeleting } =
      useAction(deleteBlogPost);
   const { executeAsync: handleUpdateOrder, isExecuting: isUpdatingOrder } =
      useAction(updateBlogPostDisplayOrder);

   const handleRefresh = (page: number = 1) => {
      startTransition(async () => {
         try {
            const result = await getBlogPosts({ page, limit: data.pageSize });
            if (result?.data) {
               setData(result.data as unknown as typeof data);
            }
         } catch (error) {
            toast.error("Failed to refresh posts");
         }
      });
   };

   const handleSearch = () => {
      if (!searchCategoryId && !searchTitle && !searchStatus && !searchStartDate && !searchEndDate) {
         toast.info('Please enter search criteria');
         return;
      }
      setIsSearching(true);
      startTransition(async () => {
         try {
            const result = await searchBlogPosts({
               categoryId: searchCategoryId || undefined,
               title: searchTitle || undefined,
               isPublished: searchStatus || undefined,
               startDate: searchStartDate || undefined,
               endDate: searchEndDate || undefined,
               page: 1,
               limit: data.pageSize
            });
            if (result?.data) {
               setData(result.data as any);
            }
         } catch (error) {
            toast.error("Failed to search posts");
         }
      });
   };

   const handleReset = () => {
      setSearchCategoryId('');
      setSearchTitle('');
      setSearchStatus('');
      setSearchStartDate('');
      setSearchEndDate('');
      setIsSearching(false);
      startTransition(async () => {
         try {
            const result = await getBlogPosts({ page: 1, limit: data.pageSize });
            if (result?.data) {
               setData(result.data as unknown as typeof data);
            }
         } catch (error) {
            toast.error("Failed to load posts");
         }
      });
   };

   const handlePageChange = (newPage: number) => {
      startTransition(async () => {
         try {
            if (isSearching || searchCategoryId || searchTitle || searchStatus || searchStartDate || searchEndDate) {
               const result = await searchBlogPosts({
                  categoryId: searchCategoryId || undefined,
                  title: searchTitle || undefined,
                  isPublished: searchStatus || undefined,
                  startDate: searchStartDate || undefined,
                  endDate: searchEndDate || undefined,
                  page: newPage,
                  limit: data.pageSize
               });
               if (result?.data) {
                  setData(result.data as any);
               }
            } else {
               const result = await getBlogPosts({ page: newPage, limit: data.pageSize });
               if (result?.data) {
                  setData(result.data as unknown as typeof data);
               }
            }
         } catch (error) {
            toast.error("Failed to load posts");
         }
      });
   };

   const handleEdit = (post: (typeof data.posts)[0]) => {
      setSelectedPost(post);
      setIsFormOpen(true);
   };

   const handleAddNew = () => {
      setSelectedPost(null);
      setIsFormOpen(true);
   };

   const handleDeleteClick = (id: bigint) => {
      setPostToDelete(id);
      setDeleteDialogOpen(true);
   };

   const confirmDelete = async () => {
      if (!postToDelete) return;

      try {
         const result = await handleDelete({ id: postToDelete });
         if ((result?.data as any)?.success === true) {
            toast.success("News & Events post deleted successfully");
            setDeleteDialogOpen(false);
            setPostToDelete(null);
            handleRefresh(data.page);
         } else if (result?.serverError) {
            toast.error(result.serverError as string);
         }
      } catch (error) {
         toast.error("Failed to delete News & Events post");
      }
   };

   const handleFormClose = () => {
      setIsFormOpen(false);
      setSelectedPost(null);
      handleRefresh(data.page);
   };

   const truncateText = (text: string | null, maxLength: number = 50) => {
      if (!text) return "—";
      if (text.length > maxLength) return text.substring(0, maxLength) + "...";
      return text;
   };

   const openTextPreview = (title: string, content: string | null) => {
      setPreviewText({ title, content: content || "" });
      setTextPreviewOpen(true);
   };

   const handleDragStart = (id: bigint) => {
      setDraggedItem(id);
   };

   const handleDragOver = (id: bigint) => {
      setDragOverItem(id);
   };

   const handleDragEnd = async () => {
      if (!draggedItem || !dragOverItem || draggedItem === dragOverItem) {
         setDraggedItem(null);
         setDragOverItem(null);
         return;
      }

      setIsReordering(true);
      try {
         const draggedIndex = data.posts.findIndex(p => p.id === draggedItem);
         const dragOverIndex = data.posts.findIndex(p => p.id === dragOverItem);

         if (draggedIndex === -1 || dragOverIndex === -1) return;

         // Create new array with reordered items
         const newPosts = [...data.posts];
         const [draggedPost] = newPosts.splice(draggedIndex, 1);
         newPosts.splice(dragOverIndex, 0, draggedPost);

         // Update display order for all affected posts
         const updates = newPosts.map((post, index) => ({
            id: post.id,
            displayOrder: BigInt(index),
         }));

         // Update all posts
         for (const update of updates) {
            await handleUpdateOrder(update);
         }

         // Update local state
         setData({
            ...data,
            posts: newPosts,
         });

         toast.success("Posts reordered successfully");
      } catch (error) {
         console.error("Reordering error:", error);
         toast.error("Failed to reorder posts");
         // Refresh to get correct order
         handleRefresh(data.page);
      } finally {
         setDraggedItem(null);
         setDragOverItem(null);
         setIsReordering(false);
      }
   };

   return (
      <>
         {isFormOpen ? (
            <div className="space-y-4">
               <div className="flex items-center gap-2 justify-between">
                  <h2 className="text-lg font-semibold">
                     {selectedPost ? "Edit News & Events Post" : "Create News & Events Post"}
                  </h2>
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={handleFormClose}
                     className="gap-2"
                  >
                     <ChevronLeft className="h-4 w-4" />
                     Back to List
                  </Button>

               </div>

               <div className="bg-white rounded-lg p-6 ">
                  <BlogPostForm
                     categories={categories}
                     post={selectedPost}
                     onSuccess={handleFormClose}
                  />
               </div>
            </div>
         ) : (
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">News & Events Posts</h2>
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
                        onClick={() => handleRefresh(data.page)}
                        disabled={isPending}
                        className="gap-2"
                     >
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                     </Button>
                     <Button onClick={handleAddNew} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Post
                     </Button>
                  </div>
               </div>

               {/* Search Section - Collapsible */}
               {isSearchOpen && (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                     <div className="grid grid-cols-5 gap-4">
                        {/* Category Dropdown */}
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700">Category</label>
                           <CustomSelect
                              value={searchCategoryId}
                              onValueChange={setSearchCategoryId}
                              placeholder="Select category..."
                              searchable
                              searchPlaceholder="Search categories..."
                           >
                              <CustomSelect.Option value="">
                                 Select All
                              </CustomSelect.Option>
                              {categories.map((category) => (
                                 <CustomSelect.Option key={category.id.toString()} value={category.id.toString()}>
                                    {category.name}
                                 </CustomSelect.Option>
                              ))}
                           </CustomSelect>
                        </div>

                        {/* Status Dropdown */}
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700">Status</label>
                           <CustomSelect
                              value={searchStatus}
                              onValueChange={setSearchStatus}
                              placeholder="Select status..."
                           >
                              <CustomSelect.Option value="">
                                 Select All
                              </CustomSelect.Option>
                              <CustomSelect.Option value="true">
                                 Published
                              </CustomSelect.Option>
                              <CustomSelect.Option value="false">
                                 Draft
                              </CustomSelect.Option>
                           </CustomSelect>
                        </div>

                        {/* Title Input */}
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700">Title</label>
                           <Input
                              placeholder="Search title..."
                              value={searchTitle}
                              onChange={(e) => setSearchTitle(e.target.value)}
                              className="h-9"
                           />
                        </div>


                        {/* Start Date */}
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700">Start Date</label>
                           <DatePicker
                              value={searchStartDate}
                              onChange={setSearchStartDate}
                              placeholder="From date..."
                           />
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-700">End Date</label>
                           <DatePicker
                              value={searchEndDate}
                              onChange={setSearchEndDate}
                              placeholder="To date..."
                           />
                        </div>
                     </div>

                     {/* Buttons */}
                     <div className="flex gap-2 justify-end">
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
               )}

               <div className="border rounded-lg overflow-hidden bg-white">
                  <Table>
                     <TableHeader className="bg-muted/50">
                        <TableRow className="border-b">
                           <TableHead className="text-foreground font-semibold border-r px-4 py-3 w-8"></TableHead>
                           <TableHead className="text-foreground font-semibold border-r px-4 py-3">Created</TableHead>
                           <TableHead className="text-foreground font-semibold border-r px-4 py-3">Title</TableHead>
                           <TableHead className="text-foreground font-semibold border-r px-4 py-3">Slug</TableHead>
                           <TableHead className="text-foreground font-semibold border-r px-4 py-3">Category</TableHead>
                           <TableHead className="text-foreground font-semibold border-r px-4 py-3">Image</TableHead>
                           <TableHead className="text-foreground font-semibold border-r px-4 py-3">Status</TableHead>
                           <TableHead className="text-right text-foreground font-semibold px-4 py-3">Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {data.posts.length === 0 ? (
                           <TableRow>
                              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                 No News & Events posts found
                              </TableCell>
                           </TableRow>
                        ) : (
                           data.posts.map((post, index) => (
                              <TableRow
                                 key={post.id.toString()}
                                 draggable
                                 onDragStart={() => handleDragStart(post.id)}
                                 onDragOver={() => handleDragOver(post.id)}
                                 onDragEnd={handleDragEnd}
                                 className={`border-b transition-colors cursor-move ${draggedItem === post.id ? 'opacity-50 bg-blue-50' : ''
                                    } ${dragOverItem === post.id ? 'bg-blue-100' : ''
                                    } ${index % 2 === 0 ? 'bg-bg-white' : 'bg-muted/40'
                                    } hover:bg-primary/5`}
                              >
                                 <TableCell className="border-r px-2 py-1 text-center">
                                    <GripVertical className="h-4 w-4 text-gray-400" />
                                 </TableCell>
                                 <TableCell className="text-muted-foreground border-r px-4 py-1">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                 </TableCell>
                                 <TableCell className="font-medium max-w-xs text-foreground border-r px-4 py-1">
                                    <button
                                       onClick={() =>
                                          openTextPreview("Title", post.title)
                                       }
                                       className="text-primary hover:underline text-left"
                                    >
                                       {truncateText(post.title)}
                                    </button>
                                 </TableCell>
                                 <TableCell className="text-muted-foreground border-r px-4 py-1 text-sm">
                                    {post.slug}
                                 </TableCell>
                                 <TableCell className="text-muted-foreground border-r px-4 py-1">{post.category.name}</TableCell>
                                 <TableCell className="border-r px-4 py-1">
                                    {post.ImgSrc ? (
                                       (() => {
                                          const imageUrl = getImageUrl(post.ImgSrc!);
                                          if (!imageUrl) return <span className="text-muted-foreground">—</span>;
                                          return (
                                             <button
                                                onClick={() =>
                                                   window.open(imageUrl, "_blank")
                                                }
                                                className="relative w-12 h-12 border rounded overflow-hidden hover:opacity-80 transition-opacity"
                                             >
                                                <NextImage
                                                   src={imageUrl}
                                                   alt={(post.ImgAlt || "Image")}
                                                   fill
                                                   className="object-cover"
                                                />
                                             </button>
                                          );
                                       })()
                                    ) : (
                                       <span className="text-muted-foreground">—</span>
                                    )}
                                 </TableCell>
                                 <TableCell className="border-r px-4 py-1">
                                    <span
                                       className={`px-2 py-1 rounded text-xs font-medium ${post.isPublished
                                          ? "bg-green-100 text-green-800"
                                          : "bg-yellow-100 text-yellow-800"
                                          }`}
                                    >
                                       {post.isPublished ? "Published" : "Draft"}
                                    </span>
                                 </TableCell>
                                 <TableCell className="text-right px-4 py-1">
                                    <div className="flex justify-end gap-2">
                                       <Button
                                          variant="outline"
                                          size="sm"
                                          className="gap-1 hover:bg-blue-100 hover:text-blue-700"
                                          onClick={() => handleEdit(post)}
                                          disabled={isReordering}
                                       >
                                          <Edit className="h-4 w-4" />
                                       </Button>

                                       <Button
                                          variant="destructive"
                                          size="sm"
                                          className="gap-1"
                                          onClick={() =>
                                             handleDeleteClick(post.id)
                                          }
                                          disabled={isDeleting || isReordering}
                                       >
                                          <Trash2 className="h-4 w-4 " />
                                       </Button>
                                    </div>
                                 </TableCell>
                              </TableRow>
                           ))
                        )}
                     </TableBody>
                  </Table>
               </div>

               {/* Pagination */}
               <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                     Showing {(data.page - 1) * data.pageSize + 1} to{" "}
                     {Math.min(data.page * data.pageSize, data.total)} of {data.total} posts
                  </p>
                  <div className="flex gap-2">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(data.page - 1)}
                        disabled={data.page === 1 || isPending}
                        className="gap-2"
                     >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                     </Button>
                     <div className="flex items-center gap-2">
                        {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
                           (page) => (
                              <Button
                                 key={page}
                                 variant={data.page === page ? "default" : "outline"}
                                 size="sm"
                                 onClick={() => handlePageChange(page)}
                                 disabled={isPending}
                              >
                                 {page}
                              </Button>
                           )
                        )}
                     </div>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(data.page + 1)}
                        disabled={data.page === data.totalPages || isPending}
                        className="gap-2"
                     >
                        Next
                        <ChevronRight className="h-4 w-4" />
                     </Button>
                  </div>
               </div>
            </div >
         )
         }

         <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Delete News & Events Post</AlertDialogTitle>
                  <AlertDialogDescription>
                     Are you sure you want to delete this News & Events post? This action cannot
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

         <Dialog open={textPreviewOpen} onOpenChange={setTextPreviewOpen}>
            <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
               <DialogHeader>
                  <DialogTitle>{previewText?.title}</DialogTitle>
               </DialogHeader>
               <div className="whitespace-pre-wrap break-words text-sm">
                  {previewText?.content || "No content"}
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}
