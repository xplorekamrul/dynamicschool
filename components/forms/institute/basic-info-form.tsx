"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Building2, Globe } from "lucide-react";
import { normalizeDomain, isValidDomain, isValidPath } from "@/lib/normalize-domain";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { saveInstitute } from "@/actions/Institute/save-institute";

const baseSchema = z.object({
  name: z.string().min(2, "Institute name is required"),
  domainRaw: z.string().min(1, "Domain is required"),
});

const schema = baseSchema.superRefine((val, ctx) => {
  const { host, path } = normalizeDomain(val.domainRaw);

  if (!host || !isValidDomain(host)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["domainRaw"],
      message:
        "Enter a valid domain like 'example.com' or 'sub.example.co.uk'. No http/https.",
    });
    return;
  }

  if (!isValidPath(path)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["domainRaw"],
      message:
        "Path may only contain letters, numbers, dots, and hyphens (e.g., example.com/portal-1).",
    });
  }
});

type Values = z.infer<typeof schema>;

export default function BasicInfoForm({
  mode = "create",
  defaultValues,
  onSaved,
}: {
  mode?: "create" | "edit";
  defaultValues?: Partial<Values> & { instituteId?: string; domain?: string };
  onSaved: (payload: { instituteId: string; domain: string }) => void;
}) {
  const initialDomain = useMemo(() => defaultValues?.domain ?? "", [defaultValues?.domain]);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: defaultValues?.name ?? "",
      domainRaw: initialDomain,
    },
  });

  useEffect(() => {
    form.reset({
      name: defaultValues?.name ?? "",
      domainRaw: initialDomain,
    });
  }, [mode, initialDomain, defaultValues?.name, form]);

  // next-safe-action hook
  const { execute, status } = useAction(saveInstitute, {
    onSuccess: (res) => {
      const data = res?.data;
      if (!data) return;

      toast.success(data.message);
      onSaved({ instituteId: data.instituteId, domain: data.domain });
    },
    onError: (err) => {
      const ve = err?.error?.validationErrors as
        | { name?: { _errors?: string[] }; domainRaw?: { _errors?: string[] } }
        | undefined;

      const vMsgs = [
        ...(ve?.name?._errors ?? []),
        ...(ve?.domainRaw?._errors ?? []),
      ].filter(Boolean);

      if (vMsgs.length) {
        if (ve?.name?._errors?.[0]) {
          form.setError("name", { type: "manual", message: ve.name._errors[0] });
        }
        if (ve?.domainRaw?._errors?.[0]) {
          form.setError("domainRaw", { type: "manual", message: ve.domainRaw._errors[0] });
        }
        toast.error(vMsgs[0]);
        return;
      }

      toast.error(err?.error?.serverError ?? "Failed to save institute");
    },
  });

  const saving = status === "executing";
  const isInvalid = !form.formState.isValid || saving;

  const onSubmit = (values: Values) => {
    execute({
      id: defaultValues?.instituteId,
      name: values.name,
      domainRaw: values.domainRaw,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Institute Name
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter institute name" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="domainRaw"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Domain
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="example.com or example.com/portal"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                Use a valid domain (with TLD), no http/https. Optional path allowed (letters, numbers, dots, hyphens).
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <Button type="submit" disabled={isInvalid} className="h-11">
            {saving ? "Saving..." : mode === "edit" ? "Save" : "Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
