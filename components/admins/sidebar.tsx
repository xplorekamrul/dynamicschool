// components/layout/Sidebar.tsx
"use client";

import { ChevronDown, FileText, FileType, Home, Image, LayoutGrid, Link2, List, ListCheck, ListVideo, Newspaper, School, Users, View } from "lucide-react";
import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { useSidebar } from "@/context/sidebar-collapse-context";
import { cn } from "@/lib/utils";

type Role = "ADMIN" | "SUPER_ADMIN" | string;

type NavItem = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  href?: string;
  children?: NavItem[];
};

export default function Sidebar({ session }: { session: Session | null }) {
  const { open: sidebarOpen } = useSidebar();
  const pathname = usePathname();
  const role = (session?.user as { role?: Role } | undefined)?.role;
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const dashboardHref = role === "SUPER_ADMIN" ? "/sadmin" : "/admin";

  const isPathActive = (href?: string) => {
    if (!href) return false;
    if (href === dashboardHref) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label]
    );
  };

  // Common
  const commonItems: NavItem[] = useMemo(
    () => [{ icon: Home, label: "Dashboard", href: dashboardHref }],
    [dashboardHref]
  );

  // Admin-only with parent/children structure
  const adminItems: NavItem[] =
    role === "ADMIN"
      ? [
        { icon: View, label: "Hero Section", href: "/admin/hero-section" },
        { icon: FileText, label: "Pages", href: "/admin/pages" },
        { icon: FileType, label: "Contents", href: "/admin/contents" },
        { icon: School, label: "Configuration", href: "/admin/config" },
        { icon: List, label: "Notice", href: "/admin/notice" },
        {
          icon: Users,
          label: " Management",
          children: [
            { icon: Users, label: "Teachers", href: "/admin/teachers" },
            { icon: Users, label: "Mgt Committee", href: "/admin/managementCommittee" },
            { icon: Users, label: "Staff", href: "/admin/staff" },
          ],
        },
        { icon: Users, label: "Vacancies", href: "/admin/vacancies" },
        {
          icon: Image,
          label: "Gallery",
          children: [
            { icon: Image, label: "Images", href: "/admin/gallery/images" },
            { icon: ListVideo, label: "Videos", href: "/admin/gallery/videos" },
          ],
        },
        { icon: Link2, label: "Important Links", href: "/admin/important-links" },
         {
          icon: Newspaper,
          label: "News & events",
          children: [
            { icon: LayoutGrid, label: "Categories", href: "/admin/blog/blog-category" },
            { icon: ListCheck, label: "List", href: "/admin/blog" },
          ],
        },
      ]
      : [];

  // Super-admin–only
  const superAdminItems: NavItem[] =
    role === "SUPER_ADMIN"
      ? [
        { icon: School, label: "Institutes", href: "/sadmin/institutes" },
      ]
      : [];

  const NavItemComponent = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus.includes(item.label);
    const active = isPathActive(item.href);
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <li key={item.label}>
          <button
            onClick={() => toggleMenu(item.label)}
            className={cn(
              "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-colors",
              !sidebarOpen && "justify-center",
              isExpanded ? "bg-emerald-600" : "hover:bg-emerald-600"
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              </>
            )}
          </button>
          {isExpanded && sidebarOpen && (
            <ul className="ml-4 mt-1 space-y-1 border-l border-emerald-600 pl-2">
              {item.children?.map((child) => (
                <NavItemComponent key={child.label} item={child} level={level + 1} />
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={item.label}>
        <Link
          href={item.href || "#"}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-white transition-colors",
            !sidebarOpen && "justify-center",
            active ? "bg-emerald-600 font-medium" : "hover:bg-emerald-600"
          )}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
          {sidebarOpen && <span className="flex-1">{item.label}</span>}
        </Link>
      </li>
    );
  };

  const NavGroup = ({ items }: { items: NavItem[] }) => {
    if (!items.length) return null;
    return (
      <ul className="space-y-1">
        {items.map((item) => (
          <NavItemComponent key={item.label} item={item} />
        ))}
      </ul>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-full border-r border-emerald-800 bg-emerald-700 text-white transition-all duration-300 ease-in-out lg:relative lg:h-screen flex flex-col",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo / Brand */}
      <div className="flex h-16 items-center justify-between border-b border-emerald-800 px-4 flex-shrink-0">
        <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold">
            SA
          </div>
          {sidebarOpen && <span className="font-semibold text-white">School Admin</span>}
        </div>
      </div>

      {/* Navigation with vertical scroll */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        <div className="space-y-4">
          <NavGroup items={commonItems} />
          <NavGroup items={adminItems} />
          <NavGroup items={superAdminItems} />
        </div>
      </nav>
    </aside>
  );
}
