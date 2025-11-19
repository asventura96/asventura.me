// src/components/resume/EducationList.tsx

import { SectionTitle } from '../ui/SectionTitle';
/**
 * CORREÇÃO: Importação corrigida para 'Education' (Maiúsculo).
 * O erro no terminal confirmou que o modelo exportado pelo Prisma Client é 'Education'.
 */
import { Education } from '@prisma/client';

// === Definição de Tipos ===

interface EducationListProps {
  /**
   * Array de objetos do tipo Education.
   * Garante tipagem estrita para course_name, institution, dates, etc.
   */
  education: Education[];
}

/**
 * Componente: EducationList
 * ----------------------------------------------------------------------
 * Renderiza a lista cronológica de formação acadêmica.
 * * @param {EducationListProps} props - Lista de formações vinda do banco.
 */
export function EducationList({ education }: EducationListProps) {
  return (
    <section className="mb-12">
      <SectionTitle title="Formação Acadêmica" />
      
      <div className="space-y-6">
        {education.map((edu) => (
          <div key={edu.id} className="pl-4 border-l-2 border-[color:var(--acento-laranja)]">
            
            {/* Nome do Curso */}
            <h3 className="text-lg text-texto-principal">
              {edu.course_name}
            </h3>
            
            {/* Instituição */}
            <p className="font-medium text-texto-secundario">
              {edu.institution}
            </p>
            
            {/* Nível e Status */}
            <p className="text-sm text-texto-secundario opacity-80">
              {edu.level} · {edu.status}
            </p>
            
            {/* Período (Início - Fim/Atual) */}
            <p className="text-sm text-texto-secundario opacity-80">
              {edu.start_date} - {edu.end_date || 'Atual'}
            </p>
            
            {/* Descrição (opcional) */}
            {edu.description && (
              <p className="mt-2 text-texto-principal text-sm">
                {edu.description}
              </p>
            )}
            
          </div>
        ))}
      </div>
    </section>
  );
}