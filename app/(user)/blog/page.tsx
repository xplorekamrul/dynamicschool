import { prisma } from "@/lib/prisma";
import { getInstituteId } from "@/lib/shared/get-institute-id";
import { getImageUrl } from "@/lib/shared/image-utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { FaArrowRightLong } from "react-icons/fa6";

export const metadata = {
  title: "সংবাদ এবং ইভেন্ট",
  description: "প্রতিষ্ঠানের সকল সংবাদ এবং ইভেন্ট দেখুন",
};

export default async function BlogPage() {
  await connection();
  const instituteId = await getInstituteId();
  if (!instituteId) return notFound();

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
  });

  if (posts.length === 0) {
    return (
      <div className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-tcolor mb-8">
            সংবাদ এবং ইভেন্ট
          </h1>
          <div className="text-center text-gray-500">
            <p>কোন সংবাদ পাওয়া যায়নি</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-tcolor mb-4">
            সংবাদ এবং ইভেন্ট
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            প্রতিষ্ঠানের সকল সংবাদ এবং ইভেন্ট সম্পর্কে জানুন
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const date = new Date(post.createdAt);
            const month = date.toLocaleDateString("en-US", { month: "short" });
            const day = date.getDate();
            const year = date.getFullYear();
            const imageUrl = getImageUrl(post.ImgSrc) || "/default-blog-image.jpg";

            return (
              <div
                key={post.id.toString()}
                className="rounded-lg shadow-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 group"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-48">
                  <Link href={`/blog/${post.slug}`}>
                    <Image
                      src={imageUrl}
                      alt={post.ImgAlt || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  {/* Date Badge */}
                  <div className="absolute right-2 top-2 flex items-center gap-x-2">
                    <div className="w-10 rounded-sm overflow-hidden shadow-sm">
                      <span className="block py-0 px-1 text-white text-xs bg-red-500 text-center capitalize">
                        {month}
                      </span>
                      <span className="block py-2 px-1 text-green-950 text-sm font-medium bg-white text-center capitalize">
                        {day}
                      </span>
                    </div>
                    <div className="rotate-[270deg] -ml-3">
                      <span className="text-sm text-white font-medium">{year}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Category */}
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-greencolor/10 text-greencolor text-xs font-semibold rounded">
                      {post.category.name}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-tcolor mb-2 line-clamp-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-scolor transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  {/* Read More Link */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-x-2 text-sm font-medium text-greencolor hover:text-scolor transition-colors"
                  >
                    বিস্তারিত পড়ুন <FaArrowRightLong />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
