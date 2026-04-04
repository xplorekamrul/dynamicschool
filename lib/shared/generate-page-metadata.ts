'use server'

import { Metadata } from 'next'
import { getPageFavicon } from './get-page-favicon'

/**
 * Helper function to add favicon to page metadata
 * Use this in generateMetadata() of any page to include dynamic favicon
 */
export async function addFaviconToMetadata(
   metadata: any,
   instituteId: string | null
): Promise<Metadata> {
   const favicon = await getPageFavicon(instituteId)

   return {
      ...metadata,
      icons: {
         icon: favicon,
      },
   } as Metadata
}
