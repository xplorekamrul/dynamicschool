import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaAtlas, FaBook, FaBookOpen, FaEye, FaFacebookF, FaHandPointRight, FaImages, FaLinkedin, FaPlayCircle, FaUniversity, FaUser } from 'react-icons/fa'
import { FaArrowRightLong, FaPhotoFilm, FaSquareTwitter, FaSquareYoutube } from 'react-icons/fa6'
import Image1 from '@/public/icon-1.png';
import Image2 from '@/public/icon-2.png';
import Image3 from '@/public/icon-3.png';
import Image4 from '@/public/icon-4.png';
import Image5 from '@/public/icon-5.png';
import Image6 from '@/public/icon-6.png';
import Image7 from '@/public/icon-7.png';
import Image8 from '@/public/icon-8.png';
import blogImage1 from '@/public/hero-slider-1.jpg';
import userImage1 from '@/public/user-image-1.png';
import userImage2 from '@/public/user-image-2.png';
import hotline from '@/public/hotline.jpg'
import school from '@/config/school'
export default function HomeContentWraper() {
  return (
    <div className='py-8 lg:py-12'>
      <div className="container mx-auto px-4">
        <div className='mb-5 lg:mb-8'>
          <h1 className='text-3xl md:text-4xl lg:text-5xl text-center font-semibold text-green-500'>{school.name} আমার অহংকার</h1>
        </div>
        <div className="flex gap-6 flex-wrap lg:flex-nowrap">
          <div className='w-full lg:w-9/12'>
            <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
              <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                <h3 className='text-base sm:text-lg font-semibold text-white'>প্রতিষ্ঠানের ইতিহাস</h3>
              </div>
              <div className='p-4 lg:p-5 text-sm lg:text-base'>
                <p><b>বাংলা একাডেমি হল </b>বাংলাদেশের ভাষানিয়ন্ত্রক সংস্থা। এটি ১৯৫৫ সালের ৩রা ডিসেম্বর (১৭ই অগ্রহায়ণ, ১৩৬২ বঙ্গাব্দ) প্রতিষ্ঠিত হয়। বাংলা ভাষা ও সাহিত্যের চর্চা, গবেষণা ও প্রচারের লক্ষ্যে তৎকালীন পূর্ব পাকিস্তানে (বর্তমান বাংলাদেশে) এই একাডেমিটি প্রতিষ্ঠা করা হয়। রাষ্ট্রভাষা আন্দোলন-পরবর্তী প্রেক্ষাপটে বাংলা একাডেমি প্রতিষ্ঠার দাবি ওঠে। তৎকালীন পূর্ব পাকিস্তানের প্রধানমন্ত্রীর সরকারি বাসভবন বর্ধমান হাউজে এই একাডেমির সদর দপ্তর স্থাপিত হয়। একাডেমির বর্ধমান হাউজে একটি “ভাষা আন্দোলন জাদুঘর” আছে।</p>
              </div>
            </div>
            <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
              <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                <h3 className='text-base sm:text-lg font-semibold text-white'>নোটিশ বোর্ড</h3>
                <Link className='inline-flex items-center gap-x-2 text-sm lg:text-base font-medium text-white transition-all hover:text-scolor' href="/">সকল নোটিশ দেখুন <FaArrowRightLong /></Link>
              </div>
              <div className='p-4 lg:p-5 text-sm lg:text-base'>
                <div className='bg-light rounded-lg overflow-hidden relative overflow-x-auto shadow-sm'>
                  <table className='w-full text-sm sm:text-base'>
                    <tbody>
                      <tr className='odd:bg-white even:bg-light text-tcolor'>
                        <td className='px-1 sm:px-4 py-2 sm:py-3'>
                          <div className='flex items-center gap-x-2'>
                            <div className='w-8 sm:w-10 rounded-sm overflow-hidden shadow-sm'>
                              <span className='block py-0 px-1 text-white text-xs sm:text-sm bg-red-500 text-center capitalize'>May</span>
                              <span className='block py-2 sm:py-3 px-1 text-green-950 text-sm sm:text-lg font-medium bg-white text-center capitalize leading-1'>28</span>
                            </div>
                            <div className='rotate-[270deg] -ml-3'>
                              <span className='text-sm sm:text-lg text-tcolor font-medium'>2025</span>
                            </div>
                          </div>
                        </td>
                        <td className='px-1 sm:px-4 py-2 sm:py-3'>
                          <Link href="/" className='inline-block transition-all hover:text-scolor'>বার্ষিক অভিভাবক সম্মেলন প্রসঙ্গে</Link>
                        </td>
                        <td className='px-1 sm:px-4 py-2 sm:py-3'><div className='flex justify-end items-center gap-x-2'><Link className='transition-all hover:text-greencolor' href="/"><FaEye className='text-xl' /></Link></div></td>
                      </tr>
                      <tr className='odd:bg-white even:bg-light text-tcolor'>
                        <td className='px-1 sm:px-4 py-2 sm:py-3'>
                          <div className='flex items-center gap-x-2'>
                            <div className='w-8 sm:w-10 rounded-sm overflow-hidden shadow-sm'>
                              <span className='block py-0 px-1 text-white text-xs sm:text-sm bg-red-500 text-center capitalize'>May</span>
                              <span className='block py-2 sm:py-3 px-1 text-green-950 text-sm sm:text-lg font-medium bg-white text-center capitalize leading-1'>18</span>
                            </div>
                            <div className='rotate-[270deg] -ml-3'>
                              <span className='text-sm sm:text-lg text-tcolor font-medium'>2025</span>
                            </div>
                          </div>
                        </td>
                        <td className='px-1 sm:px-4 py-2 sm:py-3'>
                          <Link href="/" className='inline-block transition-all hover:text-scolor'>নতুন শিক্ষাবর্ষে ভর্তি কার্যক্রম শুরু</Link>
                        </td>
                        <td className='px-1 sm:px-4 py-2 sm:py-3'><div className='flex justify-end items-center gap-x-2'><Link className='transition-all hover:text-greencolor' href="/"><FaEye className='text-xl' /></Link></div></td>
                      </tr>
                      <tr className='odd:bg-white even:bg-light text-tcolor'>
                        <td className='px-1 sm:px-4 py-2 sm:py-3'>
                          <div className='flex items-center gap-x-2'>
                            <div className='w-8 sm:w-10 rounded-sm overflow-hidden shadow-sm'>
                              <span className='block py-0 px-1 text-white text-xs sm:text-sm bg-red-500 text-center capitalize'>May</span>
                              <span className='block py-2 sm:py-3 px-1 text-green-950 text-sm sm:text-lg font-medium bg-white text-center capitalize leading-1'>13</span>
                            </div>
                            <div className='rotate-[270deg] -ml-3'>
                              <span className='text-sm sm:text-lg text-tcolor font-medium'>2025</span>
                            </div>
                          </div>
                        </td>
                        <td className='px-1 sm:px-4 py-2 sm:py-3'>
                          <Link href="/" className='inline-block transition-all hover:text-scolor'>নতুন বছরের ছুটির তালিকা</Link>
                        </td>
                        <td className='px-1 sm:px-4 py-2 sm:py-3'><div className='flex justify-end items-center gap-x-2'><Link className='transition-all hover:text-greencolor' href="/"><FaEye className='text-xl' /></Link></div></td>
                      </tr>
                      <tr className='odd:bg-white even:bg-light text-tcolor'>
                        <td className='px-1 sm:px-4 py-2 sm:py-3'>
                          <div className='flex items-center gap-x-2'>
                            <div className='w-8 sm:w-10 rounded-sm overflow-hidden shadow-sm'>
                              <span className='block py-0 px-1 text-white text-xs sm:text-sm bg-red-500 text-center capitalize'>May</span>
                              <span className='block py-2 sm:py-3 px-1 text-green-950 text-sm sm:text-lg font-medium bg-white text-center capitalize leading-1'>08</span>
                            </div>
                            <div className='rotate-[270deg] -ml-3'>
                              <span className='text-sm sm:text-lg text-tcolor font-medium'>2025</span>
                            </div>
                          </div>
                        </td>
                        <td className='px-1 sm:px-4 py-2 sm:py-3'>
                          <Link href="/" className='inline-block transition-all hover:text-scolor'>ম্যানেজিং কমিটি নির্বাচনের তারিক ঘোষণা</Link>
                        </td>
                        <td className='px-1 sm:px-4 py-2 sm:py-3'><div className='flex justify-end items-center gap-x-2'><Link className='transition-all hover:text-greencolor' href="/"><FaEye className='text-xl' /></Link></div></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden'>
                <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                  <h3 className='text-base sm:text-lg font-semibold text-white'>প্রতিষ্ঠান সম্পর্কে</h3>
                </div>
                <div className='p-4 lg:p-5 text-sm lg:text-base'>
                  <div className='flex gap-4'>
                    <div className='w-24'>
                      <Image className='w-full object-cover' src={Image1} alt='প্রতিষ্ঠান সম্পর্কে' />
                    </div>
                    <div className='flex-1'>
                      <ul className='text-sm lg:text-base space-y-1'>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> প্রতিষ্ঠানের ইতিহাস</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> লক্ষ্য ও উদ্দেশ্য</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> প্রতিষ্ঠানের অবকাঠামো</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> আমাদের অর্জন</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden'>
                <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                  <h3 className='text-base sm:text-lg font-semibold text-white'>এডমিনিস্ট্রেশন</h3>
                </div>
                <div className='p-4 lg:p-5 text-sm lg:text-base'>
                  <div className='flex gap-4'>
                    <div className='w-24'>
                      <Image className='w-full object-cover' src={Image2} alt='এডমিনিস্ট্রেশন' />
                    </div>
                    <div className='flex-1'>
                      <ul className='text-sm lg:text-base space-y-1'>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> আমাদের শিক্ষকমন্ডলী</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> অবসরপ্রাপ্ত শিক্ষকমন্ডলী</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> আমাদের কর্মীরা</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> শূণ্যপদের তালিকা</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden'>
                <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                  <h3 className='text-base sm:text-lg font-semibold text-white'>ভর্তি সম্পর্কিত</h3>
                </div>
                <div className='p-4 lg:p-5 text-sm lg:text-base'>
                  <div className='flex gap-4'>
                    <div className='w-24'>
                      <Image className='w-full object-cover' src={Image3} alt='ভর্তি সম্পর্কিত' />
                    </div>
                    <div className='flex-1'>
                      <ul className='text-sm lg:text-base space-y-1'>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> ভর্তির আবেদন</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> ছাত্রছাত্রীর আসন সংখ্যা</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> শিক্ষার্থীর ড্রেস</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> কৃতি শিক্ষার্থী</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden'>
                <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                  <h3 className='text-base sm:text-lg font-semibold text-white'>কোর্সসমূহ</h3>
                </div>
                <div className='p-4 lg:p-5 text-sm lg:text-base'>
                  <div className='flex gap-4'>
                    <div className='w-24'>
                      <Image className='w-full object-cover' src={Image4} alt='কোর্সসমূহ' />
                    </div>
                    <div className='flex-1'>
                      <ul className='text-sm lg:text-base space-y-1'>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> উচ্চ মাধ্যমিক</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> উচ্চ মাধ্যমিক (বি.এম)</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> ডিগ্রি (পাস)</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden'>
                <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                  <h3 className='text-base sm:text-lg font-semibold text-white'>একাডেমিক পেপার</h3>
                </div>
                <div className='p-4 lg:p-5 text-sm lg:text-base'>
                  <div className='flex gap-4'>
                    <div className='w-24'>
                      <Image className='w-full object-cover' src={Image5} alt='একাডেমিক পেপার' />
                    </div>
                    <div className='flex-1'>
                      <ul className='text-sm lg:text-base space-y-1'>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> সিলেবাস</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> ক্লাশ রুটিন</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> পাঠ পরিকল্পনা</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> একাডেমিক ক্যালেন্ডার</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden'>
                <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                  <h3 className='text-base sm:text-lg font-semibold text-white'>পরীক্ষার সময়সূচি ও ফলাফল</h3>
                </div>
                <div className='p-4 lg:p-5 text-sm lg:text-base'>
                  <div className='flex gap-4'>
                    <div className='w-24'>
                      <Image className='w-full object-cover' src={Image6} alt='পরীক্ষার সময়সূচি ও ফলাফল' />
                    </div>
                    <div className='flex-1'>
                      <ul className='text-sm lg:text-base space-y-1'>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> পরীক্ষার সময়সূচি</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> মাধ্যমিক ও উচ্চ মাধ্যমিক রেজাল্ট</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> জাতীয় বিশ্ববিদ্যালয় রেজাল্ট</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> অভ্যন্তরীণ পরীক্ষার রেজাল্ট</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden'>
                <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                  <h3 className='text-base sm:text-lg font-semibold text-white'>সহশিক্ষা কার্যক্রম</h3>
                </div>
                <div className='p-4 lg:p-5 text-sm lg:text-base'>
                  <div className='flex gap-4'>
                    <div className='w-24'>
                      <Image className='w-full object-cover' src={Image7} alt='সহশিক্ষা কার্যক্রম' />
                    </div>
                    <div className='flex-1'>
                      <ul className='text-sm lg:text-base space-y-1'>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> রোভার স্কাউটস</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> রেড ক্রিসেন্ট</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> ক্লাব</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> বিএনসিসি</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden'>
                <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                  <h3 className='text-base sm:text-lg font-semibold text-white'>ব্লগ ও গ্যালারী</h3>
                </div>
                <div className='p-4 lg:p-5 text-sm lg:text-base'>
                  <div className='flex gap-4'>
                    <div className='w-24'>
                      <Image className='w-full object-cover' src={Image8} alt='ব্লগ ও গ্যালারী' />
                    </div>
                    <div className='flex-1'>
                      <ul className='text-sm lg:text-base space-y-1'>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> সংবাদ ও ইভেন্ট</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> ফটো গ্যালারী</Link></li>
                        <li><Link href="/" className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'><FaHandPointRight className='text-greencolor' /> ভিডিও গ্যালারী</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
              <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                <h3 className='text-base sm:text-lg font-semibold text-white'>সংবাদ এবং ইভেন্ট</h3>
                <Link className='inline-flex items-center gap-x-2 text-sm lg:text-base font-medium text-white transition-all hover:text-scolor' href="/">আরো দেখুন <FaArrowRightLong /></Link>
              </div>
              <div className='p-4 lg:p-5 text-sm lg:text-base'>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  <div className='rounded-lg shadow-2xl overflow-hidden bg-light group'>
                    <div className='relative overflow-hidden rounded-lg '>
                      <Link href="/">
                        <Image className='w-full h-40 object-cover transition-all group-hover:scale-105' src={blogImage1} alt='blog image' />
                      </Link>
                      <div className='flex items-center gap-x-2 absolute right-2 top-2 -me-3'>
                        <div className='w-8 sm:w-10 rounded-sm overflow-hidden shadow-sm'>
                          <span className='block py-0 px-1 text-white text-xs sm:text-sm bg-red-500 text-center capitalize'>May</span>
                          <span className='block py-2 sm:py-3 px-1 text-green-950 text-sm sm:text-lg font-medium bg-white text-center capitalize leading-1'>28</span>
                        </div>
                        <div className='rotate-[270deg] -ml-3.5'>
                          <span className='text-sm sm:text-lg text-white font-medium'>2025</span>
                        </div>
                      </div>
                    </div>
                    <div className='p-4'>
                      <h3 className='text-base xl:text-xl'><Link className='text-tcolor transition-all hover:text-scolor' href="/">বাংলাদেশ সরকারি কলেজের প্রতিষ্ঠাতাও সাবেক এমপিএ মৃত্যুতে শোক র‍্যালি ও দোয়া অনুষ্ঠান।</Link></h3>
                    </div>
                  </div>
                  <div className='rounded-lg shadow-2xl overflow-hidden bg-light group'>
                    <div className='relative overflow-hidden rounded-lg '>
                      <Link href="/">
                        <Image className='w-full h-40 object-cover transition-all group-hover:scale-105' src={blogImage1} alt='blog image' />
                      </Link>
                      <div className='flex items-center gap-x-2 absolute right-2 top-2 -me-3'>
                        <div className='w-8 sm:w-10 rounded-sm overflow-hidden shadow-sm'>
                          <span className='block py-0 px-1 text-white text-xs sm:text-sm bg-red-500 text-center capitalize'>May</span>
                          <span className='block py-2 sm:py-3 px-1 text-green-950 text-sm sm:text-lg font-medium bg-white text-center capitalize leading-1'>28</span>
                        </div>
                        <div className='rotate-[270deg] -ml-3.5'>
                          <span className='text-sm sm:text-lg text-white font-medium'>2025</span>
                        </div>
                      </div>
                    </div>
                    <div className='p-4'>
                      <h3 className='text-base xl:text-xl'><Link className='text-tcolor transition-all hover:text-scolor' href="/">বাংলাদেশ সরকারি কলেজের প্রতিষ্ঠাতাও সাবেক এমপিএ মৃত্যুতে শোক র‍্যালি ও দোয়া অনুষ্ঠান।</Link></h3>
                    </div>
                  </div>
                  <div className='rounded-lg shadow-2xl overflow-hidden bg-light group'>
                    <div className='relative overflow-hidden rounded-lg '>
                      <Link href="/">
                        <Image className='w-full h-40 object-cover transition-all group-hover:scale-105' src={blogImage1} alt='blog image' />
                      </Link>
                      <div className='flex items-center gap-x-2 absolute right-2 top-2 -me-3'>
                        <div className='w-8 sm:w-10 rounded-sm overflow-hidden shadow-sm'>
                          <span className='block py-0 px-1 text-white text-xs sm:text-sm bg-red-500 text-center capitalize'>May</span>
                          <span className='block py-2 sm:py-3 px-1 text-green-950 text-sm sm:text-lg font-medium bg-white text-center capitalize leading-1'>28</span>
                        </div>
                        <div className='rotate-[270deg] -ml-3.5'>
                          <span className='text-sm sm:text-lg text-white font-medium'>2025</span>
                        </div>
                      </div>
                    </div>
                    <div className='p-4'>
                      <h3 className='text-base xl:text-xl'><Link className='text-tcolor transition-all hover:text-scolor' href="/">বাংলাদেশ সরকারি কলেজের প্রতিষ্ঠাতাও সাবেক এমপিএ মৃত্যুতে শোক র‍্যালি ও দোয়া অনুষ্ঠান।</Link></h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
              <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                <h3 className='text-base sm:text-lg font-semibold text-white'>ফটো গ্যালারী</h3>
                <Link className='inline-flex items-center gap-x-2 text-sm lg:text-base font-medium text-white transition-all hover:text-scolor' href="/">আরো দেখুন <FaArrowRightLong /></Link>
              </div>
              <div className='p-4 lg:p-5 text-sm lg:text-base'>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  <div className='rounded-lg shadow-2xl overflow-hidden bg-light group'>
                    <div className='relative overflow-hidden rounded-lg '>
                      <Link href="/">
                        <Image className='w-full h-40 object-cover transition-all group-hover:scale-105' src={blogImage1} alt='blog image' />
                      </Link>
                      <div className='inline-flex px-2 py-1 rounded-lg bg-pcolor items-center gap-x-2 text-sm absolute right-1 top-1 text-white font-semibold'>
                        <FaPhotoFilm className='text-xl' /> 2 Photos
                      </div>
                    </div>
                    <div className='p-4'>
                      <h3 className='text-base xl:text-xl'><Link className='text-tcolor transition-all hover:text-scolor' href="/">বাংলাদেশ সরকারি কলেজের প্রতিষ্ঠাতাও সাবেক এমপিএ মৃত্যুতে শোক র‍্যালি ও দোয়া অনুষ্ঠান।</Link></h3>
                    </div>
                  </div>
                  <div className='rounded-lg shadow-2xl overflow-hidden bg-light group'>
                    <div className='relative overflow-hidden rounded-lg '>
                      <Link href="/">
                        <Image className='w-full h-40 object-cover transition-all group-hover:scale-105' src={blogImage1} alt='blog image' />
                      </Link>
                      <div className='inline-flex px-2 py-1 rounded-lg bg-pcolor items-center gap-x-2 text-sm absolute right-1 top-1 text-white font-semibold'>
                        <FaPhotoFilm className='text-xl' /> 2 Photos
                      </div>
                    </div>
                    <div className='p-4'>
                      <h3 className='text-base xl:text-xl'><Link className='text-tcolor transition-all hover:text-scolor' href="/">বাংলাদেশ সরকারি কলেজের প্রতিষ্ঠাতাও সাবেক এমপিএ মৃত্যুতে শোক র‍্যালি ও দোয়া অনুষ্ঠান।</Link></h3>
                    </div>
                  </div>
                  <div className='rounded-lg shadow-2xl overflow-hidden bg-light group'>
                    <div className='relative overflow-hidden rounded-lg '>
                      <Link href="/">
                        <Image className='w-full h-40 object-cover transition-all group-hover:scale-105' src={blogImage1} alt='blog image' />
                      </Link>
                      <div className='inline-flex px-2 py-1 rounded-lg bg-pcolor items-center gap-x-2 text-sm absolute right-1 top-1 text-white font-semibold'>
                        <FaPhotoFilm className='text-xl' /> 2 Photos
                      </div>
                    </div>
                    <div className='p-4'>
                      <h3 className='text-base xl:text-xl'><Link className='text-tcolor transition-all hover:text-scolor' href="/">বাংলাদেশ সরকারি কলেজের প্রতিষ্ঠাতাও সাবেক এমপিএ মৃত্যুতে শোক র‍্যালি ও দোয়া অনুষ্ঠান।</Link></h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
              <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                <h3 className='text-base sm:text-lg font-semibold text-white'>আমাদের অবস্থান</h3>
              </div>
              <div className='p-4 lg:p-5 text-sm lg:text-base'>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.2622311681803!2d89.5218563!3d22.873973600000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ff9a45f2d3c451%3A0x61a143e99538ee33!2sDaulatpur%20Muhasin%20Secondary%20Girl&#39;s%20School!5e1!3m2!1sen!2sbd!4v1756961351373!5m2!1sen!2sbd"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
          <div className='w-full lg:w-3/12'>
            <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
              <div className='flex justify-center text-center items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                <h3 className='text-base sm:text-lg font-semibold text-white'>প্রতিষ্ঠাতা</h3>
              </div>
              <div className='p-4 lg:p-5 text-sm lg:text-base'>
                <div className='text-center'>
                  <Image className='mx-auto mb-2 w-full max-w-[250px]' src={userImage1} alt='প্রতিষ্ঠাতা' />
                  <h4 className='text-lg font-medium mb-0'>আলহাজ্ব জয়নাল আবেদিন</h4>
                  <Link className='text-sm transition-all hover:text-scolor' href="/">বিস্তারিত পড়ুন ...</Link>
                </div>
              </div>
            </div>
            <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
              <div className='flex justify-center text-center items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                <h3 className='text-base sm:text-lg font-semibold text-white'>অধ্যক্ষের বানী</h3>
              </div>
              <div className='p-4 lg:p-5 text-sm lg:text-base'>
                <div className='text-center'>
                  <Image className='mx-auto mb-2 w-full max-w-[250px]' src={userImage2} alt='অধ্যক্ষের বানী' />
                  <h4 className='text-lg font-medium mb-0'>আলহাজ্ব জয়নাল আবেদিন</h4>
                  <Link className='text-sm transition-all hover:text-scolor' href="/">বিস্তারিত পড়ুন ...</Link>
                </div>
              </div>
            </div>
            <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
              <div className='flex justify-center text-center items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                <h3 className='text-base sm:text-lg font-semibold text-white'>একাডেমিক লিংক</h3>
              </div>
              <div className='p-4 lg:p-5 text-sm lg:text-base'>
                <ul className='text-sm lg:text-base space-y-2'>
                  <li><Link href="/" className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaUniversity />একাডেমিক লিংক</Link>
                  </li>
                  <li><Link href="/founder" className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaUser /> প্রতিষ্ঠাতা</Link>
                  </li>
                  <li><Link href="/our-achievements" className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaBookOpen /> আমাদের অর্জন</Link>
                  </li>
                  <li><Link href="/library" className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaBook /> লাইব্রেরি</Link>
                  </li>
                  <li><Link href="/photo-gallery" className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaImages /> ফটো গ্যালারী</Link>
                  </li>
                  <li><Link href="/video-gallery" className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaPlayCircle /> ভিডিও গ্যালারী</Link>
                  </li>
                  <li><Link href="/contact" className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaAtlas /> যোগাযোগ</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
              <div className='flex justify-center text-center items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                <h3 className='text-base sm:text-lg font-semibold text-white'>গুরুত্বপূর্ণ লিংক</h3>
              </div>
              <div className='p-4 lg:p-5 text-sm lg:text-base'>
                <ul className='text-sm lg:text-base space-y-2'>
                  <li><Link href="https://bangladesh.gov.bd" target='_blank' className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaHandPointRight />বাংলাদেশ পোর্টাল</Link>
                  </li>
                  <li><Link href="https://banbeis.gov.bd" target='_blank' className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaHandPointRight /> ব্যানবেইস</Link>
                  </li>
                  <li><Link href="https://www.teachers.gov.bd" target='_blank' className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaHandPointRight /> শিক্ষক বাতায়ন</Link>
                  </li>
                  <li><Link href="http://www.moedu.gov.bd" target='_blank' className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaHandPointRight /> শিক্ষা মন্ত্রণালয়</Link>
                  </li>
                  <li><Link href="https://pmeat.gov.bd" target='_blank' className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaHandPointRight /> প্রধানমন্ত্রীর শিক্ষা সহায়তা ট্রাস্ট</Link>
                  </li>
                  <li><Link href="https://dshe.gov.bd" target='_blank' className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaHandPointRight /> মাধ্যমিক ও উচ্চ শিক্ষা অধিদপ্তর</Link>
                  </li>
                  <li><Link href="https://www.nu.ac.bd" target='_blank' className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaHandPointRight />  জাতীয় বিশ্ববিদ্যালয়</Link>
                  </li>
                  <li><Link href="https://www.barisalboard.gov.bd" target='_blank' className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaHandPointRight /> উচ্চ মাধ্যমিক শিক্ষা বোর্ড, বরিশাল</Link>
                  </li>
                  <li><Link href="https://bmeb.gov.bd" target='_blank' className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaHandPointRight /> মাদ্রাসা শিক্ষা বোর্ড</Link>
                  </li>
                  <li><Link href="https://techedu.gov.bd" target='_blank' className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaHandPointRight /> কারিগরি শিক্ষা অধিদপ্তর</Link>
                  </li>
                  <li><Link href="https://bteb.gov.bd" target='_blank' className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaHandPointRight /> বাংলাদেশ কারিগরি শিক্ষা বোর্ড</Link>
                  </li>
                  <li><Link href="https://bou.ac.bd" target='_blank' className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'>
                    <FaHandPointRight />  বাংলাদেশ উন্মুক্ত বিশ্ববিদ্যালয়</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
              <div className='flex justify-center text-center items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                <h3 className='text-base sm:text-lg font-semibold text-white'>জাতীয় সংগীত</h3>
              </div>
              <div className='p-4 lg:p-5 text-sm lg:text-base'>
                <audio className="w-full" controls>
                  <source src="/audio/song.mp3" type="audio/mp3" />
                </audio>
              </div>
            </div>
            <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
              <div className='flex justify-center text-center items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                <h3 className='text-base sm:text-lg font-semibold text-white'>জরুরী হটলাইন</h3>
              </div>
              <div className='p-4 lg:p-5 text-sm lg:text-base'>
                <Image src={hotline} alt='hotine' />
              </div>
            </div>
            <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
              <div className='flex justify-center text-center items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                <h3 className='text-base sm:text-lg font-semibold text-white'>সামাজিক যোগাযোগ</h3>
              </div>
              <div className='p-4 lg:p-5 text-sm lg:text-base'>
                <ul className="flex gap-x-2 space-y-1 text-xl sm:text-2xl font-semibold capitalize text-bcolor">
                  <li><a href="#" target="_black" className="transition-all hover:text-pcolor"><FaFacebookF /></a></li>
                  <li><a href="#" target="_black" className="transition-all hover:text-pcolor"><FaSquareTwitter /></a></li>
                  <li><a href="#" target="_black" className="transition-all hover:text-pcolor"><FaLinkedin /></a></li>
                  <li><a href="#" target="_black" className="transition-all hover:text-pcolor"><FaSquareYoutube /></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
