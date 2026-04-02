"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Loader2, Pencil } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateAdminProfile } from "@/actions/Institute/admins/update-admin-profile";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
});

type Values = z.infer<typeof schema>;

export default function EditAdminProfileDialog({
  open,
  onOpenChange,
  userId,
  defaultName,
  defaultEmail,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string;
  defaultName?: string | null;
  defaultEmail?: string;
  onSaved: () => void;
}) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultName ?? "",
      email: defaultEmail ?? "",
    },
    values: {
      name: defaultName ?? "",
      email: defaultEmail ?? "",
    },
  });

  const { execute, status } = useAction(updateAdminProfile, {
    onSuccess: (res) => {
      if (res?.data?.success) {
        toast.success(res.data.message);
        onSaved?.();
        onOpenChange(false);
      } else {
        toast.error(res?.data?.message ?? "Failed to update profile");
      }
    },
    onError: (err) => {
      toast.error(err?.error?.serverError ?? "Failed to update profile");
    },
  });

  const saving = status === "executing";

  const onSubmit = (v: Values) => {
    execute({ userId, name: v.name, email: v.email });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !saving && onOpenChange(v)}>
      <DialogContent className="max-w-md rounded-md">
        <DialogHeader>
          <DialogTitle className="inline-flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Edit Name & Email
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Admin name" disabled={saving} {...field} value={field.value ?? ""} />
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
                    <Input type="email" placeholder="admin@institute.edu" disabled={saving} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/80">
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
