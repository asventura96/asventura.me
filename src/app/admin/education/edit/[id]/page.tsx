// src/app/admin/education/edit/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prismaClient'

// 1. Importa a Ação de ATUALIZAR (a lógica de salvar)
import { updateEducation } from '@/app/admin/education/actions'

// 2. Importa o Formulário Inteligente (o visual)
import EducationForm from '@/components/EducationForm'

// 3. Função para buscar o item específico
async function getEducationById(id: string) {
  const educationId = parseInt(id, 10)
  if (isNaN(educationId)) {
    return null
  }
  const educationItem = await prisma.education.findUnique({
    where: { id: educationId },
  })
  return educationItem
}

// 4. A Página (Componente de Servidor)
export default async function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {

  // Desembrulha o ID (correção para Turbopack)
  const { id } = await params;

  // Busca os dados da formação específica
  const educationItem = await getEducationById(id)

  // Se o ID for inválido ou não existir, mostra 404
  if (!educationItem) {
    notFound()
  }

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Editar Formação Acadêmica
          </h1>
          <Link href="/admin/education" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Cancelar
          </Link>
        </div>

        {/* 5. Renderiza o MESMO formulário, mas agora passando:
             - A ação 'updateEducation'
             - Os 'initialData' para pré-preencher
             - O texto do botão
        */}
        <EducationForm 
          action={updateEducation}
          initialData={educationItem}
          buttonText="Salvar Alterações"
        />

      </main>
    </div>
  )
}