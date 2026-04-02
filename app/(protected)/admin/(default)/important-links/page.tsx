import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ImportantLinksClient from "./important-links-client";

async function ImportantLinksContent() {
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
               <h1 className="text-2xl font-semibold">Important Links</h1>
            </div>
            <div className="text-center py-12 text-muted-foreground">
               Institute not found
            </div>
         </section>
      );
   }

   const links = await prisma.importantLinks.findMany({
      where: { instituteId: user.instituteId },
      orderBy: { createdAt: "desc" },
   });

   return (
      <section className="space-y-6">
         <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Important Links</h1>
         </div>
         <ImportantLinksClient
            initialLinks={links.map(link => ({
               ...link,
               id: Number(link.id),
            }))}
         />
      </section>
   );
}

export default function ImportantLinksPage() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <ImportantLinksContent />
      </Suspense>
   );
}
