import Breadcrumbs from '@/components/Breadcrumbs'
import Image from 'next/image'
import pdf from '@/public/pdf.png'
export default function page() {
  return (
    <>
      <Breadcrumbs pageTitle="২০২5 সালের এইচএসসি পরীক্ষার সময়সূচি ।" />
      <div className="py-10">
        <div className="container mx-auto px-4">
          <a href="#" target='blank' className='text-center inline-block'>
            <Image className='max-w-24 mx-auto' src={pdf} alt='pdf' />
            <span className='mt-2 inline-flex px-6 py-2 rounded-lg bg-pcolor text-white text-base font-medium text-center justify-center items-center gap-x-2 transition-all hover:bg-greencolor'>View attach file</span>
          </a>
        </div>
      </div>
    </>
  )
}
