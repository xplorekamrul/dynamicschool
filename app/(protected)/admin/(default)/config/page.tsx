import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ConfigPageClient from "./config-client";

async function ConfigContent() {
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
            <div className="flex justify-between items-center">
               <h1 className="text-2xl font-semibold">Institute Configuration</h1>
            </div>
            <div className="text-center py-12 text-muted-foreground">
               Institute not found
            </div>
         </section>
      );
   }

   const config = await prisma.config.findFirst({
      where: { instituteId: user.instituteId },
   });

   return (
      <section className="space-y-6">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Institute Configuration</h1>
         </div>
         <ConfigPageClient
            initialConfig={config}
            instituteId={user.instituteId}
         />
      </section>
   );
}

export default function ConfigPage() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <ConfigContent />
      </Suspense>
   );
}
