import { Suspense } from "react";
import FooterClient from "./FooterClient";
import { getFooterData, getFooterPages } from "./get-footer-data";

async function FooterContent({ instituteId }: { instituteId?: string | null }) {
   try {
      const [footerData, footerPages] = await Promise.all([
         getFooterData(instituteId || null),
         getFooterPages(instituteId || null),
      ]);

      return <FooterClient footerData={footerData} footerPages={footerPages} />;
   } catch (error) {
      console.error("Footer error:", error);
      return <FooterClient footerData={null} footerPages={[]} />;
   }
}

export default function Footer({ instituteId }: { instituteId?: string | null } = {}) {
   return (
      <Suspense fallback={<div className="h-32 bg-gray-100" />}>
         <FooterContent instituteId={instituteId} />
      </Suspense>
   );
}
