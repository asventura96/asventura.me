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

// Importação do botão de Dark Mode
import { ModeToggle } from "@/components/mode-toggle";

export default async function Home() {
  /**
   * Carrega os dados do currículo via serviço.
   * Essa chamada já traz tudo agrupado (profile, skills, cursos, etc).
   */
  const data = await getResumeData();

  /**
   * Se falhar, mostramos uma UI simples respeitando o tema.
   */
  if (!data || !data.profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <main className="w-full max-w-md p-6 border-l-4 border-[var(--acento-laranja)] bg-card shadow-lg rounded-r">
          <h1 className="text-xl font-bold mb-2">Erro de Carregamento</h1>
          <p className="opacity-70 text-sm">Não foi possível recuperar os dados do perfil.</p>
        </main>
      </div>
    );
  }

  const { profile, skillsByCategory, experiences, education, courses, languages } = data;

  /**
   * Estrutura principal do layout da Home.
   * bg-background + text-foreground garantem adaptação Dark/Light.
   */
  return (
    <div className="flex flex-col flex-grow bg-background text-foreground transition-colors duration-300">

      {/* Botão de troca de tema, sempre no topo */}
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>

      {/* HERO */}
      <Hero profile={profile} />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 py-12 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* COLUNA CENTRAL (8 colunas) */}
          <div className="lg:col-span-8 space-y-16">
            {/* RESUMO PROFISSIONAL */}
            {profile.personal_summary && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-muted text-foreground border border-border">
                    <User size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-medium tracking-tight">Resumo Profissional</h3>
                </div>

                <p className="leading-relaxed text-base font-normal opacity-90 text-justify whitespace-pre-line">
                  {profile.personal_summary}
                </p>
              </section>
            )}

            {/* OBJETIVOS PROFISSIONAIS */}
            {profile.professional_objectives && (
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-muted text-foreground border border-border">
                    <Target size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-medium tracking-tight">Objetivos Profissionais</h3>
                </div>

                <p className="leading-relaxed text-base font-normal opacity-90 text-justify whitespace-pre-line">
                  {profile.professional_objectives}
                </p>
              </section>
            )}

            {/* FORMAÇÃO ACADÊMICA */}
            <EducationList education={education} />

            {/* EXPERIÊNCIAS PROFISSIONAIS */}
            <ExperienceTimeline experiences={experiences} />
          </div>

          {/* SIDEBAR DIREITA (4 colunas) */}
          <aside className="lg:col-span-4 space-y-8">
            {/* HABILIDADES */}
            <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
              <SkillList skillsByCategory={skillsByCategory} />
            </div>

            {/* IDIOMAS E CURSOS */}
            <div className="space-y-8">
              <LanguageList languages={languages} />
              <CourseList courses={courses} />
            </div>
          </aside>
        </div>
      </main>

      {/* RODAPÉ */}
      <footer className="bg-muted/30 text-foreground border-t border-border mt-20 print:hidden">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* INFO DO AUTOR */}
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-2xl font-bold tracking-wider uppercase text-[var(--acento-verde)]">
                {profile.name}
              </h2>

              <p className="text-muted-foreground max-w-sm mx-auto md:mx-0">
                Engenharia de Computação & Desenvolvimento de Software.
                Transformando ideias em código limpo e escalável.
              </p>

              {/* LINKS SOCIAIS */}
              <div className="flex gap-4 justify-center md:justify-start pt-2">
                {profile.linkedin_url && (
                  <Link href={profile.linkedin_url} target="_blank" className="p-2 bg-foreground/10 rounded-full hover:bg-[var(--acento-verde)] hover:text-background transition-all">
                    <Linkedin size={20} />
                  </Link>
                )}
                {profile.github_url && (
                  <Link href={profile.github_url} target="_blank" className="p-2 bg-foreground/10 rounded-full hover:bg-[var(--acento-verde)] hover:text-background transition-all">
                    <Github size={20} />
                  </Link>
                )}
                {profile.email && (
                  <Link href={`mailto:${profile.email}`} className="p-2 bg-foreground/10 rounded-full hover:bg-[var(--acento-verde)] hover:text-background transition-all">
                    <Mail size={20} />
                  </Link>
                )}
              </div>
            </div>

            {/* STACK + DOWNLOAD */}
            <div className="flex flex-col items-center md:items-end space-y-6">
              <div className="text-center md:text-right">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-2">
                  Tech Stack deste Portfólio
                </p>
                <div className="flex items-center gap-3 bg-background px-4 py-2 rounded-lg border border-border shadow-sm">
                  <Code2 size={18} className="text-[var(--acento-roxo)]" />
                  <span className="font-mono text-sm">Next.js + Tailwind + Prisma</span>
                </div>
              </div>

              {profile.website_url && (
                <Link
                  href={profile.website_url}
                  target="_blank"
                  className="group flex items-center gap-2 text-foreground hover:text-[var(--acento-verde)] transition-colors"
                >
                  Baixar Currículo em PDF
                  <Download size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>
          </div>

          {/* LINHA SEPARADORA */}
          <div className="h-px w-full bg-border my-8"></div>

          {/* COPYRIGHT */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
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