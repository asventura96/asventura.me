// src/components/resume/Hero.tsx

/**
 * @description Seção de destaque (Hero) do currículo.
 * Responsável por exibir a identidade visual principal, foto e contatos rápidos.
 * Utiliza o tema escuro da paleta para gerar impacto visual na primeira dobra.
 * @author André Ventura
 */

'use client';

import Image from 'next/image';
import { MapPin, Mail, Linkedin, Github, Download } from 'lucide-react';

interface HeroProps {
  profile: {
    id: number;
    name: string;
    title: string;
    email: string | null;
    phone: string | null;
    location: string | null;
    photo_url: string | null;
    personal_summary: string | null;
    linkedin_url?: string | null;
    github_url?: string | null;
    website_url?: string | null;
  };
}

export function Hero({ profile }: HeroProps) {
  
  /**
   * Aciona a impressão do navegador.
   * O CSS global deve conter regras @media print para ocultar elementos desnecessários.
   */
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    // FUNDO: Azul Escuro da marca (#023047)
    <section className="relative w-full bg-[var(--background)] text-[var(--branco)] overflow-hidden print:hidden">
      
      {/* Pattern de fundo sutil */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(var(--foreground)_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 lg:px-12 flex flex-col-reverse md:flex-row items-center gap-12">
        
        {/* Coluna Esquerda: Informações e Ações */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          
          {/* Badge de Status: Verde (#2ECC40) */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--acento-verde)]/10 border border-[var(--acento-verde)]/20 text-[var(--acento-verde)] text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--acento-verde)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--acento-verde)]"></span>
            </span>
            Disponível para novos projetos
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--branco)]">
              {profile.name}
            </h1>
            {/* Cargo: Laranja (#FF8D37) para destaque máximo */}
            <h2 className="text-xl md:text-2xl text-[var(--acento-laranja)] font-medium">
              {profile.title}
            </h2>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[var(--texto-secundario)] text-sm">
            {profile.location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[var(--acento-verde)]" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.email && (
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[var(--acento-verde)]" />
                <a href={`mailto:${profile.email}`} className="hover:text-[var(--acento-laranja)] transition-colors">
                  {profile.email}
                </a>
              </div>
            )}
          </div>

          <p className="text-[var(--foreground)] max-w-lg leading-relaxed opacity-90">
             Especialista em transformar processos manuais em sistemas automatizados.
             Foco em Python, Django e Desenvolvimento Web Moderno.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            {/* Botão Principal: Roxo (#5D3FD3) */}
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 bg-[var(--acento-roxo)] hover:brightness-110 text-white rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-[var(--acento-roxo)]/20 cursor-pointer"
            >
              <Download size={20} />
              Baixar CV
            </button>
            
            {/* Botões Secundários (Outline) */}
            {profile.linkedin_url && (
              <a 
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-transparent border border-[var(--texto-secundario)] text-[var(--texto-secundario)] hover:bg-[var(--texto-secundario)]/10 rounded-lg font-medium transition-all hover:scale-105"
              >
                <Linkedin size={20} />
                LinkedIn
              </a>
            )}

            {profile.github_url && (
              <a 
                href={profile.github_url}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-transparent border border-[var(--texto-secundario)] text-[var(--texto-secundario)] hover:bg-[var(--texto-secundario)]/10 rounded-lg transition-all hover:text-white"
              >
                <Github size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Coluna Direita: Foto de Perfil */}
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--acento-roxo)] to-[var(--texto-secundario)] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-[var(--foreground)]/10 overflow-hidden shadow-2xl bg-[var(--background)]">
              {profile.photo_url ? (
                 <Image 
                   src={profile.photo_url} 
                   alt={profile.name}
                   fill
                   className="object-cover"
                   priority
                 />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--texto-secundario)] text-4xl font-bold">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
        </div>
      </div>
    </section>
  );
}