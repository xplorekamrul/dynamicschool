import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import TeachersClient from "./teachers-client";

async function TeachersContent() {
   const session = await auth();

   if (!session?.user?.id) {
      redirect("/admin/login");
   }

   const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { instituteId: true },
   });

   if (!user?.instituteId) {
      return (
         <section className="space-y-6">
            <h1 className="text-2xl font-semibold">Teachers Management</h1>
            <div className="text-center py-12 text-muted-foreground">
               Institute not found
            </div>
         </section>
      );
   }

   const teachers = await prisma.teacher.findMany({
      where: { instituteId: user.instituteId },
      orderBy: { createdAt: "desc" },
   });

   return (
      <section className="space-y-6">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Teachers Management</h1>
         </div>
         <TeachersClient initialTeachers={teachers} instituteId={user.instituteId} />
      </section>
   );
}

export default function TeachersPage() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <TeachersContent />
      </Suspense>
   );
}
