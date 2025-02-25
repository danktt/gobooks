"use clients"

import { QueryClientProvider } from '@tanstack/react-query';
import type { Metadata } from "next";
import { ThemeProvider } from 'next-themes';
import { Inter } from "next/font/google";
import { queryClient } from '../../lib/queryClient';
import { DarkModeToggle } from '../components/DarkModeToggle';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark:bg-gray-900 dark:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProvider client={queryClient}>
           <div className="absolute top-4 right-4">
              <DarkModeToggle />
            </div>
            {children}
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}