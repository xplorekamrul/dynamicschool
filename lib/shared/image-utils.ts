/**
 * Converts database image path to valid URL
 * If path is a relative path (starts with /uploads/), prepend /images/
 * The rewrite in next.config.ts will handle the domain normalization:
 * /images/uploads/... → https://schoolstorage.arrowheadit.net/uploads/...
 * If path is already a full URL, return as-is
 */
export function getImageUrl(imagePath: string | null | undefined): string | null {
   if (!imagePath) {
      return null;
   }

   // If it's already a full URL, return as-is
   if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
   }

   // If it's a relative path with /uploads/, prepend /images/
   // The rewrite in next.config.ts will convert /images/uploads/... to https://schoolstorage.arrowheadit.net/uploads/...
   if (imagePath.includes('/uploads/')) {
      // Remove leading slash if present to avoid double slashes
      const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
      return `/images/${cleanPath}`;
   }

   // For other paths, return as-is
   return imagePath;
}
