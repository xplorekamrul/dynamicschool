import { getOrganizationalHistoryContent } from "@/actions/public/get-org-history-contnet";
import { getSeoContent } from "@/actions/public/get-organizational-history";
import { getInstituteId } from "@/lib/shared/get-institute-id";
import { getImageUrl } from "@/lib/shared/image-utils";
import { LexicalContent } from "@/lib/shared/lexical-content";
import Image from "next/image";

async function getCachedSeoContent(instituteId: string) {
  "use cache";
  return await getSeoContent(instituteId, "organizational-history");
}

export async function generateMetadata() {
  const instituteId = await getInstituteId();
  if (!instituteId) return {};

  const seoContent = await getCachedSeoContent(instituteId);
  if (!seoContent) return {};

  return {
    title: seoContent.title || "Organizational History",
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
}

export default async function OrganizationalHistoryPage() {
  const instituteId = await getInstituteId();

  if (!instituteId) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-lg text-red-600">Institute not found</p>
      </div>
    );
  }

  const data = await getOrganizationalHistoryContent(
    "organizational-history",
    instituteId
  );

  // Debug logging
  // console.log("Organizational History Data:", {
  //   instituteId,
  //   data,
  //   hasData: !!data,
  //   contentsLength: data?.contents?.length,
  // });

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-gradient-to-r from-green-50 to-green-100 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-700 text-center">
              Organizational History
            </h1>
          </div>
        </div>
        <div className="text-center py-20">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-blue-800 text-lg">
              No content available
            </p>
            <p className="text-blue-700 text-sm mt-2">
              Content for this page has not been added yet. Please check back later or contact the administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-700 text-center">
            {data.pageTitle}
          </h1>
        </div>
      </div>

      {/* Content Sections */}
      <section className="container mx-auto px-4 py-10 md:py-16">
        <div className="space-y-12 md:space-y-16">
          {data.contents.map((content, index) => {
            const imageUrl = getImageUrl(content.img_src);
            const hasImage = imageUrl && imageUrl.trim() !== "";

            return (
              <article key={content.id} className="flex flex-col items-center">
                {/* Section Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 mb-6 md:mb-8 text-center">
                  {content.title}
                </h2>

                {/* Image Section - Below Title, Centered */}
                {hasImage && (
                  <div className="w-full flex justify-center mb-8">
                    <div className="relative h-64 sm:h-80 md:h-96 w-full max-w-md">
                      <Image
                        src={imageUrl}
                        alt={content.img_alt || content.title}
                        fill
                        className="object-contain rounded-lg shadow-lg"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                )}

                {/* Text Section - Below Image */}
                <LexicalContent html={content.bodyHtml} subtitle={content.subtitle} />
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
