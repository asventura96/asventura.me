// src/components/resume/ExperienceTimeline.tsx
"use client"

/**
 * Timeline de experiências profissionais.
 * Estrutura orientada a usabilidade:
 * - Cards expansíveis para reduzir carga cognitiva.
 * - Ordenação automática das experiências por data.
 * - Indicadores visuais de estado (expandido/colapsado).
 * - Componentização simples para fácil manutenção.
 */

import { useState, useMemo } from "react"
import { Briefcase, Calendar, MapPin, ChevronDown } from "lucide-react"

interface Experience {
  id: number
  company: string
  role: string
  start_date: string | Date | null
  end_date?: string | Date | null
  location?: string | null
  description: string
}

interface TimelineProps {
  experiences: Experience[]
}

/**
 * Converte datas para formato legível.
 * Mantém fallback seguro caso o valor recebido seja inválido.
 */
const formatDate = (dateValue: string | Date | null | undefined): string => {
  if (!dateValue) return ""
  try {
    const date = new Date(dateValue)
    if (isNaN(date.getTime())) return String(dateValue)
    return new Intl.DateTimeFormat("pt-BR", {
      month: "short",
      year: "numeric",
    }).format(date)
  } catch {
    return String(dateValue)
  }
}

export function ExperienceTimeline({ experiences }: TimelineProps) {
  /**
   * Ordena as experiências colocando primeiro as mais recentes.
   * Critérios:
   * - Experiências em andamento (sem end_date) ficam no topo.
   * - Demais ordenadas por end_date desc.
   */
  const sortedExperiences = useMemo(() => {
    return [...experiences].sort((a, b) => {
      if (!a.end_date && b.end_date) return -1
      if (a.end_date && !b.end_date) return 1
      if (!a.end_date && !b.end_date) return 0

      return new Date(b.end_date!).getTime() - new Date(a.end_date!).getTime()
    })
  }, [experiences])

  /**
   * Controla qual card está expandido.
   * Default: primeira experiência da lista ordenada.
   */
  const [expandedId, setExpandedId] = useState<number | null>(
    sortedExperiences[0]?.id || null
  )

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section className="relative space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 rounded-xl bg-muted text-foreground border border-border">
          <Briefcase size={24} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-medium text-foreground tracking-tight">
          Experiência Profissional
        </h3>
      </div>

      {/* Eixo vertical da timeline (visível apenas em telas médias+) */}
      <div className="absolute left-[19px] top-24 bottom-4 w-[2px] bg-[var(--acento-roxo)]/20 hidden md:block"></div>

      <div className="space-y-8">
        {sortedExperiences.map((exp) => {
          const isExpanded = expandedId === exp.id

          return (
            <div key={exp.id} className="relative md:pl-16 group">
              {/* Ponto do eixo */}
              <div
                className={`absolute left-[14px] top-6 w-3 h-3 rounded-full border-[3px] z-10 hidden md:block transition-all duration-300 ${
                  isExpanded
                    ? "border-background bg-[var(--acento-laranja)] scale-125 shadow-md"
                    : "border-background bg-[var(--acento-roxo)] group-hover:bg-[var(--acento-roxo)]"
                }`}
              ></div>

              {/* Card principal */}
              <div
                className={`relative rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden group border bg-card text-card-foreground ${
                  isExpanded
                    ? "border-[var(--acento-laranja)] shadow-lg shadow-[var(--acento-laranja)]/5 -translate-y-1"
                    : "border-border hover:border-[var(--acento-roxo)] hover:shadow-md"
                }`}
                onClick={() => toggleExpand(exp.id)}
                role="button"
                aria-expanded={isExpanded}
              >
                {/* Header do card */}
                <div className="p-6 flex flex-col md:flex-row gap-4 justify-between items-start relative z-10">
                  {/* Área principal: role + empresa */}
                  <div className="space-y-1 flex-1">
                    <h4 className="text-lg font-medium text-foreground">
                      {exp.role}
                    </h4>
                    <div className="text-base font-medium text-[var(--acento-roxo)]">
                      {exp.company}
                    </div>
                  </div>

                  {/* Datas, localização e seta */}
                  <div className="flex items-start gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex flex-col md:items-end gap-2 text-sm">
                      {/* Datas */}
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-foreground whitespace-nowrap">
                        <Calendar size={14} className="text-[var(--acento-roxo)]" />
                        <span className="font-medium">
                          {formatDate(exp.start_date)} —{' '}
                          {exp.end_date ? formatDate(exp.end_date) : 'Atualmente'}
                        </span>
                      </div>

                      {/* Localização opcional */}
                      {exp.location && (
                        <div className="flex items-center gap-1.5 px-1 text-muted-foreground font-medium">
                          <MapPin size={14} className="text-[var(--acento-laranja)]" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Seta indicadora de expansão */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 border ${
                        isExpanded
                          ? "bg-[var(--acento-laranja)] border-[var(--acento-laranja)] text-white rotate-180"
                          : "bg-transparent border-border text-muted-foreground group-hover:border-[var(--acento-roxo)] group-hover:text-[var(--acento-roxo)]"
                      }`}
                    >
                      <ChevronDown size={18} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                {/* Área expandida */}
                <div
                  className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${
                    isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-8 pt-4">
                    <div className="h-px w-full bg-border mb-6"></div>
                    <p className="text-muted-foreground leading-7 whitespace-pre-line text-[15px] font-normal text-justify">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}