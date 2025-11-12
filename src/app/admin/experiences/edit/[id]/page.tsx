// src/app/admin/experiences/edit/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prismaClient'
import { updateExperience } from '@/app/admin/experiences/actions'
import ExperienceForm from '@/components/ExperienceForm'

async function getExperienceById(id: string) {
  const experienceId = parseInt(id, 10)
  if (isNaN(experienceId)) {
    return null
  }
  const experience = await prisma.experiences.findUnique({
    where: { id: experienceId },
  })

  if (!experience) return null

  return {
    ...experience,
    activities: experience.description 
  }
}

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;
  const experience = await getExperienceById(id)

  if (!experience) {
    notFound()
  }

  return (
    // O container principal é um único cartão branco
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-2xl">

      {/* HEADER BAR (BRANCO): Texto em VERDE para contraste */}
      <div className="bg-white rounded-t-xl p-4 flex justify-between items-center border-b border-zinc-300">
        <h1 className="text-xl font-bold text-[color:var(--acento-verde)]">EDITAR EXPERIÊNCIA</h1>
        <Link href="/admin/experiences" className="text-sm hover:underline text-[color:var(--acento-verde)]">
          &larr; CANCELAR
        </Link>
      </div>

      {/* Corpo do Formulário */}
      <div className="p-8">
        <ExperienceForm 
          action={updateExperience}
          initialData={experience}
          buttonText="SALVAR ALTERAÇÕES"
        />
      </div>
    </div>
  )
}