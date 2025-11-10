// 1. Imports: 'prisma' entra, 'data' (JSON) sai
import { prisma } from '@/lib/prismaClient'; // Verifique o caminho; pode ser '../lib/prismaClient'
import SkillBar from '../components/SkillBar';
import ExperienceItem from '../components/ExperienceItem'; 
// import data from '../../data/curriculumData.json'; // <-- REMOVIDO

// 2. Nova função para buscar TODOS os dados do banco
async function getData() {
  try {
    // Busca o perfil (assume que SÓ HÁ UM, com id 1)
    const profile = await prisma.profile.findFirst({
      where: { id: 1 } 
    });

    // Busca todas as skills
    const skills = await prisma.skills.findMany();

    // Busca todas as experiências
    const experiences = await prisma.experiences.findMany({
      orderBy: { id: 'desc' } // Ordena (opcional)
    });
    
    // Se o perfil não for encontrado, retorna um padrão para não quebrar a página
    const defaultProfile = { name: "André Ventura", title: "Engenheiro de Computação" };

    return {
      profile: profile || defaultProfile,
      skills: skills,
      experiences: experiences
    };

  } catch (error) {
    console.error("Erro ao buscar dados do banco:", error);
    // Retorna dados vazios em caso de erro
    return {
      profile: { name: "Erro ao carregar", title: "Erro" },
      skills: [],
      experiences: []
    };
  }
}

// 3. Componente Home agora é 'async'
export default async function Home() {
  
  // 4. Busca os dados do banco (getData) em vez do JSON (data)
  const { profile, skills, experiences } = await getData();
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl p-8 bg-white dark:bg-zinc-900 shadow-xl rounded-xl">
        
        {/* TÍTULO/PERFIL (Agora vêm do banco) */}
        <h1 className="text-3xl font-bold text-black dark:text-white">{profile.name}</h1>
        <p className="text-lg text-indigo-600 mb-6">{profile.title}</p>
        
        {/* SEÇÃO DE EXPERIÊNCIAS (Agora vêm do banco) */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-zinc-100">
            Experiência Profissional
          </h2>
          
          <div className="space-y-6">
            {/* O loop usa os dados do banco, mas as props são as mesmas que você definiu */}
            {experiences.map((exp) => (
              <ExperienceItem 
                key={exp.id} 
                company={exp.company}
                role={exp.role}
                period={exp.period}
                description={exp.description}
                id={exp.id} 
              />
            ))}
          </div>
        </div>
        
        {/* SEÇÃO DE COMPETÊNCIAS (Agora vêm do banco) */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-zinc-100">
            Competências Técnicas
          </h2>
          <div className="space-y-4">
            {skills.map((skill) => (
              <SkillBar 
                key={skill.id} // Usando o ID do banco
                name={skill.name} 
                level={skill.level} 
              />
            ))}
          </div>
        </div>
        
        {/* 5. Mensagem de rodapé atualizada */}
        <p className="mt-10 text-xs text-gray-400 text-center">
          Currículo dinâmico com Next.js, Prisma e MySQL.
        </p>

      </main>
    </div>
  );
}