// src/app/admin/courses/page.tsx (Refatorado)
import { prisma } from '@/lib/prismaClient'
import Link from 'next/link'

// 1. Importa a Ação de exclusão e o Botão Genérico
import { deleteCourse } from '@/app/admin/courses/actions' 
import DeleteButton from '@/components/DeleteButton' 

async function getCourses() {
  const courses = await prisma.course.findMany({
    orderBy: { id: 'desc' }, 
  })
  return courses
}

export default async function AdminCoursesPage() {
  const courses = await getCourses()

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-3xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Gerenciar Cursos e Certificações
          </h1>
          <Link href="/admin" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Voltar ao Painel
          </Link>
        </div>

        <div className="mb-8">
          <Link 
            href="/admin/courses/new" 
            className="inline-block w-full text-center p-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            + Adicionar Novo Curso/Certificação
          </Link>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 border-b pb-2">
            Itens Cadastrados
          </h2>

          {courses.length === 0 ? (
            <p className="text-gray-500 dark:text-zinc-400">Nenhum item cadastrado.</p>
          ) : (
            courses.map((course) => (
              <div 
                key={course.id} 
                className="p-4 border border-gray-200 dark:border-zinc-700 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-black dark:text-white">{course.name}</h3>
                    <p className="text-gray-700 dark:text-zinc-200">{course.institution}</p>
                    <p className="text-sm text-gray-500 dark:text-zinc-400">
                      {course.type} · {course.date} {course.workload ? `(${course.workload}h)` : ''}
                    </p>
                  </div>

                  {/* 2. Substituição aqui */}
                  <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
                    <Link href={`/admin/courses/edit/${course.id}`} className="text-sm text-blue-500 hover:underline">
                      Editar
                    </Link>
                    <span className="text-gray-300 dark:text-zinc-600">|</span>

                    {/* Usamos o botão genérico e passamos a AÇÃO específica */}
                    <DeleteButton id={course.id} deleteAction={deleteCourse} />

                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  )
}