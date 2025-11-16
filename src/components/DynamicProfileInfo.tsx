// src/components/DynamicProfileInfo.tsx
"use client";

import { type profile } from '@prisma/client';
import dynamic from 'next/dynamic';

/**
 * Importa o componente 'ProfileInfo' dinamicamente.
 * Esta é a correção para o erro de build:
 * 'dynamic' só pode ser usado com 'ssr: false' dentro de um Client Component.
 */
const ProfileInfoNoSSR = dynamic(
  () => import('@/components/ProfileInfo').then(mod => mod.ProfileInfo), 
  {
    /**
     * Força o Next.js a NÃO renderizar este componente no servidor (SSR).
     * Isso garante que 'new Date()' só rode no cliente, resolvendo o 'Hydration Mismatch'.
     */
    ssr: false,
    /**
     * Mostra um placeholder com a altura exata do componente
     * enquanto ele carrega no cliente, evitando 'layout shift'.
     */
    loading: () => <ul className="text-sm text-[color:var(--branco)] space-y-2 mt-8 min-h-[100px]"></ul>
  }
);

interface Props {
  profile: profile;
}

/**
 * Componente "invólucro" (wrapper) que atua como o Client Component
 * necessário para carregar o 'ProfileInfo' dinamicamente.
 */
export function DynamicProfileInfo({ profile }: Props) {
  // Renderiza o componente que só existe no cliente
  return <ProfileInfoNoSSR profile={profile} />;
}