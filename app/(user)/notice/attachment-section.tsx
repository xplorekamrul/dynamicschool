"use client";

import { Download } from "lucide-react";
import Image from "next/image";

export default function AttachmentSection({
   fileUrl,
   fileName,
}: {
   fileUrl: string;
   fileName: string | null;
}) {
   return (
      <div className="flex flex-col items-center gap-3 flex-shrink-0">
         <button
            onClick={() => window.open(fileUrl, "_blank")}
            className="group relative"
            title="View attachment"
         >
            <Image
               src="/pdf.png"
               alt="Attachment"
               width={48}
               height={48}
               className="hover:opacity-80 transition-opacity cursor-pointer rounded-md"
            />
         </button>
         <a
            href={fileUrl}
            download={fileName || "attachment"}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-greencolor hover:text-green-700 transition-colors"
            title="Download attachment"
         >
            <Download className="h-3 w-3" />
            Download
         </a>
      </div>
   );
}
