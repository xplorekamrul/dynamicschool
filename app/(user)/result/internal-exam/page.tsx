import Upcomming from "@/components/upcomming";
import { Suspense } from "react";

function UpcommingFallback() {
  return <div className="h-96 bg-gray-100" />;
}

export default function page() {
  return (
    <Suspense fallback={<UpcommingFallback />}>
      <Upcomming />
    </Suspense>
  );
}