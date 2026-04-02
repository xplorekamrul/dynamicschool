import { getSeoContent } from "@/actions/public/get-organizational-history";
import { prisma } from "@/lib/prisma";
import { getInstituteId } from "@/lib/shared/get-institute-id";
import Image from "next/image";
import { Suspense } from "react";

type ManagementCommittee = {
   id: string | bigint;
   name: string;
   image: string | null;
   phoneNumber: string;
   position: string;
   shortDetails: string | null;
};

async function getCachedSeoContent(instituteId: string) {
   "use cache";
   return await getSeoContent(instituteId, "managementCommittee");
}

export async function generateMetadata() {
   const instituteId = await getInstituteId();
   if (!instituteId) return {};

   const seoContent = await getCachedSeoContent(instituteId);
   if (!seoContent) return {};

   return {
      title: seoContent.title || "Management Committee",
      description: seoContent.description,
      keywords: seoContent.keywords,
      canonical: seoContent.canonical_url,
      openGraph: {
         title: seoContent.ogTitle || seoContent.title,
         description: seoContent.description,
         images: seoContent.ogImg
            ? [
               {
                  url: seoContent.ogImg,
                  width: 1200,
                  height: 630,
               },
            ]
            : undefined,
      },
   };
}

async function ManagementCommitteeContent() {
   const instituteId = await getInstituteId();

   if (!instituteId) {
      return (
         <div className="container mx-auto p-4">
            <div className="text-center py-12">
               <p className="text-muted-foreground">Institute not found</p>
            </div>
         </div>
      );
   }

   const members: ManagementCommittee[] = await prisma.managementCommittee.findMany({
      where: { instituteId },
      orderBy: { createdAt: "asc" },
   });

   return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
         <div className="container mx-auto px-4 py-12">
            {/* Header */}
            <div className="text-center mb-12">
               <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-3">
                  Managing Committee
               </h1>
               <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Meet our dedicated leadership team committed to excellence in education
               </p>
            </div>

            {members.length === 0 ? (
               <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No management committee members found</p>
               </div>
            ) : (
               <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full">
                        <thead className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-primary/20">
                           <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Photo</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Position</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Details</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone Number</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                           {members.map((member: ManagementCommittee) => (
                              <tr
                                 key={member.id}
                                 className="hover:bg-primary/5 transition-colors duration-200"
                              >
                                 {/* Photo */}
                                 <td className="px-6 py-4">
                                    <div className="flex items-center justify-center">
                                       {member.image ? (
                                          <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-sm mr-auto">
                                             <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover"
                                             />
                                          </div>
                                       ) : (
                                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                             <span className="text-lg font-bold text-primary/50">
                                                {member.name.charAt(0).toUpperCase()}
                                             </span>
                                          </div>
                                       )}
                                    </div>
                                 </td>

                                 {/* Name */}
                                 <td className="px-6 py-4">
                                    <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                                 </td>

                                 {/* Position */}
                                 <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-primary bg-primary/10">
                                       {member.position}
                                    </span>
                                 </td>

                                 {/* Short Details */}
                                 <td className="px-6 py-4">
                                    <p className="text-sm text-gray-600 max-w-xs truncate">
                                       {member.shortDetails || "—"}
                                    </p>
                                 </td>

                                 {/* Phone Number */}
                                 <td className="px-6 py-4">
                                    <a
                                       href={`tel:${member.phoneNumber}`}
                                       className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                    >
                                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.058.3.102.605.102.924 0 1.748.585 3.364 1.56 4.657l1.548.773a1 1 0 01.54 1.06l-.74 4.435a1 1 0 01-.986.836H3a1 1 0 01-1-1V3z" />
                                       </svg>
                                       {member.phoneNumber}
                                    </a>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  {/* Footer */}
                  <div className="bg-gradient-to-r from-primary/5 to-primary/2 px-6 py-4 border-t border-primary/10">
                     <p className="text-sm text-gray-600">
                        Total Members: <span className="font-semibold text-primary">{members.length}</span>
                     </p>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

export function generateStaticParams() {
   return [{}];
}

export default function ManagementCommitteePage() {
   return (
      <Suspense fallback={<div>Loading...</div>}>
         <ManagementCommitteeContent />
      </Suspense>
   );
}
