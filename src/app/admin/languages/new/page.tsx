// src/app/admin/languages/new/page.tsx
import Link from 'next/link'

import { addLanguage } from '@/app/admin/languages/actions'
import LanguageForm from '@/components/LanguageForm'

export default function NewLanguagePage() {
  // A variável 'inputStyle' (que não era usada) foi removida.

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Adicionar Idioma
          </h1>
          <Link href="/admin/languages" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Cancelar
          </Link>
        </div>

        <LanguageForm
          action={addLanguage}
          buttonText="Salvar Idioma"
        />

      </main>
    </div>
  )
}