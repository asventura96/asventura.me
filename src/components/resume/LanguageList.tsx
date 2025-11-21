// src/components/resume/LanguageList.tsx

/**
 * @description Componente para exibição de idiomas com barra de proficiência.
 * Corrigido: Cores adaptáveis para Dark/Light mode.
 * @author André Ventura
 *
 * NOTAS:
 * - Estrutura simples: título + lista de idiomas + barra de proficiência.
 * - As cores foram ajustadas para usar tokens do tema (bg-muted, text-foreground, etc).
 * - getLevelWidth é usado para traduzir texto em largura Tailwind.
 */

import { Languages } from "lucide-react";
import { Language } from "@prisma/client";

interface LanguageListProps {
  languages: Language[];
}

/**
 * Mapeia o nível do idioma para a largura da barra.
 * Mantém lógica defensiva baseada em includes para evitar edge cases.
 */
const getLevelWidth = (level: string) => {
  const normalized = level.toLowerCase();

  if (normalized.includes("nativo") || normalized.includes("fluente"))
    return "w-full";

  if (normalized.includes("avançado")) return "w-3/4";

  if (normalized.includes("intermediário")) return "w-1/2";

  return "w-1/3"; // fallback para Básico
};

export function LanguageList({ languages }: LanguageListProps) {
  return (
    <section className="mb-12">
      {/* Cabeçalho da seção */}
      <div className="flex items-center gap-3 mb-6">
        {/* Ícone adaptado ao tema */}
        <div className="p-2 rounded-lg bg-muted text-foreground">
          <Languages size={20} />
        </div>

        <h3 className="text-xl font-medium text-foreground">Idiomas</h3>
      </div>

      {/* Lista de idiomas */}
      <div className="grid grid-cols-1 gap-3">
        {languages.map((lang) => (
          <div
            key={lang.id}
            className="bg-card text-card-foreground p-3 rounded-xl border border-border shadow-sm"
          >
            {/* Header com nome e nível */}
            <div className="flex justify-between items-center mb-2">
              <strong className="text-foreground font-medium">{lang.name}</strong>

              {/* Mantém destaque visual do nível */}
              <span className="text-xs font-medium text-[var(--acento-roxo)] uppercase tracking-wider">
                {lang.level}
              </span>
            </div>

            {/* Barra de proficiência */}
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-[var(--acento-laranja)] to-[var(--acento-verde)] rounded-full ${getLevelWidth(
                  lang.level
                )}`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}