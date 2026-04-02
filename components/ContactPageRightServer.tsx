import { getInstituteId } from "@/lib/shared/get-institute-id";
import { Suspense } from "react";
import ContactPageRight from "./ContactPageRight";
import { getFooterData } from "./footer/get-footer-data";

async function ContactPageRightContent() {
   try {
      const instituteId = await getInstituteId();

      if (!instituteId) {
         return <ContactPageRight data={null} />;
      }

      const footerData = await getFooterData(instituteId);

      if (!footerData) {
         return <ContactPageRight data={null} />;
      }

      const contactData = {
         name: footerData.name,
         mobileNumber: footerData.mobileNumber,
         email: footerData.email,
         address: footerData.address,
         eiin: footerData.eiin,
         mpo: footerData.mpo,
         mapSrc: footerData.mapSrc,
         mapAddress: footerData.mapAddress,
      };

      return <ContactPageRight data={contactData} />;
   } catch (error) {
      console.error('Error fetching contact page data:', error);
      return <ContactPageRight data={null} />;
   }
}

export default function ContactPageRightServer() {
   return (
      <Suspense fallback={
         <div>
            <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
               <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                  <h3 className='text-base sm:text-lg font-semibold text-white'>যোগাযোগ</h3>
               </div>
               <div className='p-4 lg:p-5 text-sm lg:text-base'>
                  <div className="space-y-3">
                     <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                     <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                     <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>
               </div>
            </div>
            <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
               <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                  <h3 className='text-base sm:text-lg font-semibold text-white'>আমাদের অবস্থান</h3>
               </div>
               <div className='p-4 lg:p-5 text-sm lg:text-base'>
                  <div className="w-full h-[450px] bg-gray-200 rounded animate-pulse"></div>
               </div>
            </div>
         </div>
      }>
         <ContactPageRightContent />
      </Suspense>
   );
}
