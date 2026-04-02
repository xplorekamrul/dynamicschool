"use client";

import { updateConfig } from "@/actions/admin/update-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { configSchema, type ConfigFormValues } from "@/lib/institute/config-schema";
import { useImageField } from "@/lib/institute/useImageField";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Image as ImageIcon, Save, Upload, X } from "lucide-react";
import { useAction } from "next-safe-action/hooks";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

// Helper to extract src from iframe tag
const extractIframeSrc = (v: string) => {
   if (!v) return v;
   const srcMatch = v.match(/src=["']([^"']+)["']/);
   return srcMatch ? srcMatch[1] : v;
};

export default function ConfigEditForm({
   config,
   instituteId,
   onSave,
   onCancel,
}: {
   config: ConfigData | null;
   instituteId: string;
   onSave: (config: ConfigData) => void;
   onCancel: () => void;
}) {
   const form = useForm<ConfigFormValues>({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolver: zodResolver(configSchema) as any,
      defaultValues: {
         instituteId,
         mobileNumber: config?.mobileNumber || "",
         email: config?.email || "",
         address: config?.address || "",
         facebook: config?.facebook || "",
         twitter: config?.twitter || "",
         instagram: config?.instagram || "",
         linkedin: config?.linkedin || "",
         youtube: config?.youtube || "",
         established: config?.established || undefined,
         eiin: config?.eiin || "",
         mpo: config?.mpo || "",
         mapSrc: config?.mapSrc || "",
         mapAddress: config?.mapAddress || "",
         logo: config?.logo || "",
         favicon: config?.favicon || "",
      },
   });

   const logo = useImageField(form, "logo");
   const favicon = useImageField(form, "favicon");

   // Update mapSrc field when mapSrc field changes on blur
   const handleMapSrcBlur = () => {
      const mapSrcValue = form.getValues("mapSrc");
      if (mapSrcValue) {
         const extracted = extractIframeSrc(mapSrcValue);
         // Update the form field with the extracted value
         form.setValue("mapSrc", extracted);
      }
   };

   const { execute, status } = useAction(updateConfig, {
      onSuccess: (res) => {
         if (res?.data?.success) {
            toast.success("Configuration updated successfully");
            const values = form.getValues();
            onSave({
               id: config?.id || "",
               ...values,
            } as ConfigData);
         }
      },
      onError: (err) => {
         toast.error(err?.error?.serverError || "Failed to update configuration");
      },
   });

   const saving = status === "executing";

   const onSubmit = (values: ConfigFormValues) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { instituteId: _, ...updateData } = values;
      execute(updateData);
   };

   return (
      <>
         <input
            ref={logo.inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={logo.onFileChange}
         />
         <input
            ref={favicon.inputRef}
            type="file"
            accept="image/*,.ico"
            className="hidden"
            onChange={favicon.onFileChange}
         />

         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="pb-20">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Main Info */}
                  <div className="lg:col-span-2">
                     <Card>
                        <CardContent className="pt-4 pb-4 space-y-4">
                           {/* Contact Information */}
                           <div>
                              <h3 className="text-sm font-semibold mb-3">Contact Information</h3>
                              <div className="space-y-3">
                                 <div className="grid grid-cols-2 gap-3">
                                    <FormField
                                       name="mobileNumber"
                                       control={form.control}
                                       render={({ field }) => (
                                          <FormItem>
                                             <FormLabel className="text-xs">Mobile Number</FormLabel>
                                             <FormControl>
                                                <Input
                                                   placeholder="+8801XXXXXXXXX"
                                                   {...field}
                                                   className="h-9 text-sm"
                                                />
                                             </FormControl>
                                             <FormMessage className="text-xs" />
                                          </FormItem>
                                       )}
                                    />
                                    <FormField
                                       name="email"
                                       control={form.control}
                                       render={({ field }) => (
                                          <FormItem>
                                             <FormLabel className="text-xs">Email</FormLabel>
                                             <FormControl>
                                                <Input
                                                   type="email"
                                                   placeholder="example@email.com"
                                                   {...field}
                                                   className="h-9 text-sm"
                                                />
                                             </FormControl>
                                             <FormMessage className="text-xs" />
                                          </FormItem>
                                       )}
                                    />
                                 </div>
                                 <FormField
                                    name="address"
                                    control={form.control}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel className="text-xs">Address</FormLabel>
                                          <FormControl>
                                             <Textarea
                                                placeholder="Enter institute address"
                                                {...field}
                                                className="text-sm resize-none"
                                                rows={2}
                                             />
                                          </FormControl>
                                          <FormMessage className="text-xs" />
                                       </FormItem>
                                    )}
                                 />
                              </div>
                           </div>

                           {/* Map Information */}
                           <div>
                              <h3 className="text-sm font-semibold mb-3 pt-2">Map Information</h3>
                              <div className="space-y-3">
                                 <FormField
                                    name="mapSrc"
                                    control={form.control}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel className="text-xs">
                                             Map Embed <span className="text-red-500">*</span>
                                          </FormLabel>
                                          <FormControl>
                                             <Textarea
                                                placeholder="Paste full iframe tag or just the src URL"
                                                {...field}
                                                value={field.value ?? ""}
                                                className="text-sm resize-none font-mono text-xs"
                                                rows={2}
                                                onBlur={() => {
                                                   field.onBlur();
                                                   handleMapSrcBlur();
                                                }}
                                             />
                                          </FormControl>
                                          <p className="text-xs text-muted-foreground mt-1">
                                             Paste the complete iframe tag or just the src URL. We'll extract the URL automatically.
                                          </p>
                                          <FormMessage className="text-xs" />
                                       </FormItem>
                                    )}
                                 />
                                 <FormField
                                    name="mapAddress"
                                    control={form.control}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel className="text-xs">Map Address</FormLabel>
                                          <FormControl>
                                             <Input
                                                placeholder="Enter map address or location name"
                                                {...field}
                                                className="h-9 text-sm"
                                             />
                                          </FormControl>
                                          <FormMessage className="text-xs" />
                                       </FormItem>
                                    )}
                                 />
                              </div>
                           </div>

                           {/* Social Media */}
                           <div>
                              <h3 className="text-sm font-semibold mb-3 pt-2">Social Media</h3>
                              <div className="grid grid-cols-2 gap-3">
                                 {(["facebook", "twitter", "instagram", "linkedin", "youtube"] as const).map(
                                    (platform) => (
                                       <FormField
                                          key={platform}
                                          name={platform}
                                          control={form.control}
                                          render={({ field }) => (
                                             <FormItem>
                                                <FormLabel className="text-xs capitalize">
                                                   {platform}
                                                </FormLabel>
                                                <FormControl>
                                                   <Input
                                                      placeholder={`https://${platform}.com/...`}
                                                      {...field}
                                                      className="h-9 text-sm"
                                                   />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                             </FormItem>
                                          )}
                                       />
                                    )
                                 )}
                              </div>
                           </div>

                           {/* Institute Details */}
                           <div>
                              <h3 className="text-sm font-semibold mb-3 pt-2">Institute Details</h3>
                              <div className="grid grid-cols-3 gap-3">
                                 <FormField
                                    name="established"
                                    control={form.control}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel className="text-xs">Established</FormLabel>
                                          <FormControl>
                                             <Input
                                                type="number"
                                                inputMode="numeric"
                                                placeholder="e.g. 1995"
                                                value={field.value === undefined ? "" : String(field.value)}
                                                onChange={(e) =>
                                                   field.onChange(e.target.value === "" ? "" : e.target.value)
                                                }
                                                className="h-9 text-sm"
                                             />
                                          </FormControl>
                                          <FormMessage className="text-xs" />
                                       </FormItem>
                                    )}
                                 />
                                 <FormField
                                    name="eiin"
                                    control={form.control}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel className="text-xs">EIIN</FormLabel>
                                          <FormControl>
                                             <Input
                                                placeholder="Enter EIIN"
                                                {...field}
                                                className="h-9 text-sm"
                                             />
                                          </FormControl>
                                          <FormMessage className="text-xs" />
                                       </FormItem>
                                    )}
                                 />
                                 <FormField
                                    name="mpo"
                                    control={form.control}
                                    render={({ field }) => (
                                       <FormItem>
                                          <FormLabel className="text-xs">MPO</FormLabel>
                                          <FormControl>
                                             <Input
                                                placeholder="Enter MPO"
                                                {...field}
                                                className="h-9 text-sm"
                                             />
                                          </FormControl>
                                          <FormMessage className="text-xs" />
                                       </FormItem>
                                    )}
                                 />
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </div>

                  {/* Right Column - Images */}
                  <div className="space-y-4">
                     {[
                        { key: "logo" as const, ctrl: logo, label: "Logo" },
                        { key: "favicon" as const, ctrl: favicon, label: "Favicon" },
                     ].map(({ key, ctrl, label }) => (
                        <Card key={key}>
                           <CardContent className="pt-4 pb-4">
                              <FormField
                                 name={key}
                                 control={form.control}
                                 render={() => (
                                    <FormItem>
                                       <FormLabel className="text-sm font-semibold">{label}</FormLabel>
                                       <div className="space-y-3">
                                          <Button
                                             type="button"
                                             onClick={ctrl.click}
                                             className={`w-full h-9 text-xs ${ctrl.hasVal && !ctrl.uploading
                                                ? "bg-green-600 text-white hover:bg-green-700"
                                                : ""
                                                }`}
                                             variant={ctrl.hasVal ? "default" : "secondary"}
                                             disabled={ctrl.uploading || saving}
                                             size="sm"
                                          >
                                             {ctrl.hasVal && !ctrl.uploading ? (
                                                <Check className="h-3 w-3 mr-1" />
                                             ) : (
                                                <Upload className="h-3 w-3 mr-1" />
                                             )}
                                             {ctrl.uploading ? "Uploading..." : `Upload ${label}`}
                                          </Button>

                                          {ctrl.hasVal ? (
                                             <div className="flex justify-center">
                                                <div className="relative w-40 h-40 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                                                   {!ctrl.failed ? (
                                                      // eslint-disable-next-line @next/next/no-img-element
                                                      <img
                                                         src={ctrl.preview}
                                                         alt={label}
                                                         className="max-w-full max-h-full object-contain p-2"
                                                         onError={() => ctrl.setFailed(true)}
                                                      />
                                                   ) : (
                                                      <div className="flex items-center justify-center h-full">
                                                         <ImageIcon className="h-8 w-8 opacity-50" />
                                                      </div>
                                                   )}
                                                   <Button
                                                      type="button"
                                                      size="icon"
                                                      variant="destructive"
                                                      onClick={ctrl.clear}
                                                      className="absolute top-2 right-2 h-7 w-7"
                                                      disabled={saving}
                                                   >
                                                      <X className="h-4 w-4" />
                                                   </Button>
                                                </div>
                                             </div>
                                          ) : (
                                             <div className="flex justify-center">
                                                <div className="w-40 h-40 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-xs">
                                                   No {label.toLowerCase()} uploaded
                                                </div>
                                             </div>
                                          )}
                                       </div>
                                       <FormControl>
                                          <input type="hidden" {...form.register(key)} />
                                       </FormControl>
                                       <FormMessage className="text-xs" />
                                    </FormItem>
                                 )}
                              />
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               </div>

               {/* Sticky Action Buttons at Bottom */}
               <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50 p-4">
                  <div className="max-w-7xl mx-auto flex justify-end gap-2">
                     <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                     </Button>
                     <Button type="submit" disabled={saving}>
                        {saving ? (
                           "Saving..."
                        ) : (
                           <>
                              <Save className="h-4 w-4 mr-2" />
                              Save
                           </>
                        )}
                     </Button>
                  </div>
               </div>
            </form>
         </Form>
      </>
   );
}
