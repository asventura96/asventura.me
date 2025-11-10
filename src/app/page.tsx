import { prisma } from '@/lib/prismaClient';
import SkillBar from '../components/SkillBar';
import ExperienceItem from '../components/ExperienceItem'; 

async function getData() {
  try {
    const profile = await prisma.profile.findFirst({ where: { id: 1 } });
    const skills = await prisma.skills.findMany();
    const experiences = await prisma.experiences.findMany({ orderBy: { id: 'desc' } });
    
    return {
      profile: profile || { name: "André Ventura", title: "Carregando..." },
      skills: skills || [],
      experiences: experiences || []
    };
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return { profile: { name: "Erro", title: "Erro" }, skills: [], experiences: [] };
  }
}

export default async function Home() {
  const { profile, skills, experiences } = await getData();
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl p-8 bg-white dark:bg-zinc-900 shadow-xl rounded-xl">
        <h1 className="text-3xl font-bold text-black dark:text-white">{profile.name}</h1>
        <p className="text-lg text-indigo-600 mb-6">{profile.title}</p>
        
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-zinc-100">
            Experiência Profissional
          </h2>
          <div className="space-y-6">
            {experiences.map((exp) => (
              <ExperienceItem key={exp.id} company={exp.company} role={exp.role} period={exp.period} description={exp.description} id={exp.id} />
            ))}
          </div>
        </div>
        
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-zinc-100">
            Competências Técnicas
          </h2>
          <div className="space-y-4">
            {skills.map((skill) => (
              <SkillBar key={skill.id} name={skill.name} level={skill.level} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}