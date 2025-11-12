// src/app/admin/courses/edit/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prismaClient'
import { updateCourse } from '@/app/admin/courses/actions'
import CourseForm from '@/components/CourseForm'

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

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = await params;
  const courseItem = await getCourseById(id)

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
        <CourseForm 
          action={updateCourse}
          initialData={courseItem}
          buttonText="SALVAR ALTERAÇÕES"
        />
      </div>
    </div>
  )
}