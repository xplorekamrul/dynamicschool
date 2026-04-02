import { Role } from "@prisma/client";
import z from "zod";


// schema 
export const loginFormSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const BasicInfoFormSchema = z.object({
  logo: z.any().refine((file) => file?.length === 1, "Logo is required"),
  name: z.string().min(2, "Institute name is required"),
  domain: z.string().min(2, "Domain address is required"),
})

// types
export type LoginFormValues = z.infer<typeof loginFormSchema>
export type BasicInfoFormValues = z.infer<typeof BasicInfoFormSchema>


export const ServerActionOutputSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
});


export const InsertInstituteFormSchema = z.object({
  instituteName: z.string().min(2, "Institute name is required"),
  domain: z.string().min(2, "Domain is required"),
  userName: z.string().min(2, "User name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().optional(),
  role: z.nativeEnum(Role).refine((val) => val !== undefined, { message: "Role is required" }),
})

export type InsertInstituteFormValues = z.infer<typeof InsertInstituteFormSchema>

// Export contact form schema
export { contactFormSchema, type ContactFormData } from "./contact-form";
