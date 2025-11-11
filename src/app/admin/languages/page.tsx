// src/app/admin/languages/page.tsx (Refatorado)
import { prisma } from '@/lib/prismaClient'
import Link from 'next/link'

// 1. Importa a Ação de exclusão e o Botão Genérico
import { deleteLanguage } from '@/app/admin/languages/actions' 
import DeleteButton from '@/components/DeleteButton' 

async function getLanguages() {
  const languages = await prisma.language.findMany({
    orderBy: { id: 'desc' }, 
  })
  return languages
}

export default async function AdminLanguagesPage() {
  const languages = await getLanguages()

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-3xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Gerenciar Idiomas
          </h1>
          <Link href="/admin" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Voltar ao Painel
          </Link>
        </div>

        <div className="mb-8">
          <Link 
            href="/admin/languages/new" 
            className="inline-block w-full text-center p-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            + Adicionar Novo Idioma
          </Link>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 border-b pb-2">
            Idiomas Cadastrados
          </h2>

          {languages.length === 0 ? (
            <p className="text-gray-500 dark:text-zinc-400">Nenhum idioma cadastrado.</p>
          ) : (
            languages.map((lang) => (
              <div 
                key={lang.id} 
                className="flex justify-between items-center p-4 border border-gray-200 dark:border-zinc-700 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-lg text-black dark:text-white">{lang.name}</h3>
                  <p className="text-gray-600 dark:text-zinc-300">Nível: {lang.level}</p>
                </div>

                {/* 2. Substituição aqui */}
                <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
                  <Link href={`/admin/languages/edit/${lang.id}`} className="text-sm text-blue-500 hover:underline">
                    Editar
                  </Link>
                  <span className="text-gray-300 dark:text-zinc-600">|</span>

                  {/* Usamos o botão genérico e passamos a AÇÃO específica */}
                  <DeleteButton id={lang.id} deleteAction={deleteLanguage} />

                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  )
}