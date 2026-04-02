"use server";

import { getInstituteId } from "@/lib/shared/get-institute-id";
import { getPageContent } from "@/lib/shared/get-page-content";

export async function fetchPageContent(slug: string) {
   try {
      const instituteId = await getInstituteId();

      if (!instituteId) {
         return { error: "Institute not found" };
      }

      const content = await getPageContent(slug, instituteId);

      if (!content) {
         return { error: "Page content not found" };
      }

      return { data: content };
   } catch (error) {
      console.error("Error fetching page content:", error);
      return { error: "Internal server error" };
   }
}
