"use server";

import { prisma } from "@/lib/prisma";
import { cacheLife } from "next/cache";

export interface HeaderData {
   name: string;
   mobileNumber: string | null;
   email: string | null;
   logo: string | null;
   established: number | null;
   eiin: string | null;
   mpo: string | null;
   facebook: string | null;
   twitter: string | null;
   instagram: string | null;
   linkedin: string | null;
   youtube: string | null;
}

export interface NavItem {
   name: string;
   href: string;
   submenu?: {
      name: string;
      href: string;
   }[];
}

async function getCachedHeaderData(instituteId: string): Promise<HeaderData | null> {
   'use cache';
   cacheLife('hours');
   try {
      // Fetch institute and config data
      const institute = await prisma.institute.findUnique({
         where: { id: instituteId },
         select: {
            name: true,
            configs: {
               select: {
                  mobileNumber: true,
                  email: true,
                  logo: true,
                  established: true,
                  eiin: true,
                  mpo: true,
                  facebook: true,
                  twitter: true,
                  instagram: true,
                  linkedin: true,
                  youtube: true,
               },
            },
         },
      });

      if (!institute) {
         return null;
      }

      const config = institute.configs?.[0];

      return {
         name: institute.name,
         mobileNumber: config?.mobileNumber || null,
         email: config?.email || null,
         logo: config?.logo || null,
         established: config?.established || null,
         eiin: config?.eiin || null,
         mpo: config?.mpo || null,
         facebook: config?.facebook || null,
         twitter: config?.twitter || null,
         instagram: config?.instagram || null,
         linkedin: config?.linkedin || null,
         youtube: config?.youtube || null,
      };
   } catch {
      return null;
   }
}

/**
 * Fetch header data from the institute's config
 * Accepts instituteId as parameter to avoid calling headers() during prerendering
 */
export async function getHeaderData(instituteId: string | null): Promise<HeaderData | null> {
   try {
      if (!instituteId) {
         return null;
      }

      return getCachedHeaderData(instituteId);
   } catch {
      // Silently fail - header will render with defaults
      return null;
   }
}

async function getCachedNavItems(instituteId: string): Promise<NavItem[]> {
   'use cache';
   cacheLife('hours');
   try {
      // Fetch all active pages for this institute
      const pages = await prisma.page.findMany({
         where: {
            instituteId,
            status: "ACTIVE",
         },
         select: {
            id: true,
            title: true,
            slug: true,
            parentId: true,
         },
         orderBy: {
            createdAt: "asc",
         },
      });

      // Organize pages into menu structure based on parent-child relationships
      const navItems: NavItem[] = [];

      for (const page of pages) {
         // Only process top-level pages (no parent)
         if (!page.parentId) {
            // Find all children of this page
            const children = pages.filter(p => p.parentId === page.id);

            const submenu = children.length > 0
               ? children.map(child => ({
                  name: child.title,
                  href: `/${child.slug}`,
               }))
               : undefined;

            navItems.push({
               name: page.title,
               href: `/${page.slug}`,
               ...(submenu && { submenu }),
            });
         }
      }

      return navItems;
   } catch {
      return [];
   }
}

/**
 * Fetch active navigation items from the Page table using parent-child relationships
 * Pages with parentId become submenus of their parent
 * Accepts instituteId as parameter to avoid calling headers() during prerendering
 */
export async function getNavItems(instituteId: string | null): Promise<NavItem[]> {
   try {
      if (!instituteId) {
         return [];
      }

      return getCachedNavItems(instituteId);
   } catch {
      // Silently fail - navigation will render empty
      return [];
   }
}
