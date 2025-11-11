// src/app/layout.tsx (Versão Limpa)

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Importa o teu globals.css original

const inter = Inter({ subsets: ["latin"] }); // Isto pode estar diferente, mas não importa

export const metadata: Metadata = {
  title: "André Ventura - Currículo",
  description: "Currículo dinâmico de André Ventura",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Removemos o 'className="dark"' e o 'bg-fundo-dark'
    // Deixamos o teu globals.css tomar conta
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}