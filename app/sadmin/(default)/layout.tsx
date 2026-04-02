import SAdminLayout from "@/components/admins/sadmin-layout"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SAdminLayout>{children}</SAdminLayout>
}
 