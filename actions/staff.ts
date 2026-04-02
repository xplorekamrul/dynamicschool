"use server";

import { adminActionClient } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { getInstituteId } from "@/lib/shared/get-institute-id";
import { z } from "zod";

const staffSchema = z.object({
   name: z.string().min(1, "Name is required"),
   phoneNumber: z.string().min(1, "Phone number is required"),
   position: z.string().min(1, "Position is required"),
   image: z.string().optional(),
   id: z.bigint().optional(),
});

export const createStaff = adminActionClient
   .schema(staffSchema)
   .action(async ({ parsedInput }) => {
      const { name, phoneNumber, position, image } = parsedInput;
      const instituteId = await getInstituteId();

      if (!instituteId) throw new Error("Institute not found");

      const staff = await (prisma as any).staff.create({
         data: {
            name,
            phoneNumber,
            position,
            image,
            instituteId,
         },
      });

      return { success: true, staff };
   });

export const updateStaff = adminActionClient
   .schema(staffSchema)
   .action(async ({ parsedInput }) => {
      const { id, name, phoneNumber, position, image } = parsedInput;

      if (!id) throw new Error("Staff ID is required");

      const staff = await (prisma as any).staff.update({
         where: { id },
         data: {
            name,
            phoneNumber,
            position,
            image,
         },
      });

      return { success: true, staff };
   });

export const deleteStaff = adminActionClient
   .schema(z.object({ id: z.bigint() }))
   .action(async ({ parsedInput }) => {
      const { id } = parsedInput;

      await (prisma as any).staff.delete({
         where: { id },
      });

      return { success: true };
   });

export const getStaffByInstitute = adminActionClient.action(
   async () => {
      const instituteId = await getInstituteId();

      if (!instituteId) return [];

      const staff = await (prisma as any).staff.findMany({
         where: {
            instituteId,
         },
         orderBy: {
            createdAt: "desc",
         },
      });

      return staff;
   }
);
