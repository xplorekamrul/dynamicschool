import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";

/**
 * Get institute ID from domain with caching
 * Falls back to DEV_INSTITUTE_ID in development mode
 * Returns null during prerendering to avoid headers() errors
 */

// Normalize domain for consistent lookups
function normalizeDomain(domain: string): string {
   return domain
      .toLowerCase()
      .trim()
      .replace(/^www\./, "") // Remove www prefix
      .split(":")[0]; // Remove port if present
}

// Cached version of domain lookup - caches for 1 hour
// IMPORTANT: Domain is passed as argument so each domain gets its own cache entry
const cachedLookupByDomain = unstable_cache(
   async (domain: string) => {
      try {
         const normalizedDomain = normalizeDomain(domain);

         if (!normalizedDomain) {
            console.warn("Empty domain after normalization");
            return null;
         }

         // Add 15-second timeout to database query (production databases can be slower)
         const queryPromise = prisma.institute.findFirst({
            where: {
               domain: normalizedDomain,
            },
            select: { id: true },
         });

         const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Database query timeout after 15 seconds')), 15000)
         );

         const institute = await Promise.race([queryPromise, timeoutPromise]) as any;

         if (!institute?.id) {
            console.warn(`Institute not found for domain: ${normalizedDomain}`);
            return null;
         }

         console.log(`✅ Institute found for domain ${normalizedDomain}: ${institute.id}`);
         return institute.id;
      } catch (error) {
         console.error(`Error looking up institute by domain "${domain}":`, error);
         return null;
      }
   },
   ['institute-by-domain'], // Static tag for revalidation
   {
      revalidate: 3600, // Cache for 1 hour
      tags: ['institute-domain-lookup'] // Tag for targeted revalidation
   }
);

export async function getInstituteId(): Promise<string | null> {
   // Check if we're in development mode and have a dev institute ID
   const devInstituteId = process.env.DEV_INSTITUTE_ID;
   const isDev = process.env.NODE_ENV === "development";

   if (isDev && devInstituteId) {
      console.log("Using DEV_INSTITUTE_ID:", devInstituteId);
      return devInstituteId;
   }

   try {
      // Try to access headers - this will fail during prerendering
      // We wrap it in a try-catch to handle prerendering gracefully
      const headersList = await headers();
      const host = headersList.get("host") || "";

      if (!host) {
         console.error("No host found in headers");
         return null;
      }

      console.log("Host from headers:", host);

      // Normalize the domain
      const domain = normalizeDomain(host);

      if (!domain) {
         console.error("No valid domain after normalization from host:", host);
         return null;
      }

      console.log("Normalized domain:", domain);

      // Pass domain as argument so it becomes part of the cache key
      const instituteId = await cachedLookupByDomain(domain);

      if (!instituteId) {
         console.warn(`No institute found for domain: ${domain}`);
      }

      return instituteId;
   } catch (error) {
      // During prerendering, headers() will reject
      // This is expected and we just return null
      if (error instanceof Error && error.message.includes("prerendering")) {
         console.log("Prerendering detected, returning null");
         return null;
      }
      console.error("Error getting institute ID:", error);
      return null;
   }
}

/**
 * Get institute ID or throw error if not found
 */
export async function getInstituteIdOrThrow(): Promise<string> {
   const instituteId = await getInstituteId();

   if (!instituteId) {
      throw new Error("Institute not found for the current domain");
   }

   return instituteId;
}
