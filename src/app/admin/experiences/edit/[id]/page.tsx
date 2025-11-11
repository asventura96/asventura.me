// src/app/admin/experiences/edit/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prismaClient'

// 1. Importa a Ação de ATUALIZAR
import { updateExperience } from '@/app/admin/experiences/actions'

// 2. Importa o novo Formulário Inteligente
import ExperienceForm from '@/components/ExperienceForm'

// 3. Função para buscar o item específico
async function getExperienceById(id: string) {
  const experienceId = parseInt(id, 10)
  if (isNaN(experienceId)) {
    return null
  }
  const experience = await prisma.experiences.findUnique({
    where: { id: experienceId },
  })

  if (!experience) return null

  // Mapeia 'description' de volta para 'activities' para o formulário
  return {
    ...experience,
    activities: experience.description // 'description' no banco é 'activities' no formulário
  }
}

// 4. A Página (Componente de Servidor)
export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;
  const experience = await getExperienceById(id)

  if (!experience) {
    notFound()
  }

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Editar Experiência
          </h1>
          <Link href="/admin/experiences" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Cancelar
          </Link>
        </div>

        {/* 5. Renderiza o MESMO formulário */}
        <ExperienceForm 
          action={updateExperience}
          initialData={experience}
          buttonText="Salvar Alterações"
        />

      </main>
    </div>
  )
}