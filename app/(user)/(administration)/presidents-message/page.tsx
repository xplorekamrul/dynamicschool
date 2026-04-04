import { getSeoContent } from "@/actions/public/get-organizational-history";
import { LexicalRenderer } from "@/components/shared/lexical-renderer";
import { addFaviconToMetadata } from "@/lib/shared/generate-page-metadata";
import { getInstituteId, getInstituteIdOrThrow } from "@/lib/shared/get-institute-id";
import { getPageContent } from "@/lib/shared/get-page-content";
import { getImageUrl } from "@/lib/shared/image-utils";
import { SerializedEditorState } from "lexical";
import Image from "next/image";
import { Suspense } from "react";

interface Section {
  id: string;
  title: string;
  body: SerializedEditorState;
  isExpanded: boolean;
}

async function getCachedSeoContent(instituteId: string) {
  "use cache";
  return await getSeoContent(instituteId, "presidents-message");
}

export async function generateMetadata() {
  const instituteId = await getInstituteId();
  if (!instituteId) return {};

  const seoContent = await getCachedSeoContent(instituteId);
  if (!seoContent) return {};

  const metadata = {
    title: seoContent.title || "N/P",
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

async function PresidentsMessageContent() {
  const instituteId = await getInstituteIdOrThrow();
  const content = await getPageContent("presidents-message", instituteId);

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center py-20">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-600 mb-4">
            📝 সভাপতি&apos;র বাণী
          </h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-yellow-800 text-lg">
              কোনো তথ্য পাওয়া যায়নি
            </p>
            <p className="text-yellow-700 text-sm mt-2">
              এই পৃষ্ঠার জন্য কোনো বিষয়বস্তু এখনও যোগ করা হয়নি।
            </p>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(content.img_src);

  // Parse sections from body
  let sections: Section[] = [];
  if (content.body) {
    try {
      const parsed = JSON.parse(content.body);
      sections = Array.isArray(parsed) ? parsed : [];
    } catch {
      sections = [];
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-green-600 text-center mb-4">
        📝{content.title}
      </h1>

      {/* Card-like Content */}
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-8 space-y-8">
        {/* Image + Greeting */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {imageUrl && (
            <Image
              className="rounded-md max-w-[250px] w-full"
              width={500}
              height={500}
              src={imageUrl}
              alt={content.img_alt || "সভাপতি"}
            />
          )}
          <div className="flex-1">
            {/* {content.subtitle && (
              <h2 className="text-xl font-semibold text-primary mb-4">
                {content.subtitle}
              </h2>
            )} */}

            {/* Sections Content */}
            <div className="space-y-6">
              {sections.length > 0 ? (
                sections.map((section) => (
                  <div key={section.id} className="space-y-3">
                    {/* <h3 className="text-lg font-semibold text-gray-900">
                      {section.title}
                    </h3> */}
                    <LexicalRenderer content={typeof section.body === 'string' ? section.body : JSON.stringify(section.body)} />
                  </div>
                ))
              ) : (
                <LexicalRenderer content={content.body} />
              )}
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="pt-6 border-t border-gray-200 text-right">
          <p className="text-lg font-semibold text-primary">— {content.title}</p>
          <p className="text-muted-foreground mt-1">সভাপতি</p>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [{}];
}

export default function Page() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-10">Loading...</div>}>
      <PresidentsMessageContent />
    </Suspense>
  );
}
