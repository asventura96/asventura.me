// src/app/admin/courses/edit/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prismaClient'
import { updateCourse } from '@/app/admin/courses/actions'
import CourseForm from '@/components/CourseForm'

/**
 * Busca um curso específico pelo ID, incluindo suas relações de skills.
 * Esta função é usada para popular o formulário de edição.
 * @param id O ID do curso (string) a ser buscado.
 * @returns O objeto do curso com as skills incluídas, ou null se não for encontrado.
 */
async function getCourseById(id: string) {
  const courseId = parseInt(id, 10)
  if (isNaN(courseId)) {
    return null
  }

  /**
   * Executa a query no banco de dados.
   * Utiliza 'include' para fazer o join com a tabela 'SkillsEmCursos'
   * e, em seguida, com a tabela 'skills' para obter os nomes.
   */
  const courseItem = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      skills: { // Inclui os registros da tabela de junção
        include: {
          skill: { // 'skill' é a relação dentro de 'SkillsEmCursos' para a tabela 'skills'
            select: {
              id: true,
              name: true,
            }
          }
        }
      }
    }
  })
  return courseItem
}

/**
 * Página de Edição de Curso (Server Component).
 * Responsável por buscar os dados do curso (data fetching) e passá-los
 * para o componente de formulário (Client Component).
 * @param params Os parâmetros da rota, que no App Router (Next 15+) são uma Promise.
 */
export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  
  /**
   * Aguarda a resolução da Promise de parâmetros para obter o 'id'.
   * Esta é a correção para o erro 404.
   */
  const { id } = await params;
  
  const courseItem = await getCourseById(id)

  // Se o curso não for encontrado, renderiza a página 404 padrão
  if (!courseItem) {
    notFound()
  }
  
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-2xl">
      
      <div className="bg-white rounded-t-xl p-4 flex justify-between items-center border-b border-zinc-300">
        <h1 className="text-xl font-bold text-[color:var(--acento-verde)]">EDITAR CURSO/CERTIFICAÇÃO</h1>
        <Link href="/admin/courses" className="text-sm hover:underline text-[color:var(--acento-verde)]">
          &larr; CANCELAR
        </Link>
      </div>

      <div className="p-8">
        {/* Passa os dados do curso (agora incluindo 'skills')
          para o componente de formulário 'CourseForm'.
        */}
        <CourseForm 
          action={updateCourse}
          initialData={courseItem}
          buttonText="SALVAR ALTERAÇÕES"
        />
      </div>
    </div>
  )
}