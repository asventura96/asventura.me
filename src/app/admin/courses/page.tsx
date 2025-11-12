// src/app/admin/courses/page.tsx
import { prisma } from '@/lib/prismaClient'
import Link from 'next/link'
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
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-texto-principal">
          Gerenciar Cursos e Certificações
        </h1>
        <Link href="/admin" className="text-sm text-[color:var(--acento-verde)] hover:underline">
          &larr; Voltar ao Painel
        </Link>
      </div>

      <div className="mb-8">
        <Link 
          href="/admin/courses/new" 
          className="inline-block w-full text-center p-3 bg-[color:var(--acento-verde)] text-black rounded-lg font-semibold hover:opacity-90 transition-colors"
        >
          + Adicionar Novo Curso/Certificação
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-texto-secundario border-b border-zinc-700 pb-2">
          Itens Cadastrados
        </h2>
        
        {courses.length === 0 ? (
          <p className="text-zinc-400">Nenhum item cadastrado.</p>
        ) : (
          courses.map((course) => (
            <div 
              key={course.id} 
              className="p-4 border border-zinc-700 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-texto-principal">{course.name}</h3>
                  <p className="text-zinc-400">{course.institution}</p>
                  <p className="text-sm text-zinc-400">
                    {course.type} · {course.date} {course.workload ? `(${course.workload}h)` : ''}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
                  <Link href={`/admin/courses/edit/${course.id}`} className="text-sm text-blue-500 hover:underline">
                    Editar
                  </Link>
                  <span className="text-zinc-600">|</span>
                  <DeleteButton id={course.id} deleteAction={deleteCourse} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}