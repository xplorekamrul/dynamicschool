"use client";

import type { ConfigFormValues } from "@/lib/institute/config-schema";
import { useMemo, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { previewFromStoredPath, uploadToInstituteFolder } from "./image-upload";

export function useImageField(
  form: UseFormReturn<ConfigFormValues>,
  field: "logo" | "favicon"
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [failed, setFailed] = useState(false);

  const value = form.watch(field) || "";
  const hasVal = !!value;
  const preview = useMemo(() => previewFromStoredPath(value), [value]);

  const clear = () => {
    form.setValue(field, "", { shouldDirty: true, shouldValidate: true });
    setFailed(false);
  };

  const click = () => inputRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const instituteId = form.getValues("instituteId");
    if (!instituteId) {
      throw new Error("Institute ID is required before uploading.");
    }

    try {
      setUploading(true);
      setFailed(false);

      const storedPath = await uploadToInstituteFolder({ field, file, instituteId });

      form.setValue(field, storedPath, { shouldDirty: true, shouldValidate: true });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return {
    inputRef,
    uploading,
    failed,
    setFailed,
    value,
    hasVal,
    preview,
    clear,
    click,
    onFileChange,
  };
}
