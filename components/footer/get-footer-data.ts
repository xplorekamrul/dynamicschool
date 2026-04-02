"use server";

import { prisma } from "@/lib/prisma";
import { cacheLife } from "next/cache";

export interface FooterLink {
   name: string;
   href: string;
}

export interface FooterData {
   name: string;
   address: string | null;
   established: number | null;
   eiin: string | null;
   mpo: string | null;
   logo: string | null;
   mobileNumber: string | null;
   email: string | null;
   mapSrc: string | null;
   mapAddress: string | null;
   socialLinks: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
      youtube?: string;
   };
}

async function getCachedFooterData(instituteId: string): Promise<FooterData | null> {
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
                  address: true,
                  established: true,
                  eiin: true,
                  mpo: true,
                  logo: true,
                  mobileNumber: true,
                  email: true,
                  mapSrc: true,
                  mapAddress: true,
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
         address: config?.address || null,
         established: config?.established || null,
         eiin: config?.eiin || null,
         mpo: config?.mpo || null,
         logo: config?.logo || null,
         mobileNumber: config?.mobileNumber || null,
         email: config?.email || null,
         mapSrc: config?.mapSrc || null,
         mapAddress: config?.mapAddress || null,
         socialLinks: {
            ...(config?.facebook && { facebook: config.facebook }),
            ...(config?.twitter && { twitter: config.twitter }),
            ...(config?.instagram && { instagram: config.instagram }),
            ...(config?.linkedin && { linkedin: config.linkedin }),
            ...(config?.youtube && { youtube: config.youtube }),
         },
      };
   } catch {
      return null;
   }
}

/**
 * Fetch footer data including institute info, config, and pages
 * Accepts instituteId as parameter to avoid calling headers() during prerendering
 */
export async function getFooterData(instituteId: string | null): Promise<FooterData | null> {
   try {
      if (!instituteId) {
         return null;
      }

      return getCachedFooterData(instituteId);
   } catch {
      return null;
   }
}

async function getCachedFooterPages(instituteId: string): Promise<FooterLink[]> {
   'use cache';
   cacheLife('hours');
   try {
      // Fetch only top-level pages (no parent)
      const pages = await prisma.page.findMany({
         where: {
            instituteId,
            status: "ACTIVE",
            parentId: null,
         },
         select: {
            title: true,
            slug: true,
         },
         orderBy: {
            createdAt: "asc",
         },
         take: 8, // Limit to 8 pages for footer
      });

      return pages.map(page => ({
         name: page.title,
         href: `/${page.slug}`,
      }));
   } catch {
      return [];
   }
}

/**
 * Fetch footer pages (only top-level pages without parents)
 * Accepts instituteId as parameter to avoid calling headers() during prerendering
 */
export async function getFooterPages(instituteId: string | null): Promise<FooterLink[]> {
   try {
      if (!instituteId) {
         return [];
      }

      return getCachedFooterPages(instituteId);
   } catch {
      return [];
   }
}
