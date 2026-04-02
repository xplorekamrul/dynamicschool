'use client';

import { FileManagerProvider } from "@/context/file-manager-context";
import { useEffect, useState } from "react";

export function FileManagerProviderWrapper({ children }: { children: React.ReactNode }) {
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) {
      return <>{children}</>;
   }

   return (
      <FileManagerProvider>
         {children}
      </FileManagerProvider>
   );
}
