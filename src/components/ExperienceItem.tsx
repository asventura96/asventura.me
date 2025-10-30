// src/components/ExperienceItem.tsx
// Define o tipo para os dados de Experiência (como está no JSON)
interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string;
}

// O componente que exibe UMA experiência
export default function ExperienceItem({ company, role, period, description }: Experience) {
  return (
    <div className="mb-6 p-4 border-l-4 border-indigo-400 bg-gray-50 dark:bg-zinc-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      
      {/* Título e Período */}
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {role}
        </h3>
        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
          {period}
        </span>
      </div>
      
      {/* Empresa */}
      <p className="text-md font-semibold text-gray-600 dark:text-zinc-300 mb-2">
        {company}
      </p>
      
      {/* Descrição */}
      <p className="text-gray-700 dark:text-zinc-400">
        {description}
      </p>

    </div>
  );
}