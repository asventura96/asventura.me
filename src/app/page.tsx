// src/app/page.tsx

import { getResumeData } from '@/services/resumeService';
import { Hero } from '@/components/resume/Hero';
import { ExperienceTimeline } from '@/components/resume/ExperienceTimeline';
import { EducationList } from '@/components/resume/EducationList';
import { LanguageList } from '@/components/resume/LanguageList';
import { SkillList } from '@/components/resume/SkillList';
import { CourseList } from '@/components/resume/CourseList';
import { User, Target, Github, Linkedin, Mail, Download, Code2 } from 'lucide-react';
import Link from 'next/link';

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
    <div className="flex flex-col flex-grow bg-[var(--branco)] text-[var(--background)]">
      
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
                  <h3 className="text-2xl font-medium text-[var(--background)] tracking-tight">
                    Resumo Profissional
                  </h3>
                </div>

                {/* === RESUMO PROFISSIONAL === */}
                <p className="text-[var(--background)] leading-relaxed text-base font-normal opacity-90 text-justify whitespace-pre-line">
                  {profile.personal_summary}
                </p>
              </section>
            )}

            {/* === OBJETIVOS PROFISSIONAIS === */}
            {profile.professional_objectives && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-[var(--texto-secundario)]/20 text-[var(--background)] border border-[var(--background)]/10">
                    <Target size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-medium text-[var(--background)] tracking-tight">
                    Objetivos Profissionais
                  </h3>
                </div>

                <p className="text-[var(--background)] leading-relaxed text-base font-normal opacity-90 text-justify whitespace-pre-line">
                  {profile.professional_objectives}
                </p>
              </section>
            )}

            {/* === FORMAÇÃO ACADÊMICA === */}
             <EducationList education={education} />

            {/* === EXPERIÊNCIA PROFISSIONAL === */}
            <ExperienceTimeline experiences={experiences} />

          </div>

          {/* COLUNA DIREITA (Lateral - 4 colunas) */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* === HABILIDADES === */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[var(--texto-secundario)]/20">
              <SkillList skillsByCategory={skillsByCategory} />
            </div>

            {/* === IDIOMAS E CURSOS === */}
            <div className="space-y-8">
               <LanguageList languages={languages} />
               <CourseList courses={courses} />
            </div>

          </aside>

        </div>
      </main>

      {/* 3. === RODAPÉ === */}
      <footer className="bg-[var(--background)] text-[var(--branco)] border-t border-[var(--texto-secundario)]/20 mt-20 print:hidden">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Bloco da Esquerda: Identidade */}
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-2xl font-bold tracking-wider uppercase text-[var(--acento-verde)]">
                {profile.name}
              </h2>
              <p className="text-[var(--texto-secundario)] max-w-sm mx-auto md:mx-0">
                Engenharia de Computação & Desenvolvimento de Software. 
                Transformando ideias em código limpo e escalável.
              </p>
              
              {/* Ícones Sociais */}
              <div className="flex gap-4 justify-center md:justify-start pt-2">
                {profile.linkedin_url && (
                  <Link href={profile.linkedin_url} target="_blank" className="p-2 bg-[var(--texto-secundario)]/10 rounded-full hover:bg-[var(--acento-verde)] hover:text-[var(--background)] transition-all">
                    <Linkedin size={20} />
                  </Link>
                )}
                {profile.github_url && (
                  <Link href={profile.github_url} target="_blank" className="p-2 bg-[var(--texto-secundario)]/10 rounded-full hover:bg-[var(--acento-verde)] hover:text-[var(--background)] transition-all">
                    <Github size={20} />
                  </Link>
                )}
                {profile.email && (
                  <Link href={`mailto:${profile.email}`} className="p-2 bg-[var(--texto-secundario)]/10 rounded-full hover:bg-[var(--acento-verde)] hover:text-[var(--background)] transition-all">
                    <Mail size={20} />
                  </Link>
                )}
              </div>
            </div>

            {/* Bloco da Direita: Call to Action / Stack */}
            <div className="flex flex-col items-center md:items-end space-y-6">
              <div className="text-center md:text-right">
                 <p className="text-sm font-medium text-[var(--texto-secundario)] uppercase tracking-widest mb-2">
                   Tech Stack deste Portfólio
                 </p>
                 <div className="flex items-center gap-3 bg-[var(--foreground)]/5 px-4 py-2 rounded-lg border border-[var(--texto-secundario)]/20">
                    <Code2 size={18} className="text-[var(--acento-roxo)]" />
                    <span className="font-mono text-sm">Next.js + Tailwind + Prisma</span>
                 </div>
              </div>

              {profile.website_url && (
                <Link 
                  href={profile.website_url} 
                  target="_blank"
                  className="group flex items-center gap-2 text-[var(--branco)] hover:text-[var(--acento-verde)] transition-colors"
                >
                  Baixar Currículo em PDF
                  <Download size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>
          </div>

          {/* Linha Divisória */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--texto-secundario)]/30 to-transparent my-8"></div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--texto-secundario)]">
            <p>&copy; {new Date().getFullYear()} {profile.name}. Todos os direitos reservados.</p>
            <p className="flex items-center gap-1">
              Feito em Belo Horizonte <span className="text-[var(--acento-laranja)]">Minas Gerais</span>
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}