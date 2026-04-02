"use client";

import { useMemo } from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import { FaLocationPin } from "react-icons/fa6";

interface ContactData {
  name: string;
  mobileNumber: string | null;
  email: string | null;
  address: string | null;
  eiin: string | null;
  mpo: string | null;
  mapSrc: string | null;
  mapAddress: string | null;
}

interface ContactPageRightProps {
  data: ContactData | null;
}

export default function ContactPageRight({ data }: ContactPageRightProps) {
  const contactInfo = useMemo(() => {
    if (!data) return [];

    const info = [];

    if (data.mobileNumber) {
      info.push({
        icon: FaPhone,
        label: data.mobileNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3'),
        href: `tel:${data.mobileNumber}`
      });
    }

    if (data.email) {
      info.push({
        icon: FaEnvelope,
        label: data.email,
        href: `mailto:${data.email}`
      });
    }

    if (data.address) {
      info.push({
        icon: FaLocationPin,
        label: data.address,
        href: '#'
      });
    }

    if (data.eiin || data.mpo) {
      const codes = [];
      if (data.eiin) codes.push(`EIIN- ${data.eiin}`);
      if (data.mpo) codes.push(`MPO- ${data.mpo}`);

      info.push({
        icon: FaLocationPin,
        label: codes.join(', '),
        href: '#'
      });
    }

    return info;
  }, [data]);

  if (!data) {
    return null;
  }

  return (
    <div>
      {/* Contact Information Section */}
      <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
        <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
          <h3 className='text-base sm:text-lg font-semibold text-white'>যোগাযোগ</h3>
        </div>
        <div className='p-4 lg:p-5 text-sm lg:text-base'>
          <ul className="space-y-2 lg:space-y-3 text-base text-bcolor">
            {contactInfo.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <li key={index}>
                  <a
                    className="flex gap-x-2 text-bcolor transition-all hover:text-scolor"
                    href={item.href}
                    target={item.href.startsWith('http') ? "_blank" : undefined}
                    rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
                  >
                    <IconComponent className="mt-2 flex-shrink-0" />
                    <span className="flex-1 break-words">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Map Section */}
      {data.mapSrc && (
        <div className='shadow-xl rounded-2xl mb-6 border border-gray-200 overflow-hidden'>
          <div className='flex justify-between items-center flex-wrap gap-1.5 px-4 lg:px-5 py-3 border-b border-gray-200 bg-greencolor'>
            <h3 className='text-base sm:text-lg font-semibold text-white'>আমাদের অবস্থান</h3>
          </div>
          <div className='p-4 lg:p-5 text-sm lg:text-base'>
            <iframe
              src={data.mapSrc}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={data.mapAddress || "Institute Location"}
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
