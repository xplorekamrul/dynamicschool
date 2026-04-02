"use client";

import * as React from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteInstitute } from "@/actions/Institute/delete-institute";
import { cn } from "@/lib/utils";

const getErrorMessage = (e: unknown) =>
  e instanceof Error ? e.message : "Failed to delete";

type ButtonProps = React.ComponentProps<typeof Button>;

type Props = {
  id: string;
  className?: string;
  icon?: React.ReactNode;
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
} & Omit<ButtonProps, "children" | "onClick" | "variant" | "size">;

export default function DeleteInstituteButton({
  id,
  className,
  icon,
  label = "Delete",
  variant = "destructive",
  size = "sm",
  ...rest
}: Props) {
  const [pending, start] = useTransition();
  const router = useRouter();

  const handleClick = () => {
    const ok = window.confirm(
      "This will permanently delete this institute and ALL related data (users, pages, configs). Are you sure?"
    );
    if (!ok) return;

    start(async () => {
      try {
        await deleteInstitute({ id });
        toast.success("Institute and related data deleted");
        router.refresh();
      } catch (e: unknown) {
        toast.error(getErrorMessage(e));
      }
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={pending}
      onClick={handleClick}
      aria-disabled={pending}
      aria-label={pending ? "Deleting…" : `${label} institute`}
      title={`${label} institute`}
      className={cn("flex items-center space-x-1", className)}
      {...rest}
    >
      {icon ?? <Trash2 size={16} />}
      <span>{pending ? "Deleting..." : label}</span>
    </Button>
  );
}
