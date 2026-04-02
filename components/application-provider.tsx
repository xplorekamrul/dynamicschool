import { FileManagerProvider } from "@/context/file-manager-context"
import QueryClientProvider from "@/context/query-client-provider"
import SidebarCollapseContextProvider from "@/context/sidebar-collapse-context"

export default function ApplicationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryClientProvider>
      <SidebarCollapseContextProvider>
        <FileManagerProvider>
          {children}
        </FileManagerProvider>
      </SidebarCollapseContextProvider>
    </QueryClientProvider>
  )
}
