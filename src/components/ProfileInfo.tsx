// src/components/ProfileInfo.tsx
"use client";

import { type profile } from '@prisma/client';
import Link from 'next/link';

/**
 * Calcula a idade com base na data de nascimento.
 * Seguro para ser executado apenas no cliente (evitando 'mismatch' do 'new Date()').
 * @param birthDate - O objeto Date de nascimento.
 * @returns A idade (number) ou null.
 */
function getAge(birthDate: Date): number | null {
  if (!birthDate) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

/**
 * Determina o signo do zodíaco com base na data de nascimento.
 * @param birthDate - O objeto Date de nascimento.
 * @returns O nome do signo (string).
 */
function getZodiacSign(birthDate: Date): string {
  if (!birthDate) return "---";
  // Ajuste +1 para lógica de data (getDate é base 1)
  const day = birthDate.getDate() + 1;
  const month = birthDate.getMonth() + 1;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "♒ Aquário";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "♓ Peixes";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "♈ Áries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "♉ Touro";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "♊ Gêmeos";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "♋ Câncer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "♌ Leão";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "♍ Virgem";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "♎ Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "♏ Escorpião";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "♐ Sagitário";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "♑ Capricórnio";
  return "---";
}

interface ProfileInfoProps {
  profile: profile;
}

/**
 * Componente (Client-Side) que renderiza as informações pessoais (idade, signo).
 * Este componente é separado para ser carregado dinamicamente
 * e evitar o Erro de Hidratação do React (Hydration Mismatch).
 */
export function ProfileInfo({ profile }: ProfileInfoProps) {
  // A lógica é executada diretamente, pois o 'dynamic import'
  // no 'DynamicProfileInfo' garante que isso só rode no cliente.
  const age = profile.birthdate ? getAge(profile.birthdate) : null;
  const sign = profile.birthdate ? getZodiacSign(profile.birthdate) : null;

  return (
    <ul className="text-sm text-[color:var(--branco)] space-y-2 mt-8">
      {profile.location && <li><i className="fa-solid fa-location-dot w-6 text-center text-[color:var(--acento-verde)]"></i> {profile.location}</li>}
      {profile.email && <li><Link href={`mailto:${profile.email}`} className="hover:text-[color:var(--acento-laranja)]"><i className="fa-solid fa-envelope w-6 text-center text-[color:var(--acento-verde)]"></i> {profile.email}</Link></li>}
      {profile.phone && <li><Link href={`tel:${profile.phone}`} className="hover:text-[color:var(--acento-laranja)]"><i className="fa-solid fa-phone w-6 text-center text-[color:var(--acento-verde)]"></i> {profile.phone}</Link></li>}
      {age && profile.marital_status && (
        <li><i className="fa-solid fa-user w-6 text-center text-[color:var(--acento-verde)]"></i> {age} anos, {sign}, {profile.marital_status}</li>
      )}
    </ul>
  );
}