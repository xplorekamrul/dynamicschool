"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { saveAdmin } from "@/actions/Institute/save-admin";
import { Loader2 } from "lucide-react";

const schema = z.object({
  instituteId: z.string().min(1),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
});
type Values = z.infer<typeof schema>;

export default function AdminCreationForm({
  mode = "create",
  instituteId,
  defaultEmail = "",
  defaultName = "",
  userId,
  onSaved,
}: {
  mode?: "create" | "edit";
  instituteId: string;
  defaultEmail?: string;
  defaultName?: string;
  userId?: string;
  onSaved: () => void;
}) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      instituteId,
      name: defaultName,
      email: defaultEmail,
      password: "",
    },
  });

  const { execute, status } = useAction(saveAdmin, {
    onSuccess: (res) => {
      const data = res?.data;
      if (!data) return;
      if (data.success) {
        toast.success(mode === "edit" ? "Admin updated" : "Admin saved");
        onSaved?.();
        form.reset({
          instituteId,
          name: form.getValues("name"),
          email: form.getValues("email"),
          password: "",
        });
      } else {
        toast.error(data.message || "Failed to save admin");
      }
    },
    onError: (err) => {
      const ve = err?.error?.validationErrors as
        | {
            instituteId?: { _errors?: string[] };
            name?: { _errors?: string[] };
            email?: { _errors?: string[] };
            password?: { _errors?: string[] };
          }
        | undefined;

      let shown = false;
      if (ve) {
        (["instituteId", "name", "email", "password"] as const).forEach((k) => {
          const msg = ve[k]?._errors?.[0];
          if (msg) {
            form.setError(k, { type: "manual", message: msg });
            if (!shown) {
              toast.error(msg);
              shown = true;
            }
          }
        });
      }
      if (!shown) {
        toast.error(err?.error?.serverError ?? "Failed to save admin");
      }
    },
  });

  const saving = status === "executing";

  const onSubmit = (values: Values) => {
    execute({
      instituteId,
      userId,
      name: values.name,
      email: values.email,
      password: values.password,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="
          grid gap-3 items-end
          md:grid-cols-[1fr_1fr_1fr_auto]
          grid-cols-1
        "
      >
        <div>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Admin name"
                    {...field}
                    value={field.value ?? ""}
                    disabled={saving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="admin@institute.edu"
                    {...field}
                    value={field.value ?? ""}
                    disabled={saving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    value={field.value ?? ""}
                    disabled={saving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="md:self-end">
          <Button type="submit" disabled={saving} className="h-11 w-full md:w-auto">
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : mode === "edit" ? (
              "Save"
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
