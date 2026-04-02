"use client";

import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeroSectionForm } from "./hero-section-form";

interface HeroSectionContentProps {
   heroSection: {
      id: bigint;
      title: string;
      description: string | null;
      buttonUrl: string | null;
      buttonName: string | null;
      images: any;
      createdAt: Date;
      updatedAt: Date;
   } | null;
}

export function HeroSectionContent({ heroSection }: HeroSectionContentProps) {
   const router = useRouter();
   const [isEditing, setIsEditing] = useState(false);

   const handleSuccess = () => {
      setIsEditing(false);
      router.refresh();
   };

   if (isEditing || !heroSection) {
      return (
         <div>
            <div className="mb-6">
               <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
               >
                  ← Back
               </Button>
            </div>
            <HeroSectionForm
               heroSection={heroSection}
               onSuccess={handleSuccess}
            />
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Header with Edit Button */}
         <div className="flex justify-end">
            <Button
               onClick={() => setIsEditing(true)}
               className="gap-2"
            >
               <Edit className="h-4 w-4" />
               Edit Hero Section
            </Button>
         </div>

         {/* Hero Section Preview */}
         <div className="bg-white rounded-lg border p-6 space-y-4">
            <div>
               <h2 className="text-sm font-semibold text-gray-600 mb-2">Title</h2>
               <p className="text-2xl font-bold text-gray-900">{heroSection.title}</p>
            </div>

            {heroSection.description && (
               <div>
                  <h2 className="text-sm font-semibold text-gray-600 mb-2">Description</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{heroSection.description}</p>
               </div>
            )}

            {heroSection.buttonUrl && (
               <div>
                  <h2 className="text-sm font-semibold text-gray-600 mb-2">Button</h2>
                  <div className="flex items-center gap-4">
                     <a href={heroSection.buttonUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                        {heroSection.buttonUrl}
                     </a>
                     {heroSection.buttonName && (
                        <span className="text-sm text-gray-600">Label: <strong>{heroSection.buttonName}</strong></span>
                     )}
                  </div>
               </div>
            )}

            <div>
               <h2 className="text-sm font-semibold text-gray-600 mb-4">Carousel Images</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.isArray(heroSection.images) && heroSection.images.map((image: any, index: number) => (
                     <div key={index} className="space-y-2">
                        <div className="relative w-full bg-gray-200 rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img
                              src={image.src.startsWith('http') ? image.src : `/images${image.src}`}
                              alt={image.alt}
                              className="absolute inset-0 w-full h-full object-cover"
                           />
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">{image.alt}</p>
                     </div>
                  ))}
               </div>
            </div>

            <div className="pt-4 border-t text-xs text-gray-500">
               <p>Created: {new Date(heroSection.createdAt).toLocaleString()}</p>
               <p>Updated: {new Date(heroSection.updatedAt).toLocaleString()}</p>
            </div>
         </div>
      </div>
   );
}
