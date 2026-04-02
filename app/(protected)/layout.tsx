import ApplicationProvider from "@/components/application-provider";
import { Suspense } from "react";
import { Toaster } from "sonner";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={null}>
      <ApplicationProvider>
        {children}
        <Toaster />
      </ApplicationProvider>
    </Suspense>
  )
}
