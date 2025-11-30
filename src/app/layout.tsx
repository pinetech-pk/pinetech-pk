import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Providers } from "@/components/providers";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Ahmad Mustafa - React & Next.js Developer | Full-Stack Developer Pakistan",
  description:
    "Experienced React & Next.js developer in Karachi, Pakistan with 20+ years IT experience. Full-stack development, business strategy, and technical co-founder services. 4 apps in production. Available for hire.",
  keywords: [
    "React developer Pakistan",
    "Next.js developer Karachi",
    "Full-stack developer Pakistan",
    "Freelance developer Karachi",
    "Business strategist developer",
    "Technical co-founder Pakistan",
    "Ahmad Mustafa developer",
    "React Next.js developer",
    "PineTech",
  ],
  authors: [{ name: "Ahmad Mustafa" }],
  creator: "Ahmad Mustafa",
  publisher: "PineTech",

  // Open Graph (for LinkedIn, Facebook, WhatsApp)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.pinetech.pk",
    siteName: "PineTech - Ahmad Mustafa Portfolio",
    title: "Ahmad Mustafa - React & Next.js Developer | Full-Stack Developer",
    description:
      "20+ years IT experience. Full-stack developer specializing in React, Next.js. 4 production apps. Business strategist & potential co-founder.",
    images: [
      {
        url: "https://www.pinetech.pk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ahmad Mustafa - Full-Stack Developer Portfolio",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Ahmad Mustafa - React & Next.js Developer",
    description:
      "Full-stack developer with 20+ years experience. React, Next.js, Business Strategy.",
    images: ["https://www.pinetech.pk/og-image.jpg"],
  },

  // Additional
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical URL
  alternates: {
    canonical: "https://www.pinetech.pk",
  },

  // Additional metadata
  category: "Technology",

  // Verification (add your actual codes when you get them)
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

// Structured Data (Schema.org) for rich snippets
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ahmad Mustafa",
  jobTitle: "Full-Stack Developer & Business Strategist",
  url: "https://www.pinetech.pk",
  image: "https://www.pinetech.pk/profile-photo.jpg",
  sameAs: [
    // Add your actual profile URLs here
    "https://www.linkedin.com/in/ahmed-mustafa-a316a6b/",
    "https://www.upwork.com/freelancers/~019e11f0a2e565bb44",
    "https://github.com/pinetech-pk",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Karachi",
    addressRegion: "Sindh",
    addressCountry: "Pakistan",
  },
  email: "contact@pinetech.pk",
  telephone: "+923333336282",
  knowsAbout: [
    "React",
    "Next.js",
    "Full-Stack Development",
    "Business Strategy",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "MongoDB",
  ],
  worksFor: {
    "@type": "Organization",
    name: "PineTech",
    url: "https://www.pinetech.pk",
  },
  description:
    "Experienced full-stack developer with 20+ years IT experience, specializing in React, Next.js, and business strategy. Creator of 4 production applications including MealPlanner, WhatPrice, Nikah First, and Tadawul Insight.",
  hasOccupation: {
    "@type": "Occupation",
    name: "Full-Stack Developer",
    occupationLocation: {
      "@type": "City",
      name: "Karachi",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
