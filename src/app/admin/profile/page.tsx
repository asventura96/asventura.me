// src/app/admin/profile/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prismaClient'
import { updateProfile } from '@/app/admin/profile/actions'
import ProfileForm from '@/components/ProfileForm'

async function getProfile() {
  const profile = await prisma.profile.findUnique({
    where: { id: 1 },
  })

  return profile || {
    name: null, title: null, email: null, phone: null, location: null,
    linkedin_url: null, github_url: null, website_url: null,
    birthdate: null, marital_status: null, personal_summary: null,
    professional_objectives: null, photo_url: null
  }
}

export default async function EditProfilePage() {

  const profile = await getProfile()

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-2xl">

      <div className="bg-white rounded-t-xl p-4 flex justify-between items-center border-b border-zinc-300">
        <h1 className="text-xl font-medium text-[color:var(--acento-verde)]">EDITAR PERFIL</h1>
        <Link href="/admin" className="text-sm hover:underline text-[color:var(--acento-verde)]">
          &larr; Voltar ao Painel
        </Link>
      </div>

      <div className="p-8">
        <ProfileForm 
          action={updateProfile}
          initialData={profile}
          buttonText="SALVAR ALTERAÇÕES"
        />
      </div>
    </div>
  )
}