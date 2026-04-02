// app/sadmin/(dashboard)/layout.tsx
import { auth, signOut } from "@/lib/auth"
import Sidebar from "@/components/admins/sidebar"
import { SidebarToggle } from "@/components/admins/sidebar-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CircleUser, Search } from "lucide-react"
import SidebarCollapseContextProvider from "../../context/sidebar-collapse-context"


export default async function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <SidebarCollapseContextProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <Sidebar session={session} />

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4">
            {/* Left */}
            <SidebarToggle />

            {/* Center */}
            <div className="flex w-full max-w-md items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 bg-muted/50 border-border focus:bg-background"
                />
              </div>
            </div>

            {/* Right */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <CircleUser className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <form
                  action={async () => {
                    "use server"
                    await signOut({ redirectTo: "/admin/login" })
                  }}
                >
                  <button
                    type="submit"
                    className="w-full text-left text-sm px-2 py-1 hover:bg-muted rounded-md cursor-pointer"
                  >
                    Log out
                  </button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto">
            <div className="h-full p-6">{children}</div>
          </main>

          {/* Footer */}
          <footer className="sticky bottom-0 z-30 flex h-16 items-center justify-center border-t border-border bg-background px-4">
            <span className="text-sm text-muted-foreground">
              © 2025 Arrowhead IT. All rights reserved.
            </span>
          </footer>
        </div>
      </div>
    </SidebarCollapseContextProvider>
  )
}
