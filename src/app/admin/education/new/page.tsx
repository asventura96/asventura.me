// src/app/admin/education/new/page.tsx
import Link from 'next/link'

// 1. Importa a Ação do Servidor (a lógica de salvar)
import { addEducation } from '@/app/admin/education/actions'

// 2. Importa o Formulário Inteligente (o visual)
import EducationForm from '@/components/EducationForm'

export default function NewEducationPage() {
  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Adicionar Formação Acadêmica
          </h1>
          <Link href="/admin/education" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Cancelar
          </Link>
        </div>

        {/* 3. Renderiza o formulário inteligente, passando:
            - A ação que ele deve executar (addEducation)
            - O texto do botão
        */}
        <EducationForm 
          action={addEducation} 
          buttonText="Salvar Formação"
        />

      </main>
    </div>
  )
}