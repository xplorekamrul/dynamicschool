import { getHeroSection } from "@/actions/admin/hero-section";
import { auth } from "@/lib/auth";
import { getInstituteIdOrThrow } from "@/lib/shared/get-institute-id";
import { redirect } from "next/navigation";
import { HeroSectionContent } from "./hero-section-content";

export default async function HeroSectionPage() {
   const session = await auth();

   if (!session?.user) {
      redirect("/login");
   }

   const instituteId = await getInstituteIdOrThrow();

   const result = await getHeroSection();
   const heroSection = (result?.data as any)?.heroSection || null;

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Hero Section</h1>
         </div>

         <HeroSectionContent heroSection={heroSection} />
      </div>
   );
}
