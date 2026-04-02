import { getHeroSection } from "@/actions/home/get-hero-section";
import { getSeoContent } from "@/actions/home/get-seo-content";
import HeroSlider from "@/components/HeroSlider";
import HomeContentWrap from "@/components/HomeContentWrap-dynamic";
import NotisArea from "@/components/NotisArea";
import { getInstituteId } from "@/lib/shared/get-institute-id";
import { connection } from "next/server";

export async function generateMetadata() {
  await connection();
  const instituteId = await getInstituteId();
  if (!instituteId) return {};

  const seoContent = await getSeoContent(instituteId, "/");
  if (!seoContent) return {};

  return {
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
}

export default async function Home() {
  await connection();
  const instituteId = await getInstituteId();
  const heroSection = await getHeroSection();

  return (
    <>
      <HeroSlider
        title={heroSection?.title || undefined}
        description={heroSection?.description || undefined}
        buttonUrl={heroSection?.buttonUrl || undefined}
        buttonName={heroSection?.buttonName || undefined}
        images={(heroSection?.images as any) || undefined}
      />
      <NotisArea instituteId={instituteId} />
      <HomeContentWrap />
    </>
  );
}
