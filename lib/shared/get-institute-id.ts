import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";

/**
 * Get institute ID from domain with caching
 * Falls back to DEV_INSTITUTE_ID in development mode
 * Returns null during prerendering to avoid headers() errors
 */

// Cached version of domain lookup - caches for 1 hour
const cachedLookupByDomain = unstable_cache(
   async (domain: string) => {
      try {
         // Add 10-second timeout to database query
         const queryPromise = prisma.institute.findFirst({
            where: { domain },
            select: { id: true },
         });

         const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Database query timeout after 10 seconds')), 10000)
         );

         const institute = await Promise.race([queryPromise, timeoutPromise]) as any;
         return institute?.id ?? null;
      } catch (error) {
         console.error("Error looking up institute by domain:", error);
         return null;
      }
   },
   ['institute-by-domain'],
   { revalidate: 3600, tags: ['institute'] }
);

export async function getInstituteId(): Promise<string | null> {
   // Check if we're in development mode and have a dev institute ID
   const devInstituteId = process.env.DEV_INSTITUTE_ID;
   const isDev = process.env.NODE_ENV === "development";

   if (isDev && devInstituteId) {
      return devInstituteId;
   }

   try {
      // Try to access headers - this will fail during prerendering
      // We wrap it in a try-catch to handle prerendering gracefully
      const headersList = await headers();
      const host = headersList.get("host") || "";
      const domain = host
         .split(":")[0] // Remove port if present
         .replace(/^www\./, "");

      if (!domain) {
         console.error("No domain found in headers");
         return null;
      }

      return await cachedLookupByDomain(domain);
   } catch (error) {
      // During prerendering, headers() will reject
      // This is expected and we just return null
      if (error instanceof Error && error.message.includes("prerendering")) {
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
      throw new Error("Institute not found");
   }

   return instituteId;
}
