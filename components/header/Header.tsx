import { Suspense } from "react";
import { getHeaderData, getNavItems } from "./get-header-data";
import HeaderClient from "./HeaderClient";

async function HeaderContent({ instituteId }: { instituteId?: string | null }) {
   try {
      const [headerData, navItems] = await Promise.all([
         getHeaderData(instituteId || null),
         getNavItems(instituteId || null),
      ]);

      return <HeaderClient headerData={headerData} navItems={navItems} />;
   } catch (error) {
      console.error("Header error:", error);
      return <HeaderClient headerData={null} navItems={[]} />;
   }
}

export default function Header({ instituteId }: { instituteId?: string | null } = {}) {
   return (
      <Suspense fallback={<div className="h-32 bg-gray-100" />}>
         <HeaderContent instituteId={instituteId} />
      </Suspense>
   );
}
