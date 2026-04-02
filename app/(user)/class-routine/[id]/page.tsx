import Breadcrumbs from '@/components/Breadcrumbs'
import Image from 'next/image'
import syllabus from '@/public/class-routine-education.jpg'
export default function page() {
  return (
    <>
      <Breadcrumbs pageTitle="ক্লাস রুটিন" />
      <div className="py-10">
        <div className="container mx-auto px-4">
          <Image className='w-full' src={syllabus} alt='syllabus' />
        </div>
      </div>
    </>
  )
}
