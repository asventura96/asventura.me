// src/app/layout.tsx (Corrigido com as tuas fontes e FontAwesome)

import type { Metadata } from "next";
// 1. Importa as tuas fontes (Fredoka e Concert One)
import { Fredoka, Concert_One } from "next/font/google";
import "./globals.css"; 

// 2. Configura as fontes como variáveis CSS
const fredoka = Fredoka({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka', // Apelido da fonte
});

const concertOne = Concert_One({
  weight: ['400'], // Único peso disponível
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-concert-one', // Apelido da fonte
});

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
    <html lang="pt-BR" className="dark">

      {/* 3. Adicionamos o <head> para incluir o FontAwesome */}
      <head>
         <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" 
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" />
      </head>

      {/* 4. Aplica as variáveis das tuas fontes ao body */}
      <body 
        className={`${fredoka.variable} ${concertOne.variable} bg-fundo-dark text-texto-principal antialiased`}
      >
        {children}
      </body>
    </html>
  );
}