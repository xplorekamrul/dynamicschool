"use client";

import { getImageUrl } from "@/lib/shared/image-utils";
import Image from 'next/image';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HTMLAttributeAnchorTarget, JSX, useState } from "react";
import {
   FaAngleDown, FaBars, FaEnvelope, FaFacebookF,
   FaPhone
} from "react-icons/fa";
import {
   FaInstagram, FaLinkedin,
   FaSquareYoutube, FaXTwitter
} from "react-icons/fa6";

interface NavItem {
   name: string;
   href: string;
   icon?: JSX.Element;
   submenu?: {
      name: string;
      href: string;
      target?: HTMLAttributeAnchorTarget
   }[];
}

interface HeaderData {
   name: string;
   mobileNumber: string | null;
   email: string | null;
   logo: string | null;
   established: number | null;
   eiin: string | null;
   mpo: string | null;
   facebook: string | null;
   twitter: string | null;
   instagram: string | null;
   linkedin: string | null;
   youtube: string | null;
}

interface HeaderClientProps {
   headerData: HeaderData | null;
   navItems: NavItem[];
}

export default function HeaderClient({ headerData, navItems }: HeaderClientProps) {
   // console.log("🚀 ~ HeaderClient ~ navItems:", navItems)
   // console.log("🚀 ~ HeaderClient ~ headerData:", headerData)
   const [isOpen, setIsOpen] = useState(false);
   const [submenuOpen, setSubmenuOpen] = useState<string | null>(null);
   const pathname = usePathname();

   // Header data from database
   const schoolName = headerData?.name || "School Name";
   const mobileNumber = headerData?.mobileNumber || "+88 00000000000";
   const email = headerData?.email || "info@school.edu.bd";
   const logo = headerData?.logo || "/logo.png";
   const established = headerData?.established || new Date().getFullYear();
   const eiin = headerData?.eiin || "EIIN";
   const mpo = headerData?.mpo || "MPO";

   // Social links from database
   const socialLinks = {
      facebook: headerData?.facebook,
      twitter: headerData?.twitter,
      instagram: headerData?.instagram,
      linkedin: headerData?.linkedin,
      youtube: headerData?.youtube,
   };

   // Process nav items: convert /home to /, hide /blog
   const displayNavItems = navItems
      .filter(item => item.href !== '/blog') // Hide blog menu
      .map(item => ({
         ...item,
         href: item.href === '/home' ? '/' : item.href, // Convert /home to /
         submenu: item.submenu?.filter(sub => sub.href !== '/blog') // Also filter blog from submenus
      }));

   const logoUrl = getImageUrl(logo) || "/logo.png";
   // console.log("🚀 ~ HeaderClient ~ logoUrl:", logoUrl)

   const closeMobileMenu = () => {
      setIsOpen(false);
      setSubmenuOpen(null);
   };

   return (
      <>
         {/* Top Bar */}
         <div className="bg-light py-2 relative z-50 hidden sm:block">
            <div className="container mx-auto px-4">
               <div className="flex items-center justify-center sm:justify-between flex-wrap gap-y-2 gap-x-2">
                  <ul className="flex gap-x-3 sm:gap-x-5">
                     <li><a className="flex items-center gap-x-2 text-bcolor hover:text-pcolor" href={`tel:${mobileNumber}`}><FaPhone /> {mobileNumber}</a></li>
                     <li><a className="flex items-center gap-x-2 text-bcolor hover:text-pcolor" href={`mailto:${email}`}><FaEnvelope /> {email}</a></li>
                  </ul>
                  <ul className="flex gap-x-2 text-xl sm:text-2xl text-bcolor">
                     {socialLinks.facebook && (
                        <li><a target="_blank" href={socialLinks.facebook} className="hover:text-pcolor"><FaFacebookF /></a></li>
                     )}
                     {socialLinks.twitter && (
                        <li><a target="_blank" href={socialLinks.twitter} className="hover:text-pcolor"><FaXTwitter /></a></li>
                     )}
                     {socialLinks.instagram && (
                        <li><a target="_blank" href={socialLinks.instagram} className="hover:text-pcolor"><FaInstagram /></a></li>
                     )}
                     {socialLinks.linkedin && (
                        <li><a target="_blank" href={socialLinks.linkedin} className="hover:text-pcolor"><FaLinkedin /></a></li>
                     )}
                     {socialLinks.youtube && (
                        <li><a target="_blank" href={socialLinks.youtube} className="hover:text-pcolor"><FaSquareYoutube /></a></li>
                     )}
                  </ul>
               </div>
            </div>
         </div>

         <div className="flex flex-col xl:flex-col-reverse">
            {/* Desktop Navigation */}
            <header className="w-full sticky top-0 z-50 bg-greencolor py-2">
               <nav>
                  <div className="container mx-auto px-4 flex flex-wrap items-center justify-between">
                     <Link href="/" className="inline-flex items-center xl:hidden gap-x-2">
                        <Image width={80} height={80} className="w-[80px] h-[80px] object-cover pr-2" src={logoUrl} alt="Logo" />
                     </Link>

                     <div className="flex xl:order-2">
                        <button
                           onClick={() => setIsOpen(!isOpen)}
                           type="button"
                           className="inline-flex items-center p-2 w-10 h-10 justify-center text-white bg-pcolor rounded-xl xl:hidden hover:bg-hcolor"
                        >
                           <FaBars />
                        </button>
                     </div>

                     <div className="w-full xl:flex xl:justify-center xl:w-full xl:order-1 hidden">
                        <ul className="flex flex-row space-x-1 text-sm xxl:text-base font-medium">
                           {displayNavItems.map((item) => (
                              <li key={item.name} className="relative group">
                                 <Link
                                    href={item.href}
                                    className={`block py-2 xl:py-1 px-2 rounded ${pathname === item.href
                                       ? "text-white bg-pcolor"
                                       : "text-white hover:bg-pcolor hover:text-white"
                                       }`}
                                 >
                                    <span className="flex items-center gap-x-2">
                                       {item.icon && <span className="text-base">{item.icon}</span>}
                                       {item.name}
                                       {item.submenu && <FaAngleDown className="transition-transform group-hover:rotate-180" />}
                                    </span>
                                 </Link>
                                 {item.submenu && (
                                    <ul className="hidden group-hover:block absolute z-10 left-0 w-48 bg-white text-sm text-black rounded-sm shadow-xl">
                                       {item.submenu.map((subItem) => (
                                          <li key={subItem.name}>
                                             <Link
                                                href={subItem.href}
                                                target={subItem.target ?? undefined}
                                                className={`block px-3 py-2 hover:bg-pcolor hover:text-white ${pathname === subItem.href ? "bg-pcolor text-white " : "text-black"}`}
                                             >
                                                {subItem.name}
                                             </Link>
                                          </li>
                                       ))}
                                    </ul>
                                 )}
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               </nav>
            </header>

            {/* School Info Header */}
            <div className="container mx-auto px-4 flex justify-center items-center py-4 gap-x-1.5">
               <div className="hidden lg:block">
                  <Image width={500} height={500} className="w-[150px] h-[150px] object-cover pr-2" src={logoUrl} alt="Logo" />
               </div>
               <div className="text-center space-y-4">
                  <h1 className="text-3xl lg:text-5xl font-semibold text-tcolor">{schoolName}</h1>
                  <h3 className="text-base sm:text-xl font-medium text-bcolor">স্থাপিত: {established} খ্রি:, EIIN: {eiin}, MPO: {mpo}</h3>
               </div>
            </div>
         </div>

         {/* Mobile Backdrop */}
         {isOpen && (
            <div
               className="fixed inset-0 bg-black/50 z-40"
               onClick={closeMobileMenu}
            />
         )}

         {/* Mobile Drawer */}
         <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="p-4 border-b flex justify-between items-center">
               <h2 className="text-lg font-semibold">মেনু</h2>
               <button onClick={closeMobileMenu} className="text-2xl hover:text-pcolor">✕</button>
            </div>

            <div className="overflow-y-auto h-[calc(100%-80px)]">
               <ul className="flex flex-col text-sm xxl:text-base font-medium p-4">
                  {displayNavItems.map((item) => (
                     <li
                        key={item.name}
                        className="border-b border-gray-200 last:border-0"
                     >
                        {item.submenu ? (
                           <div
                              onMouseEnter={() => setSubmenuOpen(item.name)}
                              onMouseLeave={() => setSubmenuOpen(null)}
                           >
                              <div className="flex items-center justify-between py-3 px-2 text-black hover:bg-gray-50 cursor-pointer">
                                 <span className="flex items-center gap-x-2">
                                    {item.icon && <span className="text-base">{item.icon}</span>}
                                    {item.name}
                                 </span>
                                 <FaAngleDown className={`transition-transform duration-200 ${submenuOpen === item.name ? 'rotate-180' : ''}`} />
                              </div>

                              <ul className={`bg-gray-50 overflow-hidden transition-all duration-300 ${submenuOpen === item.name ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
                                 {item.submenu.map((subItem) => (
                                    <li key={subItem.name}>
                                       <Link
                                          href={subItem.href}
                                          target={subItem.target ?? undefined}
                                          className={`block px-6 py-2 hover:bg-gray-100 ${pathname === subItem.href ? "bg-pcolor text-white" : "text-gray-700"}`}
                                          onClick={closeMobileMenu}
                                       >
                                          {subItem.name}
                                       </Link>
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        ) : (
                           <Link
                              href={item.href}
                              className={`flex items-center gap-x-2 py-3 px-2 hover:bg-gray-50 ${pathname === item.href ? "text-pcolor font-semibold" : "text-black"}`}
                              onClick={closeMobileMenu}
                           >
                              {item.icon && <span className="text-base">{item.icon}</span>}
                              {item.name}
                           </Link>
                        )}
                     </li>
                  ))}
               </ul>
            </div>
         </div>
      </>
   );
}