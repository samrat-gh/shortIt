import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShortIt - URL Shortener",
  description:
    "Transform your long URLs into short, memorable links in seconds",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // bg-gray-800
    <html lang="en" className="min-h-screen bg-[#020617]">
      {/* "min-h-screen w-full bg-gradient-to-b from-gray-800 to-gray-900" */}
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
