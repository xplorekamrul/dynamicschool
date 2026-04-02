'use client';
import school from "@/config/school";
import { getImageUrl } from "@/lib/shared/image-utils";
import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";

interface HeroImage {
    src: string;
    alt: string;
}

interface HeroSliderProps {
    title?: string;
    description?: string;
    buttonUrl?: string;
    buttonName?: string;
    images?: HeroImage[];
}

interface ArrowProps {
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

function SampleNextArrow({ onClick }: ArrowProps) {
    return (
        <div
            onClick={onClick}
            className="absolute right-1 sm:right-5 top-1/2 z-10 -translate-y-1/2 bg-pcolor text-white w-12 h-12 flex items-center justify-center rounded-full cursor-pointer hover:bg-hcolor"
        >
            <FaChevronRight className="w-6 h-6" />
        </div>
    );
}

function SamplePrevArrow({ onClick }: ArrowProps) {
    return (
        <div
            onClick={onClick}
            className="absolute left-1 sm:left-5 top-1/2 z-10 -translate-y-1/2 bg-pcolor text-white w-12 h-12 flex items-center justify-center rounded-full cursor-pointer hover:bg-hcolor"
        >
            <FaChevronLeft className="w-6 h-6" />
        </div>
    );
}

export default function HeroSlider({
    title,
    description,
    buttonUrl,
    buttonName,
    images = [],
}: HeroSliderProps) {
    const settings = {
        // autoplay: true,
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ],
    };

    // Use dynamic images if available, otherwise use fallback
    const displayImages = images && images.length > 0
        ? images
        : [
            { src: "/hero-slider-1.jpg", alt: "slider-1" },
            { src: "/hero-slider-2.jpg", alt: "slider-2" },
            { src: "/hero-slider-1.jpg", alt: "slider-3" },
        ];

    return (
        <div className="overflow-hidden relative">
            {/* Title and Description Section */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                {/* Title */}
                <h3
                    className="bg-[rgba(237,84,7,.5)] text-white text-lg sm:text-2xl lg:text-4xl px-4 sm:px-8 lg:px-10 py-4 sm:py-6 lg:py-10 rounded-2xl lg:rounded-4xl text-center whitespace-nowrap hidden lg:inline-block mb-4"
                >
                    {title || `${school.name} `}
                </h3>

                {/* Description - Only show if available */}
                {description && (
                    <p className="bg-[rgba(0,0,0,.4)] text-white text-sm sm:text-base lg:text-lg px-4 sm:px-8 lg:px-10 py-2 sm:py-3 lg:py-4 rounded-lg lg:rounded-2xl text-center max-w-2xl hidden lg:inline-block mb-4">
                        {description}
                    </p>
                )}

                {/* Button - Only show if URL and Name available */}
                {buttonUrl && buttonName && (
                    <Link
                        href={buttonUrl}
                        className="pointer-events-auto bg-pcolor hover:bg-hcolor text-white font-semibold px-6 sm:px-8 lg:px-10 py-2 sm:py-3 lg:py-4 rounded-lg lg:rounded-2xl transition-colors hidden lg:inline-block"
                    >
                        {buttonName}
                    </Link>
                )}
            </div>

            <Slider {...settings}>
                {displayImages.map((image, index) => (
                    <div key={index} className="relative w-full overflow-hidden h-[380px] sm:h-[450px] lg:h-[600px] px-1">
                        <Image
                            src={getImageUrl(image.src) || image.src}
                            alt={image.alt}
                            fill
                            className="object-cover"
                        />
                    </div>
                ))}
            </Slider>
        </div>
    )
}