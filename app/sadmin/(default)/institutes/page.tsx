import { InsertInstituteDialog } from "@/components/dialogs/insert-institute-dialog";
import InstituteTable from "@/components/tables/institute-table";
import { Suspense } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Institutes</h1>
        <InsertInstituteDialogWrapper />
      </div>
      <Suspense fallback={<div className="h-96 bg-gray-100 rounded" />}>
        <InstituteTableWrapper searchParams={searchParams} />
      </Suspense>
    </section>
  )
}

function InsertInstituteDialogWrapper() {
  return <InsertInstituteDialog />;
}

async function InstituteTableWrapper({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? "1") || 1;
  const currentPage = page < 1 ? 1 : page;

  return <InstituteTable page={currentPage} />;
}

