import Breadcrumbs from "@/components/Breadcrumbs";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import AttachmentSection from "../attachment-section";

// Convert Lexical JSON to HTML
function lexicalToHTML(jsonString: string): string {
   try {
      const data = JSON.parse(jsonString);
      let html = "";

      const processNode = (node: Record<string, unknown>): string => {
         if (!node) return "";

         if (node.type === "text") {
            let text = (node.text as string) || "";
            const format = (node.format as number) || 0;
            if (format & 1) text = `<strong>${text}</strong>`;
            if (format & 2) text = `<em>${text}</em>`;
            if (format & 4) text = `<u>${text}</u>`;
            if (format & 8) text = `<s>${text}</s>`;
            return text;
         }

         if (node.type === "paragraph") {
            const children = ((node.children as Record<string, unknown>[]) || []).map(processNode).join("");
            return `<p>${children}</p>`;
         }

         if (node.type === "heading") {
            const level = node.tag || "h1";
            const children = ((node.children as Record<string, unknown>[]) || []).map(processNode).join("");
            return `<${level}>${children}</${level}>`;
         }

         if (node.type === "list") {
            const tag = node.listType === "number" ? "ol" : "ul";
            const items = ((node.children as Record<string, unknown>[]) || [])
               .map((item: Record<string, unknown>) => `<li>${((item.children as Record<string, unknown>[]) || []).map(processNode).join("")}</li>`)
               .join("");
            return `<${tag}>${items}</${tag}>`;
         }

         if (node.type === "quote") {
            const children = ((node.children as Record<string, unknown>[]) || []).map(processNode).join("");
            return `<blockquote>${children}</blockquote>`;
         }

         if (node.type === "code") {
            const children = ((node.children as Record<string, unknown>[]) || []).map(processNode).join("");
            return `<pre><code>${children}</code></pre>`;
         }

         return ((node.children as Record<string, unknown>[]) || []).map(processNode).join("");
      };

      if (data.root && data.root.children) {
         html = data.root.children.map(processNode).join("");
      }

      return html;
   } catch {
      return jsonString;
   }
}

async function getNoticeBySlug(slug: string) {
   const notice = await prisma.notice.findUnique({
      where: { slug },
      include: { institute: true },
   });
   return notice;
}

async function NoticeContent({ slug }: { slug: string }) {
   await connection();
   const notice = await getNoticeBySlug(slug);

   if (!notice || !notice.isPublished) {
      notFound();
   }

   const formattedDate = new Date(notice.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
   });

   return (
      <div className="py-10">
         <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
               <Link
                  href="/notice"
                  className="inline-flex items-center gap-2 text-greencolor hover:text-scolor transition-colors mb-6"
               >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Notices
               </Link>

               <div className="shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="p-6 lg:p-8">
                     <div className="mb-6">
                        <div className="flex items-start justify-between gap-4 mb-4">
                           <div className="flex-1">
                              <h1 className="text-3xl lg:text-4xl font-bold text-tcolor mb-2">
                                 {notice.title}
                              </h1>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                 <span>
                                    {formattedDate}
                                 </span>
                                 <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
                                    {notice.category}
                                 </span>
                              </div>
                           </div>

                           {notice.fileUrl && (
                              <AttachmentSection fileUrl={notice.fileUrl} fileName={notice.fileName} />
                           )}
                        </div>
                     </div>

                     <div className="prose prose-sm lg:prose-base max-w-none mb-8">
                        <div
                           className="text-tcolor leading-relaxed"
                           dangerouslySetInnerHTML={{ __html: lexicalToHTML(notice.content) }}
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export async function generateStaticParams() {
   // Return at least one sample param for build-time validation
   return [{ slug: 'sample' }];
}

export default async function NoticeDetailPage({
   params,
}: {
   params: Promise<{ slug: string }>;
}) {
   const { slug } = await params;
   return (
      <>
         <Breadcrumbs pageTitle="নোটিশ বিস্তারিত" />
         <Suspense fallback={<div>Loading...</div>}>
            <NoticeContent slug={slug} />
         </Suspense>
      </>
   );
}
