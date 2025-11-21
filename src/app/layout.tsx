// src/app/layout.tsx

import type { Metadata } from "next";
import { Fredoka, Concert_One } from "next/font/google";
import "./globals.css";

// Vercel analytics
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Theme provider
import { ThemeProvider } from "@/components/theme-provider"

const fredoka = Fredoka({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
});

const concertOne = Concert_One({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-concert-one',
});

export const metadata: Metadata = {
  title: "André Ventura - Currículo",
  description: "Currículo dinâmico de André Ventura",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>

      <body
        className={`${fredoka.variable} ${concertOne.variable} bg-fundo-dark text-texto-principal antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          {/* Vercel Analytics */}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}