// src/components/resume/SkillList.tsx

/**
 * Componente de grid interativo para exibir habilidades técnicas agrupadas por categoria.
 * Clean code aplicado, comentários técnicos adicionados e estrutura defensiva preservada.
 */

"use client";

import { useState } from "react";
import {
  Code2,
  Database,
  Layout,
  Server,
  Terminal,
  Wrench,
  Info,
} from "lucide-react";
import { skills } from "@prisma/client";

interface SkillListProps {
  /** Dicionário de skills agrupadas por categoria */
  skillsByCategory: Record<string, skills[]>;
}

/**
 * Retorna o ícone correspondente ao nome da categoria.
 * Usa comparação por palavras-chave para simplificar manutenção.
 */
const getIconForCategory = (category: string) => {
  const normalized = category.toLowerCase();

  if (normalized.includes("back")) return <Server size={18} />;
  if (normalized.includes("front")) return <Layout size={18} />;
  if (normalized.includes("dados") || normalized.includes("sql"))
    return <Database size={18} />;
  if (normalized.includes("infra") || normalized.includes("devops"))
    return <Terminal size={18} />;
  if (normalized.includes("ferramenta") || normalized.includes("plataforma"))
    return <Wrench size={18} />;

  return <Code2 size={18} />;
};

export function SkillList({ skillsByCategory }: SkillListProps) {
  /**
   * Controla qual skill está com tooltip aberto.
   * Mantém UX simples e sem sobreposição de múltiplos popovers.
   */
  const [activeSkillId, setActiveSkillId] = useState<number | null>(null);

  /**
   * Alterna o estado do tooltip ao interagir com um skill.
   */
  const handleInteraction = (id: number) => {
    setActiveSkillId(activeSkillId === id ? null : id);
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-muted text-foreground">
          <Code2 size={20} />
        </div>
        <h3 className="text-xl font-medium text-foreground">Habilidades</h3>
      </div>

      {/* Iteração de categorias */}
      {Object.entries(skillsByCategory).map(([category, list]) => (
        <div key={category} className="space-y-4">
          {/* Título da categoria */}
          <div className="flex items-center gap-2 text-foreground border-b border-border pb-2">
            <span className="text-[var(--acento-roxo)]">{getIconForCategory(category)}</span>
            <h4 className="font-medium text-sm uppercase tracking-wider opacity-80">
              {category}
            </h4>
          </div>

          {/* Grid de badges interativos */}
          <div className="flex flex-wrap gap-3">
            {list.map((skill) => {
              const isActive = activeSkillId === skill.id;

              return (
                <div key={skill.id} className="relative group">
                  {/* Chip da habilidade */}
                  <button
                    onClick={() => handleInteraction(skill.id)}
                    className={`
                      relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-normal transition-all duration-200 border
                      ${
                        isActive
                          ? "bg-[var(--acento-roxo)] text-white border-[var(--acento-roxo)] shadow-md scale-105 z-20"
                          : "bg-card text-foreground border-border hover:border-[var(--acento-laranja)] hover:text-[var(--acento-laranja)]"
                      }
                    `}
                  >
                    {skill.name}

                    {/* Ícone exibido somente quando há descrição */}
                    {skill.description && (
                      <Info
                        size={12}
                        className={`opacity-50 ${isActive ? "text-white" : ""}`}
                      />
                    )}
                  </button>

                  {/* Tooltip / Popover com descrição técnica da skill */}
                  {isActive && skill.description && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 z-30 animate-in fade-in zoom-in-95 duration-200">
                      <div className="relative bg-popover text-popover-foreground text-xs p-3 rounded-xl shadow-xl border border-border">
                        {/* Marcador visual (seta) */}
                        <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-popover border-b border-r border-border rotate-45"></div>

                        <p className="leading-relaxed font-normal">
                          <span className="block text-[var(--acento-laranja)] font-medium mb-1 text-[10px] uppercase tracking-widest">
                            Detalhes
                          </span>
                          {skill.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}