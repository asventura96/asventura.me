// src/app/admin/profile/page.tsx
import { prisma } from '@/lib/prismaClient'
import Link from 'next/link'
// Importa o componente inteligente que acabaste de corrigir
import ProfileForm from '@/components/ProfileForm' 

// --- BUSCAR O PERFIL (Sempre o ID=1) ---
async function getProfile() {
  const profile = await prisma.profile.findUnique({
    where: { id: 1 },
  })
  
  // Se o perfil não existir, retorna um objeto vazio
  if (!profile) {
    return {
      name: '', title: '', email: null, phone: null, location: null,
      linkedin_url: null, github_url: null, website_url: null,
      birthdate: null, marital_status: null, personal_summary: null,
      professional_objectives: null
    }
  }
  return profile
}

// --- A PÁGINA (Componente de Servidor) ---
export default async function EditProfilePage() {
  // 1. Busca os dados no servidor
  const profile = await getProfile()
  
  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Editar Perfil
          </h1>
          <Link href="/admin" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Voltar ao Painel
          </Link>
        </div>

        {/* 2. Renderiza o formulário inteligente, passando os dados */}
        <ProfileForm profileData={profile} />

      </main>
    </div>
  )
}