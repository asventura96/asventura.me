// src/app/page.tsx (Versão Final para o Público)

import { prisma } from '@/lib/prismaClient';

// --- 1. FUNÇÃO DE BUSCA DE DADOS (Atualizada) ---
async function getData() {
  try {
    const profile = await prisma.profile.findFirst({ where: { id: 1 } });

    // Busca experiências (ordenadas por ID, as mais novas primeiro)
    const experiences = await prisma.experiences.findMany({
      orderBy: { id: 'desc' }
    });

    // Busca competências (ordenadas por Categoria)
    const skills = await prisma.skills.findMany({
      orderBy: { category: 'asc' }
    });

    return {
      profile: profile || { name: "André Ventura", title: "Engenheiro de Computação" },
      skills: skills || [],
      experiences: experiences || []
    };

  } catch (error) {
    console.error("Erro ao buscar dados do banco:", error);
    return {
      profile: { name: "Erro ao carregar", title: "Erro" },
      skills: [],
      experiences: []
    };
  }
}

// --- 2. FUNÇÃO AUXILIAR PARA AGRUPAR SKILLS ---
// (Vamos agrupar as skills por categoria para ficar mais bonito)
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


// --- 3. O COMPONENTE (PÁGINA PÚBLICA) ---
export default async function Home() {

  const { profile, skills, experiences } = await getData();

  // Agrupa as competências
  const skillsByCategory = groupSkillsByCategory(skills);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl p-8 bg-white dark:bg-zinc-900 shadow-xl rounded-xl">

        {/* TÍTULO/PERFIL (Do banco) */}
        <h1 className="text-3xl font-bold text-black dark:text-white">{profile.name}</h1>
        <p className="text-lg text-indigo-600 mb-6">{profile.title}</p>

        {/* SEÇÃO DE EXPERIÊNCIAS (Do banco) */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-zinc-100">
            Experiência Profissional
          </h2>

          <div className="space-y-6">
            {/* O componente 'ExperienceItem' que você tinha
              precisa ser atualizado para receber os novos campos.
              Vamos renderizar direto aqui por enquanto.
            */}
            {experiences.map((exp) => (
              <div key={exp.id} className="border-l-2 border-indigo-600 pl-4">
                <h3 className="text-lg font-semibold text-black dark:text-white">{exp.role}</h3>
                <p className="font-medium text-gray-700 dark:text-zinc-200">{exp.company}</p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">{exp.period}</p>
                <p className="mt-2 text-gray-600 dark:text-zinc-300">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SEÇÃO DE COMPETÊNCIAS (NOVO FORMATO) */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-zinc-100">
            Competências
          </h2>

          {/* O 'SkillBar' foi removido */}
          <div className="space-y-6">
            {/* Faz um loop nas CATEGORIAS (Ex: "Back-end") */}
            {Object.keys(skillsByCategory).map((category) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-indigo-500 dark:text-indigo-400 mb-2">
                  {category}
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {/* Faz um loop nas SKILLS dentro da categoria */}
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

        <p className="mt-10 text-xs text-gray-400 text-center">
          Currículo dinâmico com Next.js, Prisma e MySQL.
        </p>

      </main>
    </div>
  );
}