import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ContentsClient from "./contents-client";

async function ContentsContent() {
   const session = await auth();

   if (!session?.user || session.user.role !== "ADMIN") {
      redirect("/admin/login");
   }

   const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { instituteId: true },
   });

   if (!user?.instituteId) {
      return (
         <div className="flex items-center justify-center h-96">
            <p className="text-gray-500">Institute not found</p>
         </div>
      );
   }

   // Fetch contents with Next.js caching
   const contents = await prisma.content.findMany({
      where: {
         page: {
            instituteId: user.instituteId,
         },
      },
      include: {
         page: {
            select: {
               id: true,
               title: true,
               slug: true,
               status: true,
            },
         },
      },
      orderBy: { updatedAt: "desc" },
   });

   return <ContentsClient initialContents={contents} />;
}

export default function ContentsPage() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <ContentsContent />
      </Suspense>
   );
}
