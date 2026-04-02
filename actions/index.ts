import { prisma } from "@/lib/prisma";

export const getUserByMail = async ({ email }: { email: string }) => await prisma.user.findUnique({ where: { email } })

// Export contact form action
export { submitContactForm } from "./public/contact-form";
