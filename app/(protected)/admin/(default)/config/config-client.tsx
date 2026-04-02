"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { previewFromStoredPath } from "@/lib/institute/image-upload";
import { Edit, ExternalLink } from "lucide-react";
import { useState } from "react";
import ConfigEditForm from "./config-edit-form";

/* ---------------- Types ---------------- */
type ConfigData = {
   id: string;
   mobileNumber: string | null;
   email: string | null;
   address: string | null;
   logo: string | null;
   favicon: string | null;
   facebook: string | null;
   twitter: string | null;
   instagram: string | null;
   linkedin: string | null;
   youtube: string | null;
   established: number | null;
   eiin: string | null;
   mpo: string | null;
   mapSrc: string | null;
   mapAddress: string | null;
};

type ConfigPageClientProps = {
   initialConfig: ConfigData | null;
   instituteId: string;
};

/* ---------------- Fix Normalization ---------------- */
function normalizeConfig(config: ConfigData | null): ConfigData | null {
   if (!config) return null;
   return {
      ...config,
      logo: config.logo || null,
      favicon: config.favicon || null,
   };
}

/* ---------------- Component ---------------- */
export default function ConfigPageClient({
   initialConfig,
   instituteId,
}: ConfigPageClientProps) {
   const [isEditMode, setIsEditMode] = useState(false);
   const [config, setConfig] = useState<ConfigData | null>(
      normalizeConfig(initialConfig) // FIXED HERE
   );

   const handleSave = (updatedConfig: ConfigData) => {
      setConfig(normalizeConfig(updatedConfig)); // FIXED HERE
      setIsEditMode(false);
   };

   if (!config) {
      return (
         <Card>
            <CardContent className="py-12">
               <div className="text-center space-y-4">
                  <p className="text-muted-foreground">No configuration found</p>
                  <Button onClick={() => setIsEditMode(true)}>
                     <Edit className="h-4 w-4 mr-2" />
                     Create Configuration
                  </Button>
               </div>
            </CardContent>
         </Card>
      );
   }

   return (
      <div className="space-y-6">
         <div className="flex justify-end">
            {!isEditMode && (
               <Button onClick={() => setIsEditMode(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
               </Button>
            )}
         </div>

         {isEditMode ? (
            <ConfigEditForm
               config={config}
               instituteId={instituteId}
               onSave={handleSave}
               onCancel={() => setIsEditMode(false)}
            />
         ) : (
            <ConfigViewMode config={config} />
         )}
      </div>
   );
}

/* ---------------- View Mode Component ---------------- */
function ConfigViewMode({ config }: { config: ConfigData }) {
   const InfoRow = ({
      label,
      value,
      isLink,
   }: {
      label: string;
      value: string | number | null;
      isLink?: boolean;
   }) => (
      <div className="flex py-2 border-b last:border-b-0">
         <div className="w-40 text-sm font-medium text-muted-foreground">{label}</div>
         <div className="flex-1 text-sm">
            {isLink && value ? (
               <a
                  href={value as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
               >
                  {value}
                  <ExternalLink className="h-3 w-3" />
               </a>
            ) : (
               value || "—"
            )}
         </div>
      </div>
   );

   return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* LEFT SIDE */}
         <div className="lg:col-span-2">
            <Card>
               <CardContent className="pt-4 pb-4 space-y-4">
                  <div>
                     <h3 className="text-base font-semibold mb-3">Contact Information</h3>
                     <InfoRow label="Mobile Number" value={config.mobileNumber} />
                     <InfoRow label="Email" value={config.email} />
                     <InfoRow label="Address" value={config.address} />
                  </div>

                  <div>
                     <h3 className="text-base font-semibold mb-3">Social Media</h3>
                     <InfoRow label="Facebook" value={config.facebook} isLink />
                     <InfoRow label="Twitter" value={config.twitter} isLink />
                     <InfoRow label="Instagram" value={config.instagram} isLink />
                     <InfoRow label="LinkedIn" value={config.linkedin} isLink />
                     <InfoRow label="YouTube" value={config.youtube} isLink />
                  </div>

                  <div>
                     <h3 className="text-base font-semibold mb-3">Institute Details</h3>
                     <InfoRow label="Established" value={config.established} />
                     <InfoRow label="EIIN" value={config.eiin} />
                     <InfoRow label="MPO" value={config.mpo} />
                  </div>

                  <div>
                     <h3 className="text-base font-semibold mb-3">Map Information</h3>
                     <InfoRow label="Map Address" value={config.mapAddress} />
                  </div>

                  {config.mapSrc && (
                     <div>
                        <h3 className="text-base font-semibold mb-3">Map Embed</h3>
                        <div className="w-full h-96 rounded-lg overflow-hidden border">
                           <iframe
                              src={config.mapSrc}
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                           />
                        </div>
                     </div>
                  )}
               </CardContent>
            </Card>
         </div>

         {/* RIGHT SIDE IMAGES */}
         <div className="space-y-4">
            {/* LOGO */}
            <Card>
               <CardContent className="pt-4 pb-4">
                  <h3 className="text-base font-semibold mb-3">Logo</h3>
                  {config.logo ? (
                     <div className="flex justify-center">
                        <div className="w-40 h-40 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img
                              src={previewFromStoredPath(config.logo)}
                              alt="Institute Logo"
                              className="max-w-full max-h-full object-contain p-2"
                           />
                        </div>
                     </div>
                  ) : (
                     <div className="text-center text-muted-foreground text-sm">No logo uploaded</div>
                  )}
               </CardContent>
            </Card>

            {/* FAVICON */}
            <Card>
               <CardContent className="pt-4 pb-4">
                  <h3 className="text-base font-semibold mb-3">Favicon</h3>
                  {config.favicon ? (
                     <div className="flex justify-center">
                        <div className="w-40 h-40 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img
                              src={previewFromStoredPath(config.favicon)}
                              alt="Institute Favicon"
                              className="max-w-full max-h-full object-contain p-2"
                           />
                        </div>
                     </div>
                  ) : (
                     <div className="text-center text-muted-foreground text-sm">
                        No favicon uploaded
                     </div>
                  )}
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
