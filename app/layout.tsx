import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Sam Shahsavani | PropTech Product Developer & Architectural Designer",
  description: "Building AI-powered tools that automate regulatory complexity and connect communities in the built environment. Architectural Designer at B+H Architects, Co-Founder of StoopInc.",
  keywords: ["PropTech", "Architectural Designer", "BIM", "Product Developer", "ZoningPal", "AI", "Regulatory Automation", "Toronto"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
