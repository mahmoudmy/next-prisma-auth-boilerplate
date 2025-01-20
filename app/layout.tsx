import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazir = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "کالیبرو- مدیریت آسان کالیبراسیون",
  description: "کالیبراسیون قطعات و تجهیزات را در سازمان را به آسانی با کالیبرو مدیریت کنید.",
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
