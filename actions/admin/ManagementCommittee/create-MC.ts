"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createMCSchema = z.object({
   name: z.string().min(1, "Name is required"),
   image: z.string().optional(),
   phoneNumber: z.string().min(1, "Phone number is required"),
   position: z.string().min(1, "Position is required"),
   shortDetails: z.string().optional(),
});

export const createMC = adminActionClient
   .schema(createMCSchema)
   .action(async ({ parsedInput, ctx }) => {
      const session = ctx.session;
      const userId = session.user.id;

      const user = await prisma.user.findUnique({
         where: { id: userId },
         select: { instituteId: true },
      });

      if (!user?.instituteId) {
         throw new Error("Institute not found");
      }

      const member = await prisma.managementCommittee.create({
         data: {
            ...parsedInput,
            instituteId: user.instituteId,
         },
      });

      revalidatePath("/admin/managementCommittee");
      revalidatePath("/administration/managementCommittee");

      return {
         success: true,
         message: "Member created successfully",
         member,
      };
   });
