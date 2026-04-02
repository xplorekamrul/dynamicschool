"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { savePages } from "@/actions/Institute/save-pages";
import { navItems, type NavItem as DataNavItem } from "@/data/pages";

type PageItem = {
  title: string;
  slug: string;
  contentType: "single" | "dynamic";
  parentSlug?: string;
};

const schema = z.object({
  instituteId: z.string().min(1),
  pages: z.array(z.string()).optional(),
});

type Values = z.infer<typeof schema>;

type NavItem = {
  name: string;
  href: string;
  ContentType?: "single" | "dynamic";
  submenu?: NavItem[];
};

type FieldController = {
  value?: string[];
  onChange: (val: string[]) => void;
};

export default function InstitutePagesForm({
  mode = "create",
  instituteId,
  defaultSelected = [],
  onSaved,
}: {
  mode?: "create" | "edit";
  instituteId: string;
  defaultSelected?: string[];
  onSaved: (selected: string[]) => void;
}) {
  const initialSelected = useMemo(() => defaultSelected, [defaultSelected]);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { instituteId, pages: initialSelected },
  });

  useEffect(() => {
    form.reset({ instituteId, pages: initialSelected });
  }, [form, instituteId, initialSelected]);

  const toggleItem = (
    href: string,
    submenu: NavItem[] | undefined,
    checked: boolean,
    field: FieldController
  ) => {
    const current = new Set(field.value || []);
    if (checked) {
      current.add(href);
      submenu?.forEach((c) => current.add(c.href));
    } else {
      current.delete(href);
      submenu?.forEach((c) => current.delete(c.href));
    }
    field.onChange([...current]);
  };

  const isParentChecked = (item: NavItem, selected: string[]) => {
    if (!item.submenu) return selected.includes(item.href);
    const childSelected = item.submenu.some((c) => selected.includes(c.href));
    return selected.includes(item.href) || childSelected;
  };

  const renderNavItems = (items: NavItem[], field: FieldController, depth = 0) =>
    items.map((item) => {
      const selected = field.value || [];
      const checked = isParentChecked(item, selected);
      return (
        <div key={item.href} className="space-y-2" style={{ marginLeft: depth * 16 }}>
          <FormItem className="flex flex-row items-start space-x-3 space-y-3">
            <FormControl>
              <Checkbox
                checked={checked}
                onCheckedChange={(c) => toggleItem(item.href, item.submenu, Boolean(c), field)}
              />
            </FormControl>
            <FormLabel className="cursor-pointer font-normal">{item.name}</FormLabel>
          </FormItem>
          {item.submenu && (
            <div className="ml-6">{renderNavItems(item.submenu, field, depth + 1)}</div>
          )}
        </div>
      );
    });

  const { execute, status } = useAction(savePages, {
    onSuccess: (res) => {
      toast.success(mode === "edit" ? "Pages updated" : res.data.message);
      const selected = form.getValues("pages") ?? [];
      onSaved(selected);
    },
    onError: (err) => {
      const ve = err?.error?.validationErrors as
        | { instituteId?: { _errors?: string[] }; pages?: { _errors?: string[] } }
        | undefined;

      const firstVE =
        ve?.instituteId?._errors?.[0] ?? ve?.pages?._errors?.[0];

      if (firstVE) toast.error(firstVE);
      else toast.error(err?.error?.serverError ?? "Failed to save pages");
    },
  });

  const saving = status === "executing";

  const flatten = (items: DataNavItem[], parentSlug?: string): Array<DataNavItem & { parentSlug?: string }> =>
    items.flatMap((it) => [
      { ...it, parentSlug },
      ...(it.submenu ? flatten(it.submenu, it.href) : [])
    ]);

  const onSubmit = (values: Values) => {
    const selected = new Set(values.pages ?? []);
    const all = flatten(navItems);

    const list: PageItem[] = all
      .filter((it) => selected.has(it.href))
      .map((it) => ({
        title: it.name,
        slug: it.href,
        contentType: it.ContentType,
        parentSlug: it.parentSlug,
      }));

    execute({ instituteId, pages: list });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 rounded-lg border p-6">
        <input type="hidden" {...form.register("instituteId")} value={instituteId} />

        <FormField
          control={form.control}
          name="pages"
          render={({ field }) => (
            <div className="space-y-3">
              {renderNavItems(navItems as unknown as NavItem[], field)}
              <p className="text-xs text-muted-foreground">Selected: {(field.value ?? []).length}</p>
            </div>
          )}
        />

        <div className="pt-2">
          <Button type="submit" className="h-11" disabled={saving}>
            {saving ? "Saving..." : mode === "edit" ? "Save" : "Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
}