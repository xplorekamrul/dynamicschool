import { z } from "zod";

// Phone number validation for Bangladesh
const bangladeshPhoneRegex = /^(\+88|88)?01[3-9]\d{8}$/;

const normalizePhoneNumber = (phone: string): string => {
   // Remove +88 or 88 prefix if present
   let normalized = phone.replace(/^(\+88|88)/, '');

   // If it starts with 0, keep it (11 digits total)
   // If it doesn't start with 0, it should be 10 digits (without country code)
   return normalized;
};

const validateBangladeshPhone = (phone: string): boolean => {
   const normalized = normalizePhoneNumber(phone);

   // Check if it's 11 digits starting with 01[3-9]
   if (normalized.length === 11 && normalized.startsWith('01')) {
      const prefix = normalized.substring(0, 3);
      return ['013', '014', '015', '016', '017', '018', '019'].includes(prefix);
   }

   // Check if it's 10 digits starting with 1[3-9] (without leading 0)
   if (normalized.length === 10 && normalized.startsWith('1')) {
      const prefix = '0' + normalized.substring(0, 2);
      return ['013', '014', '015', '016', '017', '018', '019'].includes(prefix);
   }

   return false;
};

export const contactFormSchema = z.object({
   name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be less than 100 characters")
      .trim(),

   phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .max(20, "Phone number must be less than 20 characters")
      .refine(validateBangladeshPhone, {
         message: "Please enter a valid Bangladesh phone number (013, 014, 015, 016, 017, 018, 019)"
      })
      .transform(normalizePhoneNumber),

   email: z
      .string()
      .max(100, "Email must be less than 100 characters")
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),

   message: z
      .string()
      .max(1000, "Message must be less than 1000 characters")
      .optional()
      .or(z.literal(""))
});

export type ContactFormData = z.infer<typeof contactFormSchema>;