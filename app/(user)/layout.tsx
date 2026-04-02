import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import school from "@/config/school";
import { InstituteProvider } from "@/context/institute-context";
import { getInstituteId } from "@/lib/shared/get-institute-id";
import type { Metadata } from "next";
import { Suspense } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

export const metadata: Metadata = {
  title: school.name,
  description: `${school.name} ${school.address}`,
  icons: {
    icon: '/logo.png',
  },
};

function HeaderFallback() {
  return <div className="h-32 bg-gray-100" />;
}

function FooterFallback() {
  return <div className="h-32 bg-gray-100" />;
}

async function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  let instituteId: string | null = null;

  try {
    instituteId = await getInstituteId();
  } catch (error) {
    console.error("Failed to get institute ID:", error);
  }

  return (
    <InstituteProvider instituteId={instituteId}>
      <Suspense fallback={<HeaderFallback />}>
        <Header instituteId={instituteId} />
      </Suspense>
      {children}
      <Suspense fallback={<FooterFallback />}>
        <Footer instituteId={instituteId} />
      </Suspense>
    </InstituteProvider>
  );
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100" />}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}
