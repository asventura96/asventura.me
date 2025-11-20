// src/components/resume/ExperienceTimeline.tsx

/**
 * @description Componente visual de linha do tempo para exibir experiências profissionais.
 * @author André Ventura
 */

'use client';

import { useState, useMemo } from 'react';
import { Briefcase, Calendar, MapPin, ChevronDown } from 'lucide-react';

interface Experience {
  id: number;
  company: string;
  role: string;
  start_date: string | Date | null;
  end_date?: string | Date | null;
  location?: string | null;
  description: string;
}

interface TimelineProps {
  experiences: Experience[];
}

/**
 * Formata uma data para o padrão "MMM. YYYY" (pt-BR).
 */
const formatDate = (dateValue: string | Date | null | undefined): string => {
  if (!dateValue) return '';
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return String(dateValue);
    return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(date);
  } catch {
    return String(dateValue);
  }
};

export function ExperienceTimeline({ experiences }: TimelineProps) {
  
  const sortedExperiences = useMemo(() => {
    return [...experiences].sort((a, b) => {
      if (!a.end_date && b.end_date) return -1;
      if (a.end_date && !b.end_date) return 1;
      if (!a.end_date && !b.end_date) return 0;
      
      const dateA = new Date(a.end_date!).getTime();
      const dateB = new Date(b.end_date!).getTime();
      return dateB - dateA;
    });
  }, [experiences]);

  const [expandedId, setExpandedId] = useState<number | null>(sortedExperiences[0]?.id || null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="relative space-y-8">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-xl bg-[var(--texto-secundario)]/20 text-[var(--background)] border border-[var(--background)]/10">
          <Briefcase size={24} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-medium text-[var(--background)] tracking-tight">
          Experiência Profissional
        </h3>
      </div>

      {/* Linha Vertical Conectora */}
      <div className="absolute left-[19px] top-24 bottom-4 w-[2px] bg-[var(--acento-roxo)]/20 hidden md:block"></div>

      <div className="space-y-8">
        {sortedExperiences.map((exp) => {
          const isExpanded = expandedId === exp.id;
          
          return (
            <div key={exp.id} className="relative md:pl-16 group">
              
              {/* Marcador da Timeline (Bolinha) */}
              <div className={`
                absolute left-[14px] top-6 w-3 h-3 rounded-full border-[3px] z-10 hidden md:block transition-all duration-300
                ${isExpanded 
                  ? 'border-white bg-[var(--acento-laranja)] scale-125 shadow-md' 
                  : 'border-white bg-[var(--acento-roxo)] group-hover:bg-[var(--acento-roxo)]'}
              `}></div>

              {/* Card Interativo */}
              <div 
                className={`
                  relative bg-white rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden group border
                  ${isExpanded 
                    ? 'border-[var(--acento-laranja)] shadow-xl shadow-[var(--background)]/10 -translate-y-1' 
                    : 'border-[var(--texto-secundario)]/30 hover:border-[var(--acento-roxo)] hover:shadow-md'}
                `}
                onClick={() => toggleExpand(exp.id)}
                role="button"
                aria-expanded={isExpanded}
              >
                {/* LAYOUT DO CABEÇALHO */}
                <div className="p-6 flex flex-col md:flex-row gap-4 justify-between items-start relative z-10">
                  
                  {/* Coluna Esquerda: Info Principal */}
                  <div className="space-y-1 flex-1">
                    <h4 className={`text-lg font-medium transition-colors ${isExpanded ? 'text-[var(--background)]' : 'text-[var(--background)]'}`}>
                      {exp.role}
                    </h4>
                    <div className="text-base font-medium text-[var(--acento-roxo)]">
                      {exp.company}
                    </div>
                  </div>

                  {/* Coluna Direita: Grupo de Dados + Seta */}
                  <div className="flex items-start gap-4 w-full md:w-auto justify-between md:justify-end">
                    
                    {/* Bloco de Data e Local */}
                    <div className="flex flex-col md:items-end gap-2 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--foreground)] border border-[var(--texto-secundario)]/50 text-[var(--background)] whitespace-nowrap">
                        <Calendar size={14} className="text-[var(--acento-roxo)]" />
                        <span className="font-medium text-[var(--background)]">
                          {formatDate(exp.start_date)} 
                          {' — '}
                          {exp.end_date ? formatDate(exp.end_date) : 'Atualmente'}
                        </span>
                      </div>
                      
                      {exp.location && (
                        <div className="flex items-center gap-1.5 px-1 text-[var(--background)]/70 font-medium">
                          <MapPin size={14} className="text-[var(--acento-laranja)]" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>

                    {/* SETA DESTAQUE */}
                    <div className={`
                      flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 border
                      ${isExpanded 
                        ? 'bg-[var(--acento-laranja)] border-[var(--acento-laranja)] text-white rotate-180 shadow-lg shadow-orange-200' 
                        : 'bg-transparent border-[var(--texto-secundario)]/30 text-[var(--texto-secundario)] group-hover:border-[var(--acento-roxo)] group-hover:text-[var(--acento-roxo)]'}
                    `}>
                      <ChevronDown size={18} strokeWidth={2.5} />
                    </div>

                  </div>
                </div>

                {/* Conteúdo Expansível */}
                <div 
                  className={`
                    transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden bg-[var(--foreground)]/30
                    ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                  `}
                >
                  <div className="px-6 pb-8 pt-4">
                    <div className="h-px w-full bg-[var(--texto-secundario)]/30 mb-6"></div>
                    <p className="text-[var(--background)] leading-7 whitespace-pre-line text-[15px] font-normal opacity-90 text-justify">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}