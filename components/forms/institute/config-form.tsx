// src/components/forms/ConfigForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useMemo } from "react";
import { useForm, type Resolver, type SubmitHandler } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Image as ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { saveConfig } from "@/actions/Institute/save-config";
import {
  configSchema,
  type ConfigFormValues,
} from "@/lib/institute/config-schema";
import { useImageField } from "@/lib/institute/useImageField";

export type { ConfigFormValues } from "@/lib/institute/config-schema";

const getErrorMessage = (err: unknown) =>
  err instanceof Error ? err.message : "Something went wrong";

// Helper to extract src from iframe tag
const extractIframeSrc = (v: string) => {
  if (!v) return v;
  const srcMatch = v.match(/src=["']([^"']+)["']/);
  return srcMatch ? srcMatch[1] : v;
};

export default function ConfigForm({
  mode = "create",
  defaultValues,
  onSaved,
}: {
  mode?: "create" | "edit";
  defaultValues: Partial<ConfigFormValues> & { instituteId: string };
  onSaved: (saved: ConfigFormValues) => void;
}) {
  const stableDefaults = useMemo<ConfigFormValues>(
    () => ({
      instituteId: defaultValues.instituteId,
      mobileNumber: defaultValues.mobileNumber ?? "",
      email: defaultValues.email ?? "",
      address: defaultValues.address ?? "",
      facebook: defaultValues.facebook ?? "",
      twitter: defaultValues.twitter ?? "",
      instagram: defaultValues.instagram ?? "",
      linkedin: defaultValues.linkedin ?? "",
      youtube: defaultValues.youtube ?? "",
      established: defaultValues.established,
      eiin: defaultValues.eiin ?? "",
      mpo: defaultValues.mpo ?? "",
      // Extract iframe src on initial load
      mapSrc: defaultValues.mapSrc ? extractIframeSrc(defaultValues.mapSrc) : "",
      mapAddress: defaultValues.mapAddress ?? "",
      logo: defaultValues.logo ?? "",
      favicon: defaultValues.favicon ?? "",
    }),
    [defaultValues]
  );

  const resolver = zodResolver(configSchema) as unknown as Resolver<ConfigFormValues>;
  const form = useForm<ConfigFormValues>({
    resolver,
    mode: "onChange",
    defaultValues: stableDefaults,
  });

  // Update mapSrc field when mapSrc field changes on blur
  const handleMapSrcBlur = () => {
    const mapSrcValue = form.getValues("mapSrc");
    if (mapSrcValue) {
      const extracted = extractIframeSrc(mapSrcValue);
      // Only update if the value actually changed
      if (extracted !== mapSrcValue) {
        form.setValue("mapSrc", extracted, { shouldValidate: true });
      }
    }
  };

  useEffect(() => {
    form.reset(stableDefaults);
  }, [stableDefaults, form]);

  // image fields via hook
  const logo = useImageField(form, "logo");
  const favicon = useImageField(form, "favicon");

  // next-safe-action: bind the safe action
  const { execute, status } = useAction(saveConfig, {
    onSuccess: (res) => {
      // res = { data, input }
      if (res?.data?.success) {
        toast.success(mode === "edit" ? "Configuration updated" : "Configuration saved");
        onSaved(form.getValues());
      } else {
        toast.error("Failed to save configuration");
      }
    },
    onError: (err) => {
      const ve = err?.error?.validationErrors as Record<
        string,
        { _errors?: string[] } | undefined
      > | undefined;

      let raised = false;
      if (ve) {
        (Object.keys(ve) as (keyof ConfigFormValues)[]).forEach((key) => {
          const msg = ve[key]?._errors?.[0];
          if (msg) {
            form.setError(key, { type: "manual", message: msg });
            if (!raised) {
              toast.error(msg);
              raised = true;
            }
          }
        });
      }
      if (!raised) {
        toast.error(err?.error?.serverError ?? getErrorMessage(err));
      }
    },
  });

  const saving = status === "executing";

  const onSubmit: SubmitHandler<ConfigFormValues> = (vals) => {
    execute(vals as Parameters<typeof saveConfig>[0]);
  };

  return (
    <>
      {/* hidden file inputs */}
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <input type="hidden" {...form.register("instituteId")} value={stableDefaults.instituteId} />

          {/* Upload row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { key: "logo" as const, ctrl: logo },
              { key: "favicon" as const, ctrl: favicon },
            ].map(({ key, ctrl }) => (
              <FormField
                key={key}
                name={key}
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel className="capitalize">{key}</FormLabel>

                    <div className="flex items-center gap-3">
                      {/* GREEN after successful upload */}
                      <Button
                        type="button"
                        onClick={ctrl.click}
                        className={`flex items-center gap-2 ${ctrl.hasVal && !ctrl.uploading ? "bg-green-600 text-white hover:bg-green-700" : ""
                          }`}
                        variant={ctrl.hasVal ? "default" : "secondary"}
                        disabled={ctrl.uploading || saving}
                      >
                        {ctrl.hasVal && !ctrl.uploading ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        {ctrl.uploading ? "Uploading..." : `Upload ${key}`}
                      </Button>

                      {/* Preview box */}
                      <div className="flex w-full min-h-10 max-w-full items-center gap-2 rounded border p-2 md:w-auto">
                        {ctrl.hasVal ? (
                          !ctrl.failed ? (
                            <div className="relative h-8 w-8">
                              <Image
                                src={ctrl.preview}
                                alt={key}
                                fill
                                sizes="32px"
                                className="rounded object-contain"
                                onError={() => ctrl.setFailed(true)}
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-5 w-5 opacity-70" />
                              <span className="text-xs text-muted-foreground">Preview failed</span>
                            </div>
                          )
                        ) : (
                          <span className="text-sm text-muted-foreground">No {key} selected</span>
                        )}

                        {ctrl.hasVal && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={ctrl.clear}
                            className="ml-auto"
                            disabled={saving}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <FormControl>
                      {/* keeps the stored DB value "/uploads/.../file" or absolute URL */}
                      <input type="hidden" {...form.register(key)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              name="mobileNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+8801XXXXXXXXX" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@email.com" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter institute address" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Map Fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              name="mapSrc"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Map Embed <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste full iframe tag or just the src URL"
                      {...field}
                      value={field.value ?? ""}
                      className="font-mono text-xs"
                      onBlur={() => {
                        field.onBlur();
                        handleMapSrcBlur();
                      }}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground mt-1">
                    Paste the complete iframe tag or just the src URL. We'll extract the URL automatically.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="mapAddress"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter map address or location name" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Socials (optional) */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(["facebook", "twitter", "instagram", "linkedin", "youtube"] as const).map((p) => (
              <FormField
                key={p}
                name={p}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">
                      {p} <span className="text-xs text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={`https://${p}.com/...`} {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              name="established"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Established Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="e.g. 1995"
                      value={field.value === undefined ? "" : String(field.value)}
                      onChange={(e) => field.onChange(e.target.value === "" ? "" : e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="eiin"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>EIIN</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter EIIN" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="mpo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MPO</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter MPO" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={saving} className="h-11">
              {saving ? "Saving..." : mode === "edit" ? "Save" : "Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}