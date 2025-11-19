// src/services/resumeService.ts
import { prisma } from '@/lib/prismaClient';
/**
 * Importa os tipos gerados automaticamente pelo Prisma Client.
 * Garante que o TypeScript conheça a estrutura exata das tabelas (skills, profile, etc).
 */
import { skills } from '@prisma/client';

// === Definições de Tipos ===

/**
 * Tipo utilitário para o objeto de skills agrupadas.
 * Chave: Nome da Categoria (string).
 * Valor: Array de registros da tabela 'skills'.
 */
export type SkillsByCategory = Record<string, skills[]>;

// === Funções Auxiliares ===

/**
 * Agrupa um array plano de skills em um dicionário indexado por categoria.
 * Utiliza 'Outras' como chave de fallback para skills sem categoria definida.
 * * @param skillsList Array de skills retornado do banco de dados.
 * @returns Objeto SkillsByCategory.
 */
function groupSkillsByCategory(skillsList: skills[]): SkillsByCategory {
  return skillsList.reduce<SkillsByCategory>((acc, skill) => {
    // Normaliza a categoria ou define valor padrão
    const category = (skill.category ?? 'Outras').trim();
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push(skill);
    return acc;
  }, {});
}

/**
 * Ordena um array de objetos baseando-se em uma propriedade de data no formato "MM/YYYY".
 * A ordenação é decrescente (mais recente primeiro).
 * * @template T Tipo genérico dos objetos no array.
 * @param entries Array de dados a ordenar.
 * @param dateField Chave da propriedade que contém a data (string).
 * @returns Novo array ordenado.
 */
function sortEntriesByDate<T>(entries: T[], dateField: keyof T): T[] {
  /**
   * Converte string "MM/YYYY" para inteiro YYYYMM para comparação numérica eficiente.
   * @param dateValue Valor do campo extraído do objeto.
   */
  const toSortableNumber = (dateValue: unknown): number => {
    if (typeof dateValue !== 'string' || !dateValue || !dateValue.includes('/')) {
      return 0; // Fallback para datas inválidas ou nulas
    }
    const parts = dateValue.split('/');
    if (parts.length !== 2) return 0;
    
    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);
    
    if (isNaN(month) || isNaN(year)) return 0;
    
    return year * 100 + month;
  };

  // Cria uma cópia do array para evitar mutação do original (Imutabilidade)
  return [...entries].sort((a, b) => {
    const dateA = toSortableNumber(a[dateField]);
    const dateB = toSortableNumber(b[dateField]);
    return dateB - dateA; 
  });
}

// === Serviço Principal ===

/**
 * Busca e agrega todos os dados necessários para a renderização do currículo.
 * Executa queries em paralelo via Promise.all para otimizar o tempo de resposta (TTFB).
 * * @returns Objeto contendo profile, skills agrupadas e listas ordenadas, ou null em caso de falha crítica.
 */
export async function getResumeData() {
  try {
    const [
      profile,
      skillsData,
      experiences,
      education,
      courses,
      languages
    ] = await Promise.all([
      // 1. Perfil (ID fixo 1 conforme regra de negócio)
      prisma.profile.findFirst({ where: { id: 1 } }),
      
      // 2. Skills (Filtradas por flag de exibição)
      prisma.skills.findMany({ 
        where: { showOnProfile: true }, 
        orderBy: { category: 'asc' } 
      }),
      
      // 3. Experiências
      prisma.experiences.findMany(),
      
      // 4. Formação
      prisma.education.findMany(),
      
      // 5. Cursos com relacionamento de Skills (Eager Loading)
      prisma.course.findMany({
        include: {
          skills: { // Tabela associativa (Join Table)
            orderBy: {
              skill: { name: 'asc' }
            },
            include: {
              skill: { // Join com tabela skills para buscar o nome
                select: { name: true } 
              }
            }
          }
        }
      }),
      
      // 6. Idiomas
      prisma.language.findMany({ orderBy: { name: 'asc' } })
    ]);

    // Processamento de dados (Sorting/Grouping) na camada de serviço para manter a View limpa
    const sortedExperiences = sortEntriesByDate(experiences || [], 'start_date');
    const sortedEducation = sortEntriesByDate(education || [], 'start_date');
    const sortedCourses = sortEntriesByDate(courses || [], 'date');
    const groupedSkills = groupSkillsByCategory(skillsData || []);

    return {
      profile: profile,
      skillsByCategory: groupedSkills,
      experiences: sortedExperiences,
      education: sortedEducation,
      courses: sortedCourses,
      languages: languages || []
    };

  } catch (error) {
    // Log de erro estruturado para observabilidade (pode ser integrado com Sentry/Datadog)
    console.error("[ResumeService] Critical Error fetching data:", error);
    return null;
  }
}