import { prisma } from "@/lib/prisma";

/**
 * Generate a URL-friendly slug from text
 */
export function generateSlug(text: string): string {
   return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug for a notice
 * If slug already exists, appends a random string to make it unique
 */
export async function generateUniqueSlug(title: string): Promise<string> {
   let slug = generateSlug(title);
   const baseSlug = slug;
   let counter = 1;

   while (true) {
      const existing = await prisma.notice.findUnique({
         where: { slug },
      });

      if (!existing) {
         return slug;
      }

      // Append random characters to make it unique
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      slug = `${baseSlug}-${randomSuffix}`;
      counter++;

      // Safety check to prevent infinite loop
      if (counter > 100) {
         throw new Error("Failed to generate unique slug after 100 attempts");
      }
   }
}
