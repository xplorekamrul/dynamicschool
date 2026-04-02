

import { getSeoContent } from "@/actions/public/get-organizational-history";
import { getInstituteId } from "@/lib/shared/get-institute-id";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import ContactPageRightServer from "@/components/ContactPageRightServer";


async function getCachedSeoContent(instituteId: string) {
  "use cache";
  return await getSeoContent(instituteId, "contact");
}

export async function generateMetadata() {
  const instituteId = await getInstituteId();
  if (!instituteId) return {};

  const seoContent = await getCachedSeoContent(instituteId);
  if (!seoContent) return {};

  return {
    title: seoContent.title || "N/A",
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

export default function page() {
    return (
        <>
            {/* <Breadcrumbs pageTitle="যোগাযোগ" /> */}
            <div className="py-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ContactPageRightServer />
                        <ContactForm />
                    </div>
                </div>
            </div>
        </>
    )
}