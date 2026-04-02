import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import MCPageContent from "./MCPageContent";

async function getMCData() {
   const session = await auth();
   if (!session?.user?.id) {
      throw new Error("Unauthorized");
   }

   const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { instituteId: true },
   });

   if (!user?.instituteId) {
      throw new Error("Institute not found");
   }

   const members = await prisma.managementCommittee.findMany({
      where: { instituteId: user.instituteId },
      orderBy: { createdAt: "desc" },
   });

   return {
      members,
      instituteId: user.instituteId,
   };
}

function LoadingFallback() {
   return (
      <div className="flex items-center justify-center min-h-screen">
         <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading management committee...</p>
         </div>
      </div>
   );
}

export default function ManagementCommitteePage() {
   return (
      <Suspense fallback={<LoadingFallback />}>
         <MCPageContent dataPromise={getMCData()} />
      </Suspense>
   );
}
