import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from '@/components/navigation';
import { PWAInstaller } from '@/components/pwa-installer';
import { DataInitializer } from '@/components/data-initializer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wellness Tracker",
  description: "Track your wellness journey with ease",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wellness Tracker",
  },
};

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PWAInstaller />
        <DataInitializer>
          {children}
          <Navigation />
        </DataInitializer>
      </body>
    </html>
  );
}
