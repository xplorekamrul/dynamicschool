import { getSeoContent } from "@/actions/public/get-organizational-history";
import { prisma } from "@/lib/prisma";
import { getInstituteId } from "@/lib/shared/get-institute-id";
import Image from "next/image";
import { Suspense } from "react";

interface StaffMember {
  id: bigint;
  name: string;
  phoneNumber: string;
  position: string;
  image?: string;
}

async function getCachedSeoContent(instituteId: string) {
  "use cache";
  return await getSeoContent(instituteId, "our-staffs");
}

export async function generateMetadata() {
  const instituteId = await getInstituteId();
  if (!instituteId) return {};

  const seoContent = await getCachedSeoContent(instituteId);
  if (!seoContent) return {};

  return {
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
}

async function getStaff(): Promise<StaffMember[]> {
  try {
    const instituteId = await getInstituteId();
    if (!instituteId) return [];

    const staff = await (prisma as unknown as { staff: { findMany: (query: unknown) => Promise<StaffMember[]> } }).staff.findMany({
      where: {
        instituteId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return staff;
  } catch (error) {
    console.error("Failed to fetch staff:", error);
    return [];
  }
}

const getPositionColor = (position: string) => {
  const colors: Record<string, string> = {
    caretaker: "bg-purple-100 text-purple-800",
    "office assistant": "bg-indigo-100 text-indigo-800",
    "lab operator": "bg-cyan-100 text-cyan-800",
    ayah: "bg-pink-100 text-pink-800",
    "security guard": "bg-orange-100 text-orange-800",
    "sanitation worker": "bg-green-100 text-green-800",
  };
  return colors[position.toLowerCase()] || "bg-gray-100 text-gray-800";
};

async function StaffContent() {
  const staff = await getStaff();

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
          <h2 className="text-2xl font-bold text-primary-foreground">Support Staff</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Photo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mobile Number
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No staff members found
                  </td>
                </tr>
              ) : (
                staff.map((member: StaffMember, index: number) => (
                  <tr
                    key={member.id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-primary/5 transition-colors duration-200`}
                  >
                    <td className="px-4 py-4">
                      {member.image ? (
                        <div className="relative h-12 w-12 rounded-full overflow-hidden">
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                      {member.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPositionColor(
                          member.position
                        )}`}
                      >
                        {member.position}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      <a
                        href={`tel:${member.phoneNumber}`}
                        className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200"
                      >
                        {member.phoneNumber}
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {staff.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total Support Staff: {staff.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return [{}];
}

export default function StaffPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StaffContent />
    </Suspense>
  );
}
