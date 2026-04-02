'use server';

import { getFeaturedPages } from '@/actions/home/get-featured-pages';
import { getGalleryImages } from '@/actions/home/get-gallery-images';
import { getInstituteConfig } from '@/actions/home/get-institute-config';
import { getLatestBlogPosts } from '@/actions/home/get-latest-blog-posts';
import { getLatestNotices } from '@/actions/home/get-latest-notices';
import { getOrganizationalHistoryContent } from '@/actions/public/get-org-history-contnet';
import { getNavItems } from '@/components/header/get-header-data';
import { prisma } from '@/lib/prisma';
import { getInstituteId } from '@/lib/shared/get-institute-id';
import { getImageUrl } from '@/lib/shared/image-utils';
import { LexicalContent } from '@/lib/shared/lexical-content';
import blogImage1 from '@/public/hero-slider-1.jpg';
import hotline from '@/public/hotline.jpg';
import Image1 from '@/public/icon-1.png';
import Image2 from '@/public/icon-2.png';
import Image3 from '@/public/icon-3.png';
import Image4 from '@/public/icon-4.png';
import Image5 from '@/public/icon-5.png';
import Image6 from '@/public/icon-6.png';
import Image7 from '@/public/icon-7.png';
import Image8 from '@/public/icon-8.png';
import Image from 'next/image';
import Link from 'next/link';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { FaEye, FaFacebookF, FaHandPointRight, FaLinkedin, FaUniversity } from 'react-icons/fa';
import { FaArrowRightLong, FaSquareTwitter, FaSquareYoutube } from 'react-icons/fa6';


async function HistorySection({ instituteId }: { instituteId: string }) {
   const data = await getOrganizationalHistoryContent('org-history', instituteId);

   if (!data || !data.contents || data.contents.length === 0) {
      console.warn('HistorySection - No data found for org-history');
      return null;
   }

   const content = data.contents[0];
   const pageSlug = 'org-history';

   return (
      <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
         <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
            <h3 className='text-base sm:text-lg font-semibold text-white'>প্রতিষ্ঠানের ইতিহাস</h3>
         </div>
         <div className='p-4 lg:p-5 text-sm lg:text-base'>
            <div className='mb-4 text-gray-700'>
               <LexicalContent html={content.bodyHtml} subtitle={content.subtitle} className="max-w-full" />
            </div>
            <Link href={`/${pageSlug}`} className='inline-flex items-center gap-x-2 text-sm lg:text-base font-medium text-greencolor transition-all hover:text-scolor'>
               বিস্তারিত পড়ুন <FaArrowRightLong />
            </Link>
         </div>
      </div>
   );
}

async function NoticeSection({ instituteId }: { instituteId: string }) {
   const notices = await getLatestNotices(instituteId, 5);

   return (
      <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
         <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
            <h3 className='text-base sm:text-lg font-semibold text-white'>নোটিশ বোর্ড</h3>
            <Link className='inline-flex items-center gap-x-2 text-sm lg:text-base font-medium text-white transition-all hover:text-scolor' href="/notice">সকল নোটিশ দেখুন <FaArrowRightLong /></Link>
         </div>
         <div className='p-4 lg:p-5 text-sm lg:text-base'>
            <div className='bg-light rounded-lg overflow-hidden relative overflow-x-auto shadow-sm'>
               <table className='w-full text-sm sm:text-base'>
                  <tbody>
                     {notices.map((notice: any) => {
                        const date = new Date(notice.createdAt);
                        const month = date.toLocaleDateString('en-US', { month: 'short' });
                        const day = date.getDate();
                        const year = date.getFullYear();

                        return (
                           <tr key={notice.id} className='odd:bg-white even:bg-light text-tcolor'>
                              <td className='px-1 sm:px-4 py-2 sm:py-3'>
                                 <div className='flex items-center gap-x-2'>
                                    <div className='w-8 sm:w-10 rounded-sm overflow-hidden shadow-sm'>
                                       <span className='block py-0 px-1 text-white text-xs sm:text-sm bg-red-500 text-center capitalize'>{month}</span>
                                       <span className='block py-2 sm:py-3 px-1 text-green-950 text-sm sm:text-lg font-medium bg-white text-center capitalize leading-1'>{day}</span>
                                    </div>
                                    <div className='rotate-[270deg] -ml-3'>
                                       <span className='text-sm sm:text-lg text-tcolor font-medium'>{year}</span>
                                    </div>
                                 </div>
                              </td>
                              <td className='px-1 sm:px-4 py-2 sm:py-3'>
                                 <Link href={`/notice/${notice.slug}`} className='inline-block transition-all hover:text-scolor'>{notice.title}</Link>
                              </td>
                              <td className='px-1 sm:px-4 py-2 sm:py-3'>
                                 <div className='flex justify-end items-center gap-x-2'>
                                    <Link className='transition-all hover:text-greencolor' href={`/notice/${notice.slug}`}>
                                       <FaEye className='text-xl' />
                                    </Link>
                                 </div>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}

async function CategorySection({ instituteId, title, image }: { instituteId: string; title: string; image: any }) {
   const navItems = await getNavItems(instituteId);
   // console.log("🚀 ~ CategorySection ~ navItems:", navItems)
   const category = navItems.find((item: any) => item.name === title);
   const pages = category?.submenu || [];

   return (
      <div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden'>
         <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
            <h3 className='text-base sm:text-lg font-semibold text-white'>{title}</h3>
         </div>
         <div className='p-4 lg:p-5 text-sm lg:text-base'>
            <div className='flex gap-4'>
               <div className='w-24'>
                  <Image className='w-full object-cover' src={image} alt={title} />
               </div>
               <div className='flex-1'>
                  <ul className='text-sm lg:text-base space-y-1'>
                     {pages.length > 0 ? pages.map((page: any) => {
                        const isExternal = page.href.startsWith('http');
                        return (
                           <li key={page.href}>
                              <Link
                                 href={page.href}
                                 className='flex gap-x-2 items-center text-tcolor transition-all hover:text-greencolor'
                                 target={isExternal ? '_blank' : undefined}
                                 rel={isExternal ? 'noopener noreferrer' : undefined}
                              >
                                 <FaHandPointRight className='text-greencolor' /> {page.name}
                              </Link>
                           </li>
                        );
                     }) : <li className='text-gray-400'>কোন পৃষ্ঠা পাওয়া যায়নি</li>}
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
}

async function FeaturedPageSection({ instituteId, pageSlug }: { instituteId: string; pageSlug: string }) {
   const pages = await getFeaturedPages(instituteId, [pageSlug]);
   const page = pages[0];

   if (!page || !page.content || page.content.length === 0) return null;

   const content = page.content[0];
   const defaultImage = '/user-image-1.png';

   return (
      <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
         <div className='flex justify-center text-center items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
            <h3 className='text-base sm:text-lg font-semibold text-white'>{page.title}</h3>
         </div>
         <div className='p-4 lg:p-5 text-sm lg:text-base'>
            <div className='text-center'>
               <Image
                  className='mx-auto mb-2 w-full max-w-[250px]'
                  src={getImageUrl(content.img_src) || defaultImage}
                  alt={content.img_alt || page.title}
                  width={250}
                  height={300}
               />
               <h4 className='text-lg font-medium mb-0'>{content.title}</h4>
               <Link className='text-sm transition-all hover:text-scolor' href={`/${page.slug}`}>
                  বিস্তারিত পড়ুন ...
               </Link>
            </div>
         </div>
      </div>
   );
}

async function GallerySection({ instituteId }: { instituteId: string }) {
   const images = await getGalleryImages(instituteId);

   if (images.length === 0) return null;

   return (
      <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
         <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
            <h3 className='text-base sm:text-lg font-semibold text-white'>ফটো গ্যালারী</h3>
            <Link className='inline-flex items-center gap-x-2 text-sm lg:text-base font-medium text-white transition-all hover:text-scolor' href="/gallery/photo-gallery">
               আরো দেখুন <FaArrowRightLong />
            </Link>
         </div>
         <div className='p-4 lg:p-5 text-sm lg:text-base'>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
               {images.map((image: any) => (
                  <div key={image.id} className='rounded-lg shadow-2xl overflow-hidden bg-light group'>
                     <div className='relative overflow-hidden rounded-lg'>
                        <Link href={`/gallery/photo-gallery`}>
                           <Image
                              className='w-full h-40 object-cover transition-all group-hover:scale-105'
                              src={getImageUrl(image.ImgSrc) || image.ImgSrc}
                              alt={image.ImgAlt || image.title}
                              width={400}
                              height={300}
                           />
                        </Link>
                        {/* <div className='inline-flex px-2 py-1 rounded-lg bg-pcolor items-center gap-x-2 text-sm absolute right-1 top-1 text-white font-semibold'>
                           <FaPhotoFilm className='text-xl' /> {image.title}
                        </div> */}
                     </div>
                     <div className='p-4'>
                        <h3 className='text-base xl:text-xl'>
                           <Link className='text-tcolor transition-all hover:text-scolor' href={`/gallery/photo-gallery`}>
                              {image.title}
                           </Link>
                        </h3>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}

async function BlogSection({ instituteId }: { instituteId: string }) {
   const posts = await getLatestBlogPosts(instituteId, 3);

   if (posts.length === 0) return null;

   return (
      <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
         <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
            <h3 className='text-base sm:text-lg font-semibold text-white'>সংবাদ এবং ইভেন্ট</h3>
            <Link className='inline-flex items-center gap-x-2 text-sm lg:text-base font-medium text-white transition-all hover:text-scolor' href="/blog">আরো দেখুন <FaArrowRightLong /></Link>
         </div>
         <div className='p-4 lg:p-5 text-sm lg:text-base'>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
               {posts.map((post: any) => {
                  const date = new Date(post.createdAt);
                  const month = date.toLocaleDateString('en-US', { month: 'short' });
                  const day = date.getDate();
                  const year = date.getFullYear();
                  const imageUrl = getImageUrl(post.ImgSrc) || blogImage1;

                  return (
                     <div key={post.id.toString()} className='rounded-lg shadow-2xl overflow-hidden bg-light group'>
                        <div className='relative overflow-hidden rounded-lg'>
                           <Link href={`/blog/${post.slug}`}>
                              <Image
                                 className='w-full h-40 object-cover transition-all group-hover:scale-105'
                                 src={imageUrl}
                                 alt={post.ImgAlt || post.title}
                                 width={400}
                                 height={300}
                              />
                           </Link>
                           <div className='flex items-center gap-x-2 absolute right-2 top-2 -me-3'>
                              <div className='w-8 sm:w-10 rounded-sm overflow-hidden shadow-sm'>
                                 <span className='block py-0 px-1 text-white text-xs sm:text-sm bg-red-500 text-center capitalize'>{month}</span>
                                 <span className='block py-2 sm:py-3 px-1 text-green-950 text-sm sm:text-lg font-medium bg-white text-center capitalize leading-1'>{day}</span>
                              </div>
                              <div className='rotate-[270deg] -ml-3.5'>
                                 <span className='text-sm sm:text-lg text-white font-medium'>{year}</span>
                              </div>
                           </div>
                        </div>
                        <div className='p-4'>
                           <h3 className='text-base xl:text-xl'>
                              <Link className='text-tcolor transition-all hover:text-scolor line-clamp-2' href={`/blog/${post.slug}`}>
                                 {post.title}
                              </Link>
                           </h3>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      </div>
   );
}

async function SocialLinks({ instituteId }: { instituteId: string }) {
   const config = await getInstituteConfig(instituteId);

   return (
      <ul className="flex gap-x-2 space-y-1 text-xl sm:text-2xl font-semibold capitalize text-bcolor">
         {config?.facebook && <li><a href={config.facebook} target="_blank" rel="noopener noreferrer" className="transition-all hover:text-pcolor"><FaFacebookF /></a></li>}
         {config?.twitter && <li><a href={config.twitter} target="_blank" rel="noopener noreferrer" className="transition-all hover:text-pcolor"><FaSquareTwitter /></a></li>}
         {config?.linkedin && <li><a href={config.linkedin} target="_blank" rel="noopener noreferrer" className="transition-all hover:text-pcolor"><FaLinkedin /></a></li>}
         {config?.youtube && <li><a href={config.youtube} target="_blank" rel="noopener noreferrer" className="transition-all hover:text-pcolor"><FaSquareYoutube /></a></li>}
      </ul>
   );
}

async function MapSection({ instituteId }: { instituteId: string }) {
   const config = await getInstituteConfig(instituteId);
   const mapSrc = config?.mapSrc || "N/A";

   return (
      <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
         <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
            <h3 className='text-base sm:text-lg font-semibold text-white'>আমাদের অবস্থান</h3>
         </div>
         <div className='p-4 lg:p-5 text-sm lg:text-base'>
            <iframe
               src={mapSrc}
               width="100%"
               height="450"
               style={{ border: 0 }}
               allowFullScreen
               loading="lazy"
               referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
         </div>
      </div>
   );
}

async function AcademicLinksSection({ instituteId }: { instituteId: string }) {
   const navItems = await getNavItems(instituteId);

   // Recursive function to find menu item by name
   const findItem = (data: any[], name: string): any | undefined => {
      for (const item of data) {
         if (item.name === name) return item;
         if (item.submenu) {
            const found = findItem(item.submenu, name);
            if (found) return found;
         }
      }
   };

   // Define academic links with their names and find their hrefs from menu
   const academicLinks = [
      { name: "একাডেমিক লিংক", href: findItem(navItems, "একাডেমিক পেপার")?.href },
      { name: "প্রতিষ্ঠাতা", href: findItem(navItems, "প্রতিষ্ঠাতা")?.href },
      { name: "আমাদের অর্জন", href: findItem(navItems, "আমাদের অর্জন")?.href },
      { name: "লাইব্রেরি", href: findItem(navItems, "লাইব্রেরি")?.href },
      { name: "ফটো গ্যালারী", href: findItem(navItems, "ফটো গ্যালারী")?.href },
      { name: "ভিডিও গ্যালারী", href: findItem(navItems, "ভিডিও গ্যালারী")?.href },
      { name: "যোগাযোগ", href: findItem(navItems, "যোগাযোগ")?.href },
   ];

   return (
      <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
         <div className='flex justify-center text-center items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
            <h3 className='text-base sm:text-lg font-semibold text-white'>একাডেমিক লিংক</h3>
         </div>
         <div className='p-4 lg:p-5 text-sm lg:text-base'>
            <ul className='text-sm lg:text-base space-y-2'>
               {academicLinks.length > 0 ? (
                  academicLinks.map((link: any) => (
                     <li key={link.name}>
                        <Link
                           href={link.href || "#"}
                           className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'
                        >
                           <FaUniversity />
                           {link.name}
                        </Link>
                     </li>
                  ))
               ) : (
                  <li className='text-gray-400'>কোন লিংক পাওয়া যায়নি</li>
               )}
            </ul>
         </div>
      </div>
   );
}

async function ImportantLinksSection({ instituteId }: { instituteId: string }) {
   const links = await prisma.importantLinks.findMany({
      where: { instituteId },
      orderBy: { createdAt: 'asc' },
   });

   return (
      <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
         <div className='flex justify-center text-center items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
            <h3 className='text-base sm:text-lg font-semibold text-white'>গুরুত্বপূর্ণ লিংক</h3>
         </div>
         <div className='p-4 lg:p-5 text-sm lg:text-base'>
            <ul className='text-sm lg:text-base space-y-2'>
               {links.length > 0 ? (
                  links.map((link: any) => (
                     <li key={link.id}>
                        <Link
                           href={link.url}
                           target='_blank'
                           className='flex items-center gap-x-2 transition-all text-tcolor hover:text-scolor'
                           rel='noopener noreferrer'
                        >
                           <FaHandPointRight />
                           {link.name}
                        </Link>
                     </li>
                  ))
               ) : (
                  <li className='text-gray-400'>কোন লিংক পাওয়া যায়নি</li>
               )}
            </ul>
         </div>
      </div>
   );
}

export default async function HomeContentWrap() {
   await connection();
   const instituteId = await getInstituteId();
   if (!instituteId) return <div className='py-8 lg:py-12'><div className="container mx-auto px-4"><p className='text-center text-red-500'>Institute not found</p></div></div>;

   const institute = await prisma.institute.findUnique({
      where: { id: instituteId },
      select: { name: true },
   });

   if (!institute) return <div className='py-8 lg:py-12'><div className="container mx-auto px-4"><p className='text-center text-red-500'>Institute not found</p></div></div>;

   return (
      <div className='py-8 lg:py-12'>
         <div className="container mx-auto px-4">
            <div className='mb-5 lg:mb-8'>
               <h1 className='text-3xl md:text-4xl lg:text-5xl text-center font-semibold text-green-500'>{institute.name} আমার অহংকার</h1>
            </div>
            <div className="flex gap-6 flex-wrap lg:flex-nowrap">
               <div className='w-full lg:w-9/12'>
                  <Suspense fallback={<div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                     <HistorySection instituteId={instituteId} />
                  </Suspense>
                  <Suspense fallback={<div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                     <NoticeSection instituteId={instituteId} />
                  </Suspense>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     <Suspense fallback={<div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                        <CategorySection instituteId={instituteId} title="প্রতিষ্ঠান সম্পর্কে" image={Image1} />
                     </Suspense>
                     <Suspense fallback={<div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                        <CategorySection instituteId={instituteId} title="এডমিনিস্ট্রেশন" image={Image2} />
                     </Suspense>
                     <Suspense fallback={<div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                        <CategorySection instituteId={instituteId} title="ভর্তি সম্পর্কিত" image={Image3} />
                     </Suspense>
                     <Suspense fallback={<div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                        <CategorySection instituteId={instituteId} title="কোর্সসমূহ" image={Image4} />
                     </Suspense>
                     <Suspense fallback={<div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                        <CategorySection instituteId={instituteId} title="একাডেমিক পেপার" image={Image5} />
                     </Suspense>
                     <Suspense fallback={<div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                        <CategorySection instituteId={instituteId} title="রেজাল্ট" image={Image6} />
                     </Suspense>
                     <Suspense fallback={<div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                        <CategorySection instituteId={instituteId} title="কো-কারিকুলাম" image={Image7} />
                     </Suspense>
                     <Suspense fallback={<div className='shadow-xl rounded-2xl border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                        <CategorySection instituteId={instituteId} title="গ্যালারী" image={Image8} />
                     </Suspense>
                  </div>
                  <Suspense fallback={<div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                     <GallerySection instituteId={instituteId} />
                  </Suspense>
                  <Suspense fallback={<div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                     <BlogSection instituteId={instituteId} />
                  </Suspense>
                  <Suspense fallback={<div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                     <MapSection instituteId={instituteId} />
                  </Suspense>
               </div>
               <div className='w-full lg:w-3/12'>
                  <Suspense fallback={<div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                     <FeaturedPageSection instituteId={instituteId} pageSlug="founder" />
                  </Suspense>
                  <Suspense fallback={<div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                     <FeaturedPageSection instituteId={instituteId} pageSlug="principals-message" />
                  </Suspense>
                  <Suspense fallback={<div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                     <AcademicLinksSection instituteId={instituteId} />
                  </Suspense>
                  <Suspense fallback={<div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden h-40 bg-gray-100 animate-pulse' />}>
                     <ImportantLinksSection instituteId={instituteId} />
                  </Suspense>
                  <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
                     <div className='flex justify-center text-center items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
                        <h3 className='text-base sm:text-lg font-semibold text-white'>জাতীয় সংগীত</h3>
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
                        <Suspense fallback={<div className='h-8 bg-gray-100 animate-pulse rounded' />}>
                           <SocialLinks instituteId={instituteId} />
                        </Suspense>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
