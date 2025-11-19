// src/components/resume/SkillList.tsx

import { SectionTitle } from '../ui/SectionTitle';
/**
 * Importação do tipo gerado automaticamente pelo Prisma.
 * Utiliza-se 'skills' (minúsculo) assumindo consistência com o 'profile'
 * e com a chamada 'prisma.skills' no service.
 */
import { skills } from '@prisma/client';

// === Definição de Tipos ===

interface SkillListProps {
  /**
   * Estrutura de dados agrupada (Dicionário).
   * - Chave (Key): Nome da Categoria (string).
   * - Valor (Value): Array de objetos 'skills' do Prisma.
   * Utilizamos 'Record<string, T>' que é a forma idiomática do TypeScript para mapas/dicionários.
   */
  skillsByCategory: Record<string, skills[]>;
}

/**
 * Componente: SkillList
 * ----------------------------------------------------------------------
 * Renderiza as competências técnicas agrupadas por categoria (ex: Front-end, Back-end).
 * Itera sobre as chaves do objeto agrupado para gerar as seções visuais.
 * * @param {SkillListProps} props - Objeto de skills categorizadas.
 */
export function SkillList({ skillsByCategory }: SkillListProps) {
  return (
    <section className="mb-12">
      <SectionTitle title="Habilidades e Competências" />
      
      <div className="space-y-6">
        {/* Object.entries converte o objeto { Categoria: [Skills] } 
          em um array iterável: [['Categoria', [Skills]], ...].
        */}
        {Object.entries(skillsByCategory).map(([category, list]) => (
          <div key={category}>
            
            {/* Título da Categoria */}
            <h3 className="text-lg text-[color:var(--acento-laranja)] mb-2">
              {category}
            </h3>
            
            {/* Lista de Skills */}
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
  );
}