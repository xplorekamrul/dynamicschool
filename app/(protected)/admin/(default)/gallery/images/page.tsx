import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import ImageClient from "./image-client";

async function GalleryImagesContent() {
   const session = await auth();

   if (!session?.user) {
      redirect("/admin/login");
   }

   const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { instituteId: true },
   });

   if (!user?.instituteId) {
      redirect("/admin/login");
   }

   const images = await prisma.galleryImage.findMany({
      where: { instituteId: user.instituteId },
      orderBy: { index: "asc" },
   });

   const formattedImages = images.map((img) => ({
      ...img,
      id: Number(img.id),
   }));

   return <ImageClient initialImages={formattedImages} />;
}

export default function GalleryImagesPage() {
   return (
      <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
         <GalleryImagesContent />
      </Suspense>
   );
}
