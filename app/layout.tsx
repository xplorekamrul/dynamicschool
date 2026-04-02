import school from "@/config/school";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { Toaster } from "sonner";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-geist-roboto",
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: school.name,
  description: `${school.name} ${school.address}`,
  icons: {
    icon: '/logo.png',
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased`}>
        {children}
        {/* <Toaster position="top-right" richColors /> */}
      </body>
    </html>
  );
}
