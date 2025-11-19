// src/components/resume/CourseList.tsx

import Link from 'next/link';
import { SectionTitle } from '../ui/SectionTitle';
/**
 * CORREÇÃO CRÍTICA:
 * O erro do terminal confirmou que o modelo no Prisma se chama 'Course' (Maiúsculo).
 * Diferente do 'profile' (minúsculo). A importação exata resolve a herança de tipos.
 */
import { Course } from '@prisma/client';

// === Definições de Tipos ===

/**
 * Define a estrutura da relação 'skills' carregada via 'include' no Prisma.
 */
type CourseSkillRelation = {
  skill: {
    name: string;
  };
};

/**
 * Extensão do tipo base 'Course' (do Prisma) para suportar o relacionamento de skills.
 * Ao estender 'Course' corretamente, as propriedades id, name, institution, etc., são herdadas.
 */
interface CourseWithRelations extends Course {
  skills?: CourseSkillRelation[];
}

interface CourseListProps {
  courses: CourseWithRelations[];
}

/**
 * Componente: CourseList
 * ----------------------------------------------------------------------
 * Renderiza a lista de certificações.
 * Mantém a compatibilidade entre a nova estrutura relacional (skills) e a estrutura legada.
 * * @param {CourseListProps} props - Lista de cursos tipada com CourseWithRelations.
 */
export function CourseList({ courses }: CourseListProps) {
  return (
    <section className="mb-12">
      <SectionTitle title="Cursos e Certificações" />
      
      <div className="space-y-6">
        {courses.map((course) => (
          <div key={course.id} className="pl-4 border-l-2 border-[color:var(--acento-laranja)]">
            
            {/* As propriedades abaixo agora serão reconhecidas porque 'Course' foi importado corretamente */}
            <h3 className="text-lg text-texto-principal">{course.name}</h3>
            <p className="font-medium text-texto-secundario">{course.institution}</p>
            
            <p className="text-sm text-texto-secundario opacity-80">
              {course.type} · {course.date} {course.workload ? `(${course.workload} horas)` : ''}
            </p>
            
            {/* Renderização condicional de Skills (Relacional vs Legado) */}
            {course.skills && course.skills.length > 0 ? (
              <p className="mt-2 text-texto-principal text-sm">
                <strong>Competências:</strong>{' '}
                {course.skills.map((s) => s.skill.name).join(', ')}
              </p>
            ) : course.skills_acquired ? (
              <p className="mt-2 text-texto-principal text-sm">
                <strong>Competências:</strong> {course.skills_acquired}
              </p>
            ) : null}

            {course.url && (
              <Link 
                href={course.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium text-[color:var(--acento-verde)] hover:underline block mt-1"
              >
                Ver Certificado &rarr;
              </Link>
            )}
            
          </div>
        ))}
      </div>
    </section>
  );
}