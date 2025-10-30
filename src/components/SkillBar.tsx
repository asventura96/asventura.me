// src/components/SkillBar.tsx

// 1. Definição do Tipo (Type) para a Habilidade
interface Skill {
  name: string;
  level: number; // Valor de 0 a 100
}

// 2. Componente Funcional que recebe as props do tipo 'Skill'
export default function SkillBar({ name, level }: Skill) {
  // A cor da barra pode ser personalizada com Tailwind
  const barColor = level > 80 ? 'bg-indigo-600' : 'bg-blue-400';
  
  return (
    <div className="mb-4">
      
      {/* Nome e Nível da Habilidade */}
      <div className="flex justify-between mb-1">
        <span className="text-base font-medium text-gray-700 dark:text-zinc-300">{name}</span>
        <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300">{level}%</span>
      </div>
      
      {/* A Barra de Progresso */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${barColor}`} 
          style={{ width: `${level}%` }}
        ></div>
      </div>
    </div>
  );
}