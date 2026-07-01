import type { Metadata, Viewport } from "next";
import { Fraunces, DM_Sans, Caveat } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CartProvider } from "@/lib/cart";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Indian snacks",
    "small-batch snacks",
    "spicy snack mix",
    "chivda",
    "masala peanuts",
    "artisan spice blends",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      { url: siteConfig.ogImage, width: 1200, height: 630, alt: "ameei snack mixes" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: "/brand/ameei_icon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    other: {
      "msvalidate.01": "2AB9ADA91A9DF1F0D150B75429D518D5",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#C0162C",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  slogan: siteConfig.tagline,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/brand/ameei_logo_primary.svg`,
  sameAs: [siteConfig.links.instagram, siteConfig.links.tiktok],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${fraunces.variable} ${dmSans.variable} ${caveat.variable} flex min-h-screen flex-col antialiased`}
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
            }}
          />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-LBPQXP7TPJ"
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LBPQXP7TPJ');`}
          </Script>
          <CartProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </CartProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
