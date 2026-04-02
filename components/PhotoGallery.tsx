import Image from "next/image";
import Fancybox from "./ui/Fancybox";

export default function PhotoGallery() {
  return (
    <>
      <Fancybox
        options={{
          Carousel: {
            infinite: false,
          },
        }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          <a className="block" data-fancybox="gallery" href={"/muhsin/gallery-image-1.jpg"}>
            <Image alt="gallary image" width={600} height={600} src={"/muhsin/gallery-image-1.jpg"} className="w-full h-[450px] rounded-xl" />
          </a>
          <a className="block" data-fancybox="gallery" href={"/muhsin/gallery-image-2.jpg"}>
            <Image alt="gallary image" width={600} height={600} src={"/muhsin/gallery-image-2.jpg"} className="w-full h-[450px] rounded-xl" />
          </a>
          <a className="block" data-fancybox="gallery" href={"/muhsin/slider-1.jpg"}>
            <Image alt="gallary image" width={600} height={600} src={"/muhsin/slider-1.jpg"} className="w-full h-[450px] rounded-xl" />
          </a>
          <a className="block" data-fancybox="gallery" href={"/muhsin/slider-3.jpg"}>
            <Image alt="gallary image" width={600} height={600} src={"/muhsin/slider-3.jpg"} className="w-full h-[450px] rounded-xl" />
          </a>
          <a className="block" data-fancybox="gallery" href={"/muhsin/gallery.jpg"}>
            <Image alt="gallary image" width={600} height={600} src={"/muhsin/gallery.jpg"} className="w-full h-[450px] rounded-xl" />
          </a>
          <a className="block" data-fancybox="gallery" href={"/muhsin/gallery-image-3.jpg"}>
            <Image alt="gallary image" width={600} height={600} src={"/muhsin/gallery-image-3.jpg"} className="w-full h-[450px] rounded-xl" />
          </a>
          
        </div>
      </Fancybox>
    </>
  )
}
