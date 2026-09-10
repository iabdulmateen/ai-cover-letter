import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Cover Letter",
  description: "Generate tailored, professional cover letters using AI",
  applicationName: "AI Cover Letter",
  keywords: [
    "AI cover letter",
    "cover letter generator",
    "job application",
    "resume builder",
    "career",
    "job search",
    "AI writing assistant",
  ],
  authors: [{ name: "AI Cover Letter" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.svg"],
    apple: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "AI Cover Letter",
    description: "Generate tailored, professional cover letters using AI",
    type: "website",
    siteName: "AI Cover Letter",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Cover Letter",
    description: "Generate tailored, professional cover letters using AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}