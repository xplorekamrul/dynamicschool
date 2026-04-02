import ApplicationProvider from "@/components/application-provider";
import { FileManagerProviderWrapper } from "@/components/providers/file-manager-provider-wrapper";
import { Suspense } from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={null}>
      <ApplicationProvider>
        <FileManagerProviderWrapper>
          {children}
        </FileManagerProviderWrapper>
      </ApplicationProvider>
    </Suspense>
  )
}
