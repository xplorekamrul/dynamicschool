// src/auth.ts
import { getUserByMail } from "@/actions";
import { Role } from "@/schema";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: "jwt" },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                // token: { label: "Token", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const email = credentials.email as string;
                const password = credentials.password as string;

                const user = await getUserByMail({ email });
                if (!user) return null;

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            }

        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            // Only check if user still exists on sign-in (when user object is present)
            // Skip on every request to reduce database calls
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as Role;
            }
            return session;
        },
    },
});
