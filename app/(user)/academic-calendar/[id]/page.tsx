import Breadcrumbs from '@/components/Breadcrumbs';
import pdf from '@/public/pdf.png';
import Image from 'next/image';
import { Suspense } from 'react';

function CalendarFallback() {
  return <div className="h-64 bg-gray-100" />;
}

function CalendarContent() {
  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <a href="#" target='blank' className='text-center inline-block'>
          <Image className='max-w-24 mx-auto' src={pdf} alt='pdf' />
          <span className='mt-2 inline-flex px-6 py-2 rounded-lg bg-pcolor text-white text-base font-medium text-center justify-center items-center gap-x-2 transition-all hover:bg-greencolor'>View attach file</span>
        </a>
      </div>
    </div>
  );
}

function PageContent() {
  return (
    <>
      <Breadcrumbs pageTitle="একাডেমিক ক্যালেন্ডার" />
      <Suspense fallback={<CalendarFallback />}>
        <CalendarContent />
      </Suspense>
    </>
  );
}

export default function page() {
  return (
    <Suspense fallback={<div className="h-96 bg-gray-100" />}>
      <PageContent />
    </Suspense>
  );
}
