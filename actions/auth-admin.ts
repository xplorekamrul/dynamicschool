// actions/auth-admin.ts
"use server"

import { actionClient } from "@/lib/next-safe-action"
import { loginFormSchema } from "@/schema"
import { returnValidationErrors } from "next-safe-action"
import { prisma } from "@/lib/prisma"
import { signIn } from "@/lib/auth"

export const adminLoginAction = actionClient
  .inputSchema(loginFormSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      //  Find admin user + fetch both user.status and institute.status
      const adminUser = await prisma.user.findFirst({
        where: { email, role: "ADMIN" },
        select: {
          id: true,
          role: true,
          status: true, // AccountStatus on User
          institute: {
            select: { status: true }, // AccountStatus on Institute
          },
        },
      })

      if (!adminUser) {
        return returnValidationErrors(loginFormSchema, {
          _errors: ["Invalid credentials"],
        })
      }

      //  Block when the Institute is suspended
      if (adminUser.institute?.status === "SUSPENDED") {
        return returnValidationErrors(loginFormSchema, {
          _errors: ["The institute is suspended"],
        })
      }

      //  Block when the User is suspended
      if (adminUser.status === "SUSPENDED") {
        return returnValidationErrors(loginFormSchema, {
          _errors: ["You are suspended from the institute"],
        })
      }

      // Credentials sign-in (only reached if above checks pass)
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        return returnValidationErrors(loginFormSchema, {
          _errors: ["Invalid credentials"],
        })
      }

      const redirectUrl = res?.url ?? "/admin"
      return { success: true, redirectUrl }
    } catch (error) {
      console.log("adminLoginAction error:", error)
      return returnValidationErrors(loginFormSchema, {
        _errors: ["Invalid credentials"],
      })
    }
  })
