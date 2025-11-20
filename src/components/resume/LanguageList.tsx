// src/components/resume/LanguageList.tsx

import { Languages } from 'lucide-react';
/**
 * Importação do tipo gerado pelo Prisma.
 * Mantida para garantir Type Safety.
 */
import { Language } from '@prisma/client';

// === Definição de Tipos ===

interface LanguageListProps {
  languages: Language[];
}

/**
 * Auxiliar visual: Define a largura da barra com base no texto do nível.
 */
const getLevelWidth = (level: string) => {
  const normalized = level.toLowerCase();
  if (normalized.includes('nativo') || normalized.includes('fluente')) return 'w-full';
  if (normalized.includes('avançado')) return 'w-3/4';
  if (normalized.includes('intermediário')) return 'w-1/2';
  return 'w-1/3'; // Básico
};

/**
 * Componente: LanguageList
 * ----------------------------------------------------------------------
 * Visual modernizado com barras de proficiência.
 */
export function LanguageList({ languages }: LanguageListProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-[var(--texto-secundario)]/10 text-[var(--background)]">
          <Languages size={20} />
        </div>
        <h3 className="text-xl font-bold text-[var(--background)]">Idiomas</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {languages.map((lang) => (
          <div key={lang.id} className="bg-white p-3 rounded-xl border border-[var(--texto-secundario)]/20 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              {/* Nome do Idioma */}
              <strong className="text-[var(--background)] font-bold">
                {lang.name}
              </strong>
              
              {/* Texto do Nível */}
              <span className="text-xs font-bold text-[var(--acento-verde)] uppercase tracking-wider">
                {lang.level}
              </span>
            </div>

            {/* Barra de Progresso Visual */}
            <div className="h-2 w-full bg-[var(--texto-secundario)]/10 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r from-[var(--acento-verde)] to-[var(--acento-roxo)] rounded-full ${getLevelWidth(lang.level)}`}
              />
            </div>
          </div> 
        ))}
      </div>
    </section>
  );
}