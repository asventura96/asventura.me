// src/components/resume/SkillList.tsx

/**
 * @file src/components/resume/SkillList.tsx
 * @description Componente que renderiza as competências técnicas em formato de Grid Interativo.
 * Implementa funcionalidade de Tooltip/Popover para exibir a descrição detalhada da skill ao clicar ou passar o mouse.
 * @author André Ventura
 */

'use client';

import { useState } from 'react';
import { Code2, Database, Layout, Server, Terminal, Wrench, Info } from 'lucide-react';
import { skills } from '@prisma/client';

interface SkillListProps {
  /**
   * Dicionário de skills agrupadas por categoria.
   * Chave: Nome da Categoria. Valor: Array de skills.
   */
  skillsByCategory: Record<string, skills[]>;
}

/**
 * Retorna o ícone adequado baseado no nome da categoria.
 */
const getIconForCategory = (category: string) => {
  const normalized = category.toLowerCase();
  if (normalized.includes('back')) return <Server size={18} />;
  if (normalized.includes('front')) return <Layout size={18} />;
  if (normalized.includes('dados') || normalized.includes('sql')) return <Database size={18} />;
  if (normalized.includes('infra') || normalized.includes('devops')) return <Terminal size={18} />;
  if (normalized.includes('ferramenta') || normalized.includes('plataforma')) return <Wrench size={18} />;
  return <Code2 size={18} />;
};

export function SkillList({ skillsByCategory }: SkillListProps) {
  // Estado para controlar qual skill está exibindo sua descrição (tooltip)
  const [activeSkillId, setActiveSkillId] = useState<number | null>(null);

  const handleInteraction = (id: number) => {
    // Se já estiver ativo, fecha. Se não, abre o novo.
    setActiveSkillId(activeSkillId === id ? null : id);
  };

  return (
    <section className="space-y-8">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-[var(--texto-secundario)]/10 text-[var(--background)]">
          <Code2 size={20} />
        </div>
        <h3 className="text-xl font-bold text-[var(--background)]">Habilidades</h3>
      </div>

      {Object.entries(skillsByCategory).map(([category, list]) => (
        <div key={category} className="space-y-4">
          
          {/* Título da Categoria */}
          <div className="flex items-center gap-2 text-[var(--background)] border-b border-[var(--texto-secundario)]/20 pb-2">
            <span className="text-[var(--acento-roxo)]">
              {getIconForCategory(category)}
            </span>
            <h4 className="font-bold text-sm uppercase tracking-wider opacity-80">
              {category}
            </h4>
          </div>

          {/* Grid de Badges Interativos */}
          <div className="flex flex-wrap gap-3">
            {list.map((skill) => {
              const isActive = activeSkillId === skill.id;

              return (
                <div key={skill.id} className="relative group">
                  
                  {/* Botão do Badge (Chip) */}
                  <button
                    onClick={() => handleInteraction(skill.id)}
                    className={`
                      relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border
                      ${isActive 
                        ? 'bg-[var(--background)] text-[var(--branco)] border-[var(--background)] shadow-md scale-105 z-20' 
                        : 'bg-white text-[var(--background)] border-[var(--texto-secundario)]/30 hover:border-[var(--acento-laranja)] hover:text-[var(--acento-laranja)]'}
                    `}
                  >
                    {skill.name}
                    {/* Indicador visual sutil de que existe informação extra */}
                    {skill.description && (
                      <Info size={12} className={`opacity-50 ${isActive ? 'text-[var(--acento-laranja)]' : ''}`} />
                    )}
                  </button>

                  {/* Tooltip / Popover de Descrição 
                      Renderizado apenas se a skill tiver descrição e estiver ativa.
                  */}
                  {isActive && skill.description && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 z-30 animate-in fade-in zoom-in-95 duration-200">
                      <div className="relative bg-[var(--background)] text-[var(--branco)] text-xs p-3 rounded-xl shadow-xl border border-[var(--acento-laranja)]">
                        
                        {/* Seta do Tooltip */}
                        <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-[var(--background)] border-b border-r border-[var(--acento-laranja)] rotate-45"></div>
                        
                        {/* Conteúdo da Descrição */}
                        <p className="leading-relaxed font-medium">
                          <span className="block text-[var(--acento-laranja)] font-bold mb-1 text-[10px] uppercase tracking-widest">
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