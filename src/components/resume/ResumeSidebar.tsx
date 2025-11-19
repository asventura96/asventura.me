// src/components/resume/ResumeSidebar.tsx

import Image from 'next/image';
import Link from 'next/link';
import { DynamicProfileInfo } from '@/components/DynamicProfileInfo';
/**
 * Importação do tipo gerado automaticamente pelo Prisma.
 * Isso garante 'Type Safety' entre o Banco de Dados e o Frontend.
 */
import { profile } from '@prisma/client';

// === Definição de Tipos ===

/**
 * Props do componente ResumeSidebar.
 * Recebe o objeto completo do perfil para distribuir os dados de contato e imagem.
 */
interface ResumeSidebarProps {
  profile: profile;
}

/**
 * Componente: ResumeSidebar
 * ----------------------------------------------------------------------
 * Responsável pela identidade visual do candidato (Foto, Nome, Cargo) e contatos.
 * * Detalhes Técnicos:
 * - Atua como uma 'Sticky Sidebar' em resoluções Desktop (lg).
 * - Utiliza 'next/image' com propriedade 'priority' para otimizar o LCP (Largest Contentful Paint).
 * - Delega informações sensíveis à hidratação (idade, local) para o client component 'DynamicProfileInfo'.
 * * @param {ResumeSidebarProps} props - Dados do perfil vindos do Server Component.
 */
export function ResumeSidebar({ profile }: ResumeSidebarProps) {
  return (
    <header className="lg:sticky lg:top-12 lg:h-screen lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left">
      
      {/* 1. Área da Foto de Perfil 
        Renderização condicional: Só exibe se a URL da foto existir no banco.
      */}
      {profile.photo_url && (
        <div className="w-40 h-40 mb-6 rounded-full overflow-hidden border-4 border-[color:var(--acento-verde)] shadow-lg mx-auto">
          <Image
            src={profile.photo_url}
            alt={`Foto de ${profile.name}`}
            width={160}
            height={160}
            className="w-full h-full object-cover"
            // Priority true é crucial aqui pois esta imagem está "acima da dobra"
            priority 
          />
        </div>
      )}

      {/* 2. Identificação Principal
        Usa as variáveis CSS globais para manter a consistência do tema.
      */}
      <h1 className="uppercase text-center text-4xl text-[color:var(--acento-verde)]">
        {profile.name}
      </h1>
      <p className="text-center text-base text-[color:var(--texto-secundario)] mt-2">
        {profile.title}
      </p>

      {/* 3. Informações Dinâmicas (Client Component)
        Isolamos dados que dependem do navegador (timezone/cálculos) para evitar erros de Hydration.
      */}
      <DynamicProfileInfo profile={profile} />

      {/* 4. Redes Sociais
        Ícones clicáveis para LinkedIn e GitHub.
      */}
      <div className="flex space-x-6 mt-8 justify-center lg:justify-start">
        {profile.linkedin_url && (
          <Link 
            href={profile.linkedin_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[color:var(--acento-verde)] hover:text-[color:var(--acento-laranja)] text-3xl transition-colors duration-200"
            aria-label="Visitar perfil no LinkedIn"
          >
            <i className="fab fa-linkedin"></i>
          </Link>
        )}
        
        {profile.github_url && (
          <Link 
            href={profile.github_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[color:var(--acento-verde)] hover:text-[color:var(--acento-laranja)] text-3xl transition-colors duration-200"
            aria-label="Visitar perfil no GitHub"
          >
            <i className="fab fa-github"></i>
          </Link>
        )}
      </div>

      {/* Divisor visual apenas para Mobile/Tablet (escondido em LG) */}
      <hr className="w-full border-zinc-700 my-12 lg:hidden" />
      
    </header>
  );
}