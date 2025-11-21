// src/components/resume/Hero.tsx

'use client';

import Image from 'next/image';
import { MapPin, Mail, Linkedin, Github, Phone, Calendar, Download } from 'lucide-react';
import { profile } from '@prisma/client';
import { useMemo } from 'react';

interface HeroProps {
  profile: profile;
}

export function Hero({ profile }: HeroProps) {

  /**
   * Computa metadados derivados da data de nascimento.
   * - useMemo evita recomputação desnecessária em re-renders do componente.
   * - Resultado é estável enquanto `profile.birthdate` não mudar.
   */
  const dateInfo = useMemo(() => {
    if (!profile.birthdate) return null;
    
    const date = new Date(profile.birthdate);
    const today = new Date();

    // Cálculo da idade baseado em ano + compensação de mês/dia.
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--;
    }

    // Cálculo do signo baseado no intervalo mês/dia.
    const day = date.getDate();
    const month = date.getMonth() + 1;

    let sign = '';
    let icon = '';

    // Tabela de intervalos zodiacais.
    if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) { sign = "Capricórnio"; icon = "♑"; }
    else if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) { sign = "Aquário"; icon = "♒"; }
    else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) { sign = "Peixes"; icon = "♓"; }
    else if ((month == 3 && day >= 21) || (month == 4 && day <= 20)) { sign = "Áries"; icon = "♈"; }
    else if ((month == 4 && day >= 21) || (month == 5 && day <= 20)) { sign = "Touro"; icon = "♉"; }
    else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) { sign = "Gêmeos"; icon = "♊"; }
    else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) { sign = "Câncer"; icon = "♋"; }
    else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) { sign = "Leão"; icon = "♌"; }
    else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) { sign = "Virgem"; icon = "♍"; }
    else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) { sign = "Libra"; icon = "♎"; }
    else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) { sign = "Escorpião"; icon = "♏"; }
    else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) { sign = "Sagitário"; icon = "♐"; }

    return { age, sign, icon };
  }, [profile.birthdate]);

  return (

    /**
     * Container principal da seção Hero.
     * - Usa cor institucional fixa no modo claro.
     * - Usa tokens do tema no modo escuro.
     * - Sobreposição de pattern em camada absoluta (layering).
     */
    <section className="relative w-full bg-[#023047] dark:bg-background text-white overflow-hidden print:hidden transition-colors duration-300">
      
      {/* Overlay de pattern com baixa opacidade para evitar ruído visual. */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 lg:px-12 flex flex-col-reverse md:flex-row items-center gap-12">
        
        {/* === COLUNA ESQUERDA === */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
          
          {/* Indicador de disponibilidade. Usa tokens para consistência de cor. */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--acento-verde)]/10 border border-[var(--acento-verde)]/20 text-[var(--acento-verde)] text-sm font-medium">
            <span className="relative flex h-2 w-2">
              {/* Efeito de ping animado (aproveita tailwindcss-animate). */}
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--acento-verde)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--acento-verde)]"></span>
            </span>
            Disponível para novos projetos
          </div>

          {/* Nome + Cargo. Usa tokens customizados de acento. */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white uppercase">
              {profile.name}
            </h1>
            <h2 className="text-xl md:text-2xl text-[var(--acento-laranja)] font-medium">
              {profile.title}
            </h2>
          </div>

          {/* Grid de informações de contato. */}
          <div className="flex flex-wrap justify-center md:justify-start gap-y-3 gap-x-6 text-zinc-300 text-sm">
            
            {profile.location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[var(--acento-verde)]" />
                <span>{profile.location}</span>
              </div>
            )}

            {dateInfo && (
              <div className="flex items-center gap-2" title={`Signo de ${dateInfo.sign}`}>
                <Calendar size={16} className="text-[var(--acento-verde)]" />
                <span>
                  {dateInfo.age} anos • {dateInfo.icon} {dateInfo.sign}
                </span>
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

            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[var(--acento-verde)]" />
                {/* Sanitização do número para protocolo tel: */}
                <a href={`tel:${profile.phone.replace(/\D/g,'')}`} className="hover:text-[var(--acento-laranja)] transition-colors">
                  {profile.phone}
                </a>
              </div>
            )}
          </div>

          {/* Botões de ação primários e secundários. */}
          <div className="flex flex-wrap gap-4 pt-4">
            
            {/* Botão principal: fallback para window.print() quando não há link externo. */}
            {profile.website_url ? (
              <a 
                href={profile.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[var(--acento-roxo)] hover:brightness-110 text-white rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-[var(--acento-roxo)]/20 cursor-pointer"
              >
                <Download size={20} />
                Baixar CV
              </a>
            ) : (
              <button 
                onClick={() => typeof window !== 'undefined' && window.print()}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--acento-roxo)] hover:brightness-110 text-white rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-[var(--acento-roxo)]/20 cursor-pointer"
              >
                <Download size={20} />
                Baixar CV
              </button>
            )}
            
            {/* Botões secundários seguem padrão outline customizado. */}
            {profile.linkedin_url && (
              <a 
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-transparent border border-zinc-500 text-zinc-300 hover:bg-white/10 hover:text-white hover:border-white rounded-lg font-medium transition-all hover:scale-105"
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
                className="flex items-center gap-2 px-6 py-3 bg-transparent border border-zinc-500 text-zinc-300 hover:bg-white/10 hover:text-white hover:border-white rounded-lg font-medium transition-all hover:scale-105"
              >
                <Github size={20} />
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* === COLUNA DIREITA (Avatar) === */}
        <div className="relative group">

          {/* Glow dinâmico usando gradient-layer + blur. */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--acento-roxo)] to-[var(--texto-secundario)] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          
          {/* Container da imagem com fallback tipográfico. */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-white/10 overflow-hidden shadow-2xl bg-[#023047]">
            {profile.photo_url ? (
              <Image 
                src={profile.photo_url} 
                alt={`Foto de ${profile.name}`}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--texto-secundario)] text-4xl font-medium">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
