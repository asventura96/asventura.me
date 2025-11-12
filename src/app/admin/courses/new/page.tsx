// src/app/admin/courses/new/page.tsx
import Link from 'next/link'
import { addCourse } from '@/app/admin/courses/actions'
import CourseForm from '@/components/CourseForm' 

export default function NewCoursePage() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-2xl">
      
      <div className="bg-white rounded-t-xl p-4 flex justify-between items-center border-b border-zinc-300">
        <h1 className="text-xl font-bold text-[color:var(--acento-verde)]">ADICIONAR CURSO/CERTIFICAÇÃO</h1>
        <Link href="/admin/courses" className="text-sm hover:underline text-[color:var(--acento-verde)]">
          &larr; CANCELAR
        </Link>
      </div>

      <div className="p-8">
        <CourseForm 
          action={addCourse} 
          buttonText="SALVAR CURSO"
        />
      </div>
    </div>
  )
}