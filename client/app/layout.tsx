import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShortIt | URL shortener on a single go",
  description: "solution to your long url",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-gray-800">
      <body
        className={
          (inter.className,
          "h-full w-full bg-gradient-to-b from-gray-800 via-blue-700 to-gray-900")
        }
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
