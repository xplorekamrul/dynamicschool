import { getVacancies } from "@/actions/get-vacancies";
import { getSeoContent } from "@/actions/public/get-organizational-history";
import VacancyListSkeleton from "@/app/(user)/(administration)/vacancy-list/vacancy-list-skeleton";
import VacancyListView from "@/app/(user)/(administration)/vacancy-list/vacancy-list-view";
import { addFaviconToMetadata } from "@/lib/shared/generate-page-metadata";
import { getInstituteId } from "@/lib/shared/get-institute-id";
import { Suspense } from "react";

async function getCachedSeoContent(instituteId: string) {
  "use cache";
  return await getSeoContent(instituteId, "vacancy-list");
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

async function VacancyContent() {
  try {
    const vacancies = await getVacancies();
    return <VacancyListView vacancies={vacancies} />;
  } catch {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Unable to Load Vacancies
          </h3>
          <p className="text-gray-500">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }
}

export default function VacancyListPage() {
  return (
    <div className="space-y-6 max-w-[77%] mx-auto py-5">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Vacancies</h1>
        <p className="text-gray-500 mt-1">
          Explore current job opportunities at our institute
        </p>
      </div>

      <Suspense fallback={<VacancyListSkeleton />}>
        <VacancyContent />
      </Suspense>
    </div>
  );
}