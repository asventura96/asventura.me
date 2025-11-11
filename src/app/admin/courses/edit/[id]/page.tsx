// src/app/admin/courses/edit/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prismaClient'

// 1. Importa a Ação de ATUALIZAR
import { updateCourse } from '@/app/admin/courses/actions'

// 2. Importa o Formulário Inteligente
import CourseForm from '@/components/CourseForm'

// 3. Função para buscar o item específico
async function getCourseById(id: string) {
  const courseId = parseInt(id, 10)
  if (isNaN(courseId)) {
    return null
  }
  const courseItem = await prisma.course.findUnique({
    where: { id: courseId },
  })
  return courseItem
}

// 4. A Página (Componente de Servidor)
export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {

  // Desembrulha o ID (correção para Turbopack)
  const { id } = await params;

  // Busca os dados do curso específico
  const courseItem = await getCourseById(id)

  // Se o ID for inválido ou não existir, mostra 404
  if (!courseItem) {
    notFound()
  }

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Editar Curso/Certificação
          </h1>
          <Link href="/admin/courses" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Cancelar
          </Link>
        </div>

        {/* 5. Renderiza o MESMO formulário, mas agora passando:
             - A ação 'updateCourse'
             - Os 'initialData' para pré-preencher
             - O texto do botão
        */}
        <CourseForm 
          action={updateCourse}
          initialData={courseItem}
          buttonText="Salvar Alterações"
        />

      </main>
    </div>
  )
}