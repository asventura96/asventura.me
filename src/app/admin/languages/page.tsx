// src/app/admin/languages/page.tsx
import { prisma } from '@/lib/prismaClient'
import Link from 'next/link'
// --- 1. IMPORTA O NOVO BOTÃO ---
import DeleteLanguageButton from '@/components/DeleteLanguageButton' // Verifica o caminho

// 1. Função para buscar os dados do banco
async function getLanguages() {
  const languages = await prisma.language.findMany({
    orderBy: { id: 'desc' }, 
  })
  return languages
}

// 2. A página
export default async function AdminLanguagesPage() {
  // Busca os dados no servidor antes da página carregar
  const languages = await getLanguages()

  return (
    <div className="flex min-h-screen justify-center bg-zinc-100 dark:bg-zinc-900">
      <main className="w-full max-w-3xl p-8 my-12 bg-white dark:bg-black shadow-xl rounded-xl">

        {/* Cabeçalho e Botão de Voltar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Gerenciar Idiomas
          </h1>
          <Link href="/admin" className="text-sm text-indigo-600 hover:text-indigo-500">
            &larr; Voltar ao Painel
          </Link>
        </div>

        {/* Botão para Adicionar Novo */}
        <div className="mb-8">
          <Link 
            href="/admin/languages/new" 
            className="inline-block w-full text-center p-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            + Adicionar Novo Idioma
          </Link>
        </div>

        {/* Lista de Itens Atuais */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-zinc-100 border-b pb-2">
            Idiomas Cadastrados
          </h2>

          {languages.length === 0 ? (
            <p className="text-gray-500 dark:text-zinc-400">Nenhum idioma cadastrado.</p>
          ) : (
            // Faz o loop e mostra cada item
            languages.map((lang) => (
              <div 
                key={lang.id} 
                className="flex justify-between items-center p-4 border border-gray-200 dark:border-zinc-700 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-lg text-black dark:text-white">{lang.name}</h3>
                  <p className="text-gray-600 dark:text-zinc-300">Nível: {lang.level}</p>
                </div>

                {/* --- 2. SUBSTITUI O BOTÃO ANTIGO PELO NOVO COMPONENTE --- */}
                <div className="flex items-center space-x-4 flex-shrink-0 ml-4">
                  <Link href={`/admin/languages/edit/${lang.id}`} className="text-sm text-blue-500 hover:underline">
                    Editar
                  </Link>
                  <span className="text-gray-300 dark:text-zinc-600">|</span>
                  <DeleteLanguageButton id={lang.id} />
                </div>
              </div>
            ))
          )}
        </div>

      </main>
    </div>
  )
}