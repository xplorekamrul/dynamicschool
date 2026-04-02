import Footer from '@/components/footer/Footer';
import Header from "@/components/header/Header";
import Image from 'next/image';


export default function NotFound() {
    return (
        <>
            <Header />
            <div className="bg-green-600 text-white py-20 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    {/* Icon Circle */}
                    <div className="inline-flex items-center justify-center w-[200px] h-[200px] bg-white/10 rounded-full mb-6">
                        <Image
                            src={'/404-error.png'}
                            alt=""
                            width={400}
                            height={400}
                        />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                        404 - Page Not Found
                    </h1>

                </div>
            </div>
            <Footer />
        </>
    )
}
