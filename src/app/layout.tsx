import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import MetaPixel from "../components/MetaPixel";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nittonotonbd.com'),
  title: {
    default: "Nittonotonbd | Best Online Shopping in Bangladesh",
    template: "%s | Nittonotonbd"
  },
  description: "Nittonotonbd is Bangladesh's trusted online marketplace for high-quality electronics, home appliances, and lifestyle products. Shop now for genuine products and fast delivery.",
  keywords: ["Nittonotonbd", "Online Shopping BD", "E-commerce Bangladesh", "Buy Electronics Online", "Home Appliances Bangladesh"],
  authors: [{ name: "Nittonotonbd Team" }],
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nittonotonbd.com",
    siteName: "Nittonotonbd",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nittonotonbd Online Shopping",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nittonotonbd | Online Shopping in Bangladesh",
    description: "Shop for genuine products at Nittonotonbd, the most trusted e-commerce platform in BD.",
    images: ["/images/og-image.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.variable}>
        <Providers>{children}</Providers>
        <MetaPixel />
      </body>
    </html>
  );
}
