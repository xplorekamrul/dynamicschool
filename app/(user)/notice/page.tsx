"use client";

import { getPublicNotices } from "@/actions/get-public-notices";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

type Notice = {
    id: string | bigint;
    slug: string | null;
    title: string;
    category: string;
    createdAt: Date;
};

type Category = {
    name: string;
    count: number;
};

export default function NoticePage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [loading, setLoading] = useState(true);

    const { execute } = useAction(getPublicNotices, {
        onSuccess: (res) => {
            if (res?.data?.success) {
                setNotices(res.data.notices);
                setCategories(res.data.categories);
            }
            setLoading(false);
        },
        onError: () => {
            setLoading(false);
        },
    });

    useEffect(() => {
        execute({
            category: selectedCategory === "ALL" ? undefined : selectedCategory,
        });
    }, [selectedCategory, execute]);

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        return {
            month: months[d.getMonth()],
            day: d.getDate(),
            year: d.getFullYear(),
        };
    };

    return (
        <>
            <Breadcrumbs pageTitle="নোটিশ" />
            <div className="py-10">
                <div className="container mx-auto px-4">
                    <div className="flex gap-6 flex-wrap lg:flex-nowrap">
                        <div className="w-full lg:w-9/12">
                            <div className="shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden">
                                <div className="p-4 lg:p-5 text-sm lg:text-base">
                                    <div className="bg-light rounded-lg overflow-hidden relative overflow-x-auto shadow-sm">
                                        {loading ? (
                                            <div className="flex items-center justify-center h-64">
                                                <div className="text-center">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-greencolor mx-auto mb-4"></div>
                                                    <p className="text-gray-600">Loading notices...</p>
                                                </div>
                                            </div>
                                        ) : notices.length === 0 ? (
                                            <div className="flex items-center justify-center h-64">
                                                <p className="text-gray-600">No notices found</p>
                                            </div>
                                        ) : (
                                            <table className="w-full text-sm sm:text-base">
                                                <tbody>
                                                    {notices.map((notice) => {
                                                        const dateInfo = formatDate(notice.createdAt);
                                                        return (
                                                            <tr
                                                                key={notice.id}
                                                                className="odd:bg-white even:bg-light text-tcolor hover:bg-gray-100 transition-colors"
                                                            >
                                                                <td className="px-1 sm:px-4 py-2 sm:py-3">
                                                                    <div className="flex items-center gap-x-2">
                                                                        <div className="w-8 sm:w-10 rounded-sm overflow-hidden shadow-sm">
                                                                            <span className="block py-0 px-1 text-white text-xs sm:text-sm bg-red-500 text-center capitalize">
                                                                                {dateInfo.month}
                                                                            </span>
                                                                            <span className="block py-2 sm:py-3 px-1 text-green-950 text-sm sm:text-lg font-medium bg-white text-center capitalize leading-1">
                                                                                {dateInfo.day}
                                                                            </span>
                                                                        </div>
                                                                        <div className="rotate-[270deg] -ml-3">
                                                                            <span className="text-sm sm:text-lg text-tcolor font-medium">
                                                                                {dateInfo.year}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-1 sm:px-4 py-2 sm:py-3 text-left">
                                                                    {notice.slug ? (
                                                                        <Link
                                                                            href={`/notice/${notice.slug}`}
                                                                            className="inline-block transition-all hover:text-scolor font-medium "
                                                                        >
                                                                            {notice.title}
                                                                        </Link>
                                                                    ) : (
                                                                        <span className="inline-block font-medium text-gray-400">
                                                                            {notice.title}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-1 sm:px-4 py-2 sm:py-3">
                                                                    <div className="flex justify-end items-center gap-x-2">
                                                                        {notice.slug ? (
                                                                            <Link
                                                                                className="transition-all hover:text-greencolor"
                                                                                href={`/notice/${notice.slug}`}
                                                                            >
                                                                                <FaEye className="text-xl" />
                                                                            </Link>
                                                                        ) : (
                                                                            <span className="text-gray-300">
                                                                                <FaEye className="text-xl" />
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-3/12">
                            <div className="shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden">
                                <div className="flex justify-center text-center items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor">
                                    <h3 className="text-base sm:text-lg font-semibold text-white">
                                        নোটিশ বিভাগ
                                    </h3>
                                </div>
                                <div className="p-4 lg:p-5 text-sm lg:text-base">
                                    <ul className="space-y-2">
                                        <li>
                                            <button
                                                onClick={() => setSelectedCategory("ALL")}
                                                className={`block w-full text-left font-medium text-base transition-all ${selectedCategory === "ALL"
                                                    ? "text-greencolor"
                                                    : "text-tcolor hover:text-greencolor"
                                                    }`}
                                            >
                                                All ({notices.length})
                                            </button>
                                        </li>
                                        {categories.map((cat) => (
                                            <li key={cat.name}>
                                                <button
                                                    onClick={() => setSelectedCategory(cat.name)}
                                                    className={`block w-full text-left font-medium text-base transition-all ${selectedCategory === cat.name
                                                        ? "text-greencolor"
                                                        : "text-tcolor hover:text-greencolor"
                                                        }`}
                                                >
                                                    {cat.name} ({cat.count})
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
