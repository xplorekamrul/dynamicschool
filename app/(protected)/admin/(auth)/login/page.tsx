// app/admin/auth/login/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AdminLoginForm } from "@/components/forms/admin-login"

export default function Page() {
  return (
    <section className="flex justify-center items-center h-dvh bg-muted/30">
      <Card className="w-full max-w-sm shadow-lg border border-primary/20">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-primary">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center">
            Sign in with your admin credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminLoginForm />
        </CardContent>
      </Card>
    </section>
  )
}
