'use client'
import { getSpecialNotice } from "@/actions/home/get-special-notice";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";

export default function NotisArea({ instituteId }: { instituteId: string | null }) {
    const [notice, setNotice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                if (!instituteId) {
                    setLoading(false);
                    return;
                }
                const specialNotice = await getSpecialNotice(instituteId);
                setNotice(specialNotice);
            } catch (error) {
                console.error("Error fetching special notice:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotice();
    }, [instituteId]);

    if (loading || !notice) {
        return null;
    }

    return (
        <>
            <style>{`
                @keyframes scroll-left {
                    0% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
                
                .notice-scroll {
                    animation: scroll-left 30s linear infinite;
                }
                
                .notice-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
            
            <div className='flex items-center bg-light overflow-hidden'>
                <div className='w-5/12 sm:w-3/12 xl:w-2/12 bg-amber-500 px-2 md:px-10 py-3 sm:text-right text-base font-semibold text-white rounded-br-3xl flex items-center justify-end gap-x-2 flex-shrink-0'>
                    <FaBell className="text-lg" />  
                    <span className="hidden sm:inline">⭐</span>
                    <span className="text-sm sm:text-base">বিশেষ ঘোষণা</span>
                </div>
                
                <div className='w-7/12 sm:w-9/12 xl:w-10/12 px-3 py-3 overflow-hidden'>
                    <Link 
                        href={`/notice/${notice.slug}`}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        className="block"
                    >
                        <div 
                            ref={textRef}
                            className="notice-scroll inline-block whitespace-nowrap text-red-500 hover:text-amber-600 transition-colors duration-300 cursor-pointer font-medium text-sm sm:text-base relative pl-5 before:absolute before:content-[''] before:left-0 before:top-2/4 before:-translate-y-2/4 before:w-2.5 before:h-2.5 before:bg-amber-500 before:rounded-full"
                            style={{
                                animationPlayState: isHovering ? 'paused' : 'running'
                            }}
                        >
                            {notice.title}
                        </div>
                    </Link>
                </div>
            </div>
        </>
    )
}
