import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazir = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js, Prisma, BetterAuth",
  description: "Next.js, Prisma, BetterAuth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${vazir.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
