// src/components/resume/LanguageList.tsx

import { SectionTitle } from '../ui/SectionTitle';
/**
 * Importação do tipo gerado pelo Prisma.
 * Segue o padrão PascalCase ('Language') identificado nos modelos 'Course' e 'Education'.
 */
import { Language } from '@prisma/client';

// === Definição de Tipos ===

interface LanguageListProps {
  /**
   * Lista de idiomas.
   * O tipo 'Language' garante que as propriedades 'name' e 'level' (e ID)
   * estejam estritamente tipadas conforme o schema do banco.
   */
  languages: Language[];
}

/**
 * Componente: LanguageList
 * ----------------------------------------------------------------------
 * Renderiza a lista de proficiência em idiomas.
 * Layout compacto para fácil leitura visual.
 * * @param {LanguageListProps} props - Lista de idiomas vinda do banco.
 */
export function LanguageList({ languages }: LanguageListProps) {
  return (
    <section className="mb-12">
      <SectionTitle title="Idiomas" />
      
      <div className="space-y-2 pl-4">
        {languages.map((lang) => (
          <p key={lang.id} className="text-texto-principal">
            
            {/* Nome do Idioma (Ex: Inglês) */}
            <strong className="font-semibold text-texto-secundario">
              {lang.name}:
            </strong>{" "}
            
            {/* Nível de Proficiência (Ex: Avançado) */}
            {lang.level}
            
          </p> 
        ))}
      </div>
    </section>
  );
}