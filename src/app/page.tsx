// src/app/page.tsx (Versão Final com Ordenação Correta)

import { prisma } from '@/lib/prismaClient';
import Link from 'next/link';
import Image from 'next/image'; 

// --- 1. FUNÇÕES AUXILIARES (PARA IDADE, SIGNO, GRUPOS) ---
// ... (Estas funções não mudam)
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

// --- NOVA FUNÇÃO AUXILIAR PARA ORDENAR DATAS 'mm/aaaa' ---
function sortEntriesByDate(entries: any[], dateField: string) {
  // Converte "mm/aaaa" num número (ex: "08/2021" -> 202108)
  const toSortableNumber = (dateString: string): number => {
    if (!dateString || !dateString.includes('/')) {
      return 0; // Coloca itens sem data no fim
    }
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
    // Ordena do maior (mais recente) para o menor (mais antigo)
    return dateB - dateA; 
  });
}


// --- 2. FUNÇÃO DE BUSCA DE DADOS (ATUALIZADA COM ORDENAÇÃO) ---
async function getData() {
  try {
    const profile = await prisma.profile.findFirst({ where: { id: 1 } });
    
    // 1. Busca os dados (sem ordenação do banco)
    const experiences = await prisma.experiences.findMany();
    const skills = await prisma.skills.findMany({ orderBy: { category: 'asc' } });
    const education = await prisma.education.findMany();
    const courses = await prisma.course.findMany();
    
    // 2. Ordena os dados em JavaScript (mais recente primeiro)
    const sortedExperiences = sortEntriesByDate(experiences || [], 'start_date');
    const sortedEducation = sortEntriesByDate(education || [], 'start_date');
    const sortedCourses = sortEntriesByDate(courses || [], 'date'); // Usa o campo 'date'

    return {
      profile: profile,
      skills: skills || [],
      experiences: sortedExperiences, // Retorna os dados ordenados
      education: sortedEducation,   // Retorna os dados ordenados
      courses: sortedCourses      // Retorna os dados ordenados
    };

  } catch (error) {
    console.error("Erro ao buscar dados do banco:", error);
    return {
      profile: null, skills: [], experiences: [], education: [], courses: []
    };
  }
}

// --- 3. O COMPONENTE (PÁGINA PÚBLICA - Sem mudanças no HTML) ---
export default async function Home() {
  
  // Busca TODOS os dados (já ordenados pela getData)
  const { profile, skills, experiences, education, courses } = await getData();
  
  if (!profile) {
    // ... (código de erro - sem mudanças)
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <main className="w-full max-w-3xl p-8 bg-white dark:bg-zinc-900 shadow-xl rounded-xl">
          <h1 className="text-3xl font-bold text-red-500">Erro ao carregar perfil.</h1>
          <p className="dark:text-white">Não foi possível conectar ao banco de dados ou o perfil (ID=1) não foi cadastrado.</p>
        </main>
      </div>
    )
  }
  
  const skillsByCategory = groupSkillsByCategory(skills);
  const age = profile.birthdate ? getAge(profile.birthdate) : null;
  const sign = profile.birthdate ? getZodiacSign(profile.birthdate) : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black py-12">
      <main className="w-full max-w-3xl p-8 bg-white dark:bg-zinc-900 shadow-xl rounded-xl">
        
        {/* --- SEÇÃO 1: CABEÇALHO E CONTATO --- */}
        {profile.photo_url && (
          <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-indigo-600 dark:border-indigo-400 shadow-lg">
            <Image
              src={profile.photo_url} 
              alt={`Foto de ${profile.name}`}
              width={128} 
              height={128} 
              className="w-full h-full object-cover" 
              priority 
            />
          </div>
        )}
        <div className="text-center"> 
          <h1 className="text-4xl font-bold text-black dark:text-white">{profile.name}</h1>
          <p className="text-xl text-indigo-600 dark:text-indigo-400 mb-6">{profile.title}</p>
          
          <ul className="text-sm text-gray-700 dark:text-zinc-300 space-y-2 mb-6">
            {profile.location && <li><span>📍</span> {profile.location}</li>}
            {profile.email && <li><Link href={`mailto:${profile.email}`} className="hover:underline"><span>✉️</span> {profile.email}</Link></li>}
            {profile.phone && <li><Link href={`tel:${profile.phone}`} className="hover:underline"><span>📞</span> {profile.phone}</Link></li>}
            {age && profile.marital_status && (
              <li><span>👤</span> {age} anos, {sign}, {profile.marital_status}</li>
            )}
          </ul>
          
          <div className="flex space-x-4 mb-8 justify-center">
            {profile.linkedin_url && (
              <Link href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" 
                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                LinkedIn
              </Link>
            )}
            {profile.github_url && (
              <Link href={profile.github_url} target="_blank" rel="noopener noreferrer" 
                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                GitHub
              </Link>
            )}
            {profile.website_url && (
              <Link href={profile.website_url} target="_blank" rel="noopener noreferrer" 
                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                Site Pessoal
              </Link>
            )}
          </div>
        </div>
        
        {/* --- SEÇÃO 2: SOBRE MIM E OBJETIVOS --- */}
        {profile.personal_summary && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-zinc-100">
              Sobre Mim
            </h2>
            <p className="text-gray-700 dark:text-zinc-300 whitespace-pre-line">{profile.personal_summary}</p>
          </div>
        )}
        
        {profile.professional_objectives && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-zinc-100">
              Objetivos Profissionais
            </h2>
            <p className="text-gray-700 dark:text-zinc-300 whitespace-pre-line">{profile.professional_objectives}</p>
          </div>
        )}

        {/* --- SEÇÃO 3: EXPERIÊNCIA PROFISSIONAL --- */}
        {/* (Agora será renderizado na ordem correta) */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-zinc-100">
            Experiência Profissional
          </h2>
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id} className="pl-4">
                <h3 className="text-lg font-semibold text-black dark:text-white">{exp.role}</h3>
                <p className="font-medium text-gray-800 dark:text-zinc-200">{exp.company}</p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">{exp.period} · {exp.location}</p>
                <p className="mt-2 text-gray-700 dark:text-zinc-300 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- SEÇÃO 4: FORMAÇÃO ACADÊMICA --- */}
        {/* (Agora será renderizado na ordem correta) */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-zinc-100">
            Formação Acadêmica
          </h2>
          <div className="space-y-6">
            {education.map((edu) => (
              <div key={edu.id} className="pl-4">
                <h3 className="text-lg font-semibold text-black dark:text-white">{edu.course_name}</h3>
                <p className="font-medium text-gray-800 dark:text-zinc-200">{edu.institution}</p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  {edu.level} · {edu.status}
                </p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  {edu.start_date} - {edu.end_date || 'Atual'}
                </p>
                {edu.description && (
                   <p className="mt-2 text-gray-700 dark:text-zinc-300 text-sm">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- SEÇÃO 5: CURSOS E CERTIFICAÇÕES --- */}
        {/* (Agora será renderizado na ordem correta) */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-zinc-100">
            Cursos e Certificações
          </h2>
          <div className="space-y-6">
            {courses.map((course) => (
              <div key={course.id} className="pl-4">
                <h3 className="text-lg font-semibold text-black dark:text-white">{course.name}</h3>
                <p className="font-medium text-gray-800 dark:text-zinc-200">{course.institution}</p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  {course.type} · {course.date} {course.workload ? `(${course.workload} horas)` : ''}
                </p>
                {course.skills_acquired && (
                   <p className="mt-2 text-gray-700 dark:text-zinc-300 text-sm">
                    <strong>Competências:</strong> {course.skills_acquired}
                   </p>
                )}
                {course.url && (
                   <Link href={course.url} target="_blank" rel="noopener noreferrer" 
                         className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                     Ver Certificado &rarr;
                   </Link>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* --- SEÇÃO 6: COMPETÊNCIAS --- */}
        {/* (Esta seção é ordenada por Categoria, o que está correto) */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-zinc-100">
            Competências
          </h2>
          <div className="space-y-6">
            {Object.keys(skillsByCategory).map((category) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                  {category}
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {skillsByCategory[category].map((skill) => (
                    <li key={skill.id} className="text-gray-700 dark:text-zinc-300">
                      <strong className="font-semibold text-black dark:text-white">{skill.name}:</strong> {skill.description}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
      </main>
    </div>
  );
}