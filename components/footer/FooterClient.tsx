"use client";

import Image from "next/image";
import Link from "next/link";
import { FaEnvelope, FaFacebookF, FaPhone } from "react-icons/fa";
import { FaInstagram, FaLinkedin, FaLocationPin, FaSquareYoutube, FaXTwitter } from "react-icons/fa6";
import { getImageUrl } from "../../lib/shared/image-utils";
import type { FooterData, FooterLink } from "./get-footer-data";

interface FooterClientProps {
   footerData: FooterData | null;
   footerPages: FooterLink[];
}

export default function FooterClient({ footerData, footerPages }: FooterClientProps) {
   const schoolName = footerData?.name || "School Name";
   const address = footerData?.address || "";
   const established = footerData?.established || new Date().getFullYear();
   const eiin = footerData?.eiin || "EIIN";
   const mpo = footerData?.mpo || "MPO";
   const logo = footerData?.logo || "/logo.png";
   const mobileNumber = footerData?.mobileNumber || "";
   const email = footerData?.email || "";
   const socialLinks = footerData?.socialLinks || {};

   // Convert logo path to use the /images rewrite if it's a storage path
   const logoUrl = getImageUrl(logo) || "/logo.png";

   // Process footer pages: convert /home to /
   const processedFooterPages = footerPages.map(page => ({
      ...page,
      href: page.href === '/home' ? '/' : page.href,
   }));

   // Social media icon mapping
   const socialIcons: Record<string, React.ReactNode> = {
      facebook: <FaFacebookF />,
      twitter: <FaXTwitter />,
      instagram: <FaInstagram />,
      linkedin: <FaLinkedin />,
      youtube: <FaSquareYoutube />,
   };

   return (
      <footer>
         <div className="py-10 lg:py-16 bg-light">
            <div className="container mx-auto px-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* About Section */}
                  <div>
                     <Link className="inline-block mb-2" href="/">
                        <Image
                           className="max-w-24"
                           src={logoUrl}
                           alt="logo"
                           width={80}
                           height={80}
                        />
                     </Link>
                     <h3 className="text-bcolor">
                        {schoolName}, {address}
                     </h3>
                     <p className="text-bcolor">
                        {address}
                     </p>
                     <p className="text-bcolor">
                        স্থাপিত: {established} খ্রি:, EIIN: {eiin}, MPO: {mpo}
                     </p>
                     {/* Social Links */}
                     <ul className="flex gap-x-2 space-y-1 text-xl sm:text-2xl font-semibold capitalize text-bcolor mt-4">
                        {Object.entries(socialLinks).map(([key, url]) => (
                           <li key={key}>
                              <a
                                 href={url}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="transition-all hover:text-pcolor"
                              >
                                 {socialIcons[key]}
                              </a>
                           </li>
                        ))}
                     </ul>
                  </div>

                  {/* Contact Section */}
                  <div>
                     <h3 className="text-tcolor text-xl font-semibold mb-5 lg:mb-6">যোগাযোগ</h3>
                     <ul className="space-y-2 lg:space-y-3 text-base text-bcolor">
                        {mobileNumber && (
                           <li>
                              <a
                                 className="flex gap-x-2 text-bcolor transition-all hover:text-pcolor"
                                 href={`tel:${mobileNumber}`}
                              >
                                 <FaPhone className="mt-0.5" />
                                 <span className="flex-1">{mobileNumber}</span>
                              </a>
                           </li>
                        )}
                        {email && (
                           <li>
                              <a
                                 className="flex gap-x-2 text-bcolor transition-all hover:text-pcolor"
                                 href={`mailto:${email}`}
                              >
                                 <FaEnvelope className="mt-1" />
                                 <span className="flex-1">{email}</span>
                              </a>
                           </li>
                        )}
                        {address && (
                           <li>
                              <a
                                 className="flex gap-x-2 text-bcolor transition-all hover:text-pcolor"
                                 href="#"
                              >
                                 <FaLocationPin className="mt-0.5" />
                                 <span className="flex-1">{address}</span>
                              </a>
                           </li>
                        )}
                     </ul>
                  </div>

                  {/* Pages Section - Split into two columns if many pages */}
                  {processedFooterPages.length > 0 && (
                     <>
                        <div>
                           <h3 className="text-tcolor text-xl font-semibold mb-5 lg:mb-6">গুরুত্বপূর্ণ লিংক</h3>
                           <ul className="space-y-2 text-base capitalize text-bcolor">
                              {processedFooterPages.slice(0, 4).map((page) => (
                                 <li key={page.href}>
                                    <Link
                                       href={page.href}
                                       className="transition-all hover:text-pcolor"
                                    >
                                       {page.name}
                                    </Link>
                                 </li>
                              ))}
                           </ul>
                        </div>
                        {processedFooterPages.length > 4 && (
                           <div>
                              <h3 className="text-tcolor text-xl font-semibold mb-5 lg:mb-6">আরও লিংক</h3>
                              <ul className="space-y-2 text-base capitalize text-bcolor">
                                 {processedFooterPages.slice(4, 8).map((page) => (
                                    <li key={page.href}>
                                       <Link
                                          href={page.href}
                                          className="transition-all hover:text-pcolor"
                                       >
                                          {page.name}
                                       </Link>
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        )}
                     </>
                  )}
               </div>
            </div>
         </div>

         {/* Bottom Bar */}
         <div className="py-3 bg-green-600">
            <div className="container mx-auto px-4">
               <div className="flex justify-center items-center">
                  <p className="text-white font-semibold">
                     Build & Developed by{" "}
                     <a
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pcolor hover:text-light"
                        href="https://www.arrowheadit.com/"
                     >
                        Arrowhead IT Solutions
                     </a>
                  </p>
               </div>
            </div>
         </div>
      </footer>
   );
}
