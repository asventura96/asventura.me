// src/components/resume/EducationList.tsx

/**
 * @description Componente para exibição da formação acadêmica.
 * Exibe os cursos em cards com datas formatadas precisamente (Mês/Ano).
 * @author André Ventura
 */

import { GraduationCap, Calendar } from 'lucide-react';
import { Education } from '@prisma/client';

interface EducationListProps {
  education: Education[];
}

/**
 * Formata datas para o padrão "MM/YYYY".
 * Se a conversão falhar (ex: string já formatada), retorna o valor original.
 */
const formatMonthYear = (dateValue: string | Date | null | undefined) => {
  if (!dateValue) return '';
  try {
    const date = new Date(dateValue);
    // Se não for uma data válida, retorna a string original (pode já estar em MM/YYYY)
    if (isNaN(date.getTime())) return String(dateValue);
    
    return new Intl.DateTimeFormat('pt-BR', { 
      month: '2-digit', 
      year: 'numeric' 
    }).format(date);
  } catch {
    return String(dateValue);
  }
};

export function EducationList({ education }: EducationListProps) {
  return (
    <section className="relative space-y-8">
      {/* Título da Seção */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-xl bg-[var(--texto-secundario)]/20 text-[var(--background)] border border-[var(--background)]/10">
          <GraduationCap size={24} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-bold text-[var(--background)] tracking-tight">Formação Acadêmica</h3>
      </div>

      <div className="space-y-8">
        {education.map((edu) => (
          <div 
            key={edu.id} 
            className="group relative p-4 rounded-xl bg-white border border-[var(--texto-secundario)]/20 hover:border-[var(--acento-verde)]/50 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            {/* Indicador lateral colorido (Hover Effect) */}
            <div className="absolute left-0 top-4 bottom-4 w-1 bg-[var(--acento-verde)] rounded-r opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="pl-2 space-y-1">
              {/* Nome do Curso: Azul Escuro */}
              <h4 className="font-bold text-[var(--background)] leading-tight text-[15px]">
                {edu.course_name}
              </h4>
              
              {/* Instituição: Roxo para destaque */}
              <div className="text-sm font-bold text-[var(--acento-roxo)]">
                {edu.institution}
              </div>

              {/* Meta-dados: Nível, Status e Data */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--background)]/70 pt-2 mt-2 border-t border-[var(--texto-secundario)]/10">
                
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[var(--foreground)] border border-[var(--texto-secundario)]/20 font-medium">
                    {edu.level}
                  </span>
                  {edu.status && (
                    <span className="text-[var(--acento-laranja)] font-medium">
                      • {edu.status}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1 font-medium">
                  <Calendar size={12} className="text-[var(--acento-laranja)]" />
                  <span>
                    {/* Aplicação da correção de data MM/YYYY */}
                    {formatMonthYear(edu.start_date)} - {edu.end_date ? formatMonthYear(edu.end_date) : 'Atual'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}