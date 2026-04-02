import { getInstitutes } from "@/actions/Institute/queries";
import AutoPaginatedInstituteTable from "./auto-paginated-institute-table";

export default async function InstituteTable({
  page,
  pageSize = 25,
}: {
  page: number;
  pageSize?: number;
}) {
  const data = await getInstitutes({ page, pageSize });

  if (!data?.success) {
    return <div>Failed or unauthorized…</div>;
  }

  return (
    <AutoPaginatedInstituteTable
      institutes={data.institutes}
      maxHeight={520}
      approxRowHeight={64}
    />
  );
}



