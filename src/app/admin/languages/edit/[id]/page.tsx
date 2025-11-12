// src/app/admin/languages/edit/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prismaClient'
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
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-2xl">
      
      <div className="bg-white rounded-t-xl p-4 flex justify-between items-center border-b border-zinc-300">
        <h1 className="text-xl font-bold text-[color:var(--acento-verde)]">EDITAR IDIOMA</h1>
        <Link href="/admin/languages" className="text-sm hover:underline text-[color:var(--acento-verde)]">
          &larr; CANCELAR
        </Link>
      </div>

      <div className="p-8">
        <LanguageForm 
          action={updateLanguage}
          initialData={language}
          buttonText="SALVAR ALTERAÇÕES"
        />
      </div>
    </div>
  )
}