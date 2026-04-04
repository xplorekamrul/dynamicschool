'use server'

import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/shared/image-utils'

/**
 * Get favicon from Config table for a specific institute
 * Used by all pages to display dynamic favicon in metadata
 */
export async function getPageFavicon(instituteId: string | null): Promise<string> {
   if (!instituteId) {
      return '/logo.png'
   }

   try {
      const config = await prisma.config.findFirst({
         where: { instituteId },
         select: {
            favicon: true,
         },
      })

      if (!config?.favicon) {
         return '/logo.png'
      }

      // Convert favicon path to proper URL
      const faviconUrl = getImageUrl(config.favicon)
      return faviconUrl || '/logo.png'
   } catch (error) {
      console.error('Error fetching page favicon:', error)
      return '/logo.png'
   }
}
