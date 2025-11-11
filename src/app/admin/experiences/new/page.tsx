// src/app/admin/experiences/new/page.tsx
import Link from 'next/link'

// 1. Importa a Ação de ADICIONAR
import { addExperience } from '@/app/admin/experiences/actions'

// 2. Importa o novo Formulário Inteligente
import ExperienceForm from '@/components/ExperienceForm'

export default function NewExperiencePage() {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Adicionar Experiência
          </h1>
          <Link href="/admin/experiences" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Cancelar
          </Link>
        </div>

        {/* 3. Renderiza o formulário inteligente */}
        <ExperienceForm 
          action={addExperience} 
          buttonText="Salvar Experiência"
        />

      </main>
    </div>
  )
}