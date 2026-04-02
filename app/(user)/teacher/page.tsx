'use client';

import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Image, { StaticImageData } from "next/image";
import author from "@/public/author.jpg";
import { FaArrowRight, FaPhoneAlt } from "react-icons/fa";
import Link from "next/link";

interface SubjectOption {
  value: string;
  label: string;
}

const subjectOptions: SubjectOption[] = [
  { value: '', label: "All Teacher's" },
  { value: 'accounting', label: "Accounting Teacher's" },
  { value: 'agricultural-education', label: "Agricultural Education Teacher's" },
  { value: 'bangla', label: "Bangla Teacher's" },
  { value: 'biology', label: "Biology Teacher's" },
  { value: 'business-organization-and-management', label: "Business Organization and Management Teacher's" },
  { value: 'chemistry', label: "Chemistry Teacher's" },
  { value: 'computer-operation', label: "Computer Operation Teacher's" },
  { value: 'economics', label: "Economics Teacher's" },
  { value: 'english', label: "English Teacher's" },
  { value: 'finance-banking-and-insurance', label: "Finance, Banking, and Insurance Teacher's" },
  { value: 'geography', label: "Geography Teacher's" },
  { value: 'higher-math', label: "Higher Math Teacher's" },
  { value: 'history', label: "History Teacher's" },
  { value: 'history-and-culture-of-islam', label: "History and Culture of Islam Teacher's" },
  { value: 'ict', label: "ICT Teacher's" },
  { value: 'logic', label: "Logic Teacher's" },
  { value: 'physical-education', label: "Physical Education Teacher's" },
  { value: 'physics', label: "Physics Teacher's" },
  { value: 'political-science', label: "Political Science Teacher's" },
  { value: 'production-management-and-marketing', label: "Production Management and Marketing Teacher's" },
  { value: 'psychology', label: "Psychology Teacher's" },
  { value: 'social-science', label: "Social Science Teacher's" },
  { value: 'social-work', label: "Social Work Teacher's" },
  { value: 'sociology', label: "Sociology Teacher's" },
  { value: 'soil-science', label: "Soil Science Teacher's" },
  { value: 'statistics', label: "Statistics Teacher's" },
  { value: 'studies-of-islam', label: "Studies of Islam Teacher's" },
];

interface Teacher {
  id: number;
  authorImage: StaticImageData;
  name: string;
  designation: string;
  subject: string;
  phone: string;
}

const teachers: Teacher[] = [
  {
    id: 1,
    authorImage: author,
    name: "MD. Hsgus Gazi",
    designation: "Principal",
    subject: "accounting",
    phone: "+88 00000000000",
  },
  {
    id: 2,
    authorImage: author,
    name: "MD. Hsgus Gazi",
    designation: "Principal",
    subject: "bangla",
    phone: "+88 00000000000",
  },
  {
    id: 3,
    authorImage: author,
    name: "MD. Hsgus Gazi",
    designation: "Principal",
    subject: "biology",
    phone: "+88 00000000000",
  },
  {
    id: 4,
    authorImage: author,
    name: "MD. Hsgus Gazi",
    designation: "Principal",
    subject: "chemistry",
    phone: "+88 00000000000",
  },
  {
    id: 5,
    authorImage: author,
    name: "MD. Hsgus Gazi",
    designation: "Principal",
    subject: "english",
    phone: "+88 00000000000",
  },
  {
    id: 6,
    authorImage: author,
    name: "MD. Hsgus Gazi",
    designation: "Principal",
    subject: "english",
    phone: "+88 00000000000",
  },
];

export default function Page() {
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };

  const filteredTeachers = selectedSubject
    ? teachers.filter((teacher) => teacher.subject === selectedSubject)
    : teachers;

  return (
    <>
      <Breadcrumbs pageTitle="শিক্ষকমন্ডলী" />

      <div className="pt-10">
        <div className="container mx-auto px-4">
          <label htmlFor="category" className="block mb-2 text-base font-medium">
            Search by Subject Teacher&apos;s
          </label>
          <select
            name="department"
            id="category"
            className="py-2 px-3 text-base w-full border border-gray-300 rounded-md"
            value={selectedSubject}
            onChange={handleChange}
          >
            {subjectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-pcolor/5 shadow-md rounded-2xl py-6 px-4 text-center hover:shadow-lg transition"
              >
                <Image
                  src={teacher.authorImage}
                  alt={teacher.name}
                  className="h-36 w-36 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-tcolor mb-1">{teacher.name}</h3>
                <h4 className="text-lg font-semibold">{teacher.designation}</h4>
                <h5 className="text-base font-medium mb-2 capitalize">{teacher.subject}</h5>
                <span className="flex items-center justify-center gap-x-2 text-lg mb-2">
                  <FaPhoneAlt className="text-greencolor" /> {teacher.phone}
                </span>
                <Link
                  href={`/teachers/${teacher.id}`}
                  className="inline-flex px-6 py-2 rounded-lg bg-pcolor text-white text-base font-medium text-center justify-center items-center gap-x-2 transition-all hover:bg-greencolor"
                >
                  View Details <FaArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
