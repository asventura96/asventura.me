// src/components/resume/CourseList.tsx

/**
 * @file src/components/resume/CourseList.tsx
 * @description Componente para listar cursos complementares e certificações.
 * Layout ajustado para lista vertical (um abaixo do outro) para melhor legibilidade.
 * @author André Ventura
 */

import Link from 'next/link';
import { Award, Calendar, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Course } from '@prisma/client';

// === Definições de Tipos ===

type CourseSkillRelation = {
  skill: {
    name: string;
  };
};

interface CourseWithRelations extends Course {
  skills?: CourseSkillRelation[];
}

interface CourseListProps {
  courses: CourseWithRelations[];
}

export function CourseList({ courses }: CourseListProps) {
  return (
    <section className="mb-12">
      {/* Cabeçalho com Ícone e Cor da Marca */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-[var(--texto-secundario)]/10 text-[var(--background)]">
          <Award size={20} />
        </div>
        <h3 className="text-xl font-medium text-[var(--background)]">Cursos e Certificações</h3>
      </div>
      
      {/* Layout alterado de Grid para Flex Column (Vertical) */}
      <div className="flex flex-col gap-4">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="group relative bg-white p-4 rounded-xl border border-[var(--texto-secundario)]/20 hover:border-[var(--acento-laranja)]/50 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                {/* Nome do Curso */}
                <h3 className="text-base font-medium text-[var(--background)] leading-tight group-hover:text-[var(--acento-laranja)] transition-colors">
                  {course.name}
                </h3>
                
                {/* Instituição */}
                <p className="text-sm font-medium text-[var(--acento-roxo)] mt-1">
                  {course.institution}
                </p>
                
                {/* Detalhes: Data, Carga Horária e Tipo */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--background)]/70 mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="text-[var(--acento-laranja)]" />
                    <span>{course.date}</span>
                  </div>
                  
                  {course.workload && (
                    <>
                      <span className="text-[var(--texto-secundario)]">•</span>
                      <span>{course.workload}h</span>
                    </>
                  )}
                  
                  {course.type && (
                     <>
                      <span className="text-[var(--texto-secundario)]">•</span>
                      <span className="uppercase text-[10px] tracking-wider font-semibold px-3 py-1 border border-[var(--acento-roxo)]/30 px-1.5 rounded-sm text-[var(--background)]">
                        {course.type}
                      </span>
                     </>
                  )}
                </div>

                {/* Lista de Competências (Skills) */}
                <div className="mt-3 pt-3 border-t border-[var(--texto-secundario)]/10">
                  {course.skills && course.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {course.skills.map((s, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[var(--foreground)] text-[var(--background)] font-medium border border-[var(--texto-secundario)]/20">
                          {s.skill.name}
                        </span>
                      ))}
                    </div>
                  ) : course.skills_acquired ? (
                     <p className="text-xs text-[var(--background)]/80 italic flex items-center gap-1">
                       <CheckCircle2 size={10} className="text-[var(--acento-verde)]"/>
                       {course.skills_acquired}
                     </p>
                  ) : null}
                </div>
              </div>

              {/* Link do Certificado (Canto superior direito) */}
              {course.url && (
                <Link 
                  href={course.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[var(--texto-secundario)] hover:text-[var(--acento-verde)] p-1 hover:bg-[var(--texto-secundario)]/10 rounded-lg transition-all"
                  title="Ver Certificado"
                >
                  <ExternalLink size={18} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}