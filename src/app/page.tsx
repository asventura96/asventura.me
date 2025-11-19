/**
 * @file src/app/page.tsx
 * @description Controlador principal da aplicação (Root Page).
 * Responsável pela orquestração de dados do servidor e composição da View.
 * * ARQUITETURA: Server Component (RSC)
 * - Data Fetching ocorre no servidor (Node.js runtime).
 * - HTML pré-renderizado é enviado ao cliente.
 * - Zero bundle size de JavaScript para a lógica de busca.
 */

import { getResumeData } from '@/services/resumeService';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ResumeSidebar } from '@/components/resume/ResumeSidebar';
import { EducationList } from '@/components/resume/EducationList';
import { LanguageList } from '@/components/resume/LanguageList';
import { ExperienceList } from '@/components/resume/ExperienceList';
import { SkillList } from '@/components/resume/SkillList';
import { CourseList } from '@/components/resume/CourseList';

/**
 * Componente Raiz assíncrono.
 * Next.js 13+ App Router permite async/await diretamente no componente.
 */
export default async function Home() {
  
  // 1. Camada de Serviço: Execução de queries otimizadas (Promise.all)
  const data = await getResumeData();

  // 2. Fail-Safe Strategy:
  // Interrompe o fluxo de renderização caso o serviço de banco de dados esteja indisponível
  // ou o perfil principal (ID 1) não exista, prevenindo Runtime Errors nos componentes filhos.
  if (!data || !data.profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <main className="w-full max-w-3xl p-8 border border-red-200 rounded bg-red-50">
          <h1 className="text-3xl font-bold text-red-600 mb-2">Erro Crítico de Carregamento</h1>
          <p className="text-red-800">
            Não foi possível recuperar os dados do perfil. Verifique a conexão com o banco de dados.
          </p>
        </main>
      </div>
    );
  }

  // Desestruturação para injeção de dependências nos componentes
  const { profile, skillsByCategory, experiences, education, courses, languages } = data;

  return (
    <div className="max-w-6xl mx-auto p-8 md:p-12 lg:p-16">
      {/* Layout Grid: Sidebar Fixa (1/3) + Conteúdo (2/3) em Desktop */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-16">

        {/* --- COMPONENTE: Sidebar (Identidade Visual e Contatos) --- */}
        <ResumeSidebar profile={profile} />

        {/* --- ÁREA PRINCIPAL: Detalhamento do Currículo --- */}
        <main className="lg:col-span-2 mt-12 lg:mt-0">
          
          {/* Seção Condicional: Sobre Mim */}
          {profile.personal_summary && (
            <section className="mb-12">
              <SectionTitle title="Sobre Mim" />
              <p className="text-texto-principal whitespace-pre-line leading-relaxed">
                {profile.personal_summary}
              </p>
            </section>
          )}

          {/* Seção Condicional: Objetivos */}
          {profile.professional_objectives && (
            <section className="mb-12">
              <SectionTitle title="Objetivos Profissionais" />
              <p className="text-texto-principal whitespace-pre-line leading-relaxed">
                {profile.professional_objectives}
              </p>
            </section>
          )}

          {/* Injeção de Componentes de Lista
              Cada componente é responsável por sua própria lógica de renderização (Map)
              e tipagem estrita baseada nos modelos do Prisma.
          */}
          
          <EducationList education={education} />
          
          <LanguageList languages={languages} />
          
          <ExperienceList experiences={experiences} />
          
          <SkillList skillsByCategory={skillsByCategory} />
          
          <CourseList courses={courses} />

        </main>
      </div>
    </div>
  );
}