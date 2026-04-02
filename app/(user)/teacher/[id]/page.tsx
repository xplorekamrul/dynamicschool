import Breadcrumbs from "@/components/Breadcrumbs";
import author from '@/public/author.jpg';
import Image, { StaticImageData } from "next/image";
import { Suspense } from "react";
import { FaAddressCard, FaBook, FaEnvelope, FaPhone, FaSchool, FaTransgender } from "react-icons/fa";
import { FaCalendarDays, FaHeartPulse, FaLocationDot, FaRegCircleUser } from "react-icons/fa6";

interface Teacher {
  id: string;
  authorImage: StaticImageData;
  name: string,
  designation: string;
  subject: string;
  phone: string;
}

const teachers: Teacher[] = [
  {
    id: '1',
    authorImage: author,
    name: "MD. Hsgus Gazi",
    designation: "Principal",
    subject: "accounting",
    phone: "+88 00000000000",
  },
  {
    id: '2',
    authorImage: author,
    name: "MD. Hsgus Gazi",
    designation: "Principal",
    subject: "bangla",
    phone: "+88 00000000000",
  },
  {
    id: '3',
    authorImage: author,
    name: "MD. Hsgus Gazi",
    designation: "Principal",
    subject: "biology",
    phone: "+88 00000000000",
  },
  {
    id: '4',
    authorImage: author,
    name: "MD. Hsgus Gazi",
    designation: "Principal",
    subject: "chemistry",
    phone: "+88 00000000000",
  },
  {
    id: '5',
    authorImage: author,
    name: "MD. Hsgus Gazi",
    designation: "Principal",
    subject: "english",
    phone: "+88 00000000000",
  },
  {
    id: '6',
    authorImage: author,
    name: "MD. Hsgus Gazi",
    designation: "Principal",
    subject: "english",
    phone: "+88 00000000000",
  },
];

async function getTeacherById(id: string) {
  const teacher = teachers.find((t) => t.id === id);
  return teacher;
}

async function TeacherContent({ id }: { id: string }) {
  const teacher = await getTeacherById(id);
  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        {teacher && <>
          <div className="flex flex-wrap gap-6">
            <div>
              <Image className="w-40 h-40 object-cover rounded-2xl" src={teacher.authorImage} alt="id" />
            </div>
            <div className="w-8/12 lg:flex-1">
              <h2 className="text-3xl font-semibold">{teacher.name}</h2>
              <h3 className="text-xl font-medium text-pcolor">{teacher.designation}</h3>
              <ul className="space-y-2 mt-4">
                <li className="flex gap-x-1.5 items-center text-base font-normal"><FaSchool /> Department: Studies of Islam</li>
                <li className="flex gap-x-1.5 items-center text-base font-normal"><FaBook /> Degree: M.S.C (STUDIES OF ISLAM)</li>
                <li className="flex gap-x-1.5 items-center text-base font-normal"><FaCalendarDays /> Joining Date: 03 Jan 1965</li>
                <li className="flex gap-x-1.5 items-center text-base font-normal"><FaAddressCard /> Job Status: Current</li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-6">
            <div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden'>
              <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                <h3 className='text-base sm:text-lg font-semibold text-white'>Personal Details:</h3>
              </div>
              <div className='p-4 lg:p-5 text-sm lg:text-base'>
                <ul className="space-y-2">
                  <li className="flex gap-x-2.5">
                    <div className="text-2xl">
                      <FaRegCircleUser />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium capitalize">Name</h3>
                      <p className="text-sm font-normal">{teacher.name}</p>
                    </div>
                  </li>
                  <li className="flex gap-x-2.5">
                    <div className="text-2xl">
                      <FaRegCircleUser />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium capitalize">Father Name</h3>
                      <p className="text-sm font-normal">{teacher.name}</p>
                    </div>
                  </li>
                  <li className="flex gap-x-2.5">
                    <div className="text-2xl">
                      <FaTransgender />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium capitalize">Gender</h3>
                      <p className="text-sm font-normal">Male</p>
                    </div>
                  </li>
                  <li className="flex gap-x-2.5">
                    <div className="text-2xl">
                      <FaHeartPulse />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium capitalize">Blood Group</h3>
                      <p className="text-sm font-normal">B +</p>
                    </div>
                  </li>
                  <li className="flex gap-x-2.5">
                    <div className="text-2xl">
                      <FaPhone />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium capitalize">Mobile</h3>
                      <p className="text-sm font-normal">+88 123 456 7890</p>
                    </div>
                  </li>
                  <li className="flex gap-x-2.5">
                    <div className="text-2xl">
                      <FaEnvelope />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium capitalize">Email</h3>
                      <p className="text-sm font-normal">email@gmail.com</p>
                    </div>
                  </li>
                  <li className="flex gap-x-2.5">
                    <div className="text-2xl">
                      <FaLocationDot />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium capitalize">Address</h3>
                      <p className="text-sm font-normal"> Bangladesh EIIN- 100000, NU Code- 1606</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden'>
              <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                <h3 className='text-base sm:text-lg font-semibold text-white'>Teacher Message:</h3>
              </div>
              <div className='p-4 lg:p-5 text-sm lg:text-base'>
                <p>উচ্চ শিক্ষার প্রসারের জন্য বরগুনা জেলার প্রথম ও ঐতিহ্যবাহী আমতলী ডিগ্রি কলেজটি এ এলাকার বিশিষ্ট সমাজ সেবক, শিক্ষানুরাগী ব্যক্তিবর্গ ও সর্বজন শ্রদ্ধেয় সাবেক প্রাদেশিক পরিষদের সদস্য আলহাজ্ব মফিজ উদ্দিন তালুকদার আমতলী থানা সদরে একটি কলেজ প্রতিষ্ঠার উদ্যোগ গ্রহণ করেন।</p>
              </div>
            </div>
          </div>
        </>}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ id: '1' }];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <Breadcrumbs pageTitle="Teacher's Profile" />
      <Suspense fallback={<div>Loading...</div>}>
        <TeacherContent id={id} />
      </Suspense>
    </>
  );
}
