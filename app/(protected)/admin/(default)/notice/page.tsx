import NoticePageClient from "@/app/(protected)/admin/(default)/notice/notice-page-client";
import { auth } from "@/lib/auth";
import { getInstituteIdOrThrow } from "@/lib/shared/get-institute-id";
import { redirect } from "next/navigation";

export default async function NoticePage() {
   const session = await auth();

   if (!session?.user) {
      redirect("/login");
   }

   const instituteId = await getInstituteIdOrThrow();

   return <NoticePageClient instituteId={instituteId} />;
}
