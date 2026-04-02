"use server";

import { deleteFile } from "@/lib/file-manager/helpers";
import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const deleteMCSchema = z.object({
   id: z.string(),
});

export const deleteMC = adminActionClient
   .schema(deleteMCSchema)
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

      const member = await prisma.managementCommittee.findFirst({
         where: {
            id: BigInt(parsedInput.id),
            instituteId: user.instituteId,
         },
      });

      if (!member) {
         throw new Error("Member not found");
      }

      await prisma.managementCommittee.delete({
         where: { id: BigInt(parsedInput.id) },
      });

      if (member.image) {
         try {
            const imagePath = member.image.replace(/^\/images/, "");
            await deleteFile(imagePath);
         } catch (error) {
            console.error("Failed to delete member image:", error);
         }
      }

      revalidatePath("/admin/managementCommittee");
      revalidatePath("/administration/managementCommittee");

      return {
         success: true,
         message: "Member deleted successfully",
      };
   });

export async function getMCMembers(instituteId: string) {
   try {
      const members = await prisma.managementCommittee.findMany({
         where: { instituteId },
         orderBy: { createdAt: "desc" },
      });
      return members;
   } catch (error) {
      console.error("Error fetching members:", error);
      throw new Error("Failed to fetch members");
   }
}
