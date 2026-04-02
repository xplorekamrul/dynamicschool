/**
 * Validate all required environment variables at startup
 * This prevents cryptic errors later and helps with debugging
 */

export function validateEnvironmentVariables() {
   const errors: string[] = [];

   // Critical variables
   if (!process.env.DATABASE_URL) {
      errors.push('DATABASE_URL is not set');
   }

   if (!process.env.NEXTAUTH_SECRET) {
      errors.push('NEXTAUTH_SECRET is not set');
   }

   // Optional but important for features
   if (!process.env.FTP_HOST) {
      console.warn('⚠️  FTP_HOST is not set - file manager will not work');
   }

   if (!process.env.SMTP_HOST) {
      console.warn('⚠️  SMTP_HOST is not set - email notifications will not work');
   }

   // Throw if critical variables are missing
   if (errors.length > 0) {
      const errorMessage = `Missing required environment variables:\n${errors.map(e => `  - ${e}`).join('\n')}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
   }

   console.log('✅ All required environment variables are set');
}
