"use server";

import { actionClient } from "@/lib/next-safe-action";
import { loginFormSchema } from "@/schema";
import { returnValidationErrors } from "next-safe-action";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const sAdminloginAction = actionClient
  .inputSchema(loginFormSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const bootstrapEmail = process.env.SUPER_ADMIN_EMAIL;

      let user = await prisma.user.findUnique({ where: { email, role: "SUPER_ADMIN" } });

      if (!user && email === bootstrapEmail) {
        const hashed = await bcrypt.hash(password, 10);

        user = await prisma.user.create({
          data: {
            email,
            // instituteId: "",
            password: hashed,
            name: "Super Admin",
            role: "SUPER_ADMIN",
          },
        });
      }

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      
      if (res?.error) {         
        console.log("res?.error", res?.error);
        
        return returnValidationErrors(loginFormSchema, {
          _errors: ["Invalid credentials"],
        });
      }

      return { success: true, redirectUrl: res.url ?? "/sadmin" };
    } catch (error) {
      console.log("error", error);
      return returnValidationErrors(loginFormSchema, {
        _errors: ["Invalid credentials"],
      });
    }
  });
