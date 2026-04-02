"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateAdminPassword } from "@/actions/Institute/admins/update-admin-password";

const schema = z.object({
  newPassword: z.string().min(8, "At least 8 characters"),
  confirmPassword: z.string().min(8, "At least 8 characters"),
}).refine((v) => v.newPassword === v.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type Values = z.infer<typeof schema>;

export default function EditAdminPasswordDialog({
  open,
  onOpenChange,
  userId,
  adminEmail,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string;
  adminEmail?: string;
  onSaved: () => void;
}) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const { execute, status } = useAction(updateAdminPassword, {
    onSuccess: (res) => {
      if (res?.data?.success) {
        toast.success(res.data.message);
        form.reset({ newPassword: "", confirmPassword: "" });
        onSaved?.();
        onOpenChange(false);
      } else {
        toast.error(res?.data?.message ?? "Failed to update password");
      }
    },
    onError: (err) => {
      toast.error(err?.error?.serverError ?? "Failed to update password");
    },
  });

  const saving = status === "executing";

  const onSubmit = (v: Values) => {
    execute({ userId, newPassword: v.newPassword });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !saving && onOpenChange(v)}>
      <DialogContent className="max-w-md rounded-md">
        <DialogHeader>
          <DialogTitle className="inline-flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            Change Password {adminEmail ? `— ${adminEmail}` : ""}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="New password" disabled={saving} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm password" disabled={saving} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="bg-primary hover:bg-primary/90">
                {saving ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
