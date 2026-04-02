"use client"
import { Menu } from "lucide-react"
import { Button } from "../ui/button"
import { useSidebar } from "@/context/sidebar-collapse-context"

export function SidebarToggle() {
  const { open, setOpen } = useSidebar() 

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setOpen(!open)}
      className="h-8 w-8 text-foreground hover:bg-accent"
    >
      <Menu className="h-4 w-4" />
    </Button>
  )
}
