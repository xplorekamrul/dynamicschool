"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Stepper from "@/components/ui/stepper";

import AdminForm from "@/components/forms/institute/admin-form";
import BasicInfoForm from "@/components/forms/institute/basic-info-form";
import ConfigForm, { type ConfigFormValues } from "@/components/forms/institute/config-form";
import InstitutePagesForm from "@/components/forms/institute/pages-form";

import { getInstituteDetail } from "@/actions/Institute/get-institute-detail";

// ---- Types for the detail fetch (adjust to your actual API) ----
type PageSummary = { slug: string };
type InstituteSummary = { name?: string; domain?: string };
type ConfigSummary = Partial<ConfigFormValues>;
type InstituteDetail = {
  institute?: InstituteSummary | null;
  config?: ConfigSummary | null;
  pages?: PageSummary[] | null;
};

type EditPayload = {
  instituteId: string;
  name: string;
  domainPostfix: string;
  config?: Partial<ConfigFormValues>;
  selectedPages?: string[];
  admin?: { userId: string; email: string; name: string };
};

export function InsertInstituteDialog({
  trigger,
  edit,
}: {
  trigger?: React.ReactNode;
  edit?: EditPayload;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const mode: "create" | "edit" = edit ? "edit" : "create";

  const [instituteId, setInstituteId] = useState<string>(edit?.instituteId ?? "");

  const [basicDefaults, setBasicDefaults] = useState<{ name?: string; domain?: string }>({
    name: edit?.name,
    domain: edit?.domainPostfix ?? "",
  });
  const [configDefaults, setConfigDefaults] = useState<Partial<ConfigFormValues> | null>(
    edit?.config ?? null
  );
  const [pagesDefaults, setPagesDefaults] = useState<string[] | null>(edit?.selectedPages ?? null);

  const totalSteps = 4;
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(Array(totalSteps).fill(false));

  const maxReachableIndex = useMemo(() => {
    if (mode === "edit") return totalSteps - 1;
    const lastCompleted = completedSteps.lastIndexOf(true);
    return Math.max(0, lastCompleted + 1);
  }, [mode, completedSteps]);

  const editDomain = useMemo(() => edit?.domainPostfix ?? "", [edit?.domainPostfix]);

  // Helper: safe error message
  const getErrorMessage = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong");

  // Fetch + hydrate for the currently known instituteId (on open, or when instituteId changes in create mode)
  useEffect(() => {
    let cancelled = false;

    const hydrateById = async (id: string) => {
      try {
        const detail = (await getInstituteDetail({ instituteId: id })) as InstituteDetail;
        if (cancelled) return;

        // Base institute info
        setBasicDefaults({
          name: detail.institute?.name ?? "",
          domain: detail.institute?.domain ?? "",
        });

        // Config
        setConfigDefaults({
          instituteId: id,
          mobileNumber: detail.config?.mobileNumber ?? "",
          email: detail.config?.email ?? "",
          address: detail.config?.address ?? "",
          facebook: detail.config?.facebook ?? "",
          twitter: detail.config?.twitter ?? "",
          instagram: detail.config?.instagram ?? "",
          linkedin: detail.config?.linkedin ?? "",
          youtube: detail.config?.youtube ?? "",
          established: detail.config?.established ?? undefined,
          eiin: detail.config?.eiin ?? "",
          mpo: detail.config?.mpo ?? "",
          mapSrc: detail.config?.mapSrc ?? "",
          mapAddress: detail.config?.mapAddress ?? "",
          logo: detail.config?.logo ?? "",
          favicon: detail.config?.favicon ?? "",
        });

        // Pages
        setPagesDefaults((detail.pages ?? []).map((p) => p.slug));
      } catch (e: unknown) {
        toast.error(getErrorMessage(e) || "Failed to load institute details");
      }
    };

    if (!open) return;

    // Reset stepper state when dialog opens
    setActive(0);
    setCompletedSteps(Array(totalSteps).fill(false));

    if (mode === "edit" && edit?.instituteId) {
      setInstituteId(edit.instituteId);
      void hydrateById(edit.instituteId);
    } else if (mode === "create" && instituteId) {
      // In create mode, we may already have an ID after step 1
      void hydrateById(instituteId);
    } else {
      // pristine create
      setBasicDefaults({ name: edit?.name, domain: editDomain });
      setConfigDefaults(null);
      setPagesDefaults(null);
    }

    return () => {
      cancelled = true;
    };
  }, [open, mode, edit?.instituteId, edit?.name, editDomain, instituteId]);

  // When instituteId is set in create mode (after step 1), re-hydrate without touching basicDefaults
  useEffect(() => {
    let cancelled = false;
    if (!instituteId || mode === "edit") return;

    (async () => {
      try {
        const detail = (await getInstituteDetail({ instituteId })) as InstituteDetail;
        if (cancelled) return;

        setBasicDefaults({
          name: detail.institute?.name ?? "",
          domain: detail.institute?.domain ?? "",
        });

        setConfigDefaults((prev) => ({
          instituteId,
          mobileNumber: prev?.mobileNumber ?? detail.config?.mobileNumber ?? "",
          email: prev?.email ?? detail.config?.email ?? "",
          address: prev?.address ?? detail.config?.address ?? "",
          facebook: prev?.facebook ?? detail.config?.facebook ?? "",
          twitter: prev?.twitter ?? detail.config?.twitter ?? "",
          instagram: prev?.instagram ?? detail.config?.instagram ?? "",
          linkedin: prev?.linkedin ?? detail.config?.linkedin ?? "",
          youtube: prev?.youtube ?? detail.config?.youtube ?? "",
          established: prev?.established ?? detail.config?.established ?? undefined,
          eiin: prev?.eiin ?? detail.config?.eiin ?? "",
          mpo: prev?.mpo ?? detail.config?.mpo ?? "",
          logo: prev?.logo ?? detail.config?.logo ?? "",
          favicon: prev?.favicon ?? detail.config?.favicon ?? "",
        }));

        setPagesDefaults((prev) => prev ?? (detail.pages ?? []).map((p) => p.slug));
      } catch {
        // ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [instituteId, mode]);

  const markCompletedAndNext = (stepIndex: number) => {
    setCompletedSteps((prev) => {
      const next = [...prev];
      next[stepIndex] = true;
      return next;
    });
    setActive((i) => Math.min(i + 1, totalSteps - 1));
  };

  const stepMode = (idx: number): "create" | "edit" => {
    if (mode === "edit") return "edit";
    return completedSteps[idx] ? "edit" : "create";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="flex items-center gap-1.5">
            Create Institute <Plus />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-full sm:h-full flex flex-col">
        <DialogHeader className="!border-b pb-3.5">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{mode === "edit" ? "Edit Institute" : "Create Institute"}</DialogTitle>
              <DialogDescription>Fill each step and continue.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-3.5">
          <Stepper
            steps={[
              {
                id: 1,
                title: "Institute Details",
                description: "Basic info",
                content: (
                  <div className="flex w-full items-center justify-center">
                    <div className="w-full max-w-5xl">
                      <BasicInfoForm
                        key={`basic-${open}-${instituteId || "new"}-${stepMode(0)}`}
                        mode={stepMode(0)}
                        defaultValues={{
                          instituteId,
                          name: basicDefaults.name,
                          domain: basicDefaults.domain,
                        }}
                        onSaved={({ instituteId: id, domain }) => {
                          setInstituteId(id);
                          setBasicDefaults((p) => ({ ...p, domain }));
                          markCompletedAndNext(0);
                          router.refresh();
                        }}
                      />
                    </div>
                  </div>
                ),
              },
              {
                id: 2,
                title: "Configuration",
                description: "Institute configuration",
                content: (
                  <div className="flex w-full items-center justify-center">
                    <div className="w-full max-w-5xl">
                      <ConfigForm
                        key={`config-${open}-${instituteId}-${stepMode(1)}`}
                        mode={stepMode(1)}
                        defaultValues={{
                          instituteId,
                          ...(configDefaults ?? { instituteId }),
                        }}
                        onSaved={(saved) => {
                          setConfigDefaults(saved);
                          markCompletedAndNext(1);
                          router.refresh();
                        }}
                      />
                    </div>
                  </div>
                ),
              },
              {
                id: 3,
                title: "Pages",
                description: "Pages setup",
                content: (
                  <div className="flex w-full items-center justify-center">
                    <div className="w-full max-w-5xl">
                      <InstitutePagesForm
                        key={`pages-${open}-${instituteId}-${(pagesDefaults ?? []).join(",")}-${stepMode(2)}`}
                        mode={stepMode(2)}
                        instituteId={instituteId}
                        defaultSelected={pagesDefaults ?? []}
                        onSaved={(selected) => {
                          setPagesDefaults(selected);
                          markCompletedAndNext(2);
                          router.refresh();
                        }}
                      />
                    </div>
                  </div>
                ),
              },
              {
                id: 4,
                title: "Admin",
                description: "Create institute admin",
                content: (
                  <div className="flex w-full items-center justify-center">
                    <div className="w-full max-w-3xl">
                      <AdminForm
                        key={`admin-${open}-${instituteId}-${stepMode(3)}`}
                        mode={stepMode(3)}
                        instituteId={instituteId}
                        defaultEmail={edit?.admin?.email}
                        defaultName={edit?.admin?.name}
                        userId={edit?.admin?.userId}
                        onSaved={() => {
                          setCompletedSteps((prev) => {
                            const next = [...prev];
                            next[3] = true;
                            return next;
                          });
                          toast.success("All steps saved");
                          setOpen(false);
                          router.refresh();
                        }}
                      />
                    </div>
                  </div>
                ),
              },
            ]}
            activeIndex={active}
            onChange={(index: number) => setActive(index)}
            orientation="vertical"
            className="h-full"
            allowJump={mode === "edit" || typeof maxReachableIndex === "number"}
            maxReachableIndex={mode === "edit" ? undefined : maxReachableIndex}
            navigation={false}
            completed={(idx) => completedSteps[idx]}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
