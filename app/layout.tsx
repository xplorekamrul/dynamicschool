import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-geist-roboto",
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
});

// Use static metadata for root layout to avoid prerendering issues
// Dynamic metadata is handled per-page (e.g., app/(user)/page.tsx)
export const metadata: Metadata = {
  title: 'My School',
  description: 'My School - Educational Institution',
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
      </body>
    </html>
  );
}
