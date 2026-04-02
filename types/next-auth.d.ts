import { User as PrismaUser } from "@prisma/client";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: PrismaUser['id']
      name: PrismaUser['name']
      email: PrismaUser['email']
      role: PrismaUser['role']
    };
  }

  interface User {
      id: PrismaUser['id']
      name: PrismaUser['name']
      email: PrismaUser['email']
      role: PrismaUser['role']
  }
}
