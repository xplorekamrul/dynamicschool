/**
 * Client-side slug generation utility
 * - Converts to lowercase
 * - Replaces spaces and special chars with hyphens
 * - Trims to 20 characters
 * - Removes trailing hyphens
 */
export function generateSlug(title: string): string {
   return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .substring(0, 20) // Trim to 20 characters
      .replace(/-+$/, ''); // Remove trailing hyphens
}
