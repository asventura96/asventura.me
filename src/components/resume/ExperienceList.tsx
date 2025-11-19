// src/components/resume/ExperienceList.tsx

import { SectionTitle } from '../ui/SectionTitle';
/**
 * Importação do tipo gerado automaticamente pelo Prisma.
 * Utiliza-se 'experiences' (minúsculo e plural) correspondendo à chamada 'prisma.experiences'
 * identificada na camada de serviço.
 */
import { experiences } from '@prisma/client';

// === Definição de Tipos ===

interface ExperienceListProps {
  /**
   * Lista de experiências profissionais.
   * O tipo 'experiences' do Prisma já contempla os campos opcionais (nullable)
   * como 'location', 'description', 'end_date', eliminando a necessidade de redeclará-los.
   */
  experiences: experiences[];
}

/**
 * Componente: ExperienceList
 * ----------------------------------------------------------------------
 * Renderiza o histórico profissional cronológico.
 * Trata campos opcionais (localização, descrição) para manter o layout limpo.
 * * @param {ExperienceListProps} props - Dados vindos do Server Component.
 */
export function ExperienceList({ experiences }: ExperienceListProps) {
  return (
    <section className="mb-12">
      <SectionTitle title="Experiência Profissional" />
      
      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="pl-4 border-l-2 border-[color:var(--acento-laranja)]">
            
            {/* Cargo / Função */}
            <h3 className="text-lg text-texto-principal">
              {exp.role}
            </h3>
            
            {/* Empresa contratante */}
            <p className="font-medium text-texto-secundario">
              {exp.company}
            </p>
            
            {/* Metadados: Período e Localização */}
            <p className="text-sm text-texto-secundario opacity-80">
              {/* Verifica se location existe antes de renderizar o separador visual */}
              {exp.period} {exp.location ? `· ${exp.location}` : ''}
            </p>

            {/* Descrição das atividades (Renderização Condicional) */}
            {exp.description && (
              <p className="mt-2 text-texto-principal whitespace-pre-line">
                {exp.description}
              </p>
            )}
            
          </div>
        ))}
      </div>
    </section>
  );
}