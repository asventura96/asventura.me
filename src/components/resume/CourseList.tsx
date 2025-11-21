// src/components/resume/CourseList.tsx

/**
 * Componente responsável por renderizar a lista de cursos e certificações.
 * Mantém foco em legibilidade, componentização e padrões de UI consistentes.
 */

import { Award, Calendar, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Course } from '@prisma/client';

// Tipos auxiliares para relacionamentos de habilidades anexadas ao curso

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
      {/* Cabeçalho com ícone da categoria */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-muted text-foreground">
          <Award size={20} />
        </div>
        <h3 className="text-xl font-medium text-foreground">Cursos e Certificações</h3>
      </div>

      {/* Lista vertical de cursos */}
      <div className="flex flex-col gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group relative bg-card text-card-foreground p-4 rounded-xl border border-border hover:border-[var(--acento-laranja)]/50 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                {/* Título do curso */}
                <h3 className="text-base font-medium text-foreground leading-tight group-hover:text-[var(--acento-laranja)] transition-colors">
                  {course.name}
                </h3>

                {/* Instituição responsável */}
                <p className="text-sm font-medium text-[var(--acento-roxo)] mt-1">
                  {course.institution}
                </p>

                {/* Dados principais do curso */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="text-[var(--acento-laranja)]" />
                    <span>{course.date}</span>
                  </div>

                  {/* Carga horária opcional */}
                  {course.workload && (
                    <>
                      <span className="text-muted-foreground/50">•</span>
                      <span>{course.workload}h</span>
                    </>
                  )}

                  {/* Tipo de curso (badge) */}
                  {course.type && (
                    <>
                      <span className="text-muted-foreground/50">•</span>
                      <span className="uppercase text-[10px] tracking-wider font-semibold px-3 py-1 border border-[var(--acento-roxo)]/30 rounded-sm text-foreground">
                        {course.type}
                      </span>
                    </>
                  )}
                </div>

                {/* Lista de habilidades desenvolvidas ou adquiridas */}
                <div className="mt-3 pt-3 border-t border-border">
                  {course.skills && course.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {course.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-muted text-foreground font-medium border border-border"
                        >
                          {s.skill.name}
                        </span>
                      ))}
                    </div>
                  ) : course.skills_acquired ? (
                    <p className="text-xs text-muted-foreground italic flex items-center gap-1">
                      <CheckCircle2 size={10} className="text-[var(--acento-verde)]" />
                      {course.skills_acquired}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Link externo para certificado */}
              {course.url && (
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[var(--acento-verde)] p-1 hover:bg-muted rounded-lg transition-all"
                  title="Ver Certificado"
                >
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
