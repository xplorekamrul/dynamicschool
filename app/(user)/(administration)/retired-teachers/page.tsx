
import { getSeoContent } from "@/actions/public/get-organizational-history";
import { prisma } from "@/lib/prisma";
import { addFaviconToMetadata } from "@/lib/shared/generate-page-metadata";
import { getInstituteId } from "@/lib/shared/get-institute-id";
import Image from "next/image";
import { Suspense } from "react";

type Teacher = {
  id: string;
  name: string;
  image: string | null;
  designation: string;
  classes: string | null;
  mobile: string;
  status: "ACTIVE" | "RETIRED";
};

async function getCachedSeoContent(instituteId: string) {
  "use cache";
  return await getSeoContent(instituteId, "retired-teachers");
}

export async function generateMetadata() {
  const instituteId = await getInstituteId();
  if (!instituteId) return {};

  const seoContent = await getCachedSeoContent(instituteId);
  if (!seoContent) return {};

  const metadata = {
    title: seoContent.title || "N/P",
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

  return await addFaviconToMetadata(metadata, instituteId);
}

async function RetiredTeachersContent() {
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

  const teachers: Teacher[] = await prisma.teacher.findMany({
    where: {
      instituteId,
      status: "RETIRED",
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-600 to-gray-800 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Retired Teachers</h2>
        </div>

        {teachers.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No retired teachers found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      SL No.
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Photo
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Designation
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Mobile
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {teachers.map((teacher: Teacher, index: number) => (
                    <tr
                      key={teacher.id}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-4 text-sm font-medium">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      {/* NEW IMAGE COLUMN */}
                      <td className="px-4 py-4">
                        {teacher.image ? (
                          <Image
                            src={teacher.image}
                            alt={teacher.name}
                            width={60}
                            height={60}
                            className="h-14 w-14 rounded-full object-cover shadow"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold text-gray-600">
                            {teacher.name.charAt(0)}
                          </div>
                        )}
                      </td>

                      {/* NAME */}
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                        {teacher.name}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        <span className="px-2 py-1 bg-gray-200 rounded-full text-xs font-medium">
                          {teacher.designation}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm font-mono">
                        <a
                          href={`tel:${teacher.mobile}`}
                          className="text-blue-600 hover:underline"
                        >
                          {teacher.mobile}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t">
              <p className="text-sm">Total Retired Teachers: {teachers.length}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function RetiredTeachersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RetiredTeachersContent />
    </Suspense>
  );
}
