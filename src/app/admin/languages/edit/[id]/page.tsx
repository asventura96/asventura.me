// src/app/admin/languages/edit/[id]/page.tsx
import { prisma } from '@/lib/prismaClient'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { updateLanguage } from '@/app/admin/languages/actions'
import LanguageForm from '@/components/LanguageForm'

async function getLanguageById(id: string) {
  const langId = parseInt(id, 10)
  if (isNaN(langId)) {
    return null
  }
  const language = await prisma.language.findUnique({
    where: { id: langId },
  })
  return language
}

export default async function EditLanguagePage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;
  const language = await getLanguageById(id)

  if (!language) {
    notFound()
  }

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-2xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Editar Idioma
          </h1>
          <Link href="/admin/languages" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Cancelar
          </Link>
        </div>

        <LanguageForm
          action={updateLanguage}
          initialData={language}
          buttonText="Salvar Alterações"
        />

      </main>
    </div>
  )
}