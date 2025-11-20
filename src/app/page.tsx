// src/app/page.tsx

import { getResumeData } from '@/services/resumeService';
import { Hero } from '@/components/resume/Hero';
import { ExperienceTimeline } from '@/components/resume/ExperienceTimeline';
import { EducationList } from '@/components/resume/EducationList';
import { LanguageList } from '@/components/resume/LanguageList';
import { SkillList } from '@/components/resume/SkillList';
import { CourseList } from '@/components/resume/CourseList';
// Importamos ícones para padronizar os títulos das seções de texto
import { User, Target } from 'lucide-react';

export default async function Home() {
  
  const data = await getResumeData();

  if (!data || !data.profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--branco)]">
        <main className="w-full max-w-md p-6 border-l-4 border-[var(--acento-laranja)] bg-white shadow-lg rounded-r">
          <h1 className="text-xl font-bold text-[var(--background)] mb-2">Erro de Carregamento</h1>
          <p className="text-[var(--background)]/70 text-sm">
            Não foi possível recuperar os dados do perfil.
          </p>
        </main>
      </div>
    );
  }

  const { profile, skillsByCategory, experiences, education, courses, languages } = data;

  return (
    <div className="min-h-screen bg-[var(--branco)] pb-16 text-[var(--background)]">
      
      {/* 1. HERO SECTION */}
      <Hero profile={profile} />

      {/* 2. CONTEÚDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 py-12 md:px-8 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* COLUNA ESQUERDA (Principal - 8 colunas) */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* === RESUMO PROFISSIONAL === */}
            {profile.personal_summary && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-[var(--texto-secundario)]/20 text-[var(--background)] border border-[var(--background)]/10">
                    <User size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--background)] tracking-tight">
                    Resumo Profissional
                  </h3>
                </div>

                <p className="text-[var(--background)] leading-relaxed text-lg font-medium opacity-90 text-justify">
                  {profile.personal_summary}
                </p>
              </section>
            )}

            {/* === OBJETIVOS === 
               Visual corrigido: Agora sem card, seguindo o padrão "clean" do Resumo.
            */}
            {profile.professional_objectives && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-[var(--texto-secundario)]/20 text-[var(--background)] border border-[var(--background)]/10">
                    <Target size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--background)] tracking-tight">
                    Objetivos Profissionais
                  </h3>
                </div>

                <p className="text-[var(--background)] leading-relaxed text-lg font-medium opacity-90 text-justify">
                  {profile.professional_objectives}
                </p>
              </section>
            )}

            {/* Educação */}
               <EducationList education={education} />

            {/* Timeline de Experiência */}
            <ExperienceTimeline experiences={experiences} />

          </div>

          {/* COLUNA DIREITA (Lateral - 4 colunas) */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Skills */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--texto-secundario)]/20">
              <SkillList skillsByCategory={skillsByCategory} />
            </div>

            {/* Idiomas e Cursos */}
            <div className="space-y-8">
               <LanguageList languages={languages} />
               <CourseList courses={courses} />
            </div>

          </aside>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--background)] text-[var(--foreground)] py-12 text-center text-sm mt-12 border-t border-[var(--texto-secundario)]/10">
        <p>&copy; {new Date().getFullYear()} {profile.name}. Desenvolvido com Next.js & Prisma.</p>
      </footer>
    </div>
  );
}