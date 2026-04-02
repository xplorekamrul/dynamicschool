export const getUserByMail = async ({ email }: { email: string }) => {
   const { getPrisma } = await import("@/lib/prisma");
   const prisma = getPrisma();
   return await prisma.user.findUnique({ where: { email } });
}

// Export contact form action
export { submitContactForm } from "./public/contact-form";
