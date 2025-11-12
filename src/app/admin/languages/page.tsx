// src/app/admin/languages/page.tsx
import { prisma } from '@/lib/prismaClient'
import Link from 'next/link'
import { deleteLanguage } from '@/app/admin/languages/actions' 
import DeleteButton from '@/components/DeleteButton' 

async function getLanguages() {
  const languages = await prisma.language.findMany({
    orderBy: { name: 'asc' }, 
  })
  return languages
}

export default async function AdminLanguagesPage() {
  const languages = await getLanguages()

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl text-texto-principal">
          Gerenciar Idiomas
        </h1>
        <Link href="/admin" className="text-sm text-[color:var(--acento-verde)] hover:underline">
          &larr; Voltar ao Painel
        </Link>
      </div>

      <div className="mb-8">
        <Link 
          href="/admin/languages/new" 
          className="inline-block w-full text-center p-3 bg-[color:var(--acento-verde)] text-black rounded-lg font-semibold hover:opacity-90 transition-colors"
        >
          + Adicionar Novo Idioma
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-texto-secundario border-b border-zinc-700 pb-2">
          Idiomas Cadastrados
        </h2>
        
        {languages.length === 0 ? (
          <p className="text-zinc-400">Nenhum idioma cadastrado.</p>
        ) : (
          languages.map((lang) => (
            <div 
              key={lang.id} 
              className="flex justify-between items-center p-4 border border-zinc-700 rounded-lg"
            >
              <div>
                <h3 className="font-semibold text-lg text-texto-principal">{lang.name}</h3>
                <p className="text-zinc-400">Nível: {lang.level}</p>
              </div>
              
              <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
                <Link href={`/admin/languages/edit/${lang.id}`} className="text-sm text-blue-500 hover:underline">
                  Editar
                </Link>
                <span className="text-zinc-600">|</span>
                <DeleteButton id={lang.id} deleteAction={deleteLanguage} />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}