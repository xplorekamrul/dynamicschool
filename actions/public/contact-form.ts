"use server";

import { sendContactEmails } from "@/lib/email";
import { getClientIP } from "@/lib/ip-utils";
import { prisma } from "@/lib/prisma";
import { getInstituteIdOrThrow } from "@/lib/shared/get-institute-id";
import { contactFormSchema } from "@/schema/contact-form";

const SECTION_NAME = "contact-us";

export async function submitContactForm(formData: unknown) {
   try {
      // Validate input
      const parsedInput = contactFormSchema.parse(formData);

      // Get institute ID and client IP
      const [instituteId, clientIP] = await Promise.all([
         getInstituteIdOrThrow(),
         getClientIP()
      ]);

      // Get configuration from environment
      const requestBlockTime = parseInt(process.env.REQUEST_BLOCK_TIME || '300'); // minutes
      const maxRequests = parseInt(process.env.MAX_REQ || '2');

      // Calculate cutoff time for old records
      const cutoffTime = new Date(Date.now() - requestBlockTime * 60 * 1000);

      // Clean up old IP logs for this institute (older than REQUEST_BLOCK_TIME)
      await prisma.ipLog.deleteMany({
         where: {
            instituteId,
            createdAt: {
               lt: cutoffTime
            }
         }
      });

      // Check current IP request count within the time window
      const existingRequests = await prisma.ipLog.count({
         where: {
            instituteId,
            ip: clientIP,
            section: SECTION_NAME,
            createdAt: {
               gte: cutoffTime
            }
         }
      });

      // If user has exceeded the request limit
      if (existingRequests >= maxRequests) {
         return {
            success: false,
            error: "You have reached the maximum number of submissions. Please try again later."
         };
      }

      // Get institute details for email
      const institute = await prisma.institute.findUnique({
         where: { id: instituteId },
         include: {
            configs: {
               select: {
                  email: true
               }
            }
         }
      });

      if (!institute) {
         return {
            success: false,
            error: "Institute not found."
         };
      }

      const adminEmail = institute.configs[0]?.email;
      if (!adminEmail) {
         return {
            success: false,
            error: "Admin email not configured. Please contact the administrator."
         };
      }

      // Start database transaction
      const result = await prisma.$transaction(async (tx) => {
         // Save contact information
         const contactInfo = await tx.contactInfo.create({
            data: {
               instituteId,
               name: parsedInput.name,
               phoneNumber: parsedInput.phoneNumber,
               email: parsedInput.email || null,
               message: parsedInput.message || null,
            }
         });

         // Log the IP request
         await tx.ipLog.create({
            data: {
               instituteId,
               ip: clientIP,
               section: SECTION_NAME,
            }
         });

         return contactInfo;
      });

      // Send emails asynchronously (don't wait for completion)
      sendContactEmails({
         name: parsedInput.name,
         phoneNumber: parsedInput.phoneNumber,
         email: parsedInput.email,
         message: parsedInput.message,
         instituteName: institute.name,
         adminEmail,
      }).catch((error) => {
         console.error('Failed to send emails:', error);
         // Don't throw error - email failure shouldn't fail the form submission
      });

      // Return success immediately, emails will be sent in background
      return {
         success: true,
         message: "Your message has been submitted successfully! We will get back to you soon.",
         data: {
            id: result.id,
         }
      };

   } catch (error) {
      console.error('Contact form submission error:', error);

      return {
         success: false,
         error: "An error occurred while submitting your message. Please try again."
      };
   }
}