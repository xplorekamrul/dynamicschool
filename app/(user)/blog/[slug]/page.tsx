import { LexicalRenderer } from "@/components/shared/lexical-renderer";
import { prisma } from "@/lib/prisma";
import { addFaviconToMetadata } from "@/lib/shared/generate-page-metadata";
import { getInstituteId } from "@/lib/shared/get-institute-id";
import { getImageUrl } from "@/lib/shared/image-utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { FaFacebookF, FaLinkedin, FaTwitter } from "react-icons/fa";
import { FaArrowLeftLong, FaCalendarDays, FaFolderOpen, FaShareNodes } from "react-icons/fa6";

interface BlogDetailPageProps {
   params: Promise<{
      slug: string;
   }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
   await connection();
   const { slug } = await params;
   const instituteId = await getInstituteId();
   if (!instituteId) return {};

   const post = await prisma.blogPost.findFirst({
      where: {
         slug,
         instituteId,
         isPublished: true,
      },
   });

   if (!post) return {};

   const metadata = {
      title: post.title,
      description: post.content?.substring(0, 160) || post.title,
      openGraph: {
         title: post.title,
         description: post.content?.substring(0, 160) || post.title,
         images: [
            {
               url: getImageUrl(post.ImgSrc) || "/default-blog-image.jpg",
               width: 1200,
               height: 630,
            },
         ],
      },
   };

   return await addFaviconToMetadata(metadata, instituteId);
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
   await connection();
   const { slug } = await params;
   const instituteId = await getInstituteId();
   if (!instituteId) return notFound();

   const post = await prisma.blogPost.findFirst({
      where: {
         slug,
         instituteId,
         isPublished: true,
      },
      include: {
         category: true,
      },
   });

   if (!post) return notFound();

   const date = new Date(post.createdAt);
   const formattedDate = date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
   });

   const imageUrl = getImageUrl(post.ImgSrc) || "/default-blog-image.jpg";

   // Get related posts
   const relatedPosts = await prisma.blogPost.findMany({
      where: {
         instituteId,
         isPublished: true,
         categoryId: post.categoryId,
         NOT: {
            id: post.id,
         },
      },
      take: 3,
      orderBy: {
         createdAt: "desc",
      },
   });

   return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
         {/* Header Navigation */}
         <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 py-3">
               <Link
                  href="/blog"
                  className="inline-flex items-center gap-x-2 text-sm font-medium text-greencolor hover:text-scolor transition-colors"
               >
                  <FaArrowLeftLong className="text-lg" /> সকল সংবাদ
               </Link>
            </div>
         </div>

         {/* Main Content */}
         <div className="py-8 lg:py-12">
            <div className="container mx-auto px-4">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Article */}
                  <div className="lg:col-span-2">
                     {/* Article Header */}
                     <article className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Featured Image */}
                        <div className="relative h-96 md:h-[500px] overflow-hidden group">
                           <Image
                              src={imageUrl}
                              alt={post.ImgAlt || post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              priority
                           />
                           {/* Overlay Gradient */}
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                           {/* Category Badge */}
                           <div className="absolute top-4 left-4">
                              <span className="inline-block px-4 py-2 bg-scolor text-white text-sm font-bold rounded-full shadow-lg">
                                 {post.category.name}
                              </span>
                           </div>

                           {/* Date Badge */}
                           <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                              <div className="flex items-center gap-x-2 text-tcolor font-semibold">
                                 <FaCalendarDays className="text-scolor" />
                                 <span className="text-sm">{formattedDate}</span>
                              </div>
                           </div>
                        </div>

                        {/* Article Content */}
                        <div className="p-6 md:p-10">
                           {/* Title */}
                           <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-tcolor mb-4 leading-tight">
                              {post.title}
                           </h1>

                           {/* Meta Information */}
                           <div className="flex flex-wrap items-center gap-6 py-4 border-b-2 border-gray-200 mb-6">
                              <div className="flex items-center gap-x-2 text-gray-600">
                                 <FaFolderOpen className="text-greencolor" />
                                 <span className="text-sm font-medium">{post.category.name}</span>
                              </div>
                              <div className="flex items-center gap-x-2 text-gray-600">
                                 <FaCalendarDays className="text-greencolor" />
                                 <span className="text-sm font-medium">{formattedDate}</span>
                              </div>
                           </div>

                           {/* Share Buttons */}
                           <div className="flex items-center gap-x-4 mb-8 pb-6 border-b border-gray-200">
                              <span className="text-sm font-semibold text-gray-700 flex items-center gap-x-2">
                                 <FaShareNodes className="text-greencolor" /> শেয়ার করুন:
                              </span>
                              <div className="flex gap-x-3">
                                 <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? window.location.href : ''}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                    title="Facebook এ শেয়ার করুন"
                                 >
                                    <FaFacebookF className="text-lg" />
                                 </a>
                                 <a
                                    href={`https://twitter.com/intent/tweet?url=${typeof window !== 'undefined' ? window.location.href : ''}&text=${post.title}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
                                    title="Twitter এ শেয়ার করুন"
                                 >
                                    <FaTwitter className="text-lg" />
                                 </a>
                                 <a
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${typeof window !== 'undefined' ? window.location.href : ''}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                                    title="LinkedIn এ শেয়ার করুন"
                                 >
                                    <FaLinkedin className="text-lg" />
                                 </a>
                              </div>
                           </div>

                           {/* Article Body */}
                           <div className="prose prose-lg max-w-none mb-8">
                              <div className="text-gray-700 leading-relaxed text-justify">
                                 <LexicalRenderer content={post.content} />
                              </div>
                           </div>

                           {/* Article Footer */}
                           <div className="border-t-2 border-gray-200 pt-6 mt-8">
                              <div className="flex flex-wrap items-center justify-between gap-4">
                                 <div className="flex items-center gap-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-greencolor to-scolor rounded-full flex items-center justify-center text-white font-bold text-lg">
                                       {post.category.name.charAt(0)}
                                    </div>
                                    <div>
                                       <p className="text-sm text-gray-600">প্রকাশিত</p>
                                       <p className="font-semibold text-tcolor">{formattedDate}</p>
                                    </div>
                                 </div>
                                 <Link
                                    href="/blog"
                                    className="px-6 py-2 bg-greencolor text-white rounded-lg hover:bg-scolor transition-colors font-medium"
                                 >
                                    সকল সংবাদ দেখুন
                                 </Link>
                              </div>
                           </div>
                        </div>
                     </article>
                  </div>

                  {/* Sidebar */}
                  <div className="lg:col-span-1">
                     {/* Related Posts */}
                     {relatedPosts.length > 0 && (
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 sticky top-24">
                           <h3 className="text-xl font-bold text-tcolor mb-6 pb-3 border-b-2 border-greencolor">
                              সম্পর্কিত সংবাদ
                           </h3>
                           <div className="space-y-4">
                              {relatedPosts.map((relatedPost) => {
                                 const relatedDate = new Date(relatedPost.createdAt);
                                 const relatedImageUrl = getImageUrl(relatedPost.ImgSrc) || "/default-blog-image.jpg";

                                 return (
                                    <Link
                                       key={relatedPost.id.toString()}
                                       href={`/blog/${relatedPost.slug}`}
                                       className="group block"
                                    >
                                       <div className="flex gap-3 hover:bg-gray-50 p-3 rounded-lg transition-colors">
                                          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                                             <Image
                                                src={relatedImageUrl}
                                                alt={relatedPost.ImgAlt || relatedPost.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform"
                                             />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                             <h4 className="text-sm font-semibold text-tcolor group-hover:text-scolor transition-colors line-clamp-2">
                                                {relatedPost.title}
                                             </h4>
                                             <p className="text-xs text-gray-500 mt-1">
                                                {relatedDate.toLocaleDateString("bn-BD", {
                                                   month: "short",
                                                   day: "numeric",
                                                })}
                                             </p>
                                          </div>
                                       </div>
                                    </Link>
                                 );
                              })}
                           </div>
                        </div>
                     )}

                     {/* Category Info */}
                     <div className="bg-gradient-to-br from-greencolor to-emerald-600 rounded-lg shadow-lg p-6 text-white">
                        <h3 className="text-lg font-bold mb-3">বিভাগ তথ্য</h3>
                        <p className="text-sm opacity-90 mb-4">
                           এই সংবাদটি <span className="font-semibold">{post.category.name}</span> বিভাগে প্রকাশিত হয়েছে।
                        </p>
                        <Link
                           href="/blog"
                           className="inline-block px-4 py-2 bg-white text-greencolor rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                           সকল সংবাদ দেখুন
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Bottom CTA */}
         <div className="bg-tcolor text-white py-12">
            <div className="container mx-auto px-4 text-center">
               <h2 className="text-2xl md:text-3xl font-bold mb-4">আরও সংবাদ পড়ুন</h2>
               <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
                  আমাদের প্রতিষ্ঠানের সকল সংবাদ এবং ইভেন্ট সম্পর্কে আপডেট থাকুন।
               </p>
               <Link
                  href="/blog"
                  className="inline-block px-8 py-3 bg-scolor text-white rounded-lg font-bold hover:bg-orange-600 transition-colors"
               >
                  সংবাদ পৃষ্ঠায় যান
               </Link>
            </div>
         </div>
      </div>
   );
}
