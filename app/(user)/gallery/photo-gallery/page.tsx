import { getInstituteId } from "@/lib/shared/get-institute-id";
import { getImageUrl } from "@/lib/shared/image-utils";
import Image from "next/image";
import { connection } from "next/server";
import { Suspense } from "react";
import { getGalleryImages } from "@/actions/admin/gallery/UserGallery/get-gallery-images";
import { getInstituteName } from "@/actions/admin/gallery/get-institute-name";

async function PhotoGalleryContent() {
  // Explicitly defer to request time - must be first
  await connection();

  // Get institute ID from domain
  const instituteId = await getInstituteId();

  if (!instituteId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Gallery not available</p>
      </div>
    );
  }

  const [institute, images] = await Promise.all([
    getInstituteName(instituteId),
    getGalleryImages(instituteId),
  ]);

  if (!institute) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Gallery not available</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No photos available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Photo Gallery</h1>
          <p className="text-muted-foreground">
            Explore our collection of photos from {institute.name}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => {
            const imageUrl = getImageUrl(image.ImgSrc) || image.ImgSrc;
            return (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg bg-muted aspect-video cursor-pointer"
              >
                <Image
                  src={imageUrl}
                  alt={image.ImgAlt || image.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                  <div className="w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white font-medium text-sm">{image.title}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PhotoGalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PhotoGalleryContent />
    </Suspense>
  );
}
