// src/app/page.tsx
import { prisma } from '@/lib/prismaClient';
import Link from 'next/link';
import Image from 'next/image';
/**
 * Importa o 'invólucro' dinâmico, que é um Client Component
 * seguro para ser usado dentro deste Server Component.
 */
import { DynamicProfileInfo } from '@/components/DynamicProfileInfo';

// === Tipos Globais da Página ===
type SkillId = string | number;

/**
 * Tipagem para a skill (usada por 'groupSkillsByCategory').
 */
interface Skill {
  id: SkillId;
  name: string;
  description: string;
  category?: string | null;
}

type SkillsByCategory = Record<string, Skill[]>;

// === Funções Auxiliares (Servidor) ===

/**
 * Agrupa as skills por categoria para exibição.
 */
function groupSkillsByCategory(skills: Skill[]): SkillsByCategory {
  return skills.reduce<SkillsByCategory>((acc, skill) => {
    const category = (skill.category ?? 'Outras').trim();
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});
}

/**
 * Ordena um array de objetos por um campo de data (ex: "MM/YYYY").
 */
function sortEntriesByDate<T>(entries: T[], dateField: keyof T) {
  const toSortableNumber = (dateValue: unknown): number => {
    if (typeof dateValue !== 'string' || !dateValue || !dateValue.includes('/')) {
      return 0;
    }
    const parts = dateValue.split('/');
    if (parts.length !== 2) return 0;
    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);
    if (isNaN(month) || isNaN(year)) return 0;
    return year * 100 + month;
  };

  return [...entries].sort((a, b) => {
    const dateA = toSortableNumber(a[dateField]);
    const dateB = toSortableNumber(b[dateField]);
    return dateB - dateA;
  });
}

// === Busca de Dados (Servidor) ===

/**
 * Busca todos os dados necessários para a página.
 * Executa em paralelo no servidor.
 */
async function getData() {
  try {
    const [
      profile,
      skills,
      experiences,
      education,
      courses,
      languages
    ] = await Promise.all([
      prisma.profile.findFirst({ where: { id: 1 } }),
      /**
       * FILTRO ESSENCIAL:
       * Busca apenas as skills onde 'showOnProfile' é true.
       * Skills criadas pelos Cursos (com 'false') não aparecerão aqui.
       */
      prisma.skills.findMany({ 
        where: { showOnProfile: true }, 
        orderBy: { category: 'asc' } 
      }),
      prisma.experiences.findMany(),
      prisma.education.findMany(),
      prisma.course.findMany(),
      prisma.language.findMany({ orderBy: { name: 'asc' } })
    ]);

    // Ordenação dos dados no servidor
    const sortedExperiences = sortEntriesByDate(experiences || [], 'start_date');
    const sortedEducation = sortEntriesByDate(education || [], 'start_date');
    const sortedCourses = sortEntriesByDate(courses || [], 'date');

    return {
      profile: profile,
      skills: skills || [],
      experiences: sortedExperiences,
      education: sortedEducation,
      courses: sortedCourses,
      languages: languages || []
    };

  } catch (error) {
    console.error("Erro ao buscar dados do banco:", error);
    return {
      profile: null, skills: [], experiences: [], education: [], courses: [], languages: []
    };
  }
}

// === Componentes Auxiliares (Servidor) ===

interface SectionTitleProps {
  title: string;
}

function SectionTitle({ title }: SectionTitleProps) {
  return (
    <h2 className="text-2xl mb-6 uppercase tracking-widest text-[color:var(--acento-verde)] border-b-2 border-[color:var(--acento-verde)] pb-2">
      {title}
    </h2>
  )
}

// === Componente Principal (Página) ===

export default async function Home() {

  const { profile, skills, experiences, education, courses, languages } = await getData();

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <main className="w-full max-w-3xl p-8">
          <h1 className="text-3xl text-red-500">Erro ao carregar perfil.</h1>
          <p>Não foi possível conectar ao banco de dados ou o perfil (ID=1) não foi cadastrado.</p>
        </main>
      </div>
    )
  }

  // Agrupamento de skills (filtradas)
  const skillsByCategory = groupSkillsByCategory(skills);

  return (
    <div className="max-w-6xl mx-auto p-8 md:p-12 lg:p-16">
      <div className="lg:grid lg:grid-cols-3 lg:gap-16">

        {/* --- COLUNA DA ESQUERDA --- */}
        <header className="lg:sticky lg:top-12 lg:h-screen lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left">

          {profile.photo_url && (
            <div className="w-40 h-40 mb-6 rounded-full overflow-hidden border-4 border-[color:var(--acento-verde)] shadow-lg mx-auto">
              <Image
                src={profile.photo_url}
                alt={`Foto de ${profile.name}`}
                width={160}
                height={160}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          )}

          <h1 className="uppercase text-center text-4xl text-[color:var(--acento-verde)]">
            {profile.name}
          </h1>
          <p className="text-center text-base text-[color:var(--texto-secundario)] mt-2">
            {profile.title}
          </p>

          {/*
           * Renderiza o 'invólucro' (wrapper) que
           * carregará o 'ProfileInfo' apenas no cliente.
           */}
          <DynamicProfileInfo profile={profile} />

          {/* Links Sociais */}
          <div className="flex space-x-6 mt-8 justify-center lg:justify-start">
            {profile.linkedin_url && (
              <Link href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                className="text-[color:var(--acento-verde)] hover:text-[color:var(--acento-laranja)] text-3xl"
                aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </Link>
            )}
            {profile.github_url && (
              <Link href={profile.github_url} target="_blank" rel="noopener noreferrer"
                className="text-[color:var(--acento-verde)] hover:text-[color:var(--acento-laranja)] text-3xl"
                aria-label="GitHub">
                <i className="fab fa-github"></i>
              </Link>
            )}
          </div>
          <hr className="w-full border-zinc-700 my-12 lg:hidden" />
        </header>

        {/* --- COLUNA DA DIREITA --- */}
        <main className="lg:col-span-2">
          
          {/* Seções de Conteúdo (Sobre, Objetivos, etc.) */}
          {profile.personal_summary && (
            <section className="mb-12">
              <SectionTitle title="Sobre Mim" />
              <p className="text-texto-principal whitespace-pre-line">{profile.personal_summary}</p>
            </section>
          )}

          {profile.professional_objectives && (
            <section className="mb-12">
              <SectionTitle title="Objetivos Profissionais" />
              <p className="text-texto-principal whitespace-pre-line">{profile.professional_objectives}</p>
            </section>
          )}

          <section className="mb-12">
            <SectionTitle title="Formação Acadêmica" />
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="pl-4 border-l-2 border-[color:var(--acento-laranja)]">
                  <h3 className="text-lg text-texto-principal">{edu.course_name}</h3>
                  <p className="font-medium text-texto-secundario">{edu.institution}</p>
                  <p className="text-sm text-texto-secundario opacity-80">
                    {edu.level} · {edu.status}
                  </p>
                  <p className="text-sm text-texto-secundario opacity-80">
                    {edu.start_date} - {edu.end_date || 'Atual'}
                  </p>
                  {edu.description && (
                    <p className="mt-2 text-texto-principal text-sm">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <SectionTitle title="Idiomas" />
            <div className="space-y-2 pl-4">
              {languages.map((lang) => (
                <p key={lang.id} className="text-texto-principal">
                  <strong className="font-semibold text-texto-secundario">{lang.name}:</strong> {lang.level}
                </p>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <SectionTitle title="Experiência Profissional" />
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="pl-4 border-l-2 border-[color:var(--acento-laranja)]">
                  <h3 className="text-lg text-texto-principal">{exp.role}</h3>
                  <p className="font-medium text-texto-secundario">{exp.company}</p>
                  <p className="text-sm text-texto-secundario opacity-80">{exp.period} · {exp.location}</p>
                  <p className="mt-2 text-texto-principal whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Habilidades e Competências (Agora filtradas) */}
          <section className="mb-12">
            <SectionTitle title="Habilidades e Competências" />
            <div className="space-y-6">
              {Object.entries(skillsByCategory).map(([category, list]) => (
                <div key={category}>
                  <h3 className="text-lg text-[color:var(--acento-laranja)] mb-2">
                    {category}
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {list.map((skill) => (
                      <li key={skill.id} className="text-texto-principal">
                        <strong className="font-semibold text-texto-secundario">
                          {skill.name}:
                        </strong>{" "}
                        {skill.description}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Cursos e Certificações */}
          <section className="mb-12">
            <SectionTitle title="Cursos e Certificações" />
            <div className="space-y-6">
              {courses.map((course) => (
                <div key={course.id} className="pl-4 border-l-2 border-[color:var(--acento-laranja)]">
                  <h3 className="text-lg text-texto-principal">{course.name}</h3>
                  <p className="font-medium text-texto-secundario">{course.institution}</p>
                  <p className="text-sm text-texto-secundario opacity-80">
                    {course.type} · {course.date} {course.workload ? `(${course.workload} horas)` : ''}
                  </p>
                  {/* TODO: Este campo 'skills_acquired' (legado) deve ser substituído
                       pela nova relação de skills. 
                       'getData()' precisará ser atualizado para incluir 
                       'course.skills.skill.name'
                  */}
                  {course.skills_acquired && (
                    <p className="mt-2 text-texto-principal text-sm">
                      <strong>Competências:</strong> {course.skills_acquired}
                    </p>
                  )}
                  {course.url && (
                    <Link href={course.url} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-medium text-[color:var(--acento-verde)] hover:underline">
                      Ver Certificado &rarr;
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}