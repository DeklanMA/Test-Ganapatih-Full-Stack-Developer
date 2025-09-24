import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeModeScript } from 'flowbite-react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'Ganapatih Full-Stack Developer',
  description: 'Ganapatih Full-Stack Developer',
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <ThemeModeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
