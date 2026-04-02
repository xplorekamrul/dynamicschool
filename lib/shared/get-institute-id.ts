import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

/**
 * Get institute ID from domain with caching
 * Falls back to DEV_INSTITUTE_ID in development mode
 * Returns null during prerendering to avoid headers() errors
 */
export async function getInstituteId(): Promise<string | null> {
   // Check if we're in development mode and have a dev institute ID
   const devInstituteId = process.env.DEV_INSTITUTE_ID;
   const isDev = process.env.NODE_ENV === "development";

   if (isDev && devInstituteId) {
      // console.log("Using DEV_INSTITUTE_ID:", devInstituteId);
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

      return await lookupInstituteIdByDomain(domain);
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

async function lookupInstituteIdByDomain(domain: string): Promise<string | null> {
   try {
      const institute = await prisma.institute.findFirst({
         where: { domain },
         select: { id: true },
      });

      return institute?.id ?? null;
   } catch (error) {
      console.error("Error looking up institute by domain:", error);
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
