import { getSeoContent } from "@/actions/public/get-organizational-history";
import { addFaviconToMetadata } from "@/lib/shared/generate-page-metadata";
import { getInstituteId } from "@/lib/shared/get-institute-id";
import { getPageContent } from "@/lib/shared/get-page-content";
import { getImageUrl } from "@/lib/shared/image-utils";
import { LexicalContent } from "@/lib/shared/lexical-content";
import { lexicalToHtml } from "@/lib/shared/lexical-parser";
import Image from "next/image";

async function getCachedSeoContent(instituteId: string) {
  "use cache";
  return await getSeoContent(instituteId, "brilliant-students");
}

export async function generateMetadata() {
  const instituteId = await getInstituteId();
  if (!instituteId) return {};

  const seoContent = await getCachedSeoContent(instituteId);
  if (!seoContent) return {};

  const metadata = {
    title: seoContent.title || "Brilliant Students",
    description: seoContent.description,
    keywords: seoContent.keywords,
    canonical: seoContent.canonical_url,
    openGraph: {
      title: seoContent.ogTitle || seoContent.title,
      description: seoContent.description,
      images: seoContent.ogImg
        ? [
          {
            url: seoContent.ogImg,
            width: 1200,
            height: 630,
          },
        ]
        : undefined,
    },
  };

  return await addFaviconToMetadata(metadata, instituteId);
}

export default async function BrilliantStudentsPage() {
  const instituteId = await getInstituteId();

  if (!instituteId) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-lg text-red-600">Institute not found</p>
      </div>
    );
  }

  const content = await getPageContent("brilliant-students", instituteId);

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-gradient-to-r from-green-50 to-green-100 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-700 text-center">
              Brilliant Students
            </h1>
          </div>
        </div>
        <div className="text-center py-20">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-blue-800 text-lg">No content available</p>
            <p className="text-blue-700 text-sm mt-2">
              Content for this page has not been added yet. Please check back
              later or contact the administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(content.img_src);
  const hasImage = imageUrl && imageUrl.trim() !== "";
  const bodyHtml = lexicalToHtml(content.body);

  return (
    <main className="w-full">
      <div className="bg-gradient-to-r from-green-50 to-green-100 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-700 text-center">
            {content.title}
          </h1>
        </div>
      </div>

      <section className="container mx-auto px-4 py-10 md:py-16">
        <article className="flex flex-col items-center">
          {hasImage && (
            <div className="w-full flex justify-center mb-8">
              <div className="relative h-64 sm:h-80 md:h-96 w-full max-w-md">
                <Image
                  src={imageUrl}
                  alt={content.img_alt || content.title}
                  fill
                  className="object-contain rounded-lg shadow-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          )}

          <div className="w-full max-w-3xl">
            {content.subtitle && (
              <p className="text-base sm:text-lg text-gray-600 mb-4 md:mb-6 font-semibold text-center">
                {content.subtitle}
              </p>
            )}

            {content.body && (
              <LexicalContent html={bodyHtml} subtitle={content.subtitle} />
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
