// src/app/admin/courses/new/page.tsx
import Link from 'next/link'

// 1. Importa a Ação do Servidor
import { addCourse } from '@/app/admin/courses/actions'

// 2. Importa o Formulário Inteligente
import CourseForm from '@/components/CourseForm'

export default function NewCoursePage() {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Adicionar Curso/Certificação
          </h1>
          <Link href="/admin/courses" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Cancelar
          </Link>
        </div>

        {/* 3. Renderiza o formulário */}
        <CourseForm 
          action={addCourse} 
          buttonText="Salvar Curso"
        />

      </main>
    </div>
  )
}