import { headers } from 'next/headers';

/**
 * Get client IP address from request headers
 */
export async function getClientIP(): Promise<string> {
   const headersList = await headers();

   // Check various headers for IP address
   const forwardedFor = headersList.get('x-forwarded-for');
   const realIP = headersList.get('x-real-ip');
   const cfConnectingIP = headersList.get('cf-connecting-ip');

   if (forwardedFor) {
      // x-forwarded-for can contain multiple IPs, get the first one
      return forwardedFor.split(',')[0].trim();
   }

   if (realIP) {
      return realIP;
   }

   if (cfConnectingIP) {
      return cfConnectingIP;
   }

   // Fallback to a default IP if none found
   return '127.0.0.1';
}