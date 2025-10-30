// app/page.tsx (APENAS as modificações necessárias)

// 1. Importar o novo componente (NO INÍCIO DO ARQUIVO)
import ExperienceItem from '../components/ExperienceItem'; 
// ...
import data from '../../data/curriculumData.json';
import SkillBar from '../components/SkillBar';

// O componente Home (sua página do currículo)
export default function Home() {
  
  // Desestrutura os dados, incluindo experiences
  const { profile, skills, experiences } = data; // <--- AGORA INCLUI EXPERIENCES
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl p-8 bg-white dark:bg-zinc-900 shadow-xl rounded-xl">
        
        {/* TÍTULO/PERFIL */}
        <h1 className="text-3xl font-bold text-black dark:text-white">{profile.name}</h1>
        <p className="text-lg text-indigo-600 mb-6">{profile.title}</p>
        
        {/* NOVO BLOCO: SEÇÃO DE EXPERIÊNCIAS */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-zinc-100">
            Experiência Profissional
          </h2>
          
          {/* Itera sobre o array 'experiences' do seu JSON e renderiza um ExperienceItem para cada */}
          <div className="space-y-6">
            {experiences.map((exp) => (
              <ExperienceItem 
                key={exp.id} // Chave de identificação única
                company={exp.company}
                role={exp.role}
                period={exp.period}
                description={exp.description}
                id={exp.id} // Passando todas as props definidas
              />
            ))}
          </div>
        </div>
        
        {/* SEÇÃO DE COMPETÊNCIAS (Bloco que já estava funcionando) */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-zinc-100">
            Competências Técnicas
          </h2>
          <div className="space-y-4">
            {skills.map((skill, index) => (
              <SkillBar 
                key={index} 
                name={skill.name} 
                level={skill.level} 
              />
            ))}
          </div>
        </div>
        
        <p className="mt-10 text-xs text-gray-400 text-center">
          Para replicar este currículo, edite apenas o arquivo **data/curriculumData.json**.
        </p>

      </main>
    </div>
  );
}