import Image from "next/image";

export default function Upcoming() {
  return (
    <div className="bg-green-600 text-white py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Icon Circle */}
        <div className="inline-flex items-center justify-center w-[200px] h-[200px] bg-white/10 rounded-full mb-6">
          <Image
            src={'/under-construction.png'}
            alt=""
            width={400}
            height={400}
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-relaxed">
          ওয়েবসাইটের কনটেন্ট প্রস্তুতির কাজ চলমান। শীঘ্রই আপনাদের জন্য উন্মুক্ত করা হবে।
        </h1>

        {/* Description */}
        {/* <p className="text-lg md:text-xl text-green-50 max-w-2xl mx-auto leading-relaxed">
          We’re preparing this section for you. Please check back later once it’s ready.
        </p> */}
      </div>
    </div>
  );
}
