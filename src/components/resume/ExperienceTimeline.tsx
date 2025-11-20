// src/components/resume/ExperienceTimeline.tsx

/**
 * @description Componente visual de linha do tempo para exibir experiências profissionais.
 * Implementa ordenação automática (cargos atuais no topo) e expansão interativa (Accordion).
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
 * Retorna a string original caso a conversão falhe, garantindo tolerância a erros.
 * * @param dateValue - String, Date ou null vindo do banco de dados
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

/**
 * Componente principal da Linha do Tempo.
 */
export function ExperienceTimeline({ experiences }: TimelineProps) {
  
  /**
   * Memoriza e ordena as experiências para evitar re-renderizações desnecessárias.
   * Lógica:
   * 1. Cargos atuais (sem data fim) aparecem primeiro.
   * 2. Demais cargos ordenados por data de fim decrescente (mais recente primeiro).
   */
  const sortedExperiences = useMemo(() => {
    return [...experiences].sort((a, b) => {
      // Se 'a' é atual e 'b' não é, 'a' vem primeiro
      if (!a.end_date && b.end_date) return -1;
      // Se 'b' é atual e 'a' não é, 'b' vem primeiro
      if (a.end_date && !b.end_date) return 1;
      // Se ambos são atuais, mantém a ordem (ou poderia ordenar por início)
      if (!a.end_date && !b.end_date) return 0;
      
      // Ambos finalizados: ordena do mais recente para o mais antigo
      const dateA = new Date(a.end_date!).getTime();
      const dateB = new Date(b.end_date!).getTime();
      return dateB - dateA;
    });
  }, [experiences]);

  // Estado para controlar qual item está expandido (inicia com o mais recente)
  const [expandedId, setExpandedId] = useState<number | null>(sortedExperiences[0]?.id || null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="relative space-y-8">
      {/* Cabeçalho da Seção: Ícone e Título na cor da marca (#023047) */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-xl bg-[var(--texto-secundario)]/20 text-[var(--background)] border border-[var(--background)]/10">
          <Briefcase size={24} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-bold text-[var(--background)] tracking-tight">
          Experiência Profissional
        </h3>
      </div>

      {/* Linha Vertical Conectora: Roxo suave (#5D3FD3) */}
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
                  ? 'border-white bg-[var(--acento-laranja)] scale-125 shadow-md' // Ativo: Laranja (#FF8D37)
                  : 'border-white bg-[var(--acento-roxo)] group-hover:bg-[var(--acento-roxo)]'} // Inativo: Roxo (#5D3FD3)
              `}></div>

              {/* Card de Experiência */}
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
                {/* Cabeçalho do Card (Sempre visível) */}
                <div className="p-6 flex flex-col md:flex-row gap-4 justify-between relative z-10">
                  
                  <div className="space-y-1">
                    {/* Cargo: Azul Escuro se ativo, Azul Escuro se inativo */}
                    <h4 className={`text-lg font-bold transition-colors ${isExpanded ? 'text-[var(--background)]' : 'text-[var(--background)]'}`}>
                      {exp.role}
                    </h4>
                    {/* Empresa: Roxo para destaque */}
                    <div className="text-base font-bold text-[var(--acento-roxo)]">
                      {exp.company}
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end justify-center gap-2 text-sm mt-2 md:mt-0 pr-8 md:pr-0">
                    {/* Badge de Data: Fundo Claro (#D4F0FC) com Texto Escuro (#023047) */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--foreground)] border border-[var(--texto-secundario)]/50 text-[var(--background)]">
                      <Calendar size={14} className="text-[var(--acento-roxo)]" />
                      <span className="font-bold text-[var(--background)]">
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

                  {/* Ícone de Expansão (Seta) */}
                  <div className={`
                    absolute top-6 right-6 transition-transform duration-300 text-[var(--background)]/30
                    ${isExpanded ? 'rotate-180 text-[var(--acento-laranja)]' : ''}
                  `}>
                    <ChevronDown size={20} />
                  </div>
                </div>

                {/* Conteúdo Expansível (Descrição) */}
                <div 
                  className={`
                    transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden bg-[var(--foreground)]/30
                    ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                  `}
                >
                  <div className="px-6 pb-8 pt-4">
                    <div className="h-px w-full bg-[var(--texto-secundario)]/30 mb-6"></div>
                    <p className="text-[var(--background)] leading-7 whitespace-pre-line text-[15px] font-medium opacity-90">
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