// src/components/resume/EducationList.tsx

/**
 * Componente responsável por exibir a formação acadêmica do usuário.
 * Foco em organização visual, semântica clara e estrutura consistente com o restante do projeto.
 */

import { GraduationCap, Calendar } from 'lucide-react';
import { Education } from '@prisma/client';

interface EducationListProps {
  education: Education[];
}

/**
 * Converte datas para o formato brasileiro MM/YYYY.
 * Mantém fallback seguro caso a data seja inválida.
 */
const formatMonthYear = (dateValue: string | Date | null | undefined) => {
  if (!dateValue) return '';

  try {
    const date = new Date(dateValue);

    // Fallback defensivo caso a data não seja válida
    if (isNaN(date.getTime())) return String(dateValue);

    return new Intl.DateTimeFormat('pt-BR', {
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return String(dateValue);
  }
};

export function EducationList({ education }: EducationListProps) {
  return (
    <section className="relative space-y-8">
      {/* Cabeçalho da seção */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-xl bg-muted text-foreground border border-border">
          <GraduationCap size={24} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-medium text-foreground tracking-tight">
          Formação Acadêmica
        </h3>
      </div>

      {/* Lista vertical de formações */}
      <div className="space-y-8">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="group relative p-4 rounded-xl bg-card text-card-foreground border border-border hover:border-[var(--acento-verde)]/50 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            {/* Indicador lateral com acento visual no hover */}
            <div className="absolute left-0 top-4 bottom-4 w-1 bg-[var(--acento-verde)] rounded-r opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="pl-2 space-y-1">
              {/* Nome do curso */}
              <h4 className="text-lg font-medium transition-colors text-foreground">
                {edu.course_name}
              </h4>

              {/* Instituição */}
              <div className="text-base font-medium text-[var(--acento-roxo)]">
                {edu.institution}
              </div>

              {/* Informações adicionais (nível, status e datas) */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-2 mt-2 border-t border-border">
                {/* Nível e status */}
                <div className="flex items-center gap-2">
                  {/* Badge do nível */}
                  <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border font-medium text-foreground">
                    {edu.level}
                  </span>

                  {/* Status opcional */}
                  {edu.status && (
                    <span className="flex items-center gap-1.5 px-1 text-muted-foreground font-medium">
                      • {edu.status}
                    </span>
                  )}
                </div>

                {/* Período do curso */}
                <div className="flex items-center gap-1.5 px-1 text-muted-foreground font-medium">
                  <Calendar size={14} className="text-[var(--acento-laranja)]" />
                  <span>
                    {formatMonthYear(edu.start_date)} -{' '}
                    {edu.end_date ? formatMonthYear(edu.end_date) : 'Atual'}
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