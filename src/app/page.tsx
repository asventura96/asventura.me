// src/app/page.tsx (Corrigido com Títulos Verdes e Ícones)

import { prisma } from '@/lib/prismaClient';
import Link from 'next/link';
import Image from 'next/image'; 

// --- 1. FUNÇÕES AUXILIARES (Sem mudanças) ---
function getAge(birthDate: Date): number | null {
  if (!birthDate) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function getZodiacSign(birthDate: Date): string {
  if (!birthDate) return "---";
  const day = birthDate.getDate() + 1; 
  const month = birthDate.getMonth() + 1;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquário ♒";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Peixes ♓";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Áries ♈";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Touro ♉";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gêmeos ♊";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Câncer ♋";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leão ♌";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgem ♍";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra ♎";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Escorpião ♏";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagitário ♐";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricórnio ♑";
  return "---";
}

function groupSkillsByCategory(skills: any[]) {
  return skills.reduce((acc, skill) => {
    const category = skill.category || 'Outras';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, any[]>);
}

function sortEntriesByDate(entries: any[], dateField: string) {
  const toSortableNumber = (dateString: string): number => {
    if (!dateString || !dateString.includes('/')) { return 0; }
    const parts = dateString.split('/');
    if (parts.length !== 2) return 0;
    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);
    if (isNaN(month) || isNaN(year)) return 0;
    return year * 100 + month;
  };
  return entries.sort((a, b) => {
    const dateA = toSortableNumber(a[dateField]);
    const dateB = toSortableNumber(b[dateField]);
    return dateB - dateA; 
  });
}

// --- 2. FUNÇÃO DE BUSCA DE DADOS (Sem mudanças) ---
async function getData() {
  try {
    const profile = await prisma.profile.findFirst({ where: { id: 1 } });
    const skills = await prisma.skills.findMany({ orderBy: { category: 'asc' } });
    const experiences = await prisma.experiences.findMany();
    const education = await prisma.education.findMany();
    const courses = await prisma.course.findMany();
    const languages = await prisma.language.findMany({
      orderBy: { name: 'asc' } 
    }); 

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

// --- FUNÇÃO AUXILIAR PARA TÍTULOS DE SEÇÃO (CORRIGIDA) ---
function SectionTitle({ title }: { title: string }) {
  return (
    // --- MUDANÇA AQUI: Trocamos o laranja pelo VERDE ---
    <h2 className="text-2xl mb-6 uppercase tracking-widest text-[color:var(--acento-verde)] border-b-2 border-[color:var(--acento-verde)] pb-2">
      {title}
    </h2>
  )
}

// --- 3. O COMPONENTE (PÁGINA PÚBLICA) ---
export default async function Home() {

  const { profile, skills, experiences, education, courses, languages } = await getData();

  if (!profile) {
    // ... (código de erro - sem mudanças)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <main className="w-full max-w-3xl p-8">
          <h1 className="text-3xl text-red-500">Erro ao carregar perfil.</h1>
          <p>Não foi possível conectar ao banco de dados ou o perfil (ID=1) não foi cadastrado.</p>
        </main>
      </div>
    )
  }

  const skillsByCategory = groupSkillsByCategory(skills);
  const age = profile.birthdate ? getAge(profile.birthdate) : null;
  const sign = profile.birthdate ? getZodiacSign(profile.birthdate) : null;

  return (
    <div className="max-w-6xl mx-auto p-8 md:p-12 lg:p-16">
      <div className="lg:grid lg:grid-cols-3 lg:gap-16">

        {/* --- COLUNA DA ESQUERDA (STICKY) --- */}
        <header className="lg:sticky lg:top-12 lg:h-screen lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left">

          {profile.photo_url && (
            <div className="w-40 h-40 mb-6 rounded-full overflow-hidden border-4 border-[color:var(--acento-verde)] shadow-lg">
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

          <h1 className="text-4xl text-[color:var(--acento-verde)]">
            {profile.name}
          </h1>
          <p className="text-xl text-[color:var(--texto-secundario)] mt-2">
            {profile.title}
          </p>

          <ul className="text-sm text-[color:var(--texto-secundario)] space-y-2 mt-8">
            {profile.location && <li><i className="fa-solid fa-location-dot w-6 text-center text-[color:var(--acento-verde)]"></i> {profile.location}</li>}
            {profile.email && <li><Link href={`mailto:${profile.email}`} className="hover:text-[color:var(--acento-laranja)]"><i className="fa-solid fa-envelope w-6 text-center text-[color:var(--acento-verde)]"></i> {profile.email}</Link></li>}
            {profile.phone && <li><Link href={`tel:${profile.phone}`} className="hover:text-[color:var(--acento-laranja)]"><i className="fa-solid fa-phone w-6 text-center text-[color:var(--acento-verde)]"></i> {profile.phone}</Link></li>}
            {age && profile.marital_status && (
              <li><i className="fa-solid fa-user w-6 text-center text-[color:var(--acento-verde)]"></i> {age} anos, {sign}, {profile.marital_status}</li>
            )}
          </ul>

          {/* --- MUDANÇA AQUI: LINKS SOCIAIS COM ÍCONES --- */}
          <div className="flex space-x-6 mt-8 justify-center lg:justify-start">
            {profile.linkedin_url && (
              <Link href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" 
                    className="text-[color:var(--texto-secundario)] hover:text-[color:var(--acento-laranja)] text-3xl"
                    aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </Link>
            )}
            {profile.github_url && (
              <Link href={profile.github_url} target="_blank" rel="noopener noreferrer" 
                    className="text-[color:var(--texto-secundario)] hover:text-[color:var(--acento-laranja)] text-3xl"
                    aria-label="GitHub">
                <i className="fab fa-github"></i>
              </Link>
            )}
            {profile.website_url && (
              <Link href={profile.website_url} target="_blank" rel="noopener noreferrer" 
                    className="text-[color:var(--texto-secundario)] hover:text-[color:var(--acento-laranja)] text-3xl"
                    aria-label="Site Pessoal">
                <i className="fas fa-globe"></i>
              </Link>
            )}
          </div>
          <hr className="w-full border-zinc-700 my-12 lg:hidden" />
        </header>

        {/* --- COLUNA DA DIREITA (ROLÁVEL) --- */}
        <main className="lg:col-span-2">

          {/* --- 1. SOBRE MIM --- */}
          {profile.personal_summary && (
            <section className="mb-12">
              <SectionTitle title="Sobre Mim" />
              <p className="text-texto-principal whitespace-pre-line">{profile.personal_summary}</p>
            </section>
          )}

          {/* --- 2. OBJETIVOS PROFISSIONAIS --- */}
          {profile.professional_objectives && (
            <section className="mb-12">
              <SectionTitle title="Objetivos Profissionais" />
              <p className="text-texto-principal whitespace-pre-line">{profile.professional_objectives}</p>
            </section>
          )}

          {/* --- 3. FORMAÇÃO ACADÊMICA --- */}
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

          {/* --- 4. IDIOMAS --- */}
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

          {/* --- 5. EXPERIÊNCIA PROFISSIONAL --- */}
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

          {/* --- 6. HABILIDADES E COMPETÊNCIAS --- */}
          <section className="mb-12">
            <SectionTitle title="Habilidades e Competências" />
            <div className="space-y-6">
              {Object.keys(skillsByCategory).map((category) => (
                <div key={category}>
                  {/* Sub-título da Categoria em Laranja */}
                  <h3 className="text-lg text-[color:var(--acento-laranja)] mb-2">
                    {category}
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {skillsByCategory[category].map((skill) => (
                      <li key={skill.id} className="text-texto-principal">
                        <strong className="font-semibold text-texto-secundario">{skill.name}:</strong> {skill.description}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* --- 7. CURSOS E CERTIFICAÇÕES --- */}
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