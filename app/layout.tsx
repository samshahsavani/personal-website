import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import { siteMetadata } from "@/lib/site-content";

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.url),
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: [...siteMetadata.keywords],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.url,
    siteName: siteMetadata.siteName,
    type: 'website',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary',
    title: siteMetadata.title,
    description: siteMetadata.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteMetadata.siteName,
    alternateName: 'Sam Shahsavani Portfolio',
    url: `${siteMetadata.url}/`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sam Shahsavani',
    url: `${siteMetadata.url}/`,
    jobTitle: 'AEC data workflows and tool-building',
    description: siteMetadata.description,
    sameAs: [
      'https://www.linkedin.com/in/sam-shahsavani/',
      'https://github.com/samshahsavani',
      'https://www.zoningpal.com/',
    ],
    knowsAbout: [
      'Healthcare BIM',
      'Architecture data workflows',
      'AEC tool building',
      'Digital delivery',
      'dRofus',
      'Revit',
      'Zoning compliance',
      'Civic data',
      'Product development',
    ],
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>

      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
