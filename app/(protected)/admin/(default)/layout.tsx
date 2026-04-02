import AdminLayout from "@/components/admins/admin-layout"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}
