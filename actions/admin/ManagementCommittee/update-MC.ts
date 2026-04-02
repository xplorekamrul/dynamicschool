"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateMCSchema = z.object({
   id: z.string(),
   name: z.string().min(1, "Name is required"),
   image: z.string().optional(),
   phoneNumber: z.string().min(1, "Phone number is required"),
   position: z.string().min(1, "Position is required"),
   shortDetails: z.string().optional(),
});

export const updateMC = adminActionClient
   .schema(updateMCSchema)
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

      const { id, ...data } = parsedInput;

      const existingMember = await prisma.managementCommittee.findFirst({
         where: {
            id: BigInt(id),
            instituteId: user.instituteId,
         },
      });

      if (!existingMember) {
         throw new Error("Member not found");
      }

      const member = await prisma.managementCommittee.update({
         where: { id: BigInt(id) },
         data,
      });

      revalidatePath("/admin/managementCommittee");
      revalidatePath("/administration/managementCommittee");

      return {
         success: true,
         message: "Member updated successfully",
         member,
      };
   });
